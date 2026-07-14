import type { NextConfig } from "next";

/**
 * Brand-index URLs from the live WordPress site (e.g. /rent-ferrari-dubai/).
 * The live site 301s every one of these to "/" via Rank Math; we mirror
 * that behaviour to preserve identical SEO signals.
 *
 * NOTE: These are EXACT-match redirects, so per-car detail URLs like
 * /rent-ferrari-dubai/ferrari-f8-tributo-spyder-yellow are unaffected
 * (they continue to render via app/[brand]/[slug]/page.tsx).
 */
const BRAND_REDIRECT_SLUGS = [
  "rent-aston-martin-dubai",
  "rent-audi-dubai",
  "rent-bentley-dubai",
  "rent-bmw-dubai",
  "rent-bugatti-dubai",
  "rent-cadillac-dubai",
  "rent-ferrari-dubai",
  "rent-lamborghini-dubai",
  "rent-land-rover-dubai",
  "rent-maserati-dubai",
  "rent-mclaren-dubai",
  "rent-mercedes-benz-dubai",
  "rent-porsche-dubai",
  "rent-range-rover-dubai",
  "rent-rolls-royce-dubai",
];

/**
 * One-off legacy URLs from the live WordPress/WooCommerce site that have no
 * 1:1 slug in the new structure. Both are live + indexed on the production
 * domain but 404 here, so we 301 them to their closest equivalent to preserve
 * link equity:
 *  - /shop — the old WooCommerce shop page → the new fleet listing.
 *  - /product/mercedes-benz-amg-g63-800-brabus — the only car published on
 *    WooCommerce's default /product/ permalink → its new car detail page
 *    ("Mercedes Brabus G63 800 Widestar").
 */
const LEGACY_REDIRECTS = [
  { source: "/shop", destination: "/our-fleet" },

  {
    source: "/product/mercedes-benz-amg-g63-800-brabus",
    destination: "/rent-mercedes-benz-dubai/mercedes-brabus-g63-800-widestar",
  },

  {
    source: "/product/mclaren-720s-performance",
    destination: "/rent-mclaren-dubai/mclaren-720s-performance",
  },

  {
    source: "/product/mclaren-570s-spyder",
    destination: "/rent-mclaren-dubai/mclaren-570s-spyder",
  },

  {
    source: "/product/mclaren-720s",
    destination: "/rent-mclaren-dubai/mclaren-720s",
  },

  {
    source: "/product/ferrari-f8-tributo-spider-novitec-2022",
    destination: "/rent-ferrari-dubai/ferrari-f8-tributo-spider-novitec",
  },

  {
    source: "/product/bmw-x6m-competition",
    destination: "/rent-bmw-dubai/bmw-x6-m-competition-blue",
  },

  {
    source: "/product/mercedes-amg-a45s",
    destination: "/brands/rent-mercedes-benz-dubai?q=Mercedes+Benz+AMG",
  },

  {
    source: "/product/bentley-continental-gtc",
    destination: "/rent-bentley-dubai/bentley-continental-gtc",
  },

  {
    source: "/product/lamborghini-huracan-sto",
    destination: "/rent-lamborghini-dubai/lamborghini-huracan-sto",
  },

  {
    source: "/product/lamborghini-huracan-coupe",
    destination: "/rent-lamborghini-dubai/lamborghini-huracan-coupe",
  },

  {
    source: "/product/bmw-m4-competition",
    destination: "/rent-bmw-dubai/bmw-m4-competition",
  },

  {
    source: "/product/lamborghini",
    destination: "/our-fleet?brand=rent-lamborghini-dubai",
  },

  {
    source: "/product/rent-lamborghini-aventador-dubai",
    destination: "/rent-lamborghini-dubai/lamborghini-aventador-svj-roadster",
  },

  {
    source: "/product/rent-lamborghini-huracan-spyder",
    destination: "/rent-lamborghini-dubai/lamborghini-huracan-evo-spyder-purple",
  },

  {
    source: "/ar/product/mclaren-720s-performance",
    destination: "/rent-mclaren-dubai/mclaren-720s-performance",
  },

  {
    source: "/product/audi-r3",
    destination: "/rent-audi-dubai/audi-rs3",
  },

  {
    source: "/product/ferrari-f8-tributo",
    destination: "/rent-ferrari-dubai/ferrari-f8-tributo-spyder-yellow",
  },

  {
    source: "/product/audi-rsq3",
    destination: "/rent-audi-dubai/audi-rs3",
  },

  {
    source: "/product/rent-bmw-x7",
    destination: "/rent-bmw-dubai/bmw-735i",
  },

  {
    source: "/product/mclaren-720s-novitec-spider-2023",
    destination: "/rent-mclaren-dubai/mclaren-720s-novitec-spyder",
  },

  {
    source: "/product/rent-porsche-911-dubai",
    destination: "/brands/rent-porsche-dubai?q=Porsche+911",
  },

  {
    source: "/ar/product/lamborghini-huracan-sto/feed",
    destination: "/brands/rent-lamborghini-dubai?q=Lamborghini+Huracan",
  },
];

const BLOG_REDIRECTS = [
  {
    source: "/blogs/6-things-to-consider-when-renting-a-rolls-royce",
    destination: "/blogs/rolls-royce-rental-tips",
  },
  {
    source: "/blogs/the-rolls-royce-wraith-luxury-performance-and-elegance-combined",
    destination: "/blogs/rolls-royce-rental-tips",
  },
  {
    source: "/blogs/top-reasons-to-choose-rolls-royce-rental-in-dubai-for-your-next-special-event",
    destination: "/blogs/rolls-royce-rental-dubai-event",
  },
  {
    source: "/blogs/quality-vs-cost-navigating-the-supercar-rental-dilemma",
    destination: "/blogs/supercar-rental-quality-vs-cost",
  },
  {
    source: "/blogs/which-are-the-most-famous-rental-cars-in-dubai",
    destination: "/blogs/famous-rental-cars-dubai",
  },
  {
    source: "/blogs/ferrari-vs-lamborghini-which-supercar-reigns-supreme",
    destination: "/blogs/ferrari-vs-lamborghini-comparison",
  },
  {
    source: "/blogs/bentley-what-makes-it-one-of-the-most-iconic-cars-in-the-world",
    destination: "/blogs/why-bentley-is-iconic",
  },
  {
    source: "/blogs/what-to-expect-when-renting-a-mercedes-in-dubai-tips-and-advice",
    destination: "/blogs/mercedes-rental-dubai-guide",
  },
  {
    source: "/blogs/the-ultimate-luxury-experience-renting-a-bugatti-for-special-occasions",
    destination: "/blogs/bugatti-rental-luxury-experience",
  },
  {
    source: "/blogs/luxury-car-rental-etiquette-what-to-know-before-hitting-the-road-in-dubai",
    destination: "/blogs/luxury-car-rental-etiquette-dubai",
  },
  {
    source: "/blogs/sustainable-supercars-exploring-eco-friendly-innovations-in-high-performance-cars",
    destination: "/blogs/sustainable-supercars-eco-innovation",
  },
  {
    source: "/blogs/gentlemans-tourer-taking-the-rolls-royce-dawn-on-an-unforgettable-road-trip",
    destination: "/blogs/rolls-royce-dawn-road-trip",
  },
  {
    source: "/blogs/the-lamborghini-urus-a-game-changer-in-the-world-of-high-performance-suvs",
    destination: "/blogs/lamborghini-urus-high-performance",
  },
  {
    source: "/blogs/the-most-expensive-luxury-cars-in-the-world",
    destination: "/blogs/most-expensive-luxury-cars",
  },
  {
    source: "/blogs/8-reasons-a-lamborghini-rental-is-ideal-for-your-dubai-trip",
    destination: "/blogs/lamborghini-rental-dubai-reasons",
  },
  {
    source: "/blogs/the-history-of-the-iconic-bentley-logo",
    destination: "/blogs/history-of-bentley-logo",
  },
  {
    source: "/blogs/unleashing-luxury-why-you-should-hire-lamborghini-dubai",
    destination: "/blogs/hire-lamborghini-dubai",
  },
  {
    source: "/blogs/the-aesthetics-and-power-of-bugatti-vehicles",
    destination: "/blogs/bugatti-aesthetics-power",
  },
  {
    source: "/blogs/why-sports-car-rentals-in-dubai-are-perfect-for-thrill-seekers-and-car-enthusiasts",
    destination: "/blogs/sports-car-rentals-dubai-thrill",
  },
  {
    source: "/blogs/top-7-features-that-make-mercedes-amg-stand-out",
    destination: "/blogs/mercedes-amg-top-features",
  },
  {
    source: "/blogs/how-to-find-the-perfect-mclaren-rental-in-dubai-for-your-adventure",
    destination: "/blogs/mclaren-rental-dubai",
  },
  {
    source: "/blogs/rolls-royce-cullinan-vs-range-rover-which-suv-to-rent-in-dubai",
    destination: "/blogs/rolls-royce-vs-range-rover-dubai",
  },
  {
    source: "/blogs/6-ferrari-models-you-must-rent-at-least-once-in-your-life",
    destination: "/blogs/must-rent-ferrari-models",
  },
  {
    source: "/blogs/discover-the-elegance-why-renting-a-lamborghini-urus-in-dubai-is-the-ultimate-luxury-experience",
    destination: "/blogs/lamborghini-urus-rental-dubai",
  },
  {
    source: "/blogs/factors-that-have-contributed-to-the-popularity-of-luxury-cars-in-dubai",
    destination: "/blogs/luxury-cars-popularity-dubai",
  },
  {
    source: "/blogs/7-reasons-why-the-supercar-rental-market-is-on-the-rise",
    destination: "/blogs/supercar-rental-market-growth",
  },
  {
    source: "/blogs/luxury-redefined-why-you-should-consider-a-g-wagon-rental",
    destination: "/blogs/g-wagon-rental-luxury",
  },
  {
    source: "/blogs/add-a-touch-of-luxury-to-your-corporate-event-with-a-lamborghini-rental",
    destination: "/blogs/lamborghini-rental-corporate-event",
  },
  {
    source: "/blogs/what-to-expect-from-your-bugatti-rental-experience",
    destination: "/blogs/bugatti-rental-experience",
  },
  {
    source: "/blogs/car-rental-guide-what-you-need-to-know-before-renting-a-supercar",
    destination: "/blogs/renting-a-lamborghini-guide",
  },
  {
    source: "/blogs/the-rolls-royce-wraith-a-car-fit-for-royalty",
    destination: "/blogs/rolls-royce-wraith-royalty",
  },
  {
    source: "/blogs/the-top-8-most-iconic-ferrari-models",
    destination: "/blogs/iconic-ferrari-models",
  },
  {
    source: "/blogs/the-different-types-of-engine-technologies-found-in-modern-day-sports-cars",
    destination: "/blogs/sports-car-engine-technologies",
  },
  {
    source: "/blogs/the-advanced-driver-assistance-features-of-the-bmw-m3",
    destination: "/blogs/bmw-m3-advanced-features",
  },
  {
    source: "/blogs/is-it-better-to-buy-or-rent-a-sports-car-in-dubai",
    destination: "/blogs/buy-vs-rent-sports-car-dubai",
  },
  {
    source: "/blogs/the-most-famous-ferraris-in-movie-history",
    destination: "/blogs/famous-ferraris-in-movies",
  },
  {
    source: "/blogs/what-makes-supercars-so-special",
    destination: "/blogs/ferrari-rental-dubai-affordable",
  },
];


const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  images: {
    // Only the Sanity CDN is allowed. The old WordPress + old-Vercel image
    // hosts were removed once every asset was migrated to public/images/ or
    // Sanity (scripts/migrate-images.mjs). If anything ever hot-links the old
    // site again, the build fails loudly instead of shipping a dead image.
    remotePatterns: [
      {
        // Sanity asset CDN — all car galleries + blog hero images resolve
        // here after the build-time export from Sanity.
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)\\.(js|css|woff2|png|jpe?g|gif|webp|avif|svg|mp4|webm|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)\\.html",
        headers: [
          { key: "Cache-Control", value: "no-cache, must-revalidate" },
        ],
      },
    ];
  },
  async redirects() {
    return [
    {
      source: "/cdn-cgi/l/email-protection",
      destination: "/contact-us",
      permanent: true,
    },
      ...BRAND_REDIRECT_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: "/",
        permanent: true,
      })),
      ...LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true })),
      ...BLOG_REDIRECTS.map((r) => ({ ...r, permanent: true })),
    ];
  },
};

export default nextConfig;
