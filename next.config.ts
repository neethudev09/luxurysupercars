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

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "luxurysupercarsdubai.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "luxurysupercarsdubai.com",
        pathname: "/pagespeed_static/**",
      },
      {
        protocol: "https",
        hostname: "luxury-supercars-dubai.vercel.app",
        pathname: "/**",
      },
      {
        // Sanity asset CDN — all car galleries + blog hero images now
        // resolve here after the build-time export from Sanity.
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return BRAND_REDIRECT_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: "/",
      permanent: true,
    }));
  },
};

export default nextConfig;
