import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Service name",
      type: "string",
      description: "E.g. \"Long Term Rental\". Used in card titles + nav.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "Drives /service/{slug}. Must match the live luxurysupercarsdubai.com slug exactly.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Card summary",
      type: "text",
      rows: 2,
      description: "One-line description for the /services grid cards.",
    }),
    defineField({
      name: "h1",
      title: "Page H1",
      type: "string",
      description: "Visible heading on /service/{slug}. Mirror the live page verbatim.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body content",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich-text body of the service detail page.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Display order on /services",
      type: "number",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
