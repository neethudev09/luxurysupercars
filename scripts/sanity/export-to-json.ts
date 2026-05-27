/**
 * Build-time Sanity export.
 *
 * Pulls every CMS-backed content type out of Sanity and writes it into
 * the JSON files the app reads — in the EXACT shapes the render code
 * already expects, so no render code changes:
 *
 *   lib/fleet-data.json          cars
 *   lib/blog-data.json           blog posts
 *   lib/featured-cars.json       homepage featured-car map
 *   lib/generated/site-settings.json   contact, social, footer blurb
 *   lib/generated/testimonials.json    customer reviews
 *   lib/generated/faq.json             FAQ entries (page + homepage)
 *   lib/generated/services.json        service detail pages
 *   lib/generated/brands.json          the 13 long-form brand pages
 *
 * Wired as the `prebuild` npm script: every `next build` regenerates
 * these files from Sanity first. A Sanity webhook → Vercel Deploy Hook
 * means an editor publish triggers a rebuild → site updates.
 *
 * Safe to run locally any time: `npx tsx scripts/sanity/export-to-json.ts`
 * Re-runnable / idempotent. If Sanity is unreachable — or returns an
 * empty set for any type — it exits non-zero WITHOUT touching the files,
 * so a flaky network or a bad query never wipes content.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { client } from "./lib";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const SITE = "https://luxurysupercarsdubai.com";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

interface PtSpan { _type: string; text?: string }
interface PtBlock { _type: string; children?: PtSpan[] }

/** Portable Text → plain text, one paragraph per block, joined by blank lines. */
function portableTextToPlain(blocks: PtBlock[] | undefined): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n\n");
}

/**
 * GROQ returns `null` for unset fields; our JSON shapes expect either a
 * value or the key absent (`undefined`). Coerce null/empty → undefined so
 * JSON.stringify drops the key entirely.
 */
function str(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}
function num(v: unknown): number | undefined {
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
}

/** Like `str`, but yields a stable "" instead of `undefined` — keeps the
 *  shape of always-present string fields constant. Never trims, so SEO
 *  copy round-trips byte-for-byte. */
function text(v: unknown): string {
  return v == null ? "" : String(v);
}

/* -------------------------------------------------------------------------- */
/*  Cars → lib/fleet-data.json                                                */
/* -------------------------------------------------------------------------- */

interface SanityImage { url?: string; width?: number; height?: number }

interface SanityCar {
  name: string;
  slug: string;
  brandSlug: string;
  brandName: string;
  categories?: string[];
  featuredIn?: string[];
  priceAed?: number;
  year?: number;
  color?: string;
  engine?: string;
  engineCapacity?: string;
  horsepower?: string;
  zeroToHundred?: string;
  topSpeed?: string;
  transmission?: string;
  driveType?: string;
  doors?: number;
  seats?: number;
  deposit?: string;
  mileageLimit?: string;
  extraKmCharge?: string;
  features?: string[];
  description?: PtBlock[];
  heroImage?: SanityImage;
  gallery?: SanityImage[];
  seo?: { title?: string; description?: string };
}

const CAR_QUERY = `*[_type == "car" && defined(slug.current) && defined(brand)]{
  name,
  "slug": slug.current,
  "brandSlug": brand->slug.current,
  "brandName": brand->displayName,
  categories,
  featuredIn,
  priceAed,
  year, color, engine, engineCapacity, horsepower, zeroToHundred, topSpeed,
  transmission, driveType, doors, seats,
  deposit, mileageLimit, extraKmCharge,
  features,
  description,
  "heroImage": heroImage.asset->{ url, "width": metadata.dimensions.width, "height": metadata.dimensions.height },
  "gallery": gallery[]{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height },
  seo
}`;

function mapCar(c: SanityCar) {
  const hero = str(c.heroImage?.url) || str(c.gallery?.[0]?.url) || "";
  const gallery = (c.gallery || [])
    .filter((g) => g.url)
    .map((g) => {
      const item: { url: string; width?: number; height?: number } = { url: g.url! };
      const w = num(g.width);
      const h = num(g.height);
      if (w !== undefined) item.width = w;
      if (h !== undefined) item.height = h;
      return item;
    });
  const url = `${SITE}/${c.brandSlug}/${c.slug}/`;
  const title = str(c.seo?.title) || `Rent ${c.name} in Dubai | Luxury Supercars Dubai`;
  const description = str(c.seo?.description) || "";

  return {
    key: `${c.brandSlug}/${c.slug}`,
    brand: c.brandSlug,
    slug: c.slug,
    name: c.name,
    brandName: c.brandName,
    url,
    canonical: url,
    title,
    metaDescription: description,
    ogTitle: title,
    ogDescription: description,
    ogImage: hero,
    ogImageWidth: num(c.heroImage?.width),
    ogImageHeight: num(c.heroImage?.height),
    price: typeof c.priceAed === "number" ? c.priceAed : null,
    priceCurrency: "AED",
    image: hero,
    gallery: gallery.length ? gallery : hero ? [{ url: hero }] : [],
    categories: (c.categories || []).filter((x): x is string => typeof x === "string"),
    specs: {
      deposit: str(c.deposit),
      mileageLimit: str(c.mileageLimit),
      extraKmCharge: str(c.extraKmCharge),
      year: str(c.year),
      color: str(c.color),
      engine: str(c.engine),
      horsepower: str(c.horsepower),
      zeroToHundred: str(c.zeroToHundred),
      engineCapacity: str(c.engineCapacity),
      driveType: str(c.driveType),
      transmission: str(c.transmission),
      doors: str(c.doors),
      seats: str(c.seats),
      topSpeed: str(c.topSpeed),
    },
    features: (c.features || []).filter((x): x is string => typeof x === "string"),
    bodyText: portableTextToPlain(c.description),
  };
}

/* -------------------------------------------------------------------------- */
/*  Blog posts → lib/blog-data.json                                           */
/* -------------------------------------------------------------------------- */

interface SanityBlogPost {
  title: string;
  h1?: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  bodyHtml?: string;
  heroImage?: SanityImage;
  seo?: { title?: string; description?: string };
}

const BLOG_QUERY = `*[_type == "blogPost" && defined(slug.current)]{
  title, h1,
  "slug": slug.current,
  publishedAt,
  excerpt,
  bodyHtml,
  "heroImage": heroImage.asset->{ url, "width": metadata.dimensions.width, "height": metadata.dimensions.height },
  seo
} | order(publishedAt desc)`;

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function mapBlogPost(p: SanityBlogPost) {
  const url = `${SITE}/blogs/${p.slug}/`;
  const hero = str(p.heroImage?.url) || "";
  return {
    slug: p.slug,
    url,
    canonical: url,
    title: str(p.seo?.title) || p.title,
    metaDescription: str(p.seo?.description) || "",
    ogTitle: p.title,
    ogDescription: str(p.seo?.description) || "",
    ogImage: hero,
    ogImageWidth: num(p.heroImage?.width),
    ogImageHeight: num(p.heroImage?.height),
    h1: str(p.h1) || p.title,
    date: formatDate(p.publishedAt),
    excerpt: str(p.excerpt) || "",
    bodyHtml: p.bodyHtml || "",
  };
}

/* -------------------------------------------------------------------------- */
/*  Site settings → lib/generated/site-settings.json                          */
/* -------------------------------------------------------------------------- */

interface SanitySiteSettings {
  title?: string;
  description?: string;
  contact?: {
    primaryPhone?: string;
    secondaryPhone?: string;
    landline?: string;
    email?: string;
    address?: string;
    altAddress?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
  };
  footerDescription?: string;
}

const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  title, description, contact, social, footerDescription
}`;

function mapSiteSettings(s: SanitySiteSettings) {
  return {
    title: text(s.title),
    description: text(s.description),
    contact: {
      primaryPhone: text(s.contact?.primaryPhone),
      secondaryPhone: text(s.contact?.secondaryPhone),
      landline: text(s.contact?.landline),
      email: text(s.contact?.email),
      address: text(s.contact?.address),
      altAddress: text(s.contact?.altAddress),
    },
    social: {
      facebook: text(s.social?.facebook),
      instagram: text(s.social?.instagram),
      twitter: text(s.social?.twitter),
      youtube: text(s.social?.youtube),
      tiktok: text(s.social?.tiktok),
    },
    footerDescription: text(s.footerDescription),
  };
}

/* -------------------------------------------------------------------------- */
/*  Testimonials → lib/generated/testimonials.json                            */
/* -------------------------------------------------------------------------- */

interface SanityTestimonial {
  name?: string;
  quote?: string;
  source?: string;
  rating?: number;
  showOnHomepage?: boolean;
  order?: number;
}

const TESTIMONIAL_QUERY = `*[_type == "testimonial"] | order(order asc){
  name, quote, source, rating, showOnHomepage, order
}`;

function mapTestimonial(t: SanityTestimonial) {
  return {
    name: text(t.name),
    quote: text(t.quote),
    source: t.source === "google" ? "google" : "named",
    rating: num(t.rating) ?? 5,
    showOnHomepage: t.showOnHomepage !== false,
    order: num(t.order) ?? 0,
  };
}

/* -------------------------------------------------------------------------- */
/*  FAQ → lib/generated/faq.json                                              */
/* -------------------------------------------------------------------------- */

interface SanityFaq {
  question?: string;
  answer?: string;
  category?: string;
  showOnHomepage?: boolean;
}

const FAQ_QUERY = `*[_type == "faq"] | order(order asc, question asc){
  question, answer, category, showOnHomepage
}`;

function mapFaq(f: SanityFaq) {
  return {
    q: text(f.question),
    a: text(f.answer),
    category: text(f.category) || "other",
    showOnHomepage: f.showOnHomepage === true,
  };
}

/* -------------------------------------------------------------------------- */
/*  Services → lib/generated/services.json                                    */
/* -------------------------------------------------------------------------- */

interface SanityService {
  title?: string;
  slug?: string;
  summary?: string;
  h1?: string;
  body?: PtBlock[];
  seo?: { title?: string; description?: string };
}

const SERVICE_QUERY = `*[_type == "service" && defined(slug.current)] | order(order asc){
  title, "slug": slug.current, summary, h1, body, seo
}`;

function mapService(s: SanityService) {
  const paragraphs = portableTextToPlain(s.body)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    slug: text(s.slug),
    title: text(s.title),
    summary: text(s.summary),
    h1: text(s.h1),
    metaTitle: text(s.seo?.title),
    metaDescription: text(s.seo?.description),
    paragraphs,
  };
}

/* -------------------------------------------------------------------------- */
/*  Brands → lib/generated/brands.json                                        */
/* -------------------------------------------------------------------------- */

/**
 * Brand-page "visible title" — the heading shown on the brand hero and
 * the prefix of its FAQ heading ("{visibleTitle} FAQs"). Not a Sanity
 * field: the live site uses a simplified form that doesn't derive cleanly
 * from the brand display name ("Mclaren" vs "McLaren", "Mercedes Benz" vs
 * "Mercedes-Benz", "Rolls Royce" vs "Rolls-Royce"), so it's pinned here
 * keyed by slug. A brand absent from this map falls back to displayName.
 */
const BRAND_VISIBLE_TITLES: Record<string, string> = {
  "rent-aston-martin-dubai": "Aston Martin",
  "rent-audi-dubai": "Audi",
  "rent-bentley-dubai": "Bentley",
  "rent-bmw-dubai": "BMW",
  "rent-cadillac-dubai": "Cadillac",
  "rent-ferrari-dubai": "Ferrari",
  "rent-lamborghini-dubai": "Lamborghini",
  "rent-maserati-dubai": "Maserati",
  "rent-mclaren-dubai": "Mclaren",
  "rent-mercedes-benz-dubai": "Mercedes Benz",
  "rent-porsche-dubai": "Porsche",
  "rent-range-rover-dubai": "Range Rover",
  "rent-rolls-royce-dubai": "Rolls Royce",
};

type BrandSectionBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; headers: string[]; rows: string[][] };

interface PtBodyBlock {
  _type: string;
  style?: string;
  listItem?: string;
  children?: PtSpan[];
  headers?: string[];
  rows?: { cells?: string[] }[];
}

interface SanityBrand {
  displayName: string;
  slug: string;
  h1: string;
  sections?: { h2: string; body?: PtBodyBlock[] }[];
  faqs?: { question?: string; answer?: string }[];
  seo?: { title?: string; description?: string };
}

const BRAND_QUERY = `*[_type == "brand" && defined(slug.current)] | order(slug.current asc){
  displayName,
  "slug": slug.current,
  h1,
  sections[]{ h2, body },
  faqs[]{ question, answer },
  seo
}`;

/**
 * Inverse of blockToPortableText() in migrate-brands.ts — turns a brand
 * section's Portable Text body back into the structured block list the
 * renderer expects:
 *   - normal block (no listItem)        → { kind: "paragraph" }
 *   - consecutive `bullet` list blocks  → one { kind: "list" }
 *   - custom `pricingTable` object      → { kind: "table" }
 * Text is taken verbatim (no trimming) so SEO copy round-trips exactly.
 */
function portableTextToBrandBlocks(body: PtBodyBlock[] | undefined): BrandSectionBlock[] {
  const out: BrandSectionBlock[] = [];
  let listBuf: string[] | null = null;
  const flushList = () => {
    if (listBuf && listBuf.length) out.push({ kind: "list", items: listBuf });
    listBuf = null;
  };

  for (const block of body || []) {
    if (block._type === "pricingTable") {
      flushList();
      out.push({
        kind: "table",
        headers: (block.headers || []).map((h) => text(h)),
        rows: (block.rows || []).map((r) => (r.cells || []).map((c) => text(c))),
      });
      continue;
    }
    if (block._type === "block") {
      const value = (block.children || []).map((c) => c.text || "").join("");
      if (block.listItem === "bullet") {
        if (!listBuf) listBuf = [];
        if (value.trim()) listBuf.push(value);
      } else {
        flushList();
        if (value.trim()) out.push({ kind: "paragraph", text: value });
      }
    }
  }
  flushList();
  return out;
}

function mapBrand(b: SanityBrand) {
  const visibleTitle = BRAND_VISIBLE_TITLES[b.slug] ?? b.displayName;
  return {
    slug: b.slug,
    displayName: b.displayName,
    title: text(b.seo?.title),
    description: text(b.seo?.description),
    h1: b.h1,
    visibleTitle,
    sections: (b.sections || []).map((s) => ({
      h2: s.h2,
      body: portableTextToBrandBlocks(s.body),
    })),
    faqs: (b.faqs || []).map((f) => ({ q: text(f.question), a: text(f.answer) })),
    faqHeading: `${visibleTitle} FAQs`,
  };
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

function writeJson(relPath: string, data: unknown) {
  writeFileSync(resolve(ROOT, relPath), JSON.stringify(data, null, 2) + "\n");
}

async function main() {
  console.log("[export] fetching from Sanity…");

  const [cars, posts, siteSettings, testimonials, faqs, services, brands] =
    await Promise.all([
      client.fetch<SanityCar[]>(CAR_QUERY),
      client.fetch<SanityBlogPost[]>(BLOG_QUERY),
      client.fetch<SanitySiteSettings | null>(SITE_SETTINGS_QUERY),
      client.fetch<SanityTestimonial[]>(TESTIMONIAL_QUERY),
      client.fetch<SanityFaq[]>(FAQ_QUERY),
      client.fetch<SanityService[]>(SERVICE_QUERY),
      client.fetch<SanityBrand[]>(BRAND_QUERY),
    ]);

  // Fail-safe: if ANY type comes back empty, abort without writing — a
  // bad query or network blip must never blank out live content.
  const requireRows = (label: string, rows: unknown) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error(`No ${label} returned from Sanity — aborting (existing JSON left untouched).`);
    }
  };
  requireRows("cars", cars);
  requireRows("blog posts", posts);
  requireRows("testimonials", testimonials);
  requireRows("FAQs", faqs);
  requireRows("services", services);
  requireRows("brands", brands);
  if (!siteSettings || typeof siteSettings !== "object") {
    throw new Error("No siteSettings returned from Sanity — aborting (existing JSON left untouched).");
  }

  // Cars — sorted by brand then slug for stable diffs.
  const fleet = cars
    .map(mapCar)
    .sort((a, b) => a.brand.localeCompare(b.brand) || a.slug.localeCompare(b.slug));

  // Featured-cars map — derived from each car's featuredIn array.
  const featured: Record<string, string[]> = { sports: [], convertible: [], luxury: [], suv: [] };
  for (const c of cars) {
    for (const cat of c.featuredIn || []) {
      if (featured[cat]) featured[cat].push(c.slug);
    }
  }

  // Blog posts — newest first (query already orders).
  const blog = posts.map(mapBlogPost);

  // Remaining CMS types → lib/generated/.
  const settingsOut = mapSiteSettings(siteSettings);
  const testimonialsOut = testimonials.map(mapTestimonial);
  const faqOut = faqs.map(mapFaq);
  const servicesOut = services.map(mapService);
  const brandsOut = Object.fromEntries(brands.map((b) => [b.slug, mapBrand(b)]));

  mkdirSync(resolve(ROOT, "lib/generated"), { recursive: true });

  writeJson("lib/fleet-data.json", fleet);
  writeJson("lib/blog-data.json", blog);
  writeJson("lib/featured-cars.json", {
    _comment:
      "GENERATED from Sanity car.featuredIn by scripts/sanity/export-to-json.ts. Do not hand-edit — toggle 'Featured on homepage in...' on the car in /studio instead.",
    ...featured,
  });
  writeJson("lib/generated/site-settings.json", settingsOut);
  writeJson("lib/generated/testimonials.json", testimonialsOut);
  writeJson("lib/generated/faq.json", faqOut);
  writeJson("lib/generated/services.json", servicesOut);
  writeJson("lib/generated/brands.json", brandsOut);

  const homepageFaqs = faqOut.filter((f) => f.showOnHomepage).length;
  console.log(`[export] wrote lib/fleet-data.json            (${fleet.length} cars)`);
  console.log(`[export] wrote lib/blog-data.json             (${blog.length} posts)`);
  console.log(
    `[export] wrote lib/featured-cars.json         (sports ${featured.sports.length}, convertible ${featured.convertible.length}, luxury ${featured.luxury.length}, suv ${featured.suv.length})`,
  );
  console.log(`[export] wrote lib/generated/site-settings.json`);
  console.log(`[export] wrote lib/generated/testimonials.json (${testimonialsOut.length} reviews)`);
  console.log(`[export] wrote lib/generated/faq.json          (${faqOut.length} entries, ${homepageFaqs} on homepage)`);
  console.log(`[export] wrote lib/generated/services.json     (${servicesOut.length} services)`);
  console.log(`[export] wrote lib/generated/brands.json       (${brands.length} brands)`);
}

main().catch((e) => {
  console.error("[export] FAILED:", e.message);
  // Non-zero exit aborts the build; existing JSON files are never partially written.
  process.exit(1);
});
