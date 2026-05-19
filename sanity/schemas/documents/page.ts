import { defineField, defineType } from "sanity";

/**
 * Standalone-page content (hero + SEO) for the site's 14 top-level
 * routes (home, about, services, contact, faq, careers, blog, legal,
 * 4 fleet category pages, our-fleet).
 *
 * Each page is a Sanity singleton — there's one document per route,
 * pinned by document ID in sanity/structure.ts. Editors can't create
 * new `page` documents from the global menu (enforced in sanity.config.ts).
 *
 * Render-side: every page route's generateMetadata + PageHero reads
 * this document and falls back to the verbatim live copy in
 * lib/content.ts when a field is blank — so leaving fields empty
 * preserves the SEO-locked live wording.
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "routePath",
      title: "Route",
      type: "string",
      description: "Read-only — the URL this page is rendered at.",
      readOnly: true,
    }),
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      description: "Editor-only label (not rendered). E.g. \"Contact us page\".",
      validation: (Rule) => Rule.required(),
    }),

    // --- Hero -------------------------------------------------------
    defineField({
      name: "heroEyebrow",
      title: "Hero — eyebrow",
      type: "string",
      description: "Small champagne label above the H1. E.g. \"Contact\", \"Services\".",
    }),
    defineField({
      name: "heroH1",
      title: "Hero — H1",
      type: "string",
      description: "Big display heading. Supports **bold** for champagne emphasis.",
    }),
    defineField({
      name: "heroSubline",
      title: "Hero — subline",
      type: "text",
      rows: 3,
      description: "Smaller body line under the H1. Leave blank to hide.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero — background image",
      type: "image",
      options: { hotspot: true },
    }),

    // --- SEO --------------------------------------------------------
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "routePath", media: "heroImage" },
  },
});
