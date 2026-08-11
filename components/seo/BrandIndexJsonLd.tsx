import { PRODUCTION_ORIGIN } from "@/lib/site";
import type { FleetBrandMeta } from "@/lib/fleet-brands";

interface BrandIndexJsonLdProps {
  brands: (FleetBrandMeta & { carCount: number })[];
}

/**
 * ItemList of every rentable brand on /brands, linking to each brand's
 * dedicated page. Rendered as JSON-LD so crawlers can index the hub's
 * full inventory of marques.
 */
export default function BrandIndexJsonLd({ brands }: BrandIndexJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Luxury Car Rental Brands in Dubai | Luxury Supercars Dubai",
    url: `${PRODUCTION_ORIGIN}/brands`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: brands.map((brand, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: brand.displayName,
        url: `${PRODUCTION_ORIGIN}/brands/${brand.slug}`,
      })),
    },
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
