// Reference: how the validated redirects are merged in next.config.ts.
// The actual integration lives in ../next.config.ts (redirects()).
//
// Merge order (all permanent 301):
//   1. /cdn-cgi/l/email-protection -> /contact-us
//   2. BRAND_REDIRECT_SLUGS  (exact /rent-{brand}-dubai -> /, mirrors old Rank Math)
//   3. LEGACY_REDIRECTS      (old /product, /shop, /ar/product URLs)
//   4. BLOG_REDIRECTS        (old blog slugs -> current article)
//   5. lsr-redirects.generated (validated legacy URLs -> current car/brand/blog pages)
// The full array is sorted alphabetically by source.
import type { NextConfig } from "next";
import { legacyRedirects } from "./lsr-redirects.generated";

const nextConfig: NextConfig = {
  // ...existing next.config.ts settings (images, headers, experimental)...
  async redirects() {
    const existingRedirects: Array<{
      source: string;
      destination: string;
      permanent: boolean;
    }> = [
      // ...BRAND_REDIRECT_SLUGS / LEGACY_REDIRECTS / BLOG_REDIRECTS (see next.config.ts)...
    ];
    return [...existingRedirects, ...legacyRedirects].sort((a, b) =>
      a.source.localeCompare(b.source),
    );
  },
};

export default nextConfig;
