/**
 * Locations migration — pushes all 20 location pages from
 * lib/locations.ts (static TS) to Sanity so editors can maintain them
 * from /studio without code commits.
 *
 * Idempotent — safe to re-run. Each location document is keyed by
 * `location-{slug}` so existing docs are replaced, not duplicated.
 *
 * Run: npx tsx scripts/sanity/migrate-locations.ts
 * Requires SANITY_API_TOKEN in .env.local
 */
import { getAllLocations } from "../../lib/locations";
import { batchCreateOrReplace, isConfigured } from "./lib";
import { key } from "./blocks";

async function main() {
  if (!isConfigured) {
    console.error(
      "SANITY_API_TOKEN not found in .env.local — skipping Sanity write.\n" +
        "Run the script with a valid token to push changes to Sanity.",
    );
    process.exit(1);
  }

  const locations = getAllLocations();

  const docs = locations.map((l) => ({
    _id: `location-${l.slug}`,
    _type: "location",
    name: l.name,
    slug: { _type: "slug", current: l.slug },
    h1: l.h1,
    intro: l.intro,
    coordinates: {
      _type: "object",
      lat: l.coordinates.lat,
      lng: l.coordinates.lng,
    },
    whyRent: l.whyRent,
    hotels: l.hotels,
    attractions: l.attractions,
    landmarks: l.landmarks,
    popularBrands: (l.popularBrands || []).map((b, i) => ({
      _type: "brandLink",
      _key: key("brand", `${i}-${b.name}`),
      name: b.name,
      href: b.href,
    })),
    faqs: (l.faqs || []).map((f, i) => ({
      _type: "locationFaq",
      _key: key("faq", `${i}-${f.q}`),
      question: f.q,
      answer: f.a,
    })),
    nearby: (l.nearby || []).map((n, i) => ({
      _type: "nearbyLink",
      _key: key("near", `${i}-${n.name}`),
      name: n.name,
      href: n.href,
    })),
    seo: {
      title: l.title,
      description: l.description,
    },
  }));

  await batchCreateOrReplace(docs, { label: "locations" });
  console.log(`\u2713 ${docs.length} locations migrated to Sanity`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
