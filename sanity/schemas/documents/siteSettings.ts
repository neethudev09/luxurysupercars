import { defineField, defineType } from "sanity";

/**
 * Singleton — every site-wide setting that should be editable without
 * a code deploy. The desk structure pins this as a single document
 * (no "create new" option) so editors always land on the same record.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  // The desk forces a single-document instance for this type.
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      initialValue: "Luxury Supercars Dubai",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Default site description",
      type: "text",
      rows: 3,
      description: "Used in social shares + as a fallback meta description site-wide.",
    }),
    defineField({
      name: "contact",
      title: "Contact details",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "primaryPhone", title: "Primary phone", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "secondaryPhone", title: "Secondary phone", type: "string" }),
        defineField({ name: "landline", title: "Landline", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string", validation: (Rule) => Rule.required().email() }),
        defineField({ name: "address", title: "Primary showroom address", type: "text", rows: 2 }),
        defineField({ name: "altAddress", title: "Secondary address", type: "text", rows: 2 }),
        defineField({ name: "operationHours", title: "Operation hours", type: "string", initialValue: "9 am – 9 pm (Monday–Sunday)" }),
      ],
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "twitter", title: "X (Twitter) URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok URL", type: "url" }),
      ],
    }),
    defineField({
      name: "footerDescription",
      title: "Footer description",
      type: "text",
      rows: 4,
      description: "Long-form blurb shown in the site footer.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
