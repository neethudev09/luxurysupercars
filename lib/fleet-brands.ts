/**
 * Brand-page content for the 13 /brands/rent-{brand}-dubai pages.
 *
 * Data is sourced from lib/generated/brands.json, which
 * scripts/sanity/export-to-json.ts regenerates from Sanity `brand` docs
 * on every build — editors manage brand copy in /studio. Each section's
 * body is an ordered list of blocks (paragraphs, bulleted lists, pricing
 * tables) reconstructed from the Sanity Portable Text.
 *
 * Every string is verbatim from the live WordPress site so the pages
 * inherit existing rankings. Live-page quirks preserved per the
 * SEO-is-king rule:
 *   - McLaren H1: "Rent Mclaren in Dubai" (lowercase 'l')
 *   - Mercedes H1: "Rent Mercedes Benz in Dubai" (no hyphen)
 *   - Title/meta price mismatches on BMW, Cadillac, Rolls-Royce
 */
import brandsData from "./generated/brands.json";

export type BrandSectionBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; headers: string[]; rows: string[][] };

export interface BrandSection {
  h2: string;
  body: BrandSectionBlock[];
}

export interface FleetBrandMeta {
  slug: string;
  displayName: string;
  title: string;
  description: string;
  h1: string;
  visibleTitle: string;
  sections: BrandSection[];
  faqs: { q: string; a: string }[];
  faqHeading: string | null;
}

export const FLEET_BRANDS = brandsData as unknown as Record<string, FleetBrandMeta>;

export const FLEET_BRAND_LIST: FleetBrandMeta[] = Object.values(FLEET_BRANDS);
export const FLEET_BRAND_SLUGS: string[] = Object.keys(FLEET_BRANDS);
