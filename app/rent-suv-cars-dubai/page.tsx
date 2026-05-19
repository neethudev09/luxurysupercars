import type { Metadata } from "next";
import FleetTypePageBody from "@/components/sections/FleetTypePageBody";
import { FLEET_TYPES } from "@/lib/fleet-types";
import { UNIQUE_CARS } from "@/lib/fleet";
import { getCarsByCategory } from "@/lib/fleet-tags";

const META = FLEET_TYPES.suv;

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: `/${META.slug}` },
  openGraph: {
    title: META.title,
    description: META.description,
    url: `https://luxurysupercarsdubai.com/${META.slug}`,
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

export default function Page() {
  const cars = getCarsByCategory(UNIQUE_CARS, META.category);
  return <FleetTypePageBody meta={META} cars={cars} />;
}
