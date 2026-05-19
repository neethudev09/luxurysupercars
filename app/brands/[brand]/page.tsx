import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FleetBrandPageBody from "@/components/sections/FleetBrandPageBody";
import { FLEET_BRANDS, FLEET_BRAND_SLUGS } from "@/lib/fleet-brands";
import { UNIQUE_CARS } from "@/lib/fleet";
import { getCarsByBrand } from "@/lib/fleet-tags";

interface PageProps {
  params: Promise<{ brand: string }>;
}

export function generateStaticParams() {
  return FLEET_BRAND_SLUGS.map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand } = await params;
  const meta = FLEET_BRANDS[brand];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/brands/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://luxurysupercarsdubai.com/brands/${meta.slug}`,
      siteName: "Luxury Supercars Dubai",
      locale: "en_AE",
      type: "website",
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { brand } = await params;
  const meta = FLEET_BRANDS[brand];
  if (!meta) notFound();

  const cars = getCarsByBrand(UNIQUE_CARS, meta.slug);
  return <FleetBrandPageBody meta={meta} cars={cars} />;
}
