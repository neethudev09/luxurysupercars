import type { Car } from "@/lib/fleet";
import { carHref } from "@/lib/fleet";
import { SITE_URL } from "@/lib/site";

const SITE = SITE_URL;

export default function CarJsonLd({ car }: { car: Car }) {
  const url = `${SITE}${carHref(car)}`;
  // Only include schema.org fields that the live page actually has data
  // for. Omitting unknown values is preferable to lying with placeholders.
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.name,
    image: car.image,
    url,
  };
  if (car.engine || car.horsepower) {
    json.vehicleEngine = {
      "@type": "EngineSpecification",
      ...(car.engine ? { name: car.engine } : {}),
      ...(car.horsepower ? { engineDisplacement: car.horsepower } : {}),
    };
  }
  if (car.zeroToHundred) json.accelerationTime = car.zeroToHundred;
  if (car.topSpeed) json.speed = car.topSpeed;
  if (car.seats > 0) json.seatingCapacity = car.seats;
  if (car.doors > 0) json.numberOfDoors = car.doors;
  if (car.color) json.color = car.color;
  if (car.year) json.vehicleModelDate = String(car.year);
  if (car.driveType) json.driveWheelConfiguration = car.driveType;
  if (car.transmission) json.vehicleTransmission = car.transmission;
  if (car.price > 0) {
    json.offers = {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: car.price,
        priceCurrency: "AED",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "DAY",
        },
      },
      seller: {
        "@type": "AutoRental",
        name: "Luxury Supercars Dubai",
        url: SITE,
      },
    };
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: car.category[0].toUpperCase() + car.category.slice(1),
        item: SITE + "/#" + car.category,
      },
      { "@type": "ListItem", position: 3, name: car.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
