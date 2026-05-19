import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import FleetTypeHero from "@/components/sections/FleetTypeHero";
import FleetBrandAbout from "@/components/sections/FleetBrandAbout";
import FleetExplorer from "@/components/fleet/FleetExplorer";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { CONTACT } from "@/lib/content";
import type { Car } from "@/lib/fleet";
import type { FleetBrandMeta } from "@/lib/fleet-brands";

interface FleetBrandPageBodyProps {
  meta: FleetBrandMeta;
  cars: Car[];
}

/**
 * Shared shell for /brands/rent-{brand}-dubai routes. Each brand page
 * supplies its own FleetBrandMeta + pre-filtered car list. The Brand
 * filter group in the sidebar is hidden since the route locks it.
 *
 * If the brand has zero cars in our data (e.g. Aston Martin, BMW,
 * Cadillac, Maserati, Range Rover), the explorer is replaced with a
 * concierge-style empty state so the page still surfaces its SEO
 * content without showing an empty grid.
 */
export default function FleetBrandPageBody({ meta, cars }: FleetBrandPageBodyProps) {
  const hasCars = cars.length > 0;

  return (
    <main>
      <SiteNav />
      <FleetTypeHero visibleTitle={meta.visibleTitle} h1={meta.h1} />

      {hasCars ? (
        <FleetExplorer cars={cars} hideBrandFilter />
      ) : (
        <BrandEmptyState brandName={meta.displayName} />
      )}

      <FleetBrandAbout brandName={meta.displayName} sections={meta.sections} />
      <Testimonials />
      {meta.faqHeading && meta.faqs.length > 0 && (
        <FAQ heading={meta.faqHeading} items={meta.faqs} />
      )}
      <Contact />
      <Footer />
    </main>
  );
}

function BrandEmptyState({ brandName }: { brandName: string }) {
  const waNumber = CONTACT.primaryPhone.replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Hi, I'd like to enquire about renting a ${brandName} in Dubai. Could you share availability?`,
  );
  const waHref = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-6 md:pt-8 pb-16 md:pb-20">
      <div className="container-x">
        <div className="relative flex flex-col items-center justify-center text-center py-20 md:py-28 rounded-2xl border border-white/10 bg-[var(--bg-graphite)]/40 overflow-hidden">
          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[var(--champagne)]/[0.04] blur-3xl" />
          <span className="relative font-[var(--font-mono)] text-[10.5px] tracking-[0.28em] uppercase text-[var(--champagne)] mb-4">
            Available on request
          </span>
          <h2 className="relative font-[var(--font-display)] text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight tracking-tight mb-3 text-balance max-w-xl">
            {brandName} models reserved for our concierge clients
          </h2>
          <p className="relative text-[14px] text-[var(--ink-lo)] max-w-md mb-7">
            We curate select {brandName} vehicles by request. Reach out and our
            team will source the exact model, trim, and timing you have in mind.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--champagne-hi)] transition-colors"
            >
              WhatsApp the team
            </a>
            <Link
              href="/our-fleet"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[12.5px] hover:border-[var(--champagne)]/60 transition-colors"
            >
              Browse the wider fleet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
