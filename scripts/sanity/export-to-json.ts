/**
 * Build-time Sanity export.
 *
 * Pulls cars + blog posts out of Sanity and writes them into the JSON
 * files the app already reads (lib/fleet-data.json, lib/blog-data.json,
 * lib/featured-cars.json) — in the EXACT existing shapes, so no render
 * code changes.
 *
 * Wired as the `prebuild` npm script: every `next build` regenerates
 * these files from Sanity first. A Sanity webhook → Vercel Deploy Hook
 * means an editor publish triggers a rebuild → site updates.
 *
 * Safe to run locally any time: `npx tsx scripts/sanity/export-to-json.ts`
 * Re-runnable / idempotent. If Sanity is unreachable it exits non-zero
 * WITHOUT touching the files, so a flaky network never wipes content.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { client } from "./lib";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const SITE = "https://luxurysupercarsdubai.com";

/* -------------------------------------------------------------------------- */
/*  Portable Text → plain text                                                */
/* -------------------------------------------------------------------------- */

interface PtSpan { _type: string; text?: string }
interface PtBlock { _type: string; children?: PtSpan[] }

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
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log("[export] fetching from Sanity…");

  const [cars, posts] = await Promise.all([
    client.fetch<SanityCar[]>(CAR_QUERY),
    client.fetch<SanityBlogPost[]>(BLOG_QUERY),
  ]);

  if (!Array.isArray(cars) || cars.length === 0) {
    throw new Error("No cars returned from Sanity — aborting (existing JSON left untouched).");
  }
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("No blog posts returned from Sanity — aborting (existing JSON left untouched).");
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

  writeFileSync(resolve(ROOT, "lib/fleet-data.json"), JSON.stringify(fleet, null, 2) + "\n");
  writeFileSync(resolve(ROOT, "lib/blog-data.json"), JSON.stringify(blog, null, 2) + "\n");
  writeFileSync(
    resolve(ROOT, "lib/featured-cars.json"),
    JSON.stringify(
      {
        _comment:
          "GENERATED from Sanity car.featuredIn by scripts/sanity/export-to-json.ts. Do not hand-edit — toggle 'Featured on homepage in...' on the car in /studio instead.",
        ...featured,
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`[export] wrote lib/fleet-data.json    (${fleet.length} cars)`);
  console.log(`[export] wrote lib/blog-data.json     (${blog.length} posts)`);
  console.log(
    `[export] wrote lib/featured-cars.json (sports ${featured.sports.length}, convertible ${featured.convertible.length}, luxury ${featured.luxury.length}, suv ${featured.suv.length})`,
  );
}

main().catch((e) => {
  console.error("[export] FAILED:", e.message);
  // Non-zero exit aborts the build; existing JSON files are never partially written.
  process.exit(1);
});
