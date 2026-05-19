import { defineField, defineType } from "sanity";

/**
 * Reusable SEO object. Embed on any document that surfaces a public
 * URL (car, blogPost, service, brand, page).
 *
 * Empty fields are fine — the route's generateMetadata should fall back
 * to sensible defaults (title from `name`, description from excerpt, etc).
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description: "Browser tab + search result title. Leave blank to use the document title.",
      validation: (Rule) => Rule.max(70).warning("Search engines truncate titles longer than 70 chars."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Search result snippet (160 chars max).",
      validation: (Rule) => Rule.max(170).warning("Search engines truncate descriptions longer than 160 chars."),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description: "Used when the URL is shared on social. Falls back to the document hero image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "If true, adds <meta name=\"robots\" content=\"noindex\"> to the page.",
      initialValue: false,
    }),
  ],
});
