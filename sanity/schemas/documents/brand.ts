import { defineField, defineType } from "sanity";

/**
 * Brand pages — /brands/rent-{brand}-dubai/. Each brand has long-form
 * sections (H2 + Portable Text body), a brand-specific FAQ list, and
 * full SEO metadata.
 *
 * Migrated from lib/fleet-brands.ts (2735 lines of inline TypeScript).
 * Cars reference the brand via car.brand → brand._id.
 */
export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "displayName",
      title: "Display name",
      type: "string",
      description: "E.g. \"Ferrari\", \"Rolls-Royce\". Used in nav, breadcrumbs, and car cards.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: "Drives /brands/{slug} and /{slug}/{car-slug}. Must match live (e.g. \"rent-ferrari-dubai\").",
      options: {
        source: "displayName",
        maxLength: 96,
        slugify: (input) =>
          `rent-${input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-dubai`,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "h1",
      title: "Page H1",
      type: "string",
      description: "Visible heading on the brand page. Mirror live verbatim (some have intentional quirks like \"Rent Mclaren in Dubai\").",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Brand logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "introBody",
      title: "Intro body",
      type: "array",
      of: [{ type: "block" }],
      description: "Lead paragraphs above the fleet grid.",
    }),
    defineField({
      name: "sections",
      title: "Content sections",
      type: "array",
      description: "Repeatable H2 + Portable Text sections (with optional bulleted lists and pricing tables).",
      of: [
        {
          type: "object",
          name: "brandSection",
          fields: [
            defineField({ name: "h2", title: "Section heading", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [
                { type: "block" },
                {
                  type: "object",
                  name: "pricingTable",
                  title: "Pricing table",
                  fields: [
                    defineField({
                      name: "headers",
                      title: "Column headers",
                      type: "array",
                      of: [{ type: "string" }],
                    }),
                    defineField({
                      name: "rows",
                      title: "Rows",
                      type: "array",
                      of: [
                        {
                          type: "object",
                          name: "row",
                          fields: [
                            defineField({
                              name: "cells",
                              title: "Cells",
                              type: "array",
                              of: [{ type: "string" }],
                            }),
                          ],
                        },
                      ],
                    }),
                  ],
                  preview: {
                    select: { headers: "headers", rows: "rows" },
                    prepare: ({ headers, rows }) => ({
                      title: `Table (${headers?.length ?? 0} cols × ${rows?.length ?? 0} rows)`,
                    }),
                  },
                },
              ],
            }),
          ],
          preview: { select: { title: "h2" } },
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "Brand-specific FAQs",
      type: "array",
      of: [
        {
          type: "object",
          name: "brandFaq",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "displayName", subtitle: "slug.current", media: "logo" },
  },
});
