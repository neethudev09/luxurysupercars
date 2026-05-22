/**
 * Canonical site origin — used for canonical tags, OpenGraph URLs, the
 * sitemap and structured data.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL — explicit per-environment override. Set on the
 *     staging project to the staging alias; change it to the live domain
 *     when the site goes to production.
 *  2. Vercel production deployments — the project's production domain.
 *  3. Vercel preview deployments — the per-deployment URL, so previews
 *     self-canonicalise and never claim to be the live site.
 *  4. The production domain, as a fallback for local builds.
 *
 * Only consumed by server-side code (metadata, sitemap, robots, JSON-LD),
 * so the non-public VERCEL_* build variables are safe to read here.
 */
function resolveOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://luxurysupercarsdubai.com";
}

/** The real production domain — the only origin allowed to be search-indexed. */
export const PRODUCTION_ORIGIN = "https://luxurysupercarsdubai.com";

export const SITE_URL = resolveOrigin().replace(/\/+$/, "");
