/**
 * Static imagery used across the site. Every asset is now either:
 *  - self-hosted in public/images/ (migrated off the old WordPress site by
 *    scripts/migrate-images.mjs — these survive the old site being switched
 *    off at launch), or
 *  - served from Sanity's permanent CDN (cdn.sanity.io) for fleet photography.
 *
 * NOTHING here points at luxurysupercarsdubai.com/wp-content or the old
 * Vercel deployment any more — those URLs 404 the moment the old site is
 * replaced. If you add a new image, drop the file in public/images/ (or use
 * a Sanity asset) rather than hot-linking an external URL.
 */

// Self-hosted brand mark (was hot-linked from the old Vercel deployment).
export const SITE_LOGO = "/images/branding/logo.png";

export const HERO_IMAGE = "/images/legacy/2025/08/DSCF9336-scaled.jpg";

export const TESTIMONIAL_AVATAR = "/images/legacy/2025/01/user-dummy-img.png";

export const CATEGORY_ICONS = {
  luxury: "/images/car-types/luxury-bentley.png",
  sports: "/images/car-types/sports.svg",
  convertible: "/images/legacy/2024/12/convertible-1.svg",
  electric: "/images/legacy/2024/12/electric-car-rental-1.svg",
  suv: "/images/car-types/suv.svg",
} as const;

export const NAV_CAR_TYPES = [
  { label: "Luxury Cars",      href: "/rent-luxury-cars-dubai",      icon: CATEGORY_ICONS.luxury },
  { label: "Convertible Cars", href: "/rent-convertible-cars-dubai", icon: CATEGORY_ICONS.convertible },
  { label: "Sports Cars",      href: "/rent-sports-cars-dubai",      icon: CATEGORY_ICONS.sports },
  { label: "Electric Cars",    href: "/our-fleet?tag=electric",      icon: CATEGORY_ICONS.electric },
  { label: "SUV Cars",         href: "/rent-suv-cars-dubai",         icon: CATEGORY_ICONS.suv },
] as const;

/**
 * Editorial photography paired with each /service/{slug} page. Uses Sanity
 * fleet imagery — the cars themselves carry the visual weight a stock service
 * photo couldn't. (The old wp-content photos here 404'd even on the live site,
 * so these were repointed to the matching car in the Sanity fleet.) Keyed by
 * the service slug used in SERVICES_PAGE.items[].slug ([lib/content.ts](lib/content.ts)).
 */
export const SERVICE_IMAGES: Record<string, string> = {
  "gift-vouchers": "/images/legacy/2024/12/Rolls-Royce-Cullinan-Mansory-tiffany-8-1024x768.jpg",
  "long-term-rental":
    "https://cdn.sanity.io/images/pkpvmml9/production/3243f947d049d055762b43036e6a593e1e9db292-1600x1214.jpg",
  "self-drive-car-rental":
    "https://cdn.sanity.io/images/pkpvmml9/production/6885889ea33c847e1fba3aa201fcaea9b1c09053-2560x1920.jpg",
  "weddings-special-events":
    "https://cdn.sanity.io/images/pkpvmml9/production/3f765cda12a78e6ea53192b5feb29fda792ee7a2-1280x960.jpg",
};

/**
 * Hero photography for the standalone page heroes that benefit from a
 * background image (contact-us, careers, legal). Self-hosted DSCF9336 where
 * available; the rest use Sanity fleet imagery (the old wp-content car photos
 * 404'd even on the live site).
 */
export const PAGE_HERO_IMAGES = {
  contact: "/images/legacy/2025/08/DSCF9336-scaled.jpg",
  careers:
    "https://cdn.sanity.io/images/pkpvmml9/production/61ce475c6aaa5511b52a8b1efb23a7224d1da8f9-2560x1920.jpg",
  legal:
    "https://cdn.sanity.io/images/pkpvmml9/production/3243f947d049d055762b43036e6a593e1e9db292-1600x1214.jpg",
  blog: "/images/legacy/2025/08/DSCF9336-scaled.jpg",
  faq: "https://cdn.sanity.io/images/pkpvmml9/production/324b89d3f34db4169f6f30b336e536bf24a0a64c-2560x1622.webp",
  services:
    "https://cdn.sanity.io/images/pkpvmml9/production/373a4fdb0a184efcbb5cecaba9e89b0c03b0e137-2560x1920.jpg",
} as const;

export const BRAND_LOGOS: { name: string; src: string; slug: string | null }[] = [
  { name: "Aston Martin", src: "/images/legacy/2024/12/aston_martin.png",  slug: "rent-aston-martin-dubai" },
  { name: "Audi",         src: "/images/legacy/2024/12/audi-1-1-1.png",     slug: "rent-audi-dubai" },
  { name: "Bentley",      src: "/images/legacy/2024/11/bentlay.png",        slug: "rent-bentley-dubai" },
  { name: "Brabus",       src: "/images/brands/brabus.png",                 slug: "rent-brabus-dubai" },
  { name: "Rolls Royce",  src: "/images/legacy/2024/11/royce.png",          slug: "rent-rolls-royce-dubai" },
  { name: "Bugatti",      src: "/images/legacy/2024/11/bugatti.png",        slug: null },
  { name: "McLaren",      src: "/images/brands/mclaren.png",                slug: "rent-mclaren-dubai" },
  { name: "BMW",          src: "/images/legacy/2024/11/bmw.png",            slug: "rent-bmw-dubai" },
  { name: "Land Rover",   src: "/images/legacy/2024/11/land.png",           slug: "rent-range-rover-dubai" },
  { name: "Mercedes",     src: "/images/legacy/2024/11/merc.png",           slug: "rent-mercedes-benz-dubai" },
  { name: "Cadillac",     src: "/images/legacy/2024/12/cadillas-1.png",     slug: "rent-cadillac-dubai" },
  { name: "Ferrari",      src: "/images/legacy/2024/11/ferri.png",          slug: "rent-ferrari-dubai" },
  { name: "Lamborghini",  src: "/images/legacy/2024/11/lam.png",            slug: "rent-lamborghini-dubai" },
  { name: "Mansory",      src: "/images/brands/mansory.png",                slug: "rent-mansory-dubai" },
  { name: "Maserati",     src: "/images/brands/maserati.png",               slug: "rent-maserati-dubai" },
  { name: "Porsche",      src: "/images/brands/porsche-new.png",                slug: "rent-porsche-dubai" },
];

/** Resolve a brand's logo from its directory slug (e.g. "rent-aston-martin-dubai"). */
export function getBrandLogo(
  brandSlug: string,
): { name: string; src: string } | null {
  const match = BRAND_LOGOS.find((b) => b.slug === brandSlug);
  return match ? { name: match.name, src: match.src } : null;
}
