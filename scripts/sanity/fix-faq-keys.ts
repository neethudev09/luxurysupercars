/**
 * Adds missing _key properties to FAQ array items in brand and type page documents.
 *
 * Run: npx tsx scripts/sanity/fix-faq-keys.ts
 */
import { client, isConfigured } from "./lib";
import { v4 as uuid } from "uuid";

async function fixBrandFaqKeys() {
  const brands = await client.fetch(`*[_type == "brand" && defined(slug.current)]{ _id, displayName }`);
  console.log(`Found ${brands.length} brand documents`);

  for (const b of brands) {
    const doc = await client.fetch(`*[_id == $id]{faqs}[0]`, { id: b._id });
    if (!doc?.faqs?.length) continue;

    const needsFix = doc.faqs.some((f: any) => !f._key);
    if (!needsFix) {
      console.log(`  ✓ ${b.displayName} — keys OK`);
      continue;
    }

    const fixed = doc.faqs.map((f: any) => ({
      ...f,
      _key: f._key || uuid(),
    }));

    await client.patch(b._id).set({ faqs: fixed }).commit();
    console.log(`  ✓ ${b.displayName} — ${fixed.length} keys added`);
  }
}

async function fixTypeFaqKeys() {
  const ids = ["page-rent-sports", "page-rent-convertible", "page-rent-luxury", "page-rent-suv"];
  const labels: Record<string, string> = {
    "page-rent-sports": "Sports Cars",
    "page-rent-convertible": "Convertible Cars",
    "page-rent-luxury": "Luxury Cars",
    "page-rent-suv": "SUVs",
  };

  for (const id of ids) {
    const doc = await client.fetch(`*[_id == $id]{fleetTypeContent}[0]`, { id });
    if (!doc?.fleetTypeContent?.faqs?.length) continue;

    const faqs = doc.fleetTypeContent.faqs;
    const needsFix = faqs.some((f: any) => !f._key);
    if (!needsFix) {
      console.log(`  ✓ ${labels[id]} — keys OK`);
      continue;
    }

    const fixed = faqs.map((f: any) => ({
      ...f,
      _key: f._key || uuid(),
    }));

    await client.patch(id).set({ fleetTypeContent: { faqs: fixed } }).commit();
    console.log(`  ✓ ${labels[id]} — ${fixed.length} keys added`);
  }
}

async function main() {
  if (!isConfigured) {
    console.error("Sanity client is not configured.");
    process.exit(1);
  }

  console.log("Fixing brand FAQ keys...");
  await fixBrandFaqKeys();

  console.log("\nFixing type page FAQ keys...");
  await fixTypeFaqKeys();

  console.log("\nDone! Keys added to all FAQ items.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
