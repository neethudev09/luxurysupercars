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
];

const nextConfig: NextConfig = {
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
  async redirects() {
    return [
      ...BRAND_REDIRECT_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: "/",
        permanent: true,
      })),
      ...LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true })),
    ];
  },
};

export default nextConfig;
