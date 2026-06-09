import { defineField, defineType } from "sanity";

/**
 * Homepage editorial content — every heading, paragraph, card and CTA the
 * owner wanted to control without a code deploy. Embedded as a single
 * `homeContent` field on the Home `page` document (sanity/schemas/documents/page.ts),
 * shown ONLY on page-home.
 *
 * Render-side: scripts/sanity/export-to-json.ts writes this object verbatim
 * to lib/generated/home.json, and lib/content.ts reads each field with a
 * fallback to the verbatim live copy — so an empty field never blanks the
 * homepage, and leaving everything untouched preserves the current wording.
 *
 * Heading fields accept **double-asterisk** markers: the renderer turns the
 * wrapped words into the champagne-italic emphasis (e.g. "**Sports Car**
 * Rental in Dubai"). Editors should keep the markers when editing.
 */

/** Eyebrow + H2 — the heading pair every homepage section shares. */
const headingFields = [
  defineField({
    name: "eyebrow",
    title: "Eyebrow (small label above heading)",
    type: "string",
  }),
  defineField({
    name: "h2",
    title: "Heading",
    type: "string",
    description: "Wrap words in **double asterisks** to gold-emphasise them.",
  }),
];

export const homeContent = defineType({
  name: "homeContent",
  title: "Homepage content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    /* ----------------------------- Hero ----------------------------- */
    defineField({
      name: "hero",
      title: "Hero (top of page)",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "h1",
          title: "Main heading (H1)",
          type: "string",
          description: "Wrap words in **double asterisks** to gold-emphasise them.",
        }),
        defineField({ name: "subline", title: "Sub-heading", type: "text", rows: 2 }),
        defineField({ name: "ctaPrimary", title: "Primary button label", type: "string" }),
        defineField({ name: "ctaSecondary", title: "Secondary button label", type: "string" }),
        defineField({ name: "ratingStars", title: "Rating — stars (e.g. 4.9)", type: "number" }),
        defineField({ name: "ratingCount", title: "Rating — number of reviews", type: "number" }),
      ],
    }),

    /* ------------------------ Fleet sections ------------------------ */
    ...(["Sports", "Convertible", "Luxury", "SUV"] as const).map((label) =>
      defineField({
        name: `fleet${label === "SUV" ? "Suv" : label}`,
        title: `${label} cars section`,
        type: "object",
        options: { collapsible: true, collapsed: true },
        fields: [
          defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
          defineField({
            name: "h2",
            title: "Heading",
            type: "string",
            description: "Wrap words in **double asterisks** to gold-emphasise them.",
          }),
          defineField({ name: "body", title: "Paragraph", type: "text", rows: 4 }),
          defineField({ name: "cta", title: "Button label", type: "string" }),
        ],
      }),
    ),

    /* ----------------------- Brand story block ---------------------- */
    defineField({
      name: "brandStory",
      title: "About / brand-story section",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        ...headingFields,
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          type: "array",
          of: [{ type: "text", rows: 4 }],
        }),
        defineField({
          name: "stats",
          title: "Stat counters",
          type: "array",
          of: [
            {
              type: "object",
              name: "stat",
              fields: [
                defineField({ name: "value", title: "Number", type: "number" }),
                defineField({ name: "decimals", title: "Decimal places (e.g. 1 for 4.9)", type: "number" }),
                defineField({ name: "suffix", title: "Suffix (e.g. +, ★, /7)", type: "string" }),
                defineField({ name: "label", title: "Label", type: "string" }),
              ],
              preview: {
                select: { value: "value", suffix: "suffix", label: "label" },
                prepare: ({ value, suffix, label }) => ({ title: `${value ?? ""}${suffix ?? ""} — ${label ?? ""}` }),
              },
            },
          ],
        }),
      ],
    }),

    /* ---------------------- Requirements block ---------------------- */
    defineField({
      name: "requirements",
      title: "Requirements section",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        ...headingFields,
        defineField({
          name: "items",
          title: "Requirement cards",
          type: "array",
          of: [
            {
              type: "object",
              name: "requirement",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "title", subtitle: "body" } },
            },
          ],
        }),
      ],
    }),

    /* ------------------------ Why choose us ------------------------- */
    defineField({
      name: "whyUs",
      title: "Why choose us section",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        ...headingFields,
        defineField({
          name: "cards",
          title: "Cards",
          type: "array",
          of: [
            {
              type: "object",
              name: "whyCard",
              fields: [
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "title", subtitle: "body" } },
            },
          ],
        }),
      ],
    }),

    /* -------------------- Section headings only --------------------- */
    defineField({
      name: "testimonialsHeading",
      title: "Testimonials — heading",
      type: "object",
      options: { collapsible: true, collapsed: true },
      description: "The reviews themselves are managed under “Testimonials”.",
      fields: headingFields,
    }),
    defineField({
      name: "faqHeading",
      title: "FAQ — heading",
      type: "object",
      options: { collapsible: true, collapsed: true },
      description: "The questions are managed under “FAQs”.",
      fields: [
        ...headingFields,
        defineField({
          name: "h3",
          title: "Sub-heading",
          type: "string",
          description: "Wrap words in **double asterisks** to gold-emphasise them.",
        }),
      ],
    }),
    defineField({
      name: "blogHeading",
      title: "Blog teaser — heading",
      type: "object",
      options: { collapsible: true, collapsed: true },
      description: "The posts shown are managed under “Blog posts”.",
      fields: headingFields,
    }),
    defineField({
      name: "instagramHeading",
      title: "Instagram — heading",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: headingFields,
    }),
  ],
});
