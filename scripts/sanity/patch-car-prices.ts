/**
 * One-shot patch: sync the approved price sheet updates into Sanity car docs.
 *
 * Why this exists:
 * - npm run build runs scripts/sanity/export-to-json.ts before Next builds.
 * - That export writes lib/fleet-data.json from Sanity car.priceAed.
 * - If Sanity still has old prices, the generated JSON reverts to old prices.
 *
 * Run after the approved pricing review:
 *   npx tsx scripts/sanity/patch-car-prices.ts
 */
import { client } from "./lib";

const PRICE_UPDATES: Record<string, number> = {
  "rent-audi-dubai/audi-r8-spyder": 1800,
  "rent-bentley-dubai/bentley-bentayga-black": 2000,
  "rent-bentley-dubai/bentley-bentayga-brown": 2000,
  "rent-bentley-dubai/bentley-bentayga-mansory": 4500,
  "rent-bmw-dubai/bmw-735i": 1300,
  "rent-cadillac-dubai/cadillac-escalade-sports-platinum": 1300,
  "rent-ferrari-dubai/ferrari-296-gts-spyder": 4000,
  "rent-ferrari-dubai/ferrari-roma-spyder": 3300,
  "rent-ferrari-dubai/ferrari-sf90-stradale": 9000,
  "rent-lamborghini-dubai/lamborghini-huracan-evo-coupe": 2500,
  "rent-lamborghini-dubai/lamborghini-huracan-evo-spyder-green": 3000,
  "rent-lamborghini-dubai/lamborghini-huracan-evo-spyder-red": 3000,
  "rent-lamborghini-dubai/lamborghini-urus-blue": 2800,
  "rent-lamborghini-dubai/lamborghini-urus-mansory": 4000,
  "rent-lamborghini-dubai/lamborghini-urus-purple": 2800,
  "rent-mclaren-dubai/mclaren-750s-spyder": 4500,
  "rent-mclaren-dubai/mclaren-750s-spyder-tiffany-blue": 4500,
  "rent-mclaren-dubai/mclaren-artura-spyder": 3500,
  "rent-mclaren-dubai/mclaren-artura-spyder-white": 3500,
  "rent-mercedes-benz-dubai/mercedes-benz-amg-c63": 1500,
  "rent-mercedes-benz-dubai/mercedes-benz-amg-gls800-brabus": 2000,
  "rent-mercedes-benz-dubai/mercedes-benz-amg-gt63-coupe": 2200,
  "rent-mercedes-benz-dubai/mercedes-gls600-maybach": 2000,
  "rent-porsche-dubai/porsche-911-carerra-s-spyder": 1500,
  "rent-porsche-dubai/porsche-911-turbo-s": 3000,
  "rent-range-rover-dubai/range-rover-vogue-hse": 1500,
  "rent-range-rover-dubai/range-rover-vogue-mansory": 2000,
  "rent-rolls-royce-dubai/rolls-royce-cullinan": 4000,
  "rent-rolls-royce-dubai/rolls-royce-cullinan-mansory": 5500,
  "rent-rolls-royce-dubai/rolls-royce-cullinan-mansory-black": 4500,
};

async function main() {
  const rows = Object.entries(PRICE_UPDATES).map(([key, priceAed]) => {
    const [brandSlug, slug] = key.split("/");
    return {
      docId: `car-${brandSlug}-${slug}`,
      brandSlug,
      slug,
      priceAed,
    };
  });

  const existing = await client.fetch<Array<{ _id: string; slug: string; priceAed?: number }>>(
    `*[_type == "car" && _id in $ids]{ _id, "slug": slug.current, priceAed }`,
    { ids: rows.map((row) => row.docId) },
  );
  const existingIds = new Set(existing.map((doc) => doc._id));
  const missing = rows.filter((row) => !existingIds.has(row.docId));

  if (missing.length) {
    throw new Error(
      `Missing Sanity car docs: ${missing.map((row) => `${row.brandSlug}/${row.slug}`).join(", ")}`,
    );
  }

  const tx = client.transaction();
  for (const row of rows) {
    tx.patch(row.docId, (patch) => patch.set({ priceAed: row.priceAed }));
  }

  await tx.commit({ visibility: "sync" });

  console.log(`patched ${rows.length} Sanity car prices`);
  for (const row of rows) {
    console.log(`${row.brandSlug}/${row.slug}: AED ${row.priceAed}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
