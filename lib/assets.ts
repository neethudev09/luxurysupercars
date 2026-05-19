/**
 * All imagery references the live production site so this redesign uses
 * the existing CDN assets without re-hosting. URLs verified at build time
 * — if any 404 in future, swap with placeholder + flag.
 */

// Lamborghini Revuelto — flagship V12 hybrid, 12,000 AED/day.
// Was previously pointing at /image-1.png which is the site brand mark.
export const SITE_LOGO =
  "https://luxury-supercars-dubai.vercel.app/images/branding/logo.png";

export const HERO_IMAGE =
  "https://luxurysupercarsdubai.com/wp-content/uploads/2025/08/DSCF9336-scaled.jpg";

export const TESTIMONIAL_AVATAR =
  "https://luxurysupercarsdubai.com/wp-content/uploads/2025/01/user-dummy-img.png";

export const CATEGORY_ICONS = {
  luxury:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/luxury-car-rental.svg",
  sports:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/sports-car-rental.svg",
  convertible:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/convertible-1.svg",
  electric:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/electric-car-rental-1.svg",
  suv: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/suv-car-rental.svg",
} as const;

export const NAV_CAR_TYPES = [
  { label: "Luxury Cars",      href: "/rent-luxury-cars-dubai",      icon: CATEGORY_ICONS.luxury },
  { label: "Convertible Cars", href: "/rent-convertible-cars-dubai", icon: CATEGORY_ICONS.convertible },
  { label: "Sports Cars",      href: "/rent-sports-cars-dubai",      icon: CATEGORY_ICONS.sports },
  { label: "Electric Cars",    href: "/our-fleet?tag=electric",      icon: CATEGORY_ICONS.electric },
  { label: "SUV Cars",         href: "/rent-suv-cars-dubai",         icon: CATEGORY_ICONS.suv },
] as const;

/**
 * Editorial photography paired with each /service/{slug} page. Reuses
 * fleet CDN imagery — the cars themselves carry the visual weight that
 * a stock service photo couldn't. Keyed by the service slug used in
 * SERVICES_PAGE.items[].slug ([lib/content.ts](lib/content.ts)).
 */
export const SERVICE_IMAGES: Record<string, string> = {
  "gift-vouchers":
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Rolls-Royce-Cullinan-Mansory-tiffany-8-1024x768.jpg",
  "long-term-rental":
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Bentley-Bentayga-Mansory-1.jpg",
  "self-drive-car-rental":
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/McLaren-750s-Spider-Tiffany-Blue-1.jpg",
  "weddings-special-events":
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Rolls-Royce-Dawn-White-1.jpg",
};

/**
 * Hero photography for the standalone page heroes that benefit from a
 * background image (contact-us, careers, legal). Reuses fleet CDN
 * imagery to keep the brand visual language consistent.
 */
export const PAGE_HERO_IMAGES = {
  contact:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2025/08/DSCF9336-scaled.jpg",
  careers:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Lamborghini-Revuelto-1.jpg",
  legal:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Bentley-Bentayga-Mansory-1.jpg",
  blog:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2025/08/DSCF9336-scaled.jpg",
  faq:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Lamborghini-Urus-Mansory-1.jpg",
  services:
    "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Mercedes-G63-AMG-Brabus-Green-Widestar-1.jpg",
} as const;

export const BRAND_LOGOS: { name: string; src: string; slug: string | null }[] = [
  { name: "Aston Martin", src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/aston_martin.png",       slug: "rent-aston-martin-dubai" },
  { name: "Audi",         src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/audi-1-1-1.png",          slug: "rent-audi-dubai" },
  { name: "Bentley",      src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/11/bentlay.png",             slug: "rent-bentley-dubai" },
  { name: "Rolls Royce",  src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/11/royce.png",               slug: "rent-rolls-royce-dubai" },
  { name: "Bugatti",      src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/11/bugatti.png",             slug: null },
  { name: "McLaren",      src: "https://luxurysupercarsdubai.com/wp-content/uploads/2025/05/McLaren-logo-black-scaled.png",  slug: "rent-mclaren-dubai" },
  { name: "BMW",          src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/11/bmw.png",                 slug: "rent-bmw-dubai" },
  { name: "Land Rover",   src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/11/land.png",                slug: "rent-range-rover-dubai" },
  { name: "Mercedes",     src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/11/merc.png",                slug: "rent-mercedes-benz-dubai" },
  { name: "Cadillac",     src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/cadillas-1.png",          slug: "rent-cadillac-dubai" },
  { name: "Ferrari",      src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/11/ferri.png",               slug: "rent-ferrari-dubai" },
  { name: "Lamborghini",  src: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/11/lam.png",                 slug: "rent-lamborghini-dubai" },
  { name: "Maserati",     src: "https://luxurysupercarsdubai.com/wp-content/uploads/2025/05/maserati-logo.png", slug: "rent-maserati-dubai" },
  { name: "Porsche",      src: "https://luxurysupercarsdubai.com/wp-content/uploads/2025/01/porsche-logo-2.png",      slug: "rent-porsche-dubai" },
];
