import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import { getAllLocations } from "@/lib/locations";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Luxury Car Rental Locations Dubai | Free Delivery Across the City",
  description:
    "Luxury Supercar Rentals delivers to every Dubai district - Dubai Marina, Downtown, Palm Jumeirah, JBR, DIFC, Business Bay, Airport and more. Free delivery included.",
  alternates: { canonical: "/locations" },
  openGraph: {
    title: "Luxury Car Rental Locations Dubai | Free Delivery Across the City",
    description:
      "Luxury Supercar Rentals delivers to every Dubai district - Dubai Marina, Downtown, Palm Jumeirah, JBR, DIFC, Business Bay, Airport and more.",
    url: "/locations",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

export default function LocationsPage() {
  const locations = getAllLocations();

  return (
    <main>
      <SiteNav />
      <PageHero
        eyebrow="Locations"
        h1="**Dubai** Delivery Areas"
        subline="Free delivery to every major Dubai district - from the Marina to the Palm, Downtown to the Airport. Your car, wherever you are."
        spotlight="right"
      />

      <section className="relative bg-[var(--bg-pearl)] border-t border-black/5 py-20 md:py-24 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 size-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[var(--champagne)]/[0.06] blur-[160px]"
        />
        <div className="container-x relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {locations.map((loc, i) => (
              <Reveal key={loc.slug} delay={i * 60}>
                <Link
                  href={`/locations/${loc.slug}`}
                  className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-black/8 bg-[var(--bg-obsidian)] p-7 md:p-8 hover:border-[var(--champagne)]/60 transition-colors"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 size-[200px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[var(--champagne)]/[0.04] blur-[100px] transition-all duration-500 group-hover:scale-[1.3]"
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    <span className="font-[var(--font-mono)] text-[10.5px] tracking-[0.26em] uppercase text-[var(--champagne)] mb-3">
                      {["abu-dhabi", "ras-al-khaimah", "sharjah", "fujairah", "ajman"].includes(loc.slug) ? loc.name : "Dubai"}
                    </span>
                    <h2 className="font-[var(--font-display)] text-[clamp(1.3rem,2.2vw,1.7rem)] leading-[1.15] tracking-tight text-[var(--ink-hi)] mb-3">
                      {loc.name}
                    </h2>
                    <p className="text-[15px] leading-[1.7] text-[var(--ink-lo)] line-clamp-3">
                      {loc.intro}
                    </p>
                    <span className="mt-auto pt-5 inline-flex items-center gap-2 text-[13px] font-[var(--font-mono)] tracking-[0.04em] text-[var(--champagne)] group-hover:text-[var(--champagne-hi)] transition-colors">
                      View area
                      <svg width="13" height="9" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1">
                        <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
