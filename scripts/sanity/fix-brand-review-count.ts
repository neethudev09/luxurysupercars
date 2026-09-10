/**
 * Replace every "486 Google reviews" with "489 Google reviews" in the
 * brand document sections body (Portable Text), then re-export.
 *
 * Run: npx tsx scripts/sanity/fix-brand-review-count.ts
 */
import { client, isConfigured } from "./lib";

function replaceInPortableText(node: unknown): boolean {
  let changed = false;
  if (Array.isArray(node)) {
    for (const item of node) {
      if (replaceInPortableText(item)) changed = true;
    }
    return changed;
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if (typeof obj.text === "string" && obj.text.includes("486 Google reviews")) {
      obj.text = obj.text.split("486 Google reviews").join("489 Google reviews");
      return true;
    }
    for (const key of Object.keys(obj)) {
      if (replaceInPortableText(obj[key])) changed = true;
    }
  }
  return changed;
}

async function main() {
  if (!isConfigured) {
    console.error("SANITY_API_TOKEN not found in .env.local — skipping Sanity write.");
    process.exit(1);
  }

  const brands = await client.fetch<
    { _id: string; title: string; sections: unknown[] }[]
  >(`*[_type == "brand"]{ _id, title, sections }`);

  let updatedDocs = 0;
  let updatedBlocks = 0;

  for (const brand of brands) {
    const copy: unknown[] = JSON.parse(JSON.stringify(brand.sections ?? []));
    if (!replaceInPortableText(copy)) continue;
    await client.patch(brand._id).set({ sections: copy }).commit();
    updatedDocs += 1;
    const s = JSON.stringify(copy);
    const n = (s.match(/489 Google reviews/g) || []).length;
    updatedBlocks += n;
    console.log(`Patched: ${brand.title} (matches: ${n})`);
  }

  console.log(`\nDone. ${updatedDocs} brands patched, ${updatedBlocks} blocks set to 489.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});