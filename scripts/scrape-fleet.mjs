#!/usr/bin/env node
/**
 * Scrapes the full fleet from luxurysupercarsdubai.com and writes a
 * complete car registry to lib/fleet-data.json. Re-run any time the
 * live fleet changes; existing entries are overwritten.
 *
 * The redesign mirrors live SEO verbatim — title, meta description, OG
 * tags, h1, body, specs, price, gallery images are all preserved.
 *
 * Pipeline:
 *   1. Walk every /rent-{type}-cars-dubai/ index (paginated) to build a
 *      slug → categories[] map. This is the authoritative type taxonomy.
 *   2. Read product-sitemap.xml for the canonical car URL list.
 *   3. For each car: fetch the detail page, extract meta + Rank Math
 *      Product JSON-LD + Elementor spec widget pairs + WC body.
 *   4. Merge, categorize, dedupe, write JSON.
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "lib/fleet-data.json");
const SITEMAP_URL = "https://luxurysupercarsdubai.com/product-sitemap.xml";
const ORIGIN = "https://luxurysupercarsdubai.com";
const CONCURRENCY = 6;

// Maps live /rent-{type}-cars-dubai/ slug → our internal Category value.
const TYPE_PAGES = {
  sports: "rent-sports-cars-dubai",
  convertible: "rent-convertible-cars-dubai",
  luxury: "rent-luxury-cars-dubai",
  suv: "rent-suv-cars-dubai",
};

// --------------------------------------------------------------------------
//  Step 1 — sitemap and type-category map
// --------------------------------------------------------------------------

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

async function fetchText(url, attempt = 1) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
    });
    if (res.status === 429 || res.status === 403) {
      if (attempt < 4) {
        const delay = 800 * attempt;
        await new Promise((r) => setTimeout(r, delay));
        return fetchText(url, attempt + 1);
      }
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    return res.text();
  } catch (e) {
    if (attempt < 3 && /fetch failed|ECONNRESET|ETIMEDOUT/.test(e.message)) {
      await new Promise((r) => setTimeout(r, 600 * attempt));
      return fetchText(url, attempt + 1);
    }
    throw e;
  }
}

async function getCarUrlsFromSitemap() {
  const xml = await fetchText(SITEMAP_URL);
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => /\/rent-[a-z-]+-dubai\/[a-z0-9-]+\/?$/.test(u));
}

function keyFromUrl(url) {
  const m = url.match(/\/(rent-[a-z-]+-dubai)\/([a-z0-9-]+)\/?$/);
  return m ? { brand: m[1], slug: m[2], key: `${m[1]}/${m[2]}` } : null;
}

async function collectCategoryPages(typeSlug) {
  // Walk pagination until empty
  const found = new Set();
  for (let n = 1; n <= 20; n++) {
    const url = n === 1
      ? `${ORIGIN}/${typeSlug}/`
      : `${ORIGIN}/${typeSlug}/page/${n}/`;
    let html;
    try {
      html = await fetchText(url);
    } catch {
      break;
    }
    const $ = cheerio.load(html);
    const before = found.size;
    $("a[href]").each((_, a) => {
      const href = $(a).attr("href") || "";
      const m = href.match(new RegExp(`^${ORIGIN.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/(rent-[a-z-]+-dubai)/([a-z0-9-]+)/?$`));
      if (m) found.add(`${m[1]}/${m[2]}`);
    });
    // No new entries this page → end of pagination
    if (found.size === before && n > 1) break;
  }
  return [...found];
}

async function buildCategoryMap() {
  const map = new Map(); // key -> Set<Category>
  for (const [category, slug] of Object.entries(TYPE_PAGES)) {
    process.stdout.write(`  scanning /${slug}/ ...`);
    const keys = await collectCategoryPages(slug);
    process.stdout.write(` ${keys.length} cars\n`);
    for (const k of keys) {
      if (!map.has(k)) map.set(k, new Set());
      map.get(k).add(category);
    }
  }
  return map;
}

// --------------------------------------------------------------------------
//  Step 2 — per-car scrape
// --------------------------------------------------------------------------

function parseRankMathGraph($) {
  // Rank Math uses <script type="application/ld+json" class="rank-math-schema">
  // wrapping an @graph with Organization / LocalBusiness / Product / etc.
  let graph = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    const txt = $(el).contents().text();
    if (!txt) return;
    try {
      const data = JSON.parse(txt);
      if (data["@graph"]) {
        graph = data["@graph"];
        return false; // break .each
      }
    } catch {
      // ignore parse errors
    }
  });
  return graph || [];
}

function findInGraph(graph, type) {
  for (const item of graph) {
    if (item["@type"] === type) return item;
  }
  return null;
}

function extractSpecs($) {
  // Spec widgets render as PAIRS of <p class="elementor-heading-title">:
  // label (ending "  : ----") then value. We pair them by walking in order.
  const headings = [];
  $('p.elementor-heading-title.elementor-size-default').each((_, el) => {
    const text = $(el).text().trim();
    if (text) headings.push(text);
  });

  const specs = {};
  for (let i = 0; i < headings.length - 1; i++) {
    const labelRaw = headings[i];
    const value = headings[i + 1];
    // Labels look like "Engine type : ---------------------"; values are short.
    const labelMatch = labelRaw.match(/^(.+?)\s*:\s*-+\s*$/);
    if (!labelMatch) continue;
    const label = labelMatch[1].trim().toLowerCase();
    // Values that themselves match the label pattern are NEXT labels, not values
    if (/:\s*-+\s*$/.test(value)) continue;
    specs[label] = value.trim();
    i++; // consume the value
  }
  return specs;
}

function extractFeatures($) {
  // Feature lists render as Elementor icon-list-text spans, but the same
  // class is used for nav, footer, phone numbers, social links, etc.
  // Filter to short product-feature-style strings: alphabetic-only,
  // 3-40 chars, no phone numbers, no URLs, no nav labels.
  const feats = [];
  const NAV_RE = /^(home|about|our|services|contact|brands?|cars?|blog|faqs?|careers|privacy|booking|t&c|fleet|gift|reviews?|map|directions|enquire)/i;
  $("span.elementor-icon-list-text").each((_, el) => {
    const t = $(el).text().trim();
    if (!t) return;
    if (t.length < 3 || t.length > 60) return;
    if (/^[+0-9 ()\-.]+$/.test(t)) return; // phone numbers
    if (/^https?:|www\./i.test(t)) return; // URLs
    if (/^[0-9]+$/.test(t)) return; // bare numbers
    if (NAV_RE.test(t)) return;
    feats.push(t);
  });
  return [...new Set(feats)];
}

function extractBody($) {
  // The WC product content widget holds the long descriptive body
  const el = $(".elementor-widget-woocommerce-product-content").first();
  if (!el.length) return "";
  // Get text content with paragraphs separated
  const paras = [];
  el.find("p").each((_, p) => {
    const txt = $(p).text().trim();
    if (txt) paras.push(txt);
  });
  return paras.join("\n\n");
}

function normaliseSpecKey(label) {
  // Map varied live-site labels to our canonical Car field names.
  const l = label.toLowerCase().replace(/\s+/g, " ").trim();
  if (/(deposit)/.test(l)) return "deposit";
  if (/(included|mileage limit)/.test(l)) return "mileageLimit";
  if (/(additional mileage|extra km)/.test(l)) return "extraKmCharge";
  if (/^year/.test(l)) return "year";
  if (/^color/.test(l)) return "color";
  if (/(engine type|engine\s*$)/.test(l)) return "engine";
  if (/^power|horsepower/.test(l)) return "horsepower";
  if (/0\s*-\s*100|0\s*to\s*100|acceleration/.test(l)) return "zeroToHundred";
  if (/engine capacity|displacement/.test(l)) return "engineCapacity";
  if (/drive type|drivetrain/.test(l)) return "driveType";
  if (/transmission|gearbox/.test(l)) return "transmission";
  if (/(number of )?doors/.test(l)) return "doors";
  if (/^seats/.test(l)) return "seats";
  if (/baggage|luggage/.test(l)) return "baggage";
  if (/top ?speed/.test(l)) return "topSpeed";
  return null;
}

function specsToCarFields(specs) {
  const out = {};
  for (const [label, value] of Object.entries(specs)) {
    const key = normaliseSpecKey(label);
    if (!key) continue;
    out[key] = value;
  }
  return out;
}

async function scrapeCar(url, categoryMap) {
  const html = await fetchText(url);
  const $ = cheerio.load(html);
  const k = keyFromUrl(url);
  if (!k) throw new Error(`bad URL ${url}`);

  // Meta tags
  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";
  const ogTitle = $('meta[property="og:title"]').attr("content") || title;
  const ogDescription = $('meta[property="og:description"]').attr("content") || metaDescription;
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const ogImageWidth = Number($('meta[property="og:image:width"]').attr("content")) || undefined;
  const ogImageHeight = Number($('meta[property="og:image:height"]').attr("content")) || undefined;
  const canonical = $('link[rel="canonical"]').attr("href") || url;

  // Derive the car display name. The page's "first heading" is the
  // breadcrumb ("Home / ...") on most live pages, so we instead prefer
  // (in order): WC product title h1, then parse from <title>, then slug.
  const productTitle = $("h1.product_title, .product_title").first().text().trim();
  const titleParsed = title
    .replace(/^Rent\s+/i, "")
    .split(/\s*\|\s*/)[0]
    .replace(/\s+in\s+Dubai(?:,?\s*UAE)?$/i, "")
    .replace(/\s+Dubai$/i, "")
    .replace(/\s+Rental.*$/i, "")
    .trim();
  const slugCased = k.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const firstHeading = productTitle || titleParsed || slugCased;

  // Rank Math @graph (gives us images + price + brand category)
  const graph = parseRankMathGraph($);
  const product = findInGraph(graph, "Product") || {};
  const offer = (product.offers && (Array.isArray(product.offers) ? product.offers[0] : product.offers)) || null;

  // Gallery as an array of {url, width, height} objects — matches the
  // shape we'll get back from Sanity's image asset queries when the CMS
  // is wired in, so consumers don't need to change shape later.
  const gallery = (product.image || [])
    .map((img) => {
      if (typeof img === "string") return { url: img };
      return {
        url: img.url,
        width: img.width ? Number(img.width) : undefined,
        height: img.height ? Number(img.height) : undefined,
      };
    })
    .filter((g) => g.url);

  // First image = featured / hero; rest = gallery extras.
  const featuredImage = gallery[0]?.url || ogImage;

  // Specs (Elementor heading pairs)
  const rawSpecs = extractSpecs($);
  const specs = specsToCarFields(rawSpecs);

  // Body
  const bodyText = extractBody($);

  // Features
  const features = extractFeatures($);

  // Type categories from the prebuilt map
  const cats = categoryMap.get(k.key);
  const categories = cats ? [...cats] : [];

  // Brand display name = Product.category (e.g. "Lamborghini")
  const brandName = product.category || "";

  // Price — parse from offer.price or rawSpecs.deposit/Day text fallback
  let price;
  if (offer) {
    const p = Number(offer.price);
    if (!Number.isNaN(p) && p > 0) price = p;
  }
  if (!price) {
    // Sometimes the page only shows "AED 4,000 / Day" copy; try parse it.
    const aedMatch = html.match(/AED\s*([\d,]+)\s*\/?\s*Day/i);
    if (aedMatch) price = Number(aedMatch[1].replace(/,/g, ""));
  }

  return {
    key: k.key,
    brand: k.brand,
    slug: k.slug,
    name: firstHeading || title,
    brandName,
    url,
    canonical,
    title,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageWidth,
    ogImageHeight,
    price: price || null,
    priceCurrency: (offer && offer.priceCurrency) || "AED",
    image: featuredImage,
    gallery,
    categories,
    specs,
    features,
    bodyText,
  };
}

async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let idx = 0;
  async function next() {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        results[i] = await worker(items[i], i);
        process.stdout.write(`  [${i + 1}/${items.length}] ${items[i]}\n`);
      } catch (e) {
        process.stderr.write(`  ! [${i + 1}/${items.length}] ${items[i]}: ${e.message}\n`);
        results[i] = { error: e.message, url: items[i] };
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, () => next()));
  return results;
}

// --------------------------------------------------------------------------
//  Main
// --------------------------------------------------------------------------

(async () => {
  console.log("[1/3] Building type-category map from live category pages...");
  const categoryMap = await buildCategoryMap();
  console.log(`  → tagged ${categoryMap.size} unique cars across ${Object.keys(TYPE_PAGES).length} types`);

  console.log("[2/3] Fetching product sitemap...");
  const urls = await getCarUrlsFromSitemap();
  console.log(`  → ${urls.length} car URLs`);

  console.log(`[3/3] Scraping detail pages (concurrency=${CONCURRENCY})...`);
  const cars = await runWithConcurrency(urls, CONCURRENCY, (url) => scrapeCar(url, categoryMap));
  const ok = cars.filter((c) => c && !c.error && c.key);
  const failed = cars.filter((c) => c && c.error);

  console.log(`Scraped ${ok.length}/${urls.length} successfully (${failed.length} failed)`);
  if (failed.length) {
    console.log("Failed URLs:");
    for (const f of failed) console.log(`  ${f.url} — ${f.error}`);
  }

  // Sort by category > brand > slug for determinism
  ok.sort((a, b) => a.brand.localeCompare(b.brand) || a.slug.localeCompare(b.slug));

  writeFileSync(OUT, JSON.stringify(ok, null, 2) + "\n");
  const sizeKb = (Buffer.byteLength(JSON.stringify(ok)) / 1024).toFixed(1);
  console.log(`\nWrote ${OUT} (${sizeKb} KB)`);

  // Quick stats
  const byCat = { sports: 0, convertible: 0, luxury: 0, suv: 0, uncategorized: 0 };
  for (const c of ok) {
    if (c.categories.length === 0) byCat.uncategorized++;
    for (const cat of c.categories) byCat[cat] = (byCat[cat] || 0) + 1;
  }
  console.log("Category counts:", byCat);
  const galleryStats = ok.map((c) => c.gallery.length);
  // (galleryStats now counts {url,w,h} objects per car)
  const avgGallery = galleryStats.reduce((a, b) => a + b, 0) / ok.length;
  console.log(`Avg gallery size: ${avgGallery.toFixed(1)} images (min ${Math.min(...galleryStats)}, max ${Math.max(...galleryStats)})`);
})();
