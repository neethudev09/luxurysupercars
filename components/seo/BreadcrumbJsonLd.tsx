import { PRODUCTION_ORIGIN } from "@/lib/site";

export interface BreadcrumbItem {
  name: string;
  /** Site-rooted path ("/blog") or absolute URL. */
  href: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

/**
 * Renders exactly one BreadcrumbList JSON-LD block. Page templates pass
 * their explicit hierarchy (real page titles, real canonical paths) — never
 * derived from raw URL segments. Names are stripped of any HTML markup.
 *
 * URLs always resolve against the production origin so the schema never
 * leaks localhost/staging addresses, and trailing-slash handling matches
 * the site's canonical strategy (no trailing slash except the root "/").
 */
export default function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const cleanName = (name: string) =>
    name.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

  const itemListElement = items
    .filter((it) => it.name && it.href)
    .map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cleanName(it.name),
      item: it.href.startsWith("http")
        ? it.href
        : `${PRODUCTION_ORIGIN}${it.href}`,
    }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
