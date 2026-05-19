/**
 * One-shot patch — sync the cleaned-up features arrays from
 * lib/fleet-data.json into the existing Sanity car docs. Run after
 * a feature-cleanup pass to avoid re-uploading the gallery images.
 */
import fleetData from "@/lib/fleet-data.json" with { type: "json" };
import { client } from "./lib";

interface FleetCar {
  slug: string;
  brand: string;
  features: string[];
}

async function main() {
  const cars = fleetData as FleetCar[];
  const tx = client.transaction();
  for (const c of cars) {
    tx.patch(`car-${c.brand}-${c.slug}`, (p) => p.set({ features: c.features }));
  }
  await tx.commit({ visibility: "async" });
  console.log(`✓ patched features on ${cars.length} cars`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
