import { FLEET_BRANDS } from "@/lib/fleet-brands";
import { batchCreateOrReplace } from "./lib";

/**
 * 13 brand pages migrated from lib/fleet-brands.ts. The structured
 * BrandSectionBlock (paragraph | list | table) becomes a Portable Text
 * array with paragraph blocks, bulleted list blocks, and our custom
 * `pricingTable` inline object (matches the brand schema in
 * sanity/schemas/documents/brand.ts).
 *
 * SEO preservation: title, description, h1 copied byte-for-byte.
 */
async function main() {
  const docs = Object.values(FLEET_BRANDS).map((b) => ({
    _id: `brand-${b.slug}`,
    _type: "brand",
    displayName: b.displayName,
    slug: { _type: "slug", current: b.slug },
    h1: b.h1,
    sections: b.sections.map((s) => ({
      _type: "brandSection",
      _key: key("section", s.h2),
      h2: s.h2,
      body: s.body.flatMap((block) => blockToPortableText(block)),
    })),
    faqs: b.faqs.map((f, idx) => ({
      _type: "brandFaq",
      _key: key("faq", `${idx}-${f.q}`),
      question: f.q,
      answer: f.a,
    })),
    seo: {
      title: b.title,
      description: b.description,
      noIndex: false,
    },
  }));

  await batchCreateOrReplace(docs, { label: "brands" });
  console.log(`✓ ${docs.length} brands`);
}

type BodyBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "rich-paragraph"; segments: { text: string; href?: string }[] }
  | { kind: "list"; items: string[] }
  | { kind: "table"; headers: string[]; rows: string[][] };

function blockToPortableText(b: BodyBlock): unknown[] {
  if (b.kind === "paragraph" || b.kind === "rich-paragraph") {
    const text = b.kind === "rich-paragraph" ? b.segments.map((s) => s.text).join("") : b.text;
    return [
      {
        _type: "block",
        _key: key("p", text.slice(0, 20)),
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: key("s", text.slice(0, 10)), text, marks: [] }],
      },
    ];
  }
  if (b.kind === "list") {
    return b.items.map((item, idx) => ({
      _type: "block",
      _key: key("li", `${idx}-${item.slice(0, 12)}`),
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [{ _type: "span", _key: key("s", item.slice(0, 10)), text: item, marks: [] }],
    }));
  }
  if (b.kind === "table") {
    return [
      {
        _type: "pricingTable",
        _key: key("tbl", b.headers.join("-").slice(0, 20)),
        headers: b.headers,
        rows: b.rows.map((cells, idx) => ({
          _type: "row",
          _key: key("row", `${idx}`),
          cells,
        })),
      },
    ];
  }
  return [];
}

let counter = 0;
function key(prefix: string, hint: string): string {
  counter += 1;
  const sanitized = hint.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${prefix}-${sanitized.slice(0, 24)}-${counter.toString(36)}`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
