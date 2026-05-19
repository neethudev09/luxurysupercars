#!/usr/bin/env node
/**
 * Scrapes every car detail page from luxurysupercarsdubai.com and writes
 * a verbatim metadata registry to lib/car-meta.json.
 *
 * Keyed by `${brand}/${slug}` (matches our internal route params). The
 * [brand]/[slug] route's generateMetadata reads this map to ship live SEO
 * verbatim — title, description, OG tags — preserving SERP equity.
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "lib/car-meta.json");
const SITEMAP_URL = "https://luxurysupercarsdubai.com/product-sitemap.xml";
const CONCURRENCY = 6;

async function getSitemapUrls() {
  const res = await fetch(SITEMAP_URL, { redirect: "follow" });
  const xml = await res.text();
  // Each car URL looks like .../rent-{brand}-dubai/{slug}/
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => /\/rent-[a-z-]+-dubai\/[a-z0-9-]+\/?$/.test(u));
}

function keyFromUrl(url) {
  const m = url.match(/\/(rent-[a-z-]+-dubai)\/([a-z0-9-]+)\/?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

async function scrapeOne(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const key = keyFromUrl(url);
  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";
  const ogTitle = $('meta[property="og:title"]').attr("content") || title;
  const ogDescription = $('meta[property="og:description"]').attr("content") || metaDescription;
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const ogImageWidth = Number($('meta[property="og:image:width"]').attr("content")) || undefined;
  const ogImageHeight = Number($('meta[property="og:image:height"]').attr("content")) || undefined;
  const canonical = $('link[rel="canonical"]').attr("href") || url;
  const h1 = $("h1.elementor-heading-title, h1.product_title, h1").first().text().trim();

  return {
    key,
    url,
    canonical,
    title,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageWidth,
    ogImageHeight,
    h1,
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

(async () => {
  console.log(`Fetching sitemap: ${SITEMAP_URL}`);
  const urls = await getSitemapUrls();
  console.log(`Found ${urls.length} car pages. Scraping with concurrency=${CONCURRENCY}...`);

  const cars = await runWithConcurrency(urls, CONCURRENCY, scrapeOne);
  const ok = cars.filter((c) => c && !c.error && c.key);
  console.log(`Scraped ${ok.length} / ${urls.length} successfully.`);

  // Key by `${brand}/${slug}` so route's generateMetadata can do an O(1) lookup.
  const map = {};
  for (const c of ok) map[c.key] = c;

  writeFileSync(OUT, JSON.stringify(map, null, 2) + "\n");
  console.log(`Wrote ${OUT}`);
})();
