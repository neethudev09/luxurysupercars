import { defineField, defineType } from "sanity";

/**
 * Fleet-category page content — the editable copy for the four
 * /rent-{type}-cars-dubai pages (Sports, Convertible, Luxury, SUV). Embedded
 * as a `fleetTypeContent` field on each of those four `page` documents, shown
 * only on them. The meta title/description come from the document's shared SEO
 * panel; the slug + which cars are listed are fixed in code.
 *
 * Render-side: scripts/sanity/export-to-json.ts writes this block (keyed by
 * category) to lib/generated/fleet-types.json, and lib/fleet-types.ts merges
 * it over the verbatim live copy — so an empty field never blanks the page and
 * an un-migrated doc renders exactly the current SEO-locked wording.
 */
export const fleetTypeContent = defineType({
  name: "fleetTypeContent",
  title: "Fleet page content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "visibleTitle",
      title: "Visible page heading",
      type: "string",
      description: "The large heading shown on the page (e.g. \"Sports Cars\").",
    }),
    defineField({
      name: "h1",
      title: "SEO heading (H1)",
      type: "string",
      description: "The semantic H1 for search engines (often phrased differently from the visible heading).",
    }),
    defineField({
      name: "introParagraphs",
      title: "Intro paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "The lead copy above the car grid.",
    }),
    defineField({
      name: "faqHeading",
      title: "FAQ section heading",
      type: "string",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          name: "fleetFaq",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        },
      ],
    }),
  ],
});
