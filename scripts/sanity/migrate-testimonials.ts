import { TESTIMONIALS } from "@/lib/content";
import { batchCreateOrReplace } from "./lib";

/**
 * Testimonials — 5 named + 7 Google reviews. Verbatim from lib/content.ts.
 * `showOnHomepage: true` on the first 5 named ones (matches current
 * homepage Testimonials carousel behavior).
 */
async function main() {
  const named = TESTIMONIALS.named.map((it, idx) => ({
    _id: `testimonial-named-${slugify(it.name).slice(0, 80)}-${idx}`,
    _type: "testimonial",
    name: it.name,
    quote: it.quote,
    source: "named",
    rating: 5,
    showOnHomepage: true,
    order: idx,
  }));

  const google = TESTIMONIALS.google.map((it, idx) => ({
    _id: `testimonial-google-${slugify(it.name).slice(0, 80)}-${idx}`,
    _type: "testimonial",
    name: it.name,
    quote: it.quote,
    source: "google",
    rating: 5,
    showOnHomepage: false,
    order: named.length + idx,
  }));

  const docs = [...named, ...google];
  await batchCreateOrReplace(docs, { label: "testimonials" });
  console.log(`✓ ${docs.length} testimonials (${named.length} named, ${google.length} google)`);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
