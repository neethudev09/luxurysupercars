import { FLEET_TYPES } from "@/lib/fleet-types";
import type { Category } from "@/lib/fleet";
import { client } from "./lib";

/**
 * Seed the four fleet-category page documents' `fleetTypeContent` block
 * (objects/fleetTypeContent.ts) with the current verbatim copy + FAQs, so the
 * team sees and can edit the real content in /studio. The SEO title/description
 * were already set on these docs by migrate-pages.ts.
 *
 * Run ONCE after deploying the schema:  npx tsx scripts/sanity/migrate-fleet-types.ts
 *
 * Uses `setIfMissing`, so re-running never clobbers edits. At seed time
 * lib/generated/fleet-types.json is `{}`, so FLEET_TYPES equals the verbatim
 * live copy — the seed is byte-exact and the pages render unchanged.
 */

const FLEET_DOCS: { id: string; cat: Exclude<Category, never> }[] = [
  { id: "page-rent-sports", cat: "sports" },
  { id: "page-rent-convertible", cat: "convertible" },
  { id: "page-rent-luxury", cat: "luxury" },
  { id: "page-rent-suv", cat: "suv" },
];

async function main() {
  for (const { id, cat } of FLEET_DOCS) {
    const m = FLEET_TYPES[cat];
    const fleetTypeContent = {
      visibleTitle: m.visibleTitle,
      h1: m.h1,
      introParagraphs: [...m.introParagraphs],
      faqHeading: m.faqHeading,
      faqs: m.faqs.map((f, i) => ({
        _type: "fleetFaq",
        _key: `faq-${i}`,
        question: f.q,
        answer: f.a,
      })),
    };

    await client
      .patch(id)
      .setIfMissing({
        fleetTypeContent,
        seo: { title: m.title, description: m.description, noIndex: false },
      })
      .commit({ visibility: "async" });

    console.log(`✓ ${id} (${m.faqs.length} FAQs)`);
  }
  console.log("Done — fleet-category page content seeded.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
