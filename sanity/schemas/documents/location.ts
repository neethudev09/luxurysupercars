import { defineField, defineType } from "sanity";

/**
 * Location pages — /locations/{slug}. Each location has a hero intro,
 * why-rent bullets, nearby hotels & attractions, local landmarks,
 * popular brand links, FAQs and geo coordinates for the map.
 *
 * Migrated from lib/locations.ts (1047 lines of inline TypeScript).
 * Slug drives both the URL and the sitemap entry.
 */
export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Display name",
      type: "string",
      description: "E.g. \"Dubai Marina\", \"Palm Jumeirah\". Used in nav, breadcrumbs, and section headings.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: "Drives /locations/{slug}. Must match live (e.g. \"dubai-marina\").",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "h1",
      title: "Page H1",
      type: "string",
      description: "Visible heading on the location page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 4,
      description: "Lead paragraph shown below the hero and above the details.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coordinates",
      title: "Map coordinates",
      type: "object",
      description: "Latitude / longitude used for the map panel and Place JSON-LD.",
      fields: [
        defineField({ name: "lat", title: "Latitude", type: "number", validation: (Rule) => Rule.required() }),
        defineField({ name: "lng", title: "Longitude", type: "number", validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: "whyRent",
      title: "Why rent here",
      type: "array",
      of: [{ type: "string" }],
      description: "Bulleted list of reasons to rent a car in this location.",
    }),
    defineField({
      name: "hotels",
      title: "Nearby hotels",
      type: "array",
      of: [{ type: "string" }],
      description: "Hotels we deliver to in this area.",
    }),
    defineField({
      name: "attractions",
      title: "Attractions",
      type: "array",
      of: [{ type: "string" }],
      description: "Local attractions worth visiting from this location.",
    }),
    defineField({
      name: "landmarks",
      title: "Landmarks",
      type: "array",
      of: [{ type: "string" }],
      description: "Landmarks shown in the map panel next to the location page.",
    }),
    defineField({
      name: "popularBrands",
      title: "Popular brands",
      type: "array",
      of: [
        {
          type: "object",
          name: "brandLink",
          fields: [
            defineField({ name: "name", title: "Brand name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "href", title: "Href (link)", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "name", subtitle: "href" } },
        },
      ],
      description: "Cross-links to brand pages, e.g. /brands/rent-ferrari-dubai.",
    }),
    defineField({
      name: "faqs",
      title: "Location FAQs",
      type: "array",
      of: [
        {
          type: "object",
          name: "locationFaq",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({
      name: "nearby",
      title: "Nearby locations",
      type: "array",
      of: [
        {
          type: "object",
          name: "nearbyLink",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "href", title: "Href (link)", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "name", subtitle: "href" } },
        },
      ],
      description: "Cross-links to other nearby location pages.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
});
