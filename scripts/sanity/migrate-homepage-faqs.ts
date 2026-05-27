import { FAQ } from "@/lib/content";
import { batchCreateOrReplace } from "./lib";

/**
 * The 4 homepage FAQ teaser entries (FAQ.items in lib/content.ts).
 *
 * These are DISTINCT from the 29 /faq-page entries migrated by
 * migrate-faqs.ts — different, shorter wording authored for the homepage.
 * They were never part of that migration, so this script adds them as
 * their own `faq` docs flagged `showOnHomepage: true`.
 *
 * Additive + idempotent: it only creates the 4 `faq-home-*` docs and
 * never touches the 29 page docs. Verbatim from lib/content.ts.
 */
async function main() {
  const docs = FAQ.items.map((it, idx) => ({
    _id: `faq-home-${slugify(it.q).slice(0, 72)}-${idx}`,
    _type: "faq",
    question: it.q,
    answer: it.a,
    category: inferCategory(it.q, it.a),
    showOnHomepage: true,
    order: idx,
  }));

  await batchCreateOrReplace(docs, { label: "homepage-faqs" });
  console.log(`✓ ${docs.length} homepage FAQs (showOnHomepage: true)`);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Mirrors inferCategory in migrate-faqs.ts.
function inferCategory(q: string, a: string): string {
  const t = `${q} ${a}`.toLowerCase();
  if (/document|passport|licen|emirates id/.test(t)) return "documents";
  if (/payment|deposit|crypto|visa|mastercard|bitcoin|cash|card/.test(t)) return "payment";
  if (/deliver|pick.?up|drop.?off|location/.test(t)) return "delivery";
  if (/reserv|book|cancel|modif|extend|age|grace|late return|charge/.test(t)) return "booking";
  return "other";
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
