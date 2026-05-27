/**
 * Adds two new "tuner / coachbuilder" brand pages — Mansory and Brabus —
 * and tags every car whose name contains the tuner keyword.
 *
 * These are aftermarket brands that modify other manufacturers' cars
 * (e.g. Mansory Rolls-Royce, Brabus G63). Each tagged car appears on
 * BOTH its primary brand page and the tuner's brand page.
 *
 * Idempotent: rewrites `car.tuners` from scratch every run, so the
 * keyword match is the single source of truth. Editors can later
 * override in Studio for cars whose name doesn't reveal the tuner.
 */
import { client } from "./lib";

const TUNER_BRANDS = [
  {
    _id: "brand-rent-mansory-dubai",
    _type: "brand",
    displayName: "Mansory",
    slug: { _type: "slug", current: "rent-mansory-dubai" },
    h1: "Rent Mansory in Dubai",
    seo: {
      title: "Rent Mansory in Dubai | Luxury Supercars Dubai",
      description:
        "Rent Mansory-tuned luxury cars in Dubai — Bentley, Rolls-Royce, Lamborghini, and Range Rover modifications by the world's most exclusive coachbuilder.",
      noIndex: false,
    },
  },
  {
    _id: "brand-rent-brabus-dubai",
    _type: "brand",
    displayName: "Brabus",
    slug: { _type: "slug", current: "rent-brabus-dubai" },
    h1: "Rent Brabus in Dubai",
    seo: {
      title: "Rent Brabus in Dubai | Luxury Supercars Dubai",
      description:
        "Rent Brabus-tuned Mercedes-Benz performance cars in Dubai — AMG G63, GLS63, and more from the world's leading Mercedes tuner.",
      noIndex: false,
    },
  },
];

// keyword → tuner brand _id. Case-insensitive substring match against car.name.
const KEYWORD_TUNERS: Array<{ keyword: string; brandId: string }> = [
  { keyword: "mansory", brandId: "brand-rent-mansory-dubai" },
  { keyword: "brabus", brandId: "brand-rent-brabus-dubai" },
];

interface CarRow {
  _id: string;
  slug: string;
  name: string;
}

async function main() {
  // 1) Brand docs.
  const tx = client.transaction();
  for (const doc of TUNER_BRANDS) tx.createOrReplace(doc);
  await tx.commit({ visibility: "async" });
  console.log(`✓ ${TUNER_BRANDS.length} tuner brand doc(s)`);

  // 2) Pull every car so we can keyword-match locally (cheaper than per-keyword GROQ).
  const cars = await client.fetch<CarRow[]>(
    `*[_type == "car"]{ _id, "slug": slug.current, name }`,
  );
  console.log(`  scanning ${cars.length} car(s) by name…`);

  // 3) For each car, determine the desired tuner set by keyword match.
  const desired = new Map<string, string[]>(); // car _id → [brandId]
  const summary: Record<string, string[]> = {};
  for (const { keyword, brandId } of KEYWORD_TUNERS) summary[brandId] = [];

  for (const c of cars) {
    const lc = c.name.toLowerCase();
    const matched: string[] = [];
    for (const { keyword, brandId } of KEYWORD_TUNERS) {
      if (lc.includes(keyword)) {
        matched.push(brandId);
        summary[brandId].push(c.name);
      }
    }
    if (matched.length) desired.set(c._id, matched);
  }

  // 4) Sync each car's `tuners` to the desired set (overwrite — keyword
  //    search is the source of truth for this migration).
  for (const [carId, tunerIds] of desired) {
    await client
      .patch(carId)
      .set({
        tuners: tunerIds.map((id, i) => ({
          _type: "reference",
          _ref: id,
          _key: `tuner-${id}-${i}`,
        })),
      })
      .commit();
  }

  // 5) Clear `tuners` on any car that previously had a tuner but no longer
  //    matches (safety in case of past mis-tags).
  const previouslyTagged = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "car" && defined(tuners) && count(tuners) > 0 && !(_id in $kept)]{ _id, "slug": slug.current }`,
    { kept: Array.from(desired.keys()) },
  );
  for (const c of previouslyTagged) {
    await client.patch(c._id).unset(["tuners"]).commit();
    console.log(`  · cleared stale tuner on ${c.slug}`);
  }

  console.log("");
  for (const { brandId } of KEYWORD_TUNERS) {
    console.log(`✓ ${brandId}: ${summary[brandId].length} car(s)`);
    for (const n of summary[brandId]) console.log(`    - ${n}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
