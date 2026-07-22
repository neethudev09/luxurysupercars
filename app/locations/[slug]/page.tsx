import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import LocationBody from "@/components/sections/LocationBody";
import LocationMap from "@/components/sections/LocationMap";
import FAQ from "@/components/sections/FAQ";
import { getLocation, getAllLocations, LOCATION_SLUGS } from "@/lib/locations";
import Footer from "@/components/sections/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return LOCATION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};

  return {
    title: location.title,
    description: location.description,
    alternates: { canonical: `/locations/${slug}` },
    openGraph: {
      title: location.title,
      description: location.description,
      url: `/locations/${slug}`,
      siteName: "Luxury Supercars Dubai",
      locale: "en_AE",
      type: "website",
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  const faqHeading = `${location.name} FAQs`;

  const locationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `Luxury Supercar Rentals - ${location.name}`,
    description: location.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.name,
      addressRegion: "Dubai",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.coordinates.lat,
      longitude: location.coordinates.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    mainEntityOfPage: {
      "@type": "FAQPage",
      mainEntity: location.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  };

  return (
    <main>
      <SiteNav />
      <PageHero
        eyebrow={location.name}
        h1={location.h1}
        subline={location.description}
        spotlight="right"
      />
      <LocationBody location={location} />
      <LocationMap location={location} />
      <FAQ
        heading={faqHeading}
        items={location.faqs}
        cta={null}
      />
      <Script
        id="location-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationJsonLd) }}
      />
      <Footer />
    </main>
  );
}
