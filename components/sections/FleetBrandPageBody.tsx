import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import FleetTypeHero from "@/components/sections/FleetTypeHero";
import FleetBrandAbout from "@/components/sections/FleetBrandAbout";
import FleetExplorer from "@/components/fleet/FleetExplorer";
import BrandJsonLd from "@/components/seo/BrandJsonLd";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import { CONTACT } from "@/lib/content";
import Footer from "@/components/sections/Footer";
import type { Car } from "@/lib/fleet";
import type { FleetBrandMeta } from "@/lib/fleet-brands";

interface FleetBrandPageBodyProps {
  meta: FleetBrandMeta;
  cars: Car[];
}

export default function FleetBrandPageBody({ meta, cars }: FleetBrandPageBodyProps) {
  const hasCars = cars.length > 0;
  const brand = meta.displayName;

  return (
    <main>
      <BrandJsonLd meta={meta} cars={cars} />
      <SiteNav />
      <FleetTypeHero visibleTitle={meta.visibleTitle} h1={meta.h1} />

      {meta.quickAnswer && <QuickAnswer text={meta.quickAnswer} />}
      <TrustBadges />

      {hasCars ? (
        <FleetExplorer cars={cars} hideBrandFilter />
      ) : (
        <BrandEmptyState brandName={brand} />
      )}

      <FleetBrandAbout brandName={brand} sections={meta.sections} />
      <CtaBeforeReviews brandName={brand} />
      <Testimonials />
      {meta.faqHeading && meta.faqs.length > 0 && (
        <FAQ heading={meta.faqHeading} items={meta.faqs} />
      )}
      <Footer />
    </main>
  );
}

function QuickAnswer({ text }: { text: string }) {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-2 pb-8 md:pb-10">
      <div className="container-x">
        <div className="max-w-3xl">
          <p className="text-[17px] leading-[1.8] text-[var(--ink-lo)]">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}

function TrustBadges() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pb-10 md:pb-12 -mt-2">
      <div className="container-x">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
          {[
            "Free Dubai Delivery",
            "Basic Insurance Included",
            "Daily \u2022 Weekly \u2022 Monthly Rental",
            "24/7 Support",
            "Instant WhatsApp Booking",
          ].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-[13px] font-[var(--font-mono)] tracking-[0.04em] text-[var(--ink-lo)]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#C6A47E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBeforeReviews({ brandName }: { brandName: string }) {
  const waNumber = CONTACT.primaryPhone.replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Hi, I'd like to enquire about renting a ${brandName} in Dubai. Could you share availability?`,
  );
  const waHref = `https://wa.me/${waNumber}?text=${waMessage}`;
  const telHref = `tel:${CONTACT.primaryPhone}`;

  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-16 md:py-20 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--champagne)]/[0.05] blur-[140px]"
      />
      <div className="container-x relative text-center">
        <h2 className="font-[var(--font-display)] text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight tracking-tight mb-3 text-balance">
          Ready to Drive a {brandName}?
        </h2>
        <p className="text-[16.5px] leading-[1.8] text-[var(--ink-lo)] max-w-lg mx-auto mb-8">
          Book your {brandName} today with free Dubai delivery.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={telHref}
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-5 py-3 text-[13px] font-[var(--font-mono)] tracking-[0.06em] hover:border-[var(--champagne)]/60 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M12.5 9.85v1.65c0 .55-.45 1-1 1A10.5 10.5 0 0 1 1.5 2c0-.55.45-1 1-1H4.15c.45 0 .85.3.96.74l.6 2.4a1 1 0 0 1-.26.95L4.4 6.13a8.5 8.5 0 0 0 3.47 3.47l1.04-1.05c.25-.25.6-.35.95-.26l2.4.6c.44.1.74.5.74.96z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Call {CONTACT.primaryPhone}
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-5 py-3 text-[13px] font-[var(--font-mono)] tracking-[0.06em] font-medium hover:bg-[var(--champagne-hi)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M13.6 2.32A7.85 7.85 0 0 0 8.02 0C3.6 0 0 3.6 0 8.02c0 1.41.37 2.79 1.07 4.01L0 16l4.09-1.07a8.04 8.04 0 0 0 3.92 1c4.42 0 8.02-3.6 8.02-8.02 0-2.14-.83-4.16-2.43-5.6zM8.02 14.66a6.65 6.65 0 0 1-3.4-.93l-.24-.14-2.43.63.65-2.37-.16-.25a6.65 6.65 0 0 1-1.02-3.55c0-3.68 3-6.68 6.68-6.68a6.65 6.65 0 0 1 6.68 6.68c0 3.68-3 6.68-6.68 6.68zm3.66-5c-.2-.1-1.18-.58-1.36-.65-.18-.07-.32-.1-.45.1-.13.2-.52.65-.64.78-.12.13-.23.15-.43.05a5.45 5.45 0 0 1-1.6-.99 6.04 6.04 0 0 1-1.11-1.38c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.34.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12 0-.25-.01-.39-.01a.74.74 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .98.72 1.93.82 2.07.1.13 1.41 2.16 3.42 3.03.48.21.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.18-.48 1.35-.95.16-.46.16-.86.12-.95-.05-.08-.18-.13-.38-.23z" />
            </svg>
            WhatsApp
          </a>
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[13px] font-[var(--font-mono)] tracking-[0.06em] hover:border-[var(--champagne)]/60 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 9a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.3" />
              <path d="M12 7A5 5 0 112 7a5 5 0 0110 0z" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Enquire Now
          </Link>
        </div>
      </div>
    </section>
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
          <p className="relative text-[16px] text-[var(--ink-lo)] max-w-md mb-7">
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
