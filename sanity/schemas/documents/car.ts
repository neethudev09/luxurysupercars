import { defineField, defineType } from "sanity";
import { CAR_FEATURE_OPTIONS } from "@/lib/car-features";

const CATEGORY_LIST = [
  { title: "Sports", value: "sports" },
  { title: "Convertible", value: "convertible" },
  { title: "Luxury", value: "luxury" },
  { title: "SUV", value: "suv" },
];

/**
 * Fleet — the central content type. One document per car (96 today,
 * editor adds more as the fleet grows).
 *
 * Notes:
 * - `slug` drives /{brand.slug}/{slug} and MUST match the live luxurysupercarsdubai.com URL.
 * - `categories` is multi-select — a Porsche 911 Turbo S can live under sports + convertible + luxury.
 * - `featuredIn` is the CMS-driven Featured toggle the owner asked for —
 *   tick categories where this car should surface in the homepage 4-card teaser.
 * - `gallery` is the full WooCommerce gallery (10+ images on average).
 */
export const car = defineType({
  name: "car",
  title: "Car",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Car name",
      type: "string",
      description: "E.g. \"Lamborghini Huracan STO 2025\". Used on cards, breadcrumbs.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: "Drives /{brand}/{slug}. Must match the live URL byte-for-byte.",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tuners",
      title: "Tuners / modifications",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
      description:
        "Coachbuilders / tuners that have modified this car (e.g. Mansory, Brabus). The car appears on each tuner's brand page in addition to its primary brand page.",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: { list: CATEGORY_LIST, layout: "tags" },
      description: "Which fleet category pages this car appears on.",
      validation: (Rule) => Rule.min(1).error("At least one category is required."),
    }),
    defineField({
      name: "featuredIn",
      title: "Featured on homepage in...",
      type: "array",
      of: [{ type: "string" }],
      options: { list: CATEGORY_LIST, layout: "tags" },
      description: "Tick the categories where this car should appear in the homepage 4-card teaser. Editor-curated.",
    }),
    defineField({
      name: "priceAed",
      title: "Price (AED / day)",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (Rule) => Rule.min(1980).max(2100),
    }),
    defineField({
      name: "color",
      title: "Colour",
      type: "string",
    }),
    defineField({
      name: "engine",
      title: "Engine type",
      type: "string",
      description: "E.g. \"V10\", \"I6\", \"V8 Twin-Turbo\".",
    }),
    defineField({
      name: "engineCapacity",
      title: "Engine capacity",
      type: "string",
      description: "E.g. \"5204 cc\" or \"3.0L\".",
    }),
    defineField({
      name: "horsepower",
      title: "Horsepower",
      type: "string",
      description: "E.g. \"640 horsepower\".",
    }),
    defineField({
      name: "zeroToHundred",
      title: "0–100 km/h",
      type: "string",
      description: "E.g. \"3.0 seconds\".",
    }),
    defineField({
      name: "topSpeed",
      title: "Top speed",
      type: "string",
      description: "Optional — most live pages don't expose this.",
    }),
    defineField({
      name: "transmission",
      title: "Transmission",
      type: "string",
    }),
    defineField({
      name: "driveType",
      title: "Drive type",
      type: "string",
      description: "E.g. \"Rear Wheel Drive\", \"AWD\".",
    }),
    defineField({
      name: "doors",
      title: "Doors",
      type: "number",
      validation: (Rule) => Rule.min(0).max(10),
    }),
    defineField({
      name: "seats",
      title: "Seats",
      type: "number",
      validation: (Rule) => Rule.min(0).max(20),
    }),

    // --- Rental terms (live-scraped, editor-editable) ----------------
    defineField({
      name: "deposit",
      title: "Security deposit",
      type: "string",
      description: "E.g. \"AED 5,000\". Verbatim from the live product page.",
    }),
    defineField({
      name: "mileageLimit",
      title: "Included mileage limit",
      type: "string",
      description: "E.g. \"250 km/day\".",
    }),
    defineField({
      name: "extraKmCharge",
      title: "Additional mileage charge",
      type: "string",
      description: "E.g. \"AED 20/km\".",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      description: "Used as the card image and detail-page hero. First gallery image by default.",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      description: "Full car photoset (10+ images recommended).",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich body copy shown beneath specs on the car detail page.",
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
      description: "Tick the comfort, infotainment, and safety features included with this car. Add new options in lib/car-features.ts.",
      options: {
        list: CAR_FEATURE_OPTIONS,
        layout: "grid",
      },
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    {
      title: "Brand → Name",
      name: "brandName",
      by: [
        { field: "brand.displayName", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
    {
      title: "Price (low → high)",
      name: "priceAsc",
      by: [{ field: "priceAed", direction: "asc" }],
    },
    {
      title: "Featured first",
      name: "featuredFirst",
      by: [
        { field: "featuredIn", direction: "desc" }, // arrays with content sort first
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "slug.current",
      media: "heroImage",
      price: "priceAed",
      featured: "featuredIn",
    },
    prepare: ({ title, subtitle, media, price, featured }) => {
      const star = featured && featured.length ? " ★" : "";
      const priceLabel = price ? ` · AED ${price.toLocaleString()}` : "";
      return {
        title: `${title}${star}`,
        subtitle: `${subtitle}${priceLabel}`,
        media,
      };
    },
  },
});
