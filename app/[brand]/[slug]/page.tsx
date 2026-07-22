import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarDetail from "@/components/car-detail/CarDetail";
import CarJsonLd from "@/components/car-detail/CarJsonLd";
import Footer from "@/components/sections/Footer";
import {
  UNIQUE_CARS,
  getCarByPath,
  carHref,
} from "@/lib/fleet";
import { getRelatedCars } from "@/lib/fleet-tags";

export const dynamicParams = false;

export async function generateStaticParams() {
  return UNIQUE_CARS.map((c) => ({ brand: c.brand, slug: c.slug }));
}

interface RouteParams {
  brand: string;
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { brand, slug } = await params;
  const car = getCarByPath(brand, slug);
  if (!car) return {};

  // Relative path — Next resolves it against metadataBase (env-driven),
  // so canonical/OG URLs follow the deployment origin.
  const url = carHref(car);
  const { seo } = car;

  // Live SEO is mirrored verbatim from luxurysupercarsdubai.com via
  // scripts/scrape-fleet.mjs. Falls back to a templated description only
  // if the scraped page hadn't shipped a meta description (rare).
  const title = seo.title
    || `Rent ${car.name} in Dubai | Luxury Supercars Dubai`;
  const description = seo.metaDescription
    || `Rent the ${car.name} from AED ${car.price.toLocaleString()} per day in Dubai. ${car.engine}, 0–100 km/h in ${car.zeroToHundred}, ${car.seats} seats.`;
  const ogTitle = seo.ogTitle || title;
  const ogDescription = seo.ogDescription || description;
  const ogImage = seo.ogImage || car.image;
  const ogImageWidth = seo.ogImageWidth || 1200;
  const ogImageHeight = seo.ogImageHeight || 800;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      type: "website",
      images: [{ url: ogImage, width: ogImageWidth, height: ogImageHeight, alt: car.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

export default async function CarPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { brand, slug } = await params;
  const car = getCarByPath(brand, slug);
  if (!car) notFound();
  const related = getRelatedCars(UNIQUE_CARS, car, 4);
  return (
    <>
      <CarJsonLd car={car} />
      <CarDetail car={car} related={related} />
      <Footer />
    </>
  );
}
