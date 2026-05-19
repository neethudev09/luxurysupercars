/**
 * One-shot patch that adds deposit / mileageLimit / extraKmCharge to
 * every existing car doc in Sanity. Avoids re-uploading the ~1000
 * gallery images that the full migrate-cars.ts would re-download.
 *
 * Run once; afterwards the full migrate-cars.ts will set the same
 * fields on any new car it adds.
 */
import fleetData from "@/lib/fleet-data.json" with { type: "json" };
import { client } from "./lib";

interface FleetCar {
  slug: string;
  brand: string;
  specs: { deposit?: string; mileageLimit?: string; extraKmCharge?: string };
}

async function main() {
  const cars = fleetData as FleetCar[];
  const tx = client.transaction();
  let queued = 0;
  for (const c of cars) {
    const docId = `car-${c.brand}-${c.slug}`;
    tx.patch(docId, (p) =>
      p.set({
        deposit: c.specs.deposit,
        mileageLimit: c.specs.mileageLimit,
        extraKmCharge: c.specs.extraKmCharge,
      }),
    );
    queued++;
  }
  await tx.commit({ visibility: "async" });
  console.log(`✓ patched ${queued} cars with rental-terms fields`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
