import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { PreviewPane } from "./components/PreviewPane";

/**
 * Studio desk customisation. Pins all singletons (Site settings and the
 * 14 standalone Page documents) so editors land on the right document
 * without going through a list. Collection types (cars, brands, blog,
 * etc.) keep their normal list view.
 */

/**
 * Canonical list of standalone pages. Each entry pins a single Page
 * document by ID — the ID encodes the route so deterministic look-ups
 * work at render time. Order here = order in the Studio sidebar.
 */
export const SITE_PAGES = [
  { id: "page-home", title: "Home page", route: "/" },
  { id: "page-about-us", title: "About us", route: "/about-us" },
  { id: "page-our-fleet", title: "Our Fleet", route: "/our-fleet" },
  { id: "page-services", title: "Services", route: "/services" },
  { id: "page-contact-us", title: "Contact us", route: "/contact-us" },
  { id: "page-faq", title: "FAQ", route: "/faq" },
  { id: "page-careers", title: "Careers", route: "/careers" },
  { id: "page-blog", title: "Blog index", route: "/blog" },
  { id: "page-booking-tcs", title: "Booking T&Cs", route: "/booking-tcs" },
  { id: "page-privacy-policy", title: "Privacy policy", route: "/privacy-policy" },
  { id: "page-cookie-policy", title: "Cookie policy", route: "/cookie-policy" },
  // Fleet category pages
  { id: "page-rent-sports", title: "Sports cars page", route: "/rent-sports-cars-dubai" },
  { id: "page-rent-luxury", title: "Luxury cars page", route: "/rent-luxury-cars-dubai" },
  { id: "page-rent-convertible", title: "Convertible cars page", route: "/rent-convertible-cars-dubai" },
  { id: "page-rent-suv", title: "SUV cars page", route: "/rent-suv-cars-dubai" },
] as const;

function pageItem(S: StructureBuilder, id: string, title: string) {
  return S.listItem()
    .title(title)
    .id(id)
    .child(
      S.document()
        .schemaType("page")
        .documentId(id)
        .title(title)
        .views([
          S.view.form(),
          S.view.component(PreviewPane).id("web-preview").title("Preview"),
        ]),
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // --- Singletons -------------------------------------------------
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),

      // --- Pages (each a pinned singleton document) -------------------
      S.listItem()
        .title("Pages")
        .id("pages")
        .child(
          S.list()
            .title("Pages")
            .items(SITE_PAGES.map((p) => pageItem(S, p.id, p.title))),
        ),

      S.divider(),

      // --- Primary collections ----------------------------------------
      S.documentTypeListItem("car").title("Fleet (cars)"),
      S.documentTypeListItem("brand").title("Brands"),
      S.documentTypeListItem("location").title("Locations"),
      S.documentTypeListItem("blogPost").title("Blog posts"),

      S.divider(),

      // --- Secondary collections --------------------------------------
      S.documentTypeListItem("faq").title("FAQs"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("service").title("Services"),
    ]);
