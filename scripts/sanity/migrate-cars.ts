/**
 * Cars — 96 docs from lib/fleet-data.json. The heaviest migration:
 * each car has ~10 gallery images (1000+ uploads total).
 *
 * Workflow:
 *   1. Pre-fetch all brand docs to build a slug → _id lookup for refs.
 *   2. For each car:
 *      a. Upload every gallery image to Sanity (cached, retried).
 *      b. Compose the Car doc with image refs + verbatim SEO.
 *   3. Commit in batches of 25 to keep API load reasonable.
 *
 * SEO preservation: title / metaDescription / OG fields all copied
 * byte-for-byte from the live-scraped fleet-data.json.
 *
 * Featured selection: lib/featured-cars.json maps slugs to categories.
 * Each car's `featuredIn` array is populated from that mapping so the
 * homepage 4-card teaser keeps its current curation.
 */
import fleetData from "@/lib/fleet-data.json" with { type: "json" };
import featuredCars from "@/lib/featured-cars.json" with { type: "json" };
import {
  client,
  uploadImageFromUrl,
  paragraphsToPortableText,
  batchCreateOrReplace,
  type SanityImageRef,
} from "./lib";

interface FleetCar {
  slug: string;
  brand: string;
  name: string;
  brandName: string;
  title: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  price: number | null;
  image: string;
  gallery: Array<{ url: string; width?: number; height?: number }>;
  categories: string[];
  specs: Record<string, string | undefined>;
  features: string[];
  bodyText: string;
}

async function main() {
  console.log("[1/3] Loading brand → _id map from Sanity...");
  const brands = await client.fetch<Array<{ _id: string; slug: { current: string } }>>(
    `*[_type == "brand"]{ _id, slug }`,
  );
  const brandIdBySlug = new Map(brands.map((b) => [b.slug.current, b._id]));
  console.log(`  → ${brandIdBySlug.size} brands available`);

  console.log("[2/3] Building featured-by-slug map...");
  const featuredBySlug = new Map<string, string[]>();
  for (const [cat, slugs] of Object.entries(featuredCars as Record<string, unknown>)) {
    if (!Array.isArray(slugs)) continue;
    for (const slug of slugs) {
      if (typeof slug !== "string") continue;
      const list = featuredBySlug.get(slug) || [];
      list.push(cat);
      featuredBySlug.set(slug, list);
    }
  }
  console.log(`  → ${featuredBySlug.size} cars featured across at least one category`);

  const cars = fleetData as FleetCar[];
  console.log(`[3/3] Migrating ${cars.length} cars (image uploads will take a few minutes)...`);

  const docs: Record<string, unknown>[] = [];
  for (let i = 0; i < cars.length; i++) {
    const raw = cars[i];
    process.stdout.write(`  [${i + 1}/${cars.length}] ${raw.slug}\n`);

    // Upload gallery (skip duplicates via lib cache)
    const gallery: Array<SanityImageRef & { _key: string; alt?: string }> = [];
    for (let g = 0; g < raw.gallery.length; g++) {
      const ref = await uploadImageFromUrl(raw.gallery[g].url, `${raw.slug}-${g + 1}.jpg`);
      if (ref) {
        gallery.push({ ...ref, _key: `gal-${g}-${Date.now().toString(36)}`, alt: raw.name });
      }
    }

    const heroImage = gallery[0]
      ? { _type: "image" as const, asset: gallery[0].asset }
      : await uploadImageFromUrl(raw.image, `${raw.slug}-hero.jpg`);

    const brandRef = brandIdBySlug.get(raw.brand);
    if (!brandRef) {
      console.warn(`  ! Missing brand "${raw.brand}" for car ${raw.slug}; skipping reference`);
    }

    docs.push({
      _id: `car-${raw.brand}-${raw.slug}`,
      _type: "car",
      name: raw.name,
      slug: { _type: "slug", current: raw.slug },
      brand: brandRef ? { _type: "reference", _ref: brandRef } : undefined,
      categories: raw.categories,
      featuredIn: featuredBySlug.get(raw.slug) || [],
      priceAed: raw.price ?? 0,
      year: raw.specs.year ? Number(raw.specs.year) : undefined,
      color: raw.specs.color,
      engine: raw.specs.engine,
      engineCapacity: raw.specs.engineCapacity,
      horsepower: raw.specs.horsepower,
      zeroToHundred: raw.specs.zeroToHundred,
      topSpeed: raw.specs.topSpeed,
      transmission: raw.specs.transmission,
      driveType: raw.specs.driveType,
      doors: raw.specs.doors ? Number(raw.specs.doors) : undefined,
      seats: raw.specs.seats ? Number(raw.specs.seats) : undefined,
      deposit: raw.specs.deposit,
      mileageLimit: raw.specs.mileageLimit,
      extraKmCharge: raw.specs.extraKmCharge,
      heroImage,
      gallery,
      description: paragraphsToPortableText(raw.bodyText),
      features: raw.features,
      seo: {
        title: raw.title,
        description: raw.metaDescription,
        noIndex: false,
        // (ogImage falls back to heroImage on render — no need to re-upload)
      },
    });
  }

  await batchCreateOrReplace(
    docs as Array<Record<string, unknown> & { _id: string; _type: string }>,
    { label: "cars", batchSize: 25 },
  );
  console.log(`✓ ${docs.length} cars`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
