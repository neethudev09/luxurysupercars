import { SITE_URL } from "@/lib/site";
import type { FleetBrandMeta } from "@/lib/fleet-brands";
import type { Car } from "@/lib/fleet";

interface BrandJsonLdProps {
  meta: FleetBrandMeta;
  cars: Car[];
}

export default function BrandJsonLd({ meta, cars }: BrandJsonLdProps) {
  const site = SITE_URL;
  const brandName = meta.displayName;

  const vehicleSchemas = cars.map((car) => ({
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: car.name,
    url: `${site}/cars/${car.slug}`,
    description: `Rent the ${car.name} in Dubai from Luxury Supercar Rentals.`,
    brand: { "@type": "Brand", name: brandName },
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: car.priceCurrency || "AED",
      availability: "https://schema.org/InStock",
      url: `${site}/cars/${car.slug}`,
    },
  }));

  // BreadcrumbList is rendered separately via <BreadcrumbJsonLd> on the
  // brand page — kept here-free so only one breadcrumb exists per page.

  const blocks = [...vehicleSchemas];

  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }}
        />
      ))}
    </>
  );
}
