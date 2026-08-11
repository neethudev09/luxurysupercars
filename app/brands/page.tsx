import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import FleetTypeHero from "@/components/sections/FleetTypeHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import BrandIndexJsonLd from "@/components/seo/BrandIndexJsonLd";
import Testimonials from "@/components/sections/Testimonials";
import Footer from "@/components/sections/Footer";
import { BRAND_LOGOS } from "@/lib/assets";
import { FLEET_BRAND_LIST } from "@/lib/fleet-brands";
import { UNIQUE_CARS } from "@/lib/fleet";
import { getCarsByBrand } from "@/lib/fleet-tags";

export const metadata: Metadata = {
  title: "Luxury Car Rental Brands in Dubai | Luxury Supercars Dubai",
  description:
    "Browse the luxury car rental brands in Dubai — Aston Martin, Ferrari, Lamborghini, Rolls-Royce, McLaren, Porsche and more. Compare models, prices and availability with Luxury Supercars Dubai.",
  alternates: { canonical: "/brands" },
  openGraph: {
    title: "Luxury Car Rental Brands in Dubai | Luxury Supercars Dubai",
    description:
      "Browse the luxury car rental brands in Dubai — Aston Martin, Ferrari, Lamborghini, Rolls-Royce, McLaren, Porsche and more.",
    url: "/brands",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

export default function BrandsIndexPage() {
  const logoBySlug = new Map(
    BRAND_LOGOS.filter((b) => b.slug).map((b) => [b.slug as string, b.src]),
  );

  const brands = FLEET_BRAND_LIST.map((brand) => ({
    ...brand,
    logo: logoBySlug.get(brand.slug),
    carCount: getCarsByBrand(UNIQUE_CARS, brand.slug).length,
  }));

  return (
    <main>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Brands", href: "/brands" },
        ]}
      />
      <BrandIndexJsonLd brands={brands} />
      <SiteNav />

      <FleetTypeHero
        visibleTitle="Brands"
        h1="Rent Luxury Cars by **Brand** in Dubai"
      />

      {/* Intro copy */}
      <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-2 pb-10 md:pb-14">
        <div className="container-x">
          <div className="max-w-3xl">
            <p className="text-[17px] leading-[1.8] text-[var(--ink-lo)]">
              From Aston Martin to Rolls-Royce, explore every marque in the
              Luxury Supercars Dubai fleet. Each brand has its own page with
              model line-up, per-day pricing, and free delivery details — pick
              a marque and compare the cars that match your style.
            </p>
          </div>
        </div>
      </section>

      {/* Brand grid */}
      <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pb-16 md:pb-20">
        <div className="container-x">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[var(--bg-graphite)]/40 px-6 py-10 md:py-12 text-center transition-colors hover:border-[var(--champagne)]/50 hover:bg-[var(--bg-graphite)]/70"
              >
                {brand.logo && (
                  <span className="relative h-12 w-[92px]">
                    <Image
                      src={brand.logo}
                      alt={`${brand.displayName} logo`}
                      fill
                      sizes="92px"
                      className="object-contain opacity-70 transition-opacity group-hover:opacity-100"
                    />
                  </span>
                )}
                <span className="font-[var(--font-display)] text-[clamp(1.2rem,2vw,1.5rem)] leading-tight tracking-tight text-[var(--ink-hi)]">
                  {brand.displayName}
                </span>
                <span className="flex flex-col items-center gap-1">
                  <span className="font-[var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--ink-lo)]">
                    {brand.carCount === 1 ? "1 Model" : `${brand.carCount} Models`}
                  </span>
                  <span className="font-[var(--font-mono)] text-[10.5px] tracking-[0.18em] uppercase text-[var(--champagne)] opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    View Brand
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </main>
  );
}
