import type { MetadataRoute } from "next";
import { SITE_URL, PRODUCTION_ORIGIN } from "@/lib/site";

/**
 * Only the real production domain serves an "allow everything" robots.txt.
 * Staging, Vercel previews and branch URLs all resolve SITE_URL to a
 * non-production origin and get a hard "disallow everything" so Google
 * never indexes a duplicate of the live site.
 */
export default function robots(): MetadataRoute.Robots {
  if (SITE_URL !== PRODUCTION_ORIGIN) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

return {
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: [
        "*/feed/",
        "/comments/feed/",
        "/*?add-to-cart=",
        "/*?lang=",
        "/wp-includes/",
        "/wp-content/",
        "/_next/image",
      ],
    },
  ],
  sitemap: `${PRODUCTION_ORIGIN}/sitemap.xml`,
  host: PRODUCTION_ORIGIN,
};
}
