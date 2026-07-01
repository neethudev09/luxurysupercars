/**
 * Single source of truth for ALL homepage copy. Verbatim from
 * luxurysupercarsdubai.com — preserves SEO crawl signals.
 * Heading strings use **bold** markers; renderer parses them into
 * champagne-italic spans.
 *
 * CMS-backed slices (CONTACT, SOCIAL, FOOTER.description, TESTIMONIALS,
 * FAQ, FAQ_PAGE, SERVICES_PAGE.items) are sourced from lib/generated/*.json,
 * which scripts/sanity/export-to-json.ts regenerates from Sanity on every
 * build. Everything else here is hand-authored and not in the CMS.
 */
import siteSettingsData from "./generated/site-settings.json";
import testimonialsData from "./generated/testimonials.json";
import faqData from "./generated/faq.json";
import servicesData from "./generated/services.json";
import homeData from "./generated/home.json";
import aboutData from "./generated/about.json";
import pagesData from "./generated/pages.json";
import { backgroundVideoEmbed, founderVideoEmbed, youTubeIds } from "./youtube";

/**
 * Homepage editorial content from Sanity (page-home → homeContent),
 * exported to home.json by scripts/sanity/export-to-json.ts. Every field
 * is optional: the exports below fall back to the verbatim live copy when
 * a field is blank, so an empty CMS value never blanks the homepage and
 * an un-migrated doc renders exactly the current wording. `**bold**`
 * markers in headings are kept verbatim and parsed by the renderer.
 */
interface HomeHeading { eyebrow?: string; h2?: string; h3?: string }
interface HomeFleet { eyebrow?: string; h2?: string; body?: string; cta?: string }
interface HomeStat { value?: number; decimals?: number; suffix?: string; label?: string }
interface HomeCard { title?: string; body?: string }
interface HomeData {
  hero?: {
    h1?: string;
    subline?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    ratingStars?: number;
    ratingCount?: number;
  };
  fleetSports?: HomeFleet;
  fleetConvertible?: HomeFleet;
  fleetLuxury?: HomeFleet;
  fleetSuv?: HomeFleet;
  brandStory?: { eyebrow?: string; h2?: string; paragraphs?: string[]; stats?: HomeStat[] };
  requirements?: { eyebrow?: string; h2?: string; items?: HomeCard[] };
  whyUs?: { eyebrow?: string; h2?: string; cards?: HomeCard[] };
  testimonialsHeading?: HomeHeading;
  faqHeading?: HomeHeading;
  blogHeading?: HomeHeading;
  instagramHeading?: HomeHeading;
}
const home = homeData as unknown as HomeData;

export const GOOGLE_REVIEW_SUMMARY = {
  stars: 4.9,
  count: 486,
  url: "https://www.google.com/search?q=luxury+supercars+dubai",
};

/** Normalise CMS stat objects to the exact numeric/string shape CountUp needs. */
const mapStats = (stats: HomeStat[]) =>
  stats.map((s) => ({
    value: s.value ?? 0,
    decimals: s.decimals ?? 0,
    suffix: s.suffix ?? "",
    label: s.label ?? "",
  }));
/** Normalise CMS title/body cards, dropping any blank entries. */
const mapCards = (cards: HomeCard[]) =>
  cards
    .filter((c) => c.title || c.body)
    .map((c) => ({ title: c.title ?? "", body: c.body ?? "" }));

// Site-wide chrome (footer link columns, nav links, promo pop-up) from Sanity
// siteSettings. Every field falls back to the defaults below, so an
// un-migrated settings doc renders unchanged.
interface NavLink { label?: string; href?: string }
interface ChromeSettings {
  footer?: {
    copyright?: string;
    brands?: string[];
    rentLinks?: NavLink[];
    usefulLinks?: NavLink[];
    legalLinks?: NavLink[];
  };
  navLinks?: NavLink[];
  promo?: { eyebrow?: string; heading?: string; highlight?: string; body?: string; buttonLabel?: string; disclaimer?: string };
}
const chrome = siteSettingsData as unknown as ChromeSettings;
/** Normalise a CMS link list to {label, href}, dropping incomplete rows. */
const links = (list: NavLink[] | undefined) =>
  (list ?? [])
    .map((l) => ({ label: l.label ?? "", href: l.href ?? "" }))
    .filter((l) => l.label && l.href);

const NAV_LINKS_DEFAULT = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Cars Types", href: "/our-fleet" },
  { label: "Cars Brands", href: "/our-fleet" },
  { label: "Our Fleet", href: "/our-fleet" },
  { label: "Services", href: "/services" },
  // "Contact Us" is rendered separately as a button on the desktop nav;
  // FAQs and Blog live in the footer only. Keep "Contact Us" last so the
  // mobile menu shows it at the bottom.
  { label: "Contact Us", href: "/contact-us" },
];
export const NAV_LINKS = chrome.navLinks?.length ? links(chrome.navLinks) : NAV_LINKS_DEFAULT;

export const PROMO = {
  eyebrow: chrome.promo?.eyebrow || "Exclusive Offer",
  heading: chrome.promo?.heading || "Get 15% off your rental",
  highlight: chrome.promo?.highlight || "15% off",
  body: chrome.promo?.body || "Drop your email below and our team will be in touch with your exclusive discount.",
  buttonLabel: chrome.promo?.buttonLabel || "Claim 15% Off",
  disclaimer: chrome.promo?.disclaimer || "No spam — unsubscribe anytime",
};

export const CARS_TYPES = ["Luxury", "Convertible", "Sports", "Electric", "SUV"];

export const CARS_BRANDS = [
  "Aston Martin", "Audi", "Bentley", "BMW", "Brabus", "Cadillac", "Ferrari",
  "Lamborghini", "Mansory", "Rolls Royce", "Maserati", "McLaren", "Mercedes Benz",
  "Porsche", "Range Rover",
];

// Phone numbers, email, showroom address — from Sanity `siteSettings`.
export const CONTACT = siteSettingsData.contact;

// Social profile URLs — from Sanity `siteSettings`. `twitter` is currently
// a placeholder and is not surfaced by any UI (nav + footer render only
// facebook/instagram/youtube/tiktok).
export const SOCIAL = siteSettingsData.social;

export const HERO = {
  // Owner-approved rewrite (2026-05-13) — replaces the live site's ungrammatical
  // "Are You Looking To Rent Luxury Car In Dubai?". Bold markers force the
  // line break to land after "rent" so the H1 renders as two clean lines.
  h1: home.hero?.h1 || "**Looking to rent** a luxury car in Dubai",
  sub:
    home.hero?.subline ||
    "Dubai's Most Trusted Supercar Rentals. Premium Services with 24/7 Support and Free Delivery Across Dubai.",
  ctaPrimary: home.hero?.ctaPrimary || "Rent A Car",
  ctaSecondary: home.hero?.ctaSecondary || "Contact Us",
  rating: { stars: GOOGLE_REVIEW_SUMMARY.stars, count: GOOGLE_REVIEW_SUMMARY.count },
};

export const FLEET_SECTIONS = {
  sports: {
    id: "sports",
    eyebrow: home.fleetSports?.eyebrow || "Sports",
    h2: home.fleetSports?.h2 || "**Sports Car** Rental in Dubai",
    body:
      home.fleetSports?.body ||
      "Experience the pinnacle of luxury and performance with Luxury Supercars Dubai, your premier destination for exotic car rentals. Whether you're exploring the vibrant streets of Dubai, cruising along the scenic coastline, or making a statement at a high-profile event, our fleet of world-class supercars is designed to elevate every journey.",
    cta: home.fleetSports?.cta || "View All Sports Cars",
  },
  convertibles: {
    id: "convertibles",
    eyebrow: home.fleetConvertible?.eyebrow || "Convertible",
    h2: home.fleetConvertible?.h2 || "**Convertible** Car Rental in Dubai",
    body:
      home.fleetConvertible?.body ||
      "Experience the thrill of the open road and the beauty of Dubai's skyline with our convertible car rental services. At Luxury Supercars Dubai, we offer a premium collection of convertible cars that combine style, luxury, and performance, making every drive a memorable experience.",
    cta: home.fleetConvertible?.cta || "View All Convertible Cars",
  },
  luxury: {
    id: "luxury",
    eyebrow: home.fleetLuxury?.eyebrow || "Luxury",
    h2: home.fleetLuxury?.h2 || "**Rent Luxury** Cars in Dubai",
    body:
      home.fleetLuxury?.body ||
      "Make your journey in Dubai unforgettable with our luxury car rental services. At Luxury Supercars Dubai, we specialize in providing a world-class fleet of high-end vehicles, perfect for those who value style, comfort, and performance. Whether you're exploring the city's iconic landmarks, attending a business meeting, or celebrating a special occasion, our luxury cars are designed to elevate every moment.",
    cta: home.fleetLuxury?.cta || "View All Luxury Cars",
  },
  suvs: {
    id: "suvs",
    eyebrow: home.fleetSuv?.eyebrow || "SUV",
    h2: home.fleetSuv?.h2 || "**Rent SUVs** in Dubai",
    body:
      home.fleetSuv?.body ||
      "Discover unmatched comfort and versatility with Luxury Supercars Dubai's SUV rental service. Perfect for family trips, group outings, or simply exploring Dubai in style, our premium SUVs offer space, luxury, and top-notch performance.",
    cta: home.fleetSuv?.cta || "View All SUVs Cars",
  },
};

export const BRAND_STORY = {
  id: "story",
  eyebrow: home.brandStory?.eyebrow || "About",
  h2:
    home.brandStory?.h2 ||
    "Luxury **Supercars** Dubai: Your **Premier** Luxury Car Rental Service in **Dubai, UAE**",
  paragraphs: home.brandStory?.paragraphs?.length
    ? home.brandStory.paragraphs
    : [
        "When it comes to Luxury Car Rental in Dubai, Luxury Supercars Dubai is your ultimate destination. We pride ourselves on offering a premium selection of world-class vehicles, allowing you to immerse yourself in Dubai's vibrant and luxurious lifestyle in the most sophisticated way imaginable. With the largest fleet and showroom of luxury cars in the city, we provide an unrivaled variety of options to cater to your every need.",
        "Dubai is a city synonymous with opulence, and there's no better way to explore its iconic landmarks and breathtaking skyline than behind the wheel of a prestigious luxury car. At Luxury Supercars Dubai, we feature an exclusive collection from top-tier brands like Lamborghini, Ferrari, Porsche, Bentley, and Mercedes-Benz. Whether you're here for business, leisure, or a special event, our fleet of the latest models ensures a driving experience that epitomizes comfort, performance, and elegance.",
      ],
  stats: home.brandStory?.stats?.length
    ? mapStats(home.brandStory.stats).map((stat) => {
        if (stat.label.toLowerCase().includes("google rating")) {
          return { ...stat, value: GOOGLE_REVIEW_SUMMARY.stars, decimals: 1 };
        }
        if (stat.label.toLowerCase() === "reviews") {
          return { ...stat, value: GOOGLE_REVIEW_SUMMARY.count, decimals: 0 };
        }
        return stat;
      })
    : [
        { value: 14, decimals: 0, suffix: "+", label: "Brands" },
        { value: GOOGLE_REVIEW_SUMMARY.stars, decimals: 1, suffix: "★", label: "Google rating" },
        { value: GOOGLE_REVIEW_SUMMARY.count, decimals: 0, suffix: "", label: "Reviews" },
        { value: 24, decimals: 0, suffix: "/7", label: "Support" },
      ],
};

export const REQUIREMENTS = {
  id: "requirements",
  eyebrow: home.requirements?.eyebrow || "What you'll need",
  h2: home.requirements?.h2 || "What **documents** Are Needed To **Rent** A Car in Dubai",
  items: home.requirements?.items?.length
    ? mapCards(home.requirements.items)
    : [
        {
          title: "AGE",
          body: "Drivers must be at least 21 years old. Some supercars require drivers to be 25+.",
        },
        {
          title: "Driving License",
          body: "UAE residents need a valid UAE driving licence. Tourists must present a valid licence and, if required, an International Driving Permit (IDP).",
        },
        {
          title: "Free delivery",
          body: "We provide free delivery across Dubai. Delivery charges apply to other Emirates.",
        },
      ],
};

// Reviews — from Sanity `testimonial` docs, split by `source` into the
// two marquee tracks. Section heading is hand-authored.
export const TESTIMONIALS = {
  id: "testimonials",
  eyebrow: home.testimonialsHeading?.eyebrow || "Reviews",
  h2: home.testimonialsHeading?.h2 || "What Our **Customers** are Saying **About Us**",
  named: testimonialsData
    .filter((t) => t.source === "named")
    .map((t) => ({ name: t.name, quote: t.quote })),
  google: testimonialsData
    .filter((t) => t.source === "google")
    .map((t) => ({ name: t.name, quote: t.quote })),
};

export const WHY_US = {
  id: "why",
  eyebrow: home.whyUs?.eyebrow || "Why us",
  h2: home.whyUs?.h2 || "Why Choose **Luxury Supercars Dubai?**",
  cards: home.whyUs?.cards?.length
    ? mapCards(home.whyUs.cards)
    : [
        {
          title: "Largest Fleet and Showroom",
          body: "Experience the luxury of choice with the largest selection of luxury cars in Dubai. Whether you are looking for performance, comfort, or technology, our extensive range ensures we have the perfect car for your needs.",
        },
        {
          title: "No Commitment Necessary",
          body: "Want to drive a supercar? Make this dream a reality with our rental services without locking yourself into a long-term agreement.",
        },
        {
          title: "Flexible Rental Options",
          body: "We cater to all desires and needs, whether you need a car for a few hours or several days, and we ensure timely delivery.",
        },
        {
          title: "Transparent Pricing",
          body: "Enjoy straightforward and \"no hidden fees\" pricing with us. Experience our services without any worries.",
        },
      ],
};

/**
 * Homepage FAQ teaser fallback — the 4 entries originally hand-authored
 * for the homepage. The live data now comes from Sanity `faq` docs flagged
 * "Show in homepage FAQ teaser"; this array only renders if an editor
 * un-ticks every entry, so the homepage section never goes blank.
 */
const HOMEPAGE_FAQ_FALLBACK = [
  {
    q: "What is the age limit to rent a vehicle from Luxury Supercars Dubai?",
    a: "The age limit to benefit from our services is between 21 and 65 years. Additionally, we require our clients to possess a valid driving license for a minimum period of 1 year.",
  },
  {
    q: "What documents will I be asked to submit when hiring a car?",
    a: "For UAE residents: a copy of Emirates ID and UAE Driver's License (front and back). For GCC residents: GCC ID and GCC Driver's License. For tourists: passport copy and a valid driver's license. An IDP is required for certain countries.",
  },
  {
    q: "How can I pay for my car rental?",
    a: "We accept cash in all currencies, credit/debit cards (Visa, MasterCard, and AMEX), and crypto.",
  },
  {
    q: "Is a deposit required to rent a vehicle?",
    a: "Yes, it is necessary for a deposit to be made when renting a vehicle from us. However, the amount, deposit type payment method will vary by the type of agreement.",
  },
];

const homepageFaqItems = faqData
  .filter((f) => f.showOnHomepage)
  .map((f) => ({ q: f.q, a: f.a }));

// Homepage FAQ section — items from Sanity (showOnHomepage entries).
export const FAQ = {
  id: "faq",
  eyebrow: home.faqHeading?.eyebrow || "FAQs",
  h2: home.faqHeading?.h2 || "FAQs",
  h3: home.faqHeading?.h3 || "**Everything** You Need To Know About Our **Services**",
  items: homepageFaqItems.length ? homepageFaqItems : HOMEPAGE_FAQ_FALLBACK,
};

export const BLOG = {
  id: "blog",
  eyebrow: home.blogHeading?.eyebrow || "Blog",
  h2: home.blogHeading?.h2 || "Stay **Informed** And Inspired For Your Next **Journey**",
  posts: [
    {
      date: "January 25, 2026",
      title: "When a Supercar Makes Sense in Dubai: Business, Leisure, Events and Everything In Between",
      href: "https://luxurysupercarsdubai.com/blogs/when-a-supercar-makes-sense-in-dubai/",
    },
    {
      date: "January 6, 2026",
      title: "Choosing the Right Supercar in Dubai: What Fits Your Lifestyle, Not Just Your Instagram",
      href: "https://luxurysupercarsdubai.com/blogs/choosing-the-right-supercar-in-dubai/",
    },
    {
      date: "January 1, 2026",
      title: "Set Your 2026 Resolutions in Style: How a Supercar Drive Can Kickstart Your Year in Dubai",
      href: "https://luxurysupercarsdubai.com/blogs/how-a-supercar-drive-can-kickstart-your-year-in-dubai/",
    },
    {
      date: "December 31, 2025",
      title: "Winter in the Fast Lane: Why December is the Best Month to Drive in Dubai",
      href: "https://luxurysupercarsdubai.com/blogs/why-december-is-the-best-month-to-drive-in-dubai/",
    },
  ],
};

export const INSTAGRAM = {
  id: "instagram",
  eyebrow: home.instagramHeading?.eyebrow || "Instagram",
  h2: home.instagramHeading?.h2 || "Follow Us on **Instagram**",
  reels: [
    { caption: "Lamborghini Urus carbon fiber details", href: "https://www.instagram.com/reel/DYIwB6tIwY5/" },
    { caption: "Lamborghini Huracán STO track-bred features", href: "https://www.instagram.com/reel/DX9J6UroWc-/" },
    { caption: "Lamborghini Revuelto & Ferrari SF90 hybrid comparison", href: "https://www.instagram.com/reel/DXzDYJ8Io3x/" },
    { caption: "Ferrari Roma Spider convertible", href: "https://www.instagram.com/reel/DXwf2Uboliu/" },
    { caption: "McLaren 750S in blue", href: "https://www.instagram.com/reel/DXtfs1NCEKq/" },
  ],
  ctaLoad: "Load More",
  ctaFollow: "Follow on Instagram",
};

/* -------------------------------------------------------------------------- */
/*  Standalone-page copy (CMS-backed: page-* → *PageContent)                   */
/* -------------------------------------------------------------------------- */

/**
 * Standalone-page content from Sanity (page-* docs → their content block +
 * shared SEO panel), exported to pages.json by export-to-json.ts and keyed by
 * route. Every field falls back to the verbatim live copy below, so an
 * un-migrated doc renders unchanged.
 */
interface PageCms {
  metaTitle?: string;
  metaDescription?: string;
  eyebrow?: string;
  h1?: string;
  h2?: string;
  intro?: string;
  subline?: string;
  body?: string;
  paragraphs?: string[];
  sections?: unknown[];
}
const pages = pagesData as unknown as Record<string, PageCms | undefined>;
const pg = (route: string): PageCms => pages[route] ?? {};

// --- Legal-page section mappers (CMS shape → render shape) -----------------
interface BookingSection { title: string; groups: { subtitle: string; items: string[] }[] }
interface RawBookingSection { title?: string; groups?: { subtitle?: string; items?: string[] }[] }
function mapBookingSections(raw: unknown[]): BookingSection[] {
  return (raw as RawBookingSection[]).map((s) => ({
    title: s?.title ?? "",
    groups: (s?.groups ?? []).map((g) => ({
      subtitle: g?.subtitle ?? "",
      items: (g?.items ?? []).filter(Boolean),
    })),
  }));
}

interface PrivacySection { title: string; paragraphs: string[]; list?: string[]; trailer?: string[] }
interface RawPrivacySection { title?: string; paragraphs?: string[]; list?: string[]; trailer?: string[] }
function mapPrivacySections(raw: unknown[]): PrivacySection[] {
  return (raw as RawPrivacySection[]).map((s) => {
    const out: PrivacySection = {
      title: s?.title ?? "",
      paragraphs: (s?.paragraphs ?? []).filter(Boolean),
    };
    if (s?.list?.length) out.list = s.list;
    if (s?.trailer?.length) out.trailer = s.trailer;
    return out;
  });
}

// Live: /contact-us/ — meta title + headings + body verbatim. Operation hours
// pulled from the live page; CONTACT.* already holds the phone/email/address.
const contactCms = pg("/contact-us");
export const CONTACT_PAGE = {
  metaTitle: contactCms.metaTitle || "Contact Us | Get in Touch & Book Your Ride",
  metaDescription:
    contactCms.metaDescription ||
    "Get in touch with Luxury Supercars Dubai to book your ride or learn more about our exotic car rental services. Reach us by phone, email, or visit our Dubai showroom — open 9am to 9pm, seven days a week.",
  eyebrow: contactCms.eyebrow || "Contact",
  h1: contactCms.h1 || "Contact Us",
  h2: contactCms.h2 || "Reach Out to Us for Effortless Communication",
  intro: contactCms.intro || "Get in Touch us! Feel Free to Drop us a note If you Wish to Learn More!",
  body:
    contactCms.body ||
    "If you are looking to rent the latest luxury Car in Dubai, luxurysupercarsdubai.com is a one-stop destination for all. You can avail the widest range of the most exotic luxury cars, including everything from the latest Sports Cars, Convertible Cars, SUVs, Supercars, and Prestige Cars, all of which would surely provide you with a fascinating experience.",
  // Operation hours are CMS-managed via siteSettings → Contact details →
  // Operation hours; falls back to the verbatim live copy when blank.
  hours:
    (siteSettingsData.contact as { operationHours?: string }).operationHours ||
    "9 am – 9 pm (Monday–Sunday)",
};

// Live: /services/ — currently a small directory of 4 sub-services, each at
// /service/{slug}/. Sub-service detail bodies pulled verbatim from each live page.
const servicesCms = pg("/services");
export const SERVICES_PAGE = {
  metaTitle: servicesCms.metaTitle || "Luxury Car Rental Services in Dubai | Luxury Supercars Dubai",
  metaDescription:
    servicesCms.metaDescription ||
    "Explore the full range of services from Luxury Supercars Dubai — long-term rental, self-drive, weddings and special events, and gift vouchers. Premium service across Dubai with 24/7 concierge support.",
  eyebrow: servicesCms.eyebrow || "Services",
  h1: servicesCms.h1 || "Providing Amazing Service To Our Clients",
  body: "If you are looking to rent the latest luxury Car in Dubai, luxurysupercarsdubai.com is a one-stop destination for all. You can avail the widest range of the most exotic luxury cars, including everything from the latest Sports Cars, Convertible Cars, SUVs, Supercars, and Prestige Cars, all of which would surely provide you with a fascinating experience.",
  // Service detail cards — from Sanity `service` docs (slug, title,
  // summary, h1, SEO, flattened body paragraphs).
  items: servicesData,
};

// Live: /faq/ — full Q&A set. Items come from Sanity `faq` docs that are
// NOT flagged for the homepage teaser; the homepage-only entries feed FAQ
// above. metaTitle/metaDescription/h1 are hand-authored page-level copy.
const faqPageItems = faqData
  .filter((f) => !f.showOnHomepage)
  .map((f) => ({ q: f.q, a: f.a }));

const faqPageCms = pg("/faq");
export const FAQ_PAGE = {
  metaTitle: faqPageCms.metaTitle || "Luxury Supercars Dubai – FAQ on Rental Terms & Services",
  metaDescription:
    faqPageCms.metaDescription ||
    "Find answers to every question about renting a luxury car in Dubai — age limits, required documents, payment options, deposits, deliveries, and more.",
  eyebrow: faqPageCms.eyebrow || "FAQ",
  h1: faqPageCms.h1 || "Frequently Asked Questions",
  subline:
    faqPageCms.subline ||
    "Everything you need to know about renting with Luxury Supercars Dubai — booking, documents, age limits, payment, deliveries and more.",
  // Safety net: if every FAQ were flagged homepage-only, fall back to the
  // full set rather than rendering an empty /faq page.
  items: faqPageItems.length ? faqPageItems : faqData.map((f) => ({ q: f.q, a: f.a })),
};

// Live: /careers/ — verbatim. Live page has no specific job openings; the form
// captures general expressions of interest.
const careersCms = pg("/careers");
export const CAREERS_PAGE = {
  metaTitle: careersCms.metaTitle || "Careers at Luxury Group | Get in Touch",
  metaDescription:
    careersCms.metaDescription ||
    "Explore careers at Luxury Group. We're always open to hearing from people who take pride in their work and want to join a professional, well-run luxury automotive business in Dubai.",
  eyebrow: careersCms.eyebrow || "Careers",
  h1: careersCms.h1 || "Careers at Luxury Group",
  subline:
    careersCms.subline ||
    "Join a small, ambitious team behind the most extraordinary car rental fleet in Dubai.",
  h2: careersCms.h2 || "Careers Enquiry",
  paragraphs: careersCms.paragraphs?.length
    ? careersCms.paragraphs
    : [
        "Luxury Group is built around people as much as it is around brands. As the group continues to grow, we're always open to hearing from individuals who take pride in their work and want to be part of a professional, well-run organisation.",
        "We work across luxury automotive and premium services, and our roles naturally vary as the business evolves. Some positions are hands-on, some are customer-focused, and others support the wider operation behind the scenes. What matters most to us is reliability, attention to detail, and the right attitude.",
        "If you feel you'd be a good fit for Luxury Group, we'd be happy to hear from you. Use the form below to share your details and a little about your experience. If there's a suitable opportunity, someone from our team will be in touch.",
      ],
};

// Live: /booking-tcs/ — verbatim terms and conditions. Note the live page
// title uses "Booking T&C 'S" with a stray space + capital; preserved as-is
// since it appears in the live <h1> and may match inbound links.
const bookingCms = pg("/booking-tcs");
export const BOOKING_TERMS_PAGE = {
  metaTitle: bookingCms.metaTitle || "Booking Terms & Conditions | Rental Agreement Details",
  metaDescription:
    bookingCms.metaDescription ||
    "Booking terms and conditions for Luxury Supercars Dubai — required documents, age requirements, security deposits, payment methods, rental periods, and delivery information.",
  eyebrow: bookingCms.eyebrow || "Legal",
  h1: bookingCms.h1 || "Booking T&C 'S",
  subline:
    bookingCms.subline ||
    "Everything you need to know before you book — required documents, age limits, security deposit, payment methods, rental period, and delivery.",
  intro: bookingCms.intro || "Terms and Conditions:",
  sections: bookingCms.sections?.length
    ? mapBookingSections(bookingCms.sections)
    : [
    {
      title: "Requirements:",
      groups: [
        {
          subtitle: "Documents for Residents:",
          items: [
            "Passport",
            "Valid Driver's License",
            "International Driver's Permit – required from certain countries.",
          ],
        },
        {
          subtitle: "Documents for UAE Residents:",
          items: [
            "Emirates ID",
            "UAE Driver's License",
          ],
        },
        {
          subtitle: "Age Requirement:",
          items: [
            "Hirer's minimum age for SUVs and Sedans: 18 years old",
            "Hirer's minimum age for Ultra luxury vehicles: 21 years old",
          ],
        },
        {
          subtitle: "Security Deposit:",
          items: [
            "A security deposit of 5000 AED is required.",
            "The security deposit will be refunded after 28 days from the return date to your bank account for any potential traffic fines incurred during the rental period.",
            "Any outstanding traffic fines and salik toll fees will be deducted from the security deposit.",
          ],
        },
        {
          subtitle: "Payment Method:",
          items: [
            "Cash – AED, USD, GBP, AUD and Euro are accepted.",
            "Credit/Debit Card",
            "Payment Link",
            "Crypto",
          ],
        },
        {
          subtitle: "Rental Period:",
          items: [
            "The minimum rental period is 1 day or 24 hours.",
            "Each rental includes a limit of 250 KMs.",
            "Late returns may be subject to additional charges.",
            "Smoking inside the car, off-roading, and using the car on a racetrack are strictly prohibited.",
          ],
        },
        {
          subtitle: "Delivery and Collection:",
          items: [
            "Free delivery and collection are available within Dubai.",
            "Delivery and collection in other Emirates will be chargeable.",
          ],
        },
      ],
    },
  ],
};

// Live: /privacy-policy/ — verbatim policy. Sections preserved in live order.
const privacyCms = pg("/privacy-policy");
export const PRIVACY_POLICY_PAGE = {
  metaTitle: privacyCms.metaTitle || "Luxury Supercars Dubai – Privacy Policy | Data & Privacy Protection",
  metaDescription:
    privacyCms.metaDescription ||
    "How Luxury Supercars Dubai collects, uses, and protects your personal information — consent, cookies, third-party advertising, CCPA and GDPR rights, and children's information.",
  eyebrow: privacyCms.eyebrow || "Legal",
  h1: privacyCms.h1 || "Privacy Policy",
  subline:
    privacyCms.subline ||
    "How Luxury Supercars Dubai collects, uses, and protects your personal information.",
  sections: privacyCms.sections?.length
    ? mapPrivacySections(privacyCms.sections)
    : [
    {
      title: "Privacy Policy for Luxury Super Cars Dubai",
      paragraphs: [
        "At Luxury Super Cars Dubai, accessible from luxurysupercarsdubai.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Luxury Super Cars Dubai and how we use it.",
        "If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.",
        "This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Luxury Super Cars Dubai. This policy is not applicable to any information collected offline or via channels other than this website.",
      ],
    },
    {
      title: "Consent",
      paragraphs: [
        "By using our website, you hereby consent to our Privacy Policy and agree to its terms.",
      ],
    },
    {
      title: "Information we collect",
      paragraphs: [
        "The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.",
        "If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.",
        "When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.",
      ],
    },
    {
      title: "How we use your information",
      paragraphs: ["We use the information we collect in various ways, including to:"],
      list: [
        "Provide, operate, and maintain our webste",
        "Improve, personalize, and expand our webste",
        "Understand and analyze how you use our webste",
        "Develop new products, services, features, and functionality",
        "Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the webste, and for marketing and promotional purposes",
        "Send you emails",
        "Find and prevent fraud",
      ],
    },
    {
      title: "Log Files",
      paragraphs: [
        "Luxury Super Cars Dubai follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.",
      ],
    },
    {
      title: "Cookies and Web Beacons",
      paragraphs: [
        "Like any other website, Luxury Super Cars Dubai uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.",
        "For more general information on cookies, please read \"What Are Cookies\".",
      ],
    },
    {
      title: "Google Double Click DART Cookie",
      paragraphs: [
        "Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads",
      ],
    },
    {
      title: "Our Advertising Partners",
      paragraphs: [
        "Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.",
      ],
    },
    {
      title: "Advertising Partners Privacy Policies",
      paragraphs: [
        "Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Luxury Super Cars Dubai, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.",
        "Note that Luxury Super Cars Dubai has no access to or control over these cookies that are used by third-party advertisers.",
      ],
    },
    {
      title: "Third Party Privacy Policies",
      paragraphs: [
        "Luxury Super Cars Dubai's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.",
        "You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.",
      ],
    },
    {
      title: "CCPA Privacy Rights (Do Not Sell My Personal Information)",
      paragraphs: ["Under the CCPA, among other rights, California consumers have the right to:"],
      list: [
        "Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.",
        "Request that a business delete any personal data about the consumer that a business has collected.",
        "Request that a business that sells a consumer's personal data, not sell the consumer's personal data.",
      ],
      trailer: ["If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us."],
    },
    {
      title: "GDPR Data Protection Rights",
      paragraphs: ["We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:"],
      list: [
        "The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.",
        "The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.",
        "The right to erasure – You have the right to request that we erase your personal data, under certain conditions.",
        "The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.",
        "The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.",
        "The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.",
      ],
      trailer: ["If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us."],
    },
    {
      title: "Children's Information",
      paragraphs: [
        "Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.",
        "Luxury Super Cars Dubai does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.",
      ],
    },
  ],
};

// Live: /cookie-policy/ — verbatim. Sections preserved in live order.
const cookieCms = pg("/cookie-policy");
export const COOKIE_POLICY_PAGE = {
  metaTitle: cookieCms.metaTitle || "Cookie Policy | Luxury Supercars Dubai",
  metaDescription:
    cookieCms.metaDescription ||
    "How Luxury Supercars Dubai uses cookies and similar technologies — analytics, advertising, and your preferences.",
  eyebrow: cookieCms.eyebrow || "Legal",
  h1: cookieCms.h1 || "Cookie Policy",
  subline:
    cookieCms.subline || "How Luxury Supercars Dubai uses cookies and similar technologies.",
  sections: cookieCms.sections?.length
    ? mapPrivacySections(cookieCms.sections)
    : [
        {
          title: "What are cookies?",
          paragraphs: [
            "Cookies are small text files placed on your device when you visit a website. They are widely used to make sites work, to remember your preferences, and to provide information to the site owners. We also use similar technologies such as tracking pixels and browser storage, which we refer to collectively as “cookies” in this policy.",
          ],
        },
        {
          title: "How we use cookies",
          paragraphs: ["We use cookies for the following purposes:"],
          list: [
            "Essential — required for the website to function, such as remembering your currency preference.",
            "Analytics — to understand how visitors use the site so we can improve it. We use Google Analytics (via Google Tag Manager) and Vercel Analytics.",
            "Advertising — to measure and improve our marketing campaigns. We use Google Ads and the Meta (Facebook) Pixel.",
          ],
        },
        {
          title: "Third-party cookies",
          paragraphs: [
            "Some cookies are set by third-party services that appear on our pages. These include Google (Tag Manager, Analytics and Ads) and Meta Platforms (the Facebook Pixel). These providers may use the data they collect in accordance with their own privacy and cookie policies.",
          ],
        },
        {
          title: "Managing your cookies",
          paragraphs: [
            "When you first visit the site you can accept or decline non-essential cookies via the banner shown at the bottom of the screen. You can also control or delete cookies through your browser settings at any time. Please note that disabling cookies may affect parts of the site’s functionality.",
          ],
        },
        {
          title: "Contact us",
          paragraphs: [
            "If you have any questions about how we use cookies, please contact us at info@luxurysupercarsdubai.com.",
          ],
        },
      ],
};

const FOOTER_BRANDS_DEFAULT = [
  "Aston Martin", "Audi", "Bentley", "BMW", "Brabus", "Bugatti", "Cadillac",
  "Ferrari", "Lamborghini", "Land Rover", "Mansory", "Maserati", "McLaren",
  "Mercedes Benz", "Porsche", "Rolls Royce",
];
// "Rent Exotics" intentionally points at the luxury page — owner direction.
const FOOTER_RENT_DEFAULT = [
  { label: "Rent Luxury Cars", href: "/rent-luxury-cars-dubai" },
  { label: "Rent Convertible Cars", href: "/rent-convertible-cars-dubai" },
  { label: "Rent Sports Cars", href: "/rent-sports-cars-dubai" },
  { label: "Rent SUV Cars", href: "/rent-suv-cars-dubai" },
  { label: "Rent Exotics", href: "/rent-luxury-cars-dubai" },
  { label: "Rent Ferrari", href: "/brands/rent-ferrari-dubai" },
  { label: "Rent Lamborghini", href: "/brands/rent-lamborghini-dubai" },
  { label: "Rent Porsche", href: "/brands/rent-porsche-dubai" },
];
// hrefs mirror live luxurysupercarsdubai.com slugs exactly so existing
// backlinks resolve unchanged on launch.
const FOOTER_USEFUL_DEFAULT = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Fleet", href: "/our-fleet" },
  { label: "Services", href: "/services" },
  { label: "Blogs", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact-us" },
];
const FOOTER_LEGAL_DEFAULT = [
  { label: "Booking T&C's", href: "/booking-tcs" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export const FOOTER = {
  // Footer blurb — from Sanity `siteSettings.footerDescription`.
  description: siteSettingsData.footerDescription,
  brands: chrome.footer?.brands?.length ? chrome.footer.brands : FOOTER_BRANDS_DEFAULT,
  rent: chrome.footer?.rentLinks?.length ? links(chrome.footer.rentLinks) : FOOTER_RENT_DEFAULT,
  useful: chrome.footer?.usefulLinks?.length ? links(chrome.footer.usefulLinks) : FOOTER_USEFUL_DEFAULT,
  legal: chrome.footer?.legalLinks?.length ? links(chrome.footer.legalLinks) : FOOTER_LEGAL_DEFAULT,
  copyright: chrome.footer?.copyright || "© 2026 Luxury Supercar Rentals. All rights reserved.",
};

/* -------------------------------------------------------------------------- */
/*  About-page copy (CMS-backed: page-about-us → aboutContent)                 */
/* -------------------------------------------------------------------------- */

/**
 * About-page content from Sanity (page-about-us → aboutContent), exported to
 * about.json by scripts/sanity/export-to-json.ts. Every field falls back to
 * the verbatim live copy below, so an un-migrated doc renders unchanged.
 * Video fields are stored as pasted YouTube links and normalised to IDs here.
 */
interface AboutVentureItem { title?: string; body?: string; logo?: string; bordered?: boolean }
interface AboutPressTile { category?: string; caption?: string; image?: string }
interface AboutData {
  hero?: { heading?: string; paragraph?: string; backgroundVideo?: string; backgroundVideoUrl?: string };
  founder?: { heading?: string; paragraph?: string; videoUrl?: string; signature?: string };
  aboutMe?: { heading?: string; paragraphs?: string[]; portrait?: string };
  ventures?: { eyebrow?: string; items?: AboutVentureItem[] };
  embeds?: {
    tiktok?: { heading?: string; videos?: string[] };
    youtube?: { heading?: string; videos?: string[] };
    podcasts?: { heading?: string; videos?: string[] };
  };
  pressReel?: { items?: AboutPressTile[] };
}
const about = aboutData as unknown as AboutData;

/** Asset fallbacks — the current self-hosted About media. */
const ABOUT_PORTRAIT = "/images/Ahmed-portrait.png";
const ABOUT_SIGNATURE = "/images/legacy/2024/12/signature-img.avif";
const ABOUT_HERO_VIDEO = "/ahmed-trim.mp4";

export const ABOUT_HERO = {
  heading: about.hero?.heading || "**CEO** of Luxury Supercar Rentals Dubai",
  paragraph:
    about.hero?.paragraph ||
    "Ahmed has become a distinctive innovator behind luxury and super-car rentals, making a riveting offer to clients around the world to gain a taste of the opulent lifestyle.",
  backgroundVideo: about.hero?.backgroundVideoUrl || about.hero?.backgroundVideo || ABOUT_HERO_VIDEO,
  video: backgroundVideoEmbed(about.hero?.backgroundVideoUrl || about.hero?.backgroundVideo || ABOUT_HERO_VIDEO),
};

export const ABOUT_FOUNDER = {
  heading:
    about.founder?.heading ||
    "Ahmed Mansour redefines opulence with luxury super car rentals Dubai",
  paragraph:
    about.founder?.paragraph ||
    "Within the glowing and glossy world of luxury car rentals, Ahmed Mansour (Ahmed Amwell) stands out as the visionary behind Luxury Super Car Rentals Dubai. A true trailblazer, Luxury Super Car Rentals Dubai is transforming the industry, epitomizing success, and making renting the car of your dreams a hassle-free process.",
  videoUrl: about.founder?.videoUrl || "https://www.youtube.com/watch?v=TjB258kdQFc",
  video: founderVideoEmbed(about.founder?.videoUrl, "TjB258kdQFc"),
  signature: about.founder?.signature || ABOUT_SIGNATURE,
};

export const ABOUT_ME = {
  heading: about.aboutMe?.heading || "About me",
  paragraphs: about.aboutMe?.paragraphs?.length
    ? about.aboutMe.paragraphs
    : [
        "I’m Ahmed Amwell, the proud owner of Luxury Supercar Rentals, Dubai’s superior destination for the most luxury and exclusive cars available. Join us as we showcase the latest supercars, share expert insights into the world of luxury automobiles, and take you behind the scenes of our iconic showroom.",
        "If you are looking to rent the latest luxury Car in Dubai, luxurysupercarsdubai.com is a one-stop destination for all. You can avail the widest range of the most exotic luxury cars, including everything from the latest Sports Cars, Convertible Cars, SUVs, Supercars, and Prestige Cars, all of which would surely provide you with a fascinating experience.",
      ],
  portrait: about.aboutMe?.portrait || ABOUT_PORTRAIT,
};

// Full venture defaults incl. positional logos — used wholesale when the CMS
// has no ventures, and per-item to fill in a logo an editor left empty.
const VENTURE_DEFAULTS: { title: string; body: string; logo: string | null; bordered: boolean }[] = [
  { title: "Luxury Supercar Rentals", body: "The Premier Luxury Supercars Rental in Dubai. With a fleet of more than 100 exclusive super cars to choose from!", logo: "/images/LSR.png", bordered: false },
  { title: "Luxury Chauffeur Services", body: "Specialised to provide high-end chauffeur services Dubai with the best 24/7 customer service experience.", logo: "/images/LCS.png", bordered: false },
  { title: "Luxury Car Gallery", body: "The Premier Luxury Car Dealership in Dubai. Specialised in buying, selling and trading the world's most exclusive premium cars.", logo: "/images/LCG.png", bordered: false },
  { title: "Luxury Auto Care", body: "Specialised Auto Care for luxury supercars and hypercars in Dubai, delivering meticulous detailing, service and finish.", logo: "/images/LAG.png", bordered: false },
  { title: "Luxury Property Experts", body: "Real Estate Agency Specialized mostly in exclusive and luxurious properties in the UAE.", logo: "/images/legacy/elementor/thumbs/Luxury-Property-Experts-recrvozwm0qhknriejj7udemdmkmdhuj7lqfrikrq4.png", bordered: true },
];

export const ABOUT_VENTURES = {
  eyebrow: about.ventures?.eyebrow || "CEO of",
  // CMS names/descriptions/logos; a logo an editor leaves empty falls back to
  // the positional default (or company initials if none). Falls back wholesale
  // when the CMS has no ventures yet.
  items: about.ventures?.items?.length
    ? about.ventures.items.map((it, i) => ({
        title: it.title ?? "",
        body: it.body ?? "",
        logo: it.logo ?? VENTURE_DEFAULTS[i]?.logo ?? null,
        bordered: it.bordered ?? VENTURE_DEFAULTS[i]?.bordered ?? false,
      }))
    : VENTURE_DEFAULTS,
};

// Fixed design per rail (icon + layout); heading + video list are CMS-driven.
const ABOUT_EMBED_FALLBACK = {
  tiktok: ["gIho6aTDC6k", "LEWBL8DzhIU", "3_oc4OdQ-4o", "k-xGgGabnXA"],
  youtube: ["TjB258kdQFc", "VE48aZyvf7g", "zrIdggcPOk4", "QD87hNbhf-M"],
  podcasts: ["-1W-Vo3F1_I", "4o4XCiiJtm4"],
};

// Once the doc carries an `embeds` block, the CMS lists are authoritative —
// emptying a rail's list hides it. Before then, fall back to the live videos.
const embedsSeeded = Boolean(about.embeds);
const railVideos = (
  rail: { videos?: string[] } | undefined,
  fallback: string[],
): string[] => (embedsSeeded ? youTubeIds(rail?.videos) : fallback);

export const ABOUT_EMBEDS = [
  {
    id: "tiktok",
    label: "TikTok",
    icon: "tiktok" as const,
    layout: "shorts" as const,
    heading: about.embeds?.tiktok?.heading || "TikTok",
    videoIds: railVideos(about.embeds?.tiktok, ABOUT_EMBED_FALLBACK.tiktok),
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: "youtube" as const,
    layout: "wide" as const,
    heading: about.embeds?.youtube?.heading || "YouTube",
    videoIds: railVideos(about.embeds?.youtube, ABOUT_EMBED_FALLBACK.youtube),
  },
  {
    id: "podcasts",
    label: "Podcasts",
    icon: "podcasts" as const,
    layout: "wide" as const,
    heading: about.embeds?.podcasts?.heading || "PODCASTS",
    videoIds: railVideos(about.embeds?.podcasts, ABOUT_EMBED_FALLBACK.podcasts),
  },
].filter((rail) => rail.videoIds.length > 0);

// Press / awards / Instagram reel (AboutMarquee). Like the embeds, once the
// doc carries a pressReel block the CMS list is authoritative (empty = hide
// the strip); before then it falls back to the live tiles.
type PressCategory = "Award" | "Press" | "Instagram";
const PRESS_DEFAULTS: { category: PressCategory; caption: string; image: string }[] = [
  { category: "Award", caption: "Luxury Service Award 2024", image: "/images/legacy/2024/12/a.avif" },
  { category: "Press", caption: "Featured · Gulf News", image: "/images/legacy/2024/12/Article-1.avif" },
  { category: "Instagram", caption: "@luxurysupercarsdubai", image: "/images/legacy/2024/12/instagram-1.avif" },
  { category: "Press", caption: "Featured · Khaleej Times", image: "/images/legacy/2024/12/Article-2.avif" },
  { category: "Award", caption: "Top Luxury Rental — UAE", image: "/images/legacy/2024/12/award.avif" },
  { category: "Instagram", caption: "@luxurysupercarsdubai", image: "/images/legacy/2024/12/instagram-2.avif" },
  { category: "Press", caption: "Featured · Esquire ME", image: "/images/legacy/2024/12/Article-3.avif" },
  { category: "Instagram", caption: "@luxurysupercarsdubai", image: "/images/legacy/2024/12/instagram-3.avif" },
  { category: "Instagram", caption: "@luxurysupercarsdubai", image: "/images/legacy/2024/12/instagram-4.avif" },
];

const pressSeeded = Boolean(about.pressReel);
const toPressCategory = (c: string | undefined): PressCategory =>
  c === "Award" || c === "Instagram" ? c : "Press";

export const ABOUT_PRESS = {
  items: pressSeeded
    ? (about.pressReel?.items ?? [])
        .filter((t) => t.image)
        .map((t) => ({ category: toPressCategory(t.category), caption: t.caption ?? "", image: t.image as string }))
    : PRESS_DEFAULTS,
};
