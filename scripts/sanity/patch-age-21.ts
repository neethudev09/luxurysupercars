/**
 * Patch all brand pages — change minimum age from 20 → 21 site-wide.
 *
 * Runs against every `brand` document in Sanity and replaces age-related
 * text in sections and FAQs. Safe to re-run.
 *
 * Run: npx tsx scripts/sanity/patch-age-21.ts
 */
import { client, isConfigured } from "./lib";

type Replacer = string | ((m: string) => string);
const AGE_PATTERNS: [RegExp, Replacer][] = [
  [/at least 20 years old/g, "at least 21 years old"],
  [/above 20 years old/g, "above 21 years old"],
  [/above 20 years of age/g, "above 21 years of age"],
  [/above 20/g, "above 21"],
  [/over 20 years old/g, "over 21 years old"],
  [/over 20/g, "over 21"],
  [/minimum age is 20 years/g, "minimum age is 21 years"],
  [/minimum age.*?20/g, (m: string) => m.replace(/20/, "21")],
  [/must be 20/g, "must be 21"],
  [/age of 20/g, "age of 21"],
  [/age limit.*20/g, (m: string) => m.replace(/20/, "21")],
  [/is 20 years old/g, "is 21 years old"],
  [/20 years or above/g, "21 years or above"],
  [/20 years or older/g, "21 years or older"],
  [/if you are 20/g, "if you are 21"],
];

function replaceAge(text: string): string {
  for (const [pattern, replacement] of AGE_PATTERNS) {
    text = typeof replacement === "function"
      ? text.replace(pattern, replacement)
      : text.replace(pattern, replacement);
  }
  return text;
}

function walk(obj: unknown): unknown {
  if (typeof obj === "string") {
    return replaceAge(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(walk);
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = walk(value);
    }
    return result;
  }
  return obj;
}

async function main() {
  if (!isConfigured) {
    console.error("SANITY_API_TOKEN not found in .env.local");
    process.exit(1);
  }

  const brands = await client.fetch<{ _id: string; _rev: string }[]>(
    `*[_type == "brand"]{ _id, _rev }`,
  );
  console.log(`Found ${brands.length} brand documents`);

  let patched = 0;
  for (const b of brands) {
    const doc = await client.getDocument(b._id);
    if (!doc) continue;

    const current = JSON.stringify(doc);
    const walked = walk(doc) as Record<string, unknown>;
    // Remove _rev so createOrReplace generates a new one
    delete walked._rev;
    const updated = JSON.stringify(walked);

    if (current === updated) {
      console.log(`  ${b._id} — no change`);
      continue;
    }

    await client.createOrReplace(walked as any);
    patched++;
    console.log(`  ${b._id} — patched`);
  }

  console.log(`\nDone. ${patched} brand(s) updated.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
