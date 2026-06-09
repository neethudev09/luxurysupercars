import { defineField, defineType } from "sanity";

/** A reusable {label, href} link, used by the nav + footer link columns. */
const linkObject = {
  type: "object" as const,
  name: "navLink",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "href", title: "Path or URL", type: "string", description: "e.g. /about-us or https://…" }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
};

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
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "copyright", title: "Copyright line", type: "string" }),
        defineField({
          name: "brands",
          title: "Brand names list",
          type: "array",
          of: [{ type: "string" }],
          description: "The brand names listed in the footer.",
        }),
        defineField({ name: "rentLinks", title: "“Rent” column links", type: "array", of: [linkObject] }),
        defineField({ name: "usefulLinks", title: "“Useful links” column", type: "array", of: [linkObject] }),
        defineField({ name: "legalLinks", title: "Legal links column", type: "array", of: [linkObject] }),
      ],
    }),
    defineField({
      name: "navLinks",
      title: "Main navigation links",
      type: "array",
      of: [linkObject],
      description: "The top navigation menu. Each link needs a label and a path (e.g. /about-us). Leave empty to keep the built-in menu.",
    }),
    defineField({
      name: "promo",
      title: "Promo pop-up",
      type: "object",
      options: { collapsible: true, collapsed: true },
      description: "The email-capture pop-up shown to first-time visitors.",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow (small label)", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "highlight",
          title: "Highlighted words",
          type: "string",
          description: "These exact words inside the heading are shown in gold (e.g. \"15% off\").",
        }),
        defineField({ name: "body", title: "Body text", type: "text", rows: 2 }),
        defineField({ name: "buttonLabel", title: "Button label", type: "string" }),
        defineField({ name: "disclaimer", title: "Small print under the form", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
