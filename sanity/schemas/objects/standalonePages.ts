import { defineField, defineType } from "sanity";

/**
 * Editable content for the standalone pages (contact, careers, services, FAQ,
 * booking T&Cs, privacy). Each is embedded as a field on its `page` document,
 * shown only on that document. The meta title/description come from the
 * document's shared SEO panel; the page's bespoke layout (forms, car grids,
 * address cards) stays in code.
 *
 * Render-side: scripts/sanity/export-to-json.ts writes these to
 * lib/generated/pages.json (keyed by route) and lib/content.ts merges each
 * over the verbatim live copy — an empty field falls back, so an un-migrated
 * doc renders exactly the current SEO-locked wording.
 */

const eyebrow = defineField({
  name: "eyebrow",
  title: "Eyebrow (small label above the heading)",
  type: "string",
});

/* ----------------------------- Contact --------------------------------- */
export const contactPageContent = defineType({
  name: "contactPageContent",
  title: "Contact page content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    eyebrow,
    defineField({ name: "h1", title: "SEO heading (hidden H1)", type: "string", description: "The exact live H1, kept for SEO (e.g. \"Contact Us\")." }),
    defineField({ name: "h2", title: "Visible heading", type: "string" }),
    defineField({ name: "intro", title: "Sub-heading", type: "text", rows: 2 }),
    defineField({ name: "body", title: "Body paragraph", type: "text", rows: 4 }),
  ],
});

/* ----------------------------- Careers --------------------------------- */
export const careersPageContent = defineType({
  name: "careersPageContent",
  title: "Careers page content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    eyebrow,
    defineField({ name: "h1", title: "Heading", type: "string" }),
    defineField({ name: "subline", title: "Sub-heading", type: "text", rows: 2 }),
    defineField({ name: "h2", title: "Enquiry-form label", type: "string", description: "Small label above the enquiry form (e.g. \"Careers Enquiry\")." }),
    defineField({ name: "paragraphs", title: "Body paragraphs", type: "array", of: [{ type: "text", rows: 4 }] }),
  ],
});

/* ----------------------------- Services -------------------------------- */
export const servicesPageContent = defineType({
  name: "servicesPageContent",
  title: "Services page content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  description: "The service cards below come from the “Services” documents.",
  fields: [
    eyebrow,
    defineField({ name: "h1", title: "Heading", type: "string" }),
  ],
});

/* ------------------------------- FAQ ----------------------------------- */
export const faqPageContent = defineType({
  name: "faqPageContent",
  title: "FAQ page content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  description: "The questions come from the “FAQs” documents.",
  fields: [
    eyebrow,
    defineField({ name: "h1", title: "Heading", type: "string" }),
    defineField({ name: "subline", title: "Sub-heading", type: "text", rows: 2 }),
  ],
});

/* ------------------------- Booking T&Cs (legal) ------------------------ */
export const bookingTermsContent = defineType({
  name: "bookingTermsContent",
  title: "Booking T&Cs content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    eyebrow,
    defineField({ name: "h1", title: "Heading", type: "string" }),
    defineField({ name: "subline", title: "Sub-heading", type: "text", rows: 2 }),
    defineField({ name: "intro", title: "Intro line", type: "string" }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "termsSection",
          fields: [
            defineField({ name: "title", title: "Section heading", type: "string" }),
            defineField({
              name: "groups",
              title: "Groups",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "termsGroup",
                  fields: [
                    defineField({ name: "subtitle", title: "Sub-heading", type: "string" }),
                    defineField({ name: "items", title: "Bullet points", type: "array", of: [{ type: "string" }] }),
                  ],
                  preview: { select: { title: "subtitle" } },
                },
              ],
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
});

/* --------------------------- Privacy (legal) --------------------------- */
export const privacyPolicyContent = defineType({
  name: "privacyPolicyContent",
  title: "Privacy policy content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    eyebrow,
    defineField({ name: "h1", title: "Heading", type: "string" }),
    defineField({ name: "subline", title: "Sub-heading", type: "text", rows: 2 }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "policySection",
          fields: [
            defineField({ name: "title", title: "Section heading", type: "string" }),
            defineField({ name: "paragraphs", title: "Paragraphs", type: "array", of: [{ type: "text", rows: 4 }] }),
            defineField({ name: "list", title: "Bullet points (optional)", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "trailer", title: "Closing paragraphs (optional)", type: "array", of: [{ type: "text", rows: 3 }] }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
});

/* --------------------------- Cookie policy (legal) --------------------- */
export const cookiePolicyContent = defineType({
  name: "cookiePolicyContent",
  title: "Cookie policy content",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    eyebrow,
    defineField({ name: "h1", title: "Heading", type: "string" }),
    defineField({ name: "subline", title: "Sub-heading", type: "text", rows: 2 }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "cookieSection",
          fields: [
            defineField({ name: "title", title: "Section heading", type: "string" }),
            defineField({ name: "paragraphs", title: "Paragraphs", type: "array", of: [{ type: "text", rows: 4 }] }),
            defineField({ name: "list", title: "Bullet points (optional)", type: "array", of: [{ type: "string" }] }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
});

export const standalonePageObjects = [
  contactPageContent,
  careersPageContent,
  servicesPageContent,
  faqPageContent,
  bookingTermsContent,
  privacyPolicyContent,
  cookiePolicyContent,
];
