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
 * The Home and About documents carry extra blocks holding all their
 * editable copy (objects/homeContent.ts, objects/aboutContent.ts), shown
 * ONLY on those documents. Their generic hero fields are hidden because
 * those pages render their own bespoke hero (homeContent.hero / the About
 * video banner), not the shared PageHero.
 *
 * Render-side: scripts/sanity/export-to-json.ts writes these blocks to
 * lib/generated/home.json + about.json, and lib/content.ts reads each field
 * with a fallback to the verbatim live copy — so an empty field never blanks
 * the page, and untouched fields preserve the SEO-locked live wording.
 */

const baseId = (document?: { _id?: string }) =>
  document?._id?.replace(/^drafts\./, "");
/** True for the Home singleton (handles the `drafts.` id prefix). */
const isHome = (document?: { _id?: string }) => baseId(document) === "page-home";
/** True for the About singleton. */
const isAbout = (document?: { _id?: string }) => baseId(document) === "page-about-us";
/** True for the four /rent-{type}-cars-dubai category pages. */
const FLEET_TYPE_IDS = ["page-rent-sports", "page-rent-convertible", "page-rent-luxury", "page-rent-suv"];
const isFleetType = (document?: { _id?: string }) => FLEET_TYPE_IDS.includes(baseId(document) ?? "");
/** The standalone pages, each with its own content block (see below). */
const isOn = (id: string) => (document?: { _id?: string }) => baseId(document) === id;
const STANDALONE_IDS = ["page-contact-us", "page-careers", "page-services", "page-faq", "page-booking-tcs", "page-privacy-policy", "page-cookie-policy"];
const isStandalone = (document?: { _id?: string }) => STANDALONE_IDS.includes(baseId(document) ?? "");
/** Pages that render a bespoke hero — the shared hero fields are hidden. */
const hidesHeroFields = (document?: { _id?: string }) =>
  isHome(document) || isAbout(document) || isFleetType(document) || isStandalone(document);

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

    // --- Homepage content (Home document only) ----------------------
    defineField({
      name: "homeContent",
      title: "Homepage content",
      type: "homeContent",
      description: "Every editable heading, paragraph, card and button on the homepage.",
      hidden: ({ document }) => !isHome(document),
    }),

    // --- About page content (About document only) -------------------
    defineField({
      name: "aboutContent",
      title: "About page content",
      type: "aboutContent",
      description: "Every editable heading, paragraph, venture card and video on the About page.",
      hidden: ({ document }) => !isAbout(document),
    }),

    // --- Fleet-category content (the 4 /rent-*-cars-dubai pages) -----
    defineField({
      name: "fleetTypeContent",
      title: "Fleet page content",
      type: "fleetTypeContent",
      description: "Heading, intro paragraphs and FAQs for this car-category page. Meta title/description are in the SEO panel below.",
      hidden: ({ document }) => !isFleetType(document),
    }),

    // --- Standalone-page content (one block per page) ---------------
    defineField({ name: "contactPageContent", title: "Contact page content", type: "contactPageContent", hidden: ({ document }) => !isOn("page-contact-us")(document) }),
    defineField({ name: "careersPageContent", title: "Careers page content", type: "careersPageContent", hidden: ({ document }) => !isOn("page-careers")(document) }),
    defineField({ name: "servicesPageContent", title: "Services page content", type: "servicesPageContent", hidden: ({ document }) => !isOn("page-services")(document) }),
    defineField({ name: "faqPageContent", title: "FAQ page content", type: "faqPageContent", hidden: ({ document }) => !isOn("page-faq")(document) }),
    defineField({ name: "bookingTermsContent", title: "Booking T&Cs content", type: "bookingTermsContent", hidden: ({ document }) => !isOn("page-booking-tcs")(document) }),
    defineField({ name: "privacyPolicyContent", title: "Privacy policy content", type: "privacyPolicyContent", hidden: ({ document }) => !isOn("page-privacy-policy")(document) }),
    defineField({ name: "cookiePolicyContent", title: "Cookie policy content", type: "cookiePolicyContent", hidden: ({ document }) => !isOn("page-cookie-policy")(document) }),

    // --- Hero (pages with the shared PageHero) ----------------------
    defineField({
      name: "heroEyebrow",
      title: "Hero — eyebrow",
      type: "string",
      description: "Small champagne label above the H1. E.g. \"Contact\", \"Services\".",
      hidden: ({ document }) => hidesHeroFields(document),
    }),
    defineField({
      name: "heroH1",
      title: "Hero — H1",
      type: "string",
      description: "Big display heading. Supports **bold** for champagne emphasis.",
      hidden: ({ document }) => hidesHeroFields(document),
    }),
    defineField({
      name: "heroSubline",
      title: "Hero — subline",
      type: "text",
      rows: 3,
      description: "Smaller body line under the H1. Leave blank to hide.",
      hidden: ({ document }) => hidesHeroFields(document),
    }),
    defineField({
      name: "heroImage",
      title: "Hero — background image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => hidesHeroFields(document),
    }),

    // --- SEO --------------------------------------------------------
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "routePath", media: "heroImage" },
  },
});
