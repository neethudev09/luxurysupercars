import {
  HERO,
  CONTACT_PAGE,
  SERVICES_PAGE,
  FAQ_PAGE,
  CAREERS_PAGE,
  BOOKING_TERMS_PAGE,
  PRIVACY_POLICY_PAGE,
} from "@/lib/content";
import { FLEET_TYPES } from "@/lib/fleet-types";
import { batchCreateOrReplace } from "./lib";

/**
 * Standalone page docs (14). Every SEO field copied byte-for-byte from
 * the verbatim live SEO already captured in lib/content.ts and
 * lib/fleet-types.ts. The render-side fallback chain means leaving a
 * field blank in the Studio falls back to these exact values.
 */
async function main() {
  const pages = [
    /* ----------------------------- core ----------------------------- */
    {
      _id: "page-home",
      _type: "page",
      routePath: "/",
      title: "Home page",
      heroEyebrow: "Welcome",
      heroH1: HERO.h1,
      heroSubline: HERO.sub,
      seo: {
        title: "Luxury Supercar Rentals Dubai - Rent Luxury & Sports Car Dubai",
        description:
          "Dubai's Most Trusted Supercar Rentals. Premium Services with 24/7 Support and Free Delivery Across Dubai. Lamborghini, Ferrari, Rolls Royce, McLaren, Porsche and more.",
        noIndex: false,
      },
    },
    {
      _id: "page-about-us",
      _type: "page",
      routePath: "/about-us",
      title: "About us",
      heroEyebrow: "About",
      heroH1: "About Us",
      seo: {
        title: "About Us | Luxury Super Car Rental",
        description:
          "Our mission is to provide the best luxury car rentals and services solutions, with a focus on exclusivity for your holiday or business experience.",
        noIndex: false,
      },
    },
    {
      _id: "page-our-fleet",
      _type: "page",
      routePath: "/our-fleet",
      title: "Our Fleet",
      heroEyebrow: "Fleet",
      heroH1: "Our Fleet",
      seo: {
        title: "Our Fleet | Luxury Supercars Dubai",
        description:
          "Browse the full Luxury Supercars Dubai fleet — Lamborghini, Ferrari, Rolls Royce, McLaren, Porsche, Mercedes, Bentley and more. Filter by type, brand, seats, doors and colour.",
        noIndex: false,
      },
    },
    {
      _id: "page-services",
      _type: "page",
      routePath: "/services",
      title: "Services",
      heroEyebrow: "Services",
      heroH1: SERVICES_PAGE.h1,
      seo: {
        title: SERVICES_PAGE.metaTitle,
        description: SERVICES_PAGE.metaDescription,
        noIndex: false,
      },
    },
    {
      _id: "page-contact-us",
      _type: "page",
      routePath: "/contact-us",
      title: "Contact us",
      heroEyebrow: "Contact",
      heroH1: CONTACT_PAGE.h2,
      heroSubline: CONTACT_PAGE.intro,
      seo: {
        title: CONTACT_PAGE.metaTitle,
        description: CONTACT_PAGE.metaDescription,
        noIndex: false,
      },
    },
    {
      _id: "page-faq",
      _type: "page",
      routePath: "/faq",
      title: "FAQ",
      heroEyebrow: "FAQ",
      heroH1: FAQ_PAGE.h1,
      seo: {
        title: FAQ_PAGE.metaTitle,
        description: FAQ_PAGE.metaDescription,
        noIndex: false,
      },
    },
    {
      _id: "page-careers",
      _type: "page",
      routePath: "/careers",
      title: "Careers",
      heroEyebrow: "Careers",
      heroH1: CAREERS_PAGE.h1,
      seo: {
        title: CAREERS_PAGE.metaTitle,
        description: CAREERS_PAGE.metaDescription,
        noIndex: false,
      },
    },
    {
      _id: "page-blog",
      _type: "page",
      routePath: "/blog",
      title: "Blog index",
      heroEyebrow: "Journal",
      heroH1: "Latest News & Article",
      seo: {
        title: "Luxury Supercars Dubai Blog | News, Guides & Stories",
        description:
          "Explore the Luxury Supercars Dubai journal — guides, brand histories, rental tips, and stories from the world's most extraordinary car rental fleet.",
        noIndex: false,
      },
    },
    {
      _id: "page-booking-tcs",
      _type: "page",
      routePath: "/booking-tcs",
      title: "Booking T&Cs",
      heroEyebrow: "Legal",
      heroH1: BOOKING_TERMS_PAGE.h1,
      seo: {
        title: BOOKING_TERMS_PAGE.metaTitle,
        description: BOOKING_TERMS_PAGE.metaDescription,
        noIndex: false,
      },
    },
    {
      _id: "page-privacy-policy",
      _type: "page",
      routePath: "/privacy-policy",
      title: "Privacy policy",
      heroEyebrow: "Legal",
      heroH1: PRIVACY_POLICY_PAGE.h1,
      seo: {
        title: PRIVACY_POLICY_PAGE.metaTitle,
        description: PRIVACY_POLICY_PAGE.metaDescription,
        noIndex: false,
      },
    },
    /* ------------------------- category pages ----------------------- */
    {
      _id: "page-rent-sports",
      _type: "page",
      routePath: "/rent-sports-cars-dubai",
      title: "Sports cars page",
      heroEyebrow: "Sports cars",
      heroH1: FLEET_TYPES.sports.h1,
      seo: {
        title: FLEET_TYPES.sports.title,
        description: FLEET_TYPES.sports.description,
        noIndex: false,
      },
    },
    {
      _id: "page-rent-luxury",
      _type: "page",
      routePath: "/rent-luxury-cars-dubai",
      title: "Luxury cars page",
      heroEyebrow: "Luxury cars",
      heroH1: FLEET_TYPES.luxury.h1,
      seo: {
        title: FLEET_TYPES.luxury.title,
        description: FLEET_TYPES.luxury.description,
        noIndex: false,
      },
    },
    {
      _id: "page-rent-convertible",
      _type: "page",
      routePath: "/rent-convertible-cars-dubai",
      title: "Convertible cars page",
      heroEyebrow: "Convertibles",
      heroH1: FLEET_TYPES.convertible.h1,
      seo: {
        title: FLEET_TYPES.convertible.title,
        description: FLEET_TYPES.convertible.description,
        noIndex: false,
      },
    },
    {
      _id: "page-rent-suv",
      _type: "page",
      routePath: "/rent-suv-cars-dubai",
      title: "SUV cars page",
      heroEyebrow: "SUVs",
      heroH1: FLEET_TYPES.suv.h1,
      seo: {
        title: FLEET_TYPES.suv.title,
        description: FLEET_TYPES.suv.description,
        noIndex: false,
      },
    },
  ];

  await batchCreateOrReplace(pages, { label: "pages" });
  console.log(`✓ ${pages.length} pages`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
