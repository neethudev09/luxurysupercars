import { defineField, defineType } from "sanity";

/**
 * Blog post. Each post lives at /blogs/{slug} — slug MUST match the
 * live luxurysupercarsdubai.com URL to preserve inbound SEO.
 *
 * Migrated content keeps the original HTML body for fidelity; new posts
 * authored in Studio use Portable Text (richer editor, image asset refs).
 * The renderer prefers `body` (Portable Text) and falls back to `bodyHtml`.
 */
export const blogPost = defineType({
  name: "blogPost",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Used in the SEO <title> if no override in the SEO panel.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "h1",
      title: "Display H1",
      type: "string",
      description: "Visible heading on the post page (often longer/punchier than the SEO title).",
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Drives /blogs/{slug}. Must match the live URL byte-for-byte.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on blog index cards.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Body (rich text)",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
        },
      ],
      description: "Preferred body format for new posts.",
    }),
    defineField({
      name: "bodyHtml",
      title: "Body (legacy HTML)",
      type: "text",
      rows: 20,
      description: "Migrated posts keep their original HTML here. New posts should use the rich-text Body above.",
    }),
    defineField({
      name: "relatedCars",
      title: "Related cars",
      type: "array",
      of: [{ type: "reference", to: [{ type: "car" }] }],
      description: "Surfaced in a 'cars mentioned' strip beneath the article.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    {
      title: "Published (newest first)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "",
      media,
    }),
  },
});
