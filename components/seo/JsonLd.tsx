import { CONTACT } from "@/lib/content";
import { FAQ as FAQ_DATA, HERO } from "@/lib/content";
import { ALL_CARS } from "@/lib/fleet";
import { SITE_URL } from "@/lib/site";

const SITE = SITE_URL;

export default function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: "Luxury Supercars Dubai",
    url: SITE,
    image: `${SITE}/wp-content/uploads/2024/11/image-1.png`,
    // Verbatim from live site's LocalBusiness schema description
    description:
      "If you are looking to rent the latest luxury Car in Dubai, luxurysupercarsdubai.com is a one-stop destination for all. You can avail the widest range of the most exotic luxury cars, including everything from the latest Sports Cars, Convertible Cars, SUVs, Supercars, and Prestige Cars, all of which would surely provide you with a fascinating experience.",
    telephone: CONTACT.primaryPhone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Showroom 317, Nadd Al Hamar",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: HERO.rating.stars,
      reviewCount: HERO.rating.count,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
  };

  const cars = ALL_CARS.map((c) => ({
    "@context": "https://schema.org",
    "@type": "Car",
    name: c.name,
    image: c.image,
    vehicleEngine: { "@type": "EngineSpecification", name: c.engine },
    accelerationTime: c.zeroToHundred,
    seatingCapacity: c.seats,
    numberOfDoors: c.doors,
    offers: {
      "@type": "Offer",
      price: c.price,
      priceCurrency: "AED",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: c.price,
        priceCurrency: "AED",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "DAY" },
      },
    },
  }));

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
    ],
  };

  const blocks = [localBusiness, faqPage, breadcrumb, ...cars];

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
