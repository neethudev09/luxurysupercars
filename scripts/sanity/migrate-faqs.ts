import { FAQ_PAGE, FAQ } from "@/lib/content";
import { batchCreateOrReplace } from "./lib";

/**
 * FAQ docs. FAQ_PAGE.items has 29 entries (the full /faq page set).
 * The 4 entries in FAQ.items are a curated subset shown on the home
 * page — we set `showOnHomepage: true` on the matching docs.
 */
async function main() {
  const homepageQuestions = new Set<string>(FAQ.items.map((it) => it.q));

  const docs = FAQ_PAGE.items.map((it, idx) => ({
    _id: `faq-${slugify(it.q).slice(0, 80)}-${idx}`,
    _type: "faq",
    question: it.q,
    answer: it.a,
    category: inferCategory(it.q, it.a),
    showOnHomepage: homepageQuestions.has(it.q),
    order: idx,
  }));

  await batchCreateOrReplace(docs, { label: "faqs" });
  console.log(`✓ ${docs.length} FAQs (${docs.filter((d) => d.showOnHomepage).length} on homepage)`);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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
