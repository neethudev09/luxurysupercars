import type { MetadataRoute } from "next";

/**
 * Only the production deployment serves an "allow everything" robots.txt.
 * Vercel previews + staging + branch URLs get a hard "disallow everything"
 * so Google never indexes duplicate copies of the live site.
 *
 * Detection (in order):
 *   1. Explicit NEXT_PUBLIC_SITE_URL set to the prod origin
 *   2. Vercel's auto-injected VERCEL_ENV === "production"
 */
const PROD_ORIGIN = "https://luxurysupercarsdubai.com";

function isProd(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production";
  if (process.env.NEXT_PUBLIC_SITE_URL)
    return process.env.NEXT_PUBLIC_SITE_URL === PROD_ORIGIN;
  return process.env.NODE_ENV === "production";
}

export default function robots(): MetadataRoute.Robots {
  if (!isProd()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${PROD_ORIGIN}/sitemap.xml`,
    host: PROD_ORIGIN,
  };
}
