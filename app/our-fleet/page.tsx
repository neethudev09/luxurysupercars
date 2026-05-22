import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import BrandsSection from "@/components/sections/BrandsSection";
import FleetExplorer from "@/components/fleet/FleetExplorer";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { UNIQUE_CARS } from "@/lib/fleet";

export const metadata: Metadata = {
  title: "Our Luxury Car Rental Fleet | Luxury Supercars Dubai",
  description:
    "Browse the full Luxury Supercars Dubai fleet — supercars, convertibles, SUVs and prestige rentals. Filter by brand, type, doors, seats, colour, and price.",
  alternates: { canonical: "/our-fleet" },
  openGraph: {
    title: "Our Luxury Car Rental Fleet | Luxury Supercars Dubai",
    description:
      "Browse the full Luxury Supercars Dubai fleet — supercars, convertibles, SUVs and prestige rentals.",
    url: "/our-fleet",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

export default function OurFleetPage() {
  return (
    <main>
      <SiteNav />
      {/* Visually-hidden — preserves the live site's "Our Fleet" page-title
          for SEO/crawlers without rendering it in the redesigned layout. */}
      <p className="sr-only">Our Fleet</p>
      <BrandsSection />
      <div id="fleet">
        <FleetExplorer cars={UNIQUE_CARS} />
      </div>
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
