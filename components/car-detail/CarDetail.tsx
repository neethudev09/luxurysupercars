import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/fleet";
import { getCarGallery } from "@/lib/fleet";
import { CONTACT } from "@/lib/content";
import { getBrandLogo } from "@/lib/assets";
import SiteNav from "@/components/nav/SiteNav";
import Footer from "@/components/sections/Footer";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import CarGallery from "./CarGallery";
import SpecGrid from "./SpecGrid";
import FeaturesGrid from "./FeaturesGrid";
import CarDescription from "./CarDescription";
import RelatedCars from "./RelatedCars";
import StickyEnquireBar from "./StickyEnquireBar";
import RentalCard from "./RentalCard";
import FAQ from "@/components/sections/FAQ";

/**
 * Where the rental card (price + deposit/mileage/extra-km + CTAs) lives.
 *   "hero"  — top-right of the hero (original layout)
 *   "specs" — sticky aside next to the Specifications grid
 *
 * Flip this one constant to switch layouts. The other slot collapses
 * gracefully so there's no orphaned markup either way.
 */
const RENTAL_CARD_PLACEMENT: "hero" | "specs" = "specs";

interface CarDetailProps {
  car: Car;
  related: Car[];
}

const categoryLabel: Record<Car["category"], string> = {
  sports: "Sports",
  convertible: "Convertibles",
  luxury: "Luxury",
  suv: "SUVs",
};

const categoryAnchor: Record<Car["category"], string> = {
  sports: "/rent-sports-cars-dubai",
  convertible: "/rent-convertible-cars-dubai",
  luxury: "/rent-luxury-cars-dubai",
  suv: "/rent-suv-cars-dubai",
};

export default function CarDetail({ car, related }: CarDetailProps) {
  const waNumber = CONTACT.primaryPhone.replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Hi, I'm interested in renting the ${car.name}. Could you share availability and pricing?`,
  );
  const waHref = `https://wa.me/${waNumber}?text=${waMessage}`;
  const brandLogo = getBrandLogo(car.brand);

  return (
    <main className="bg-[var(--bg-obsidian)] text-[var(--ink-hi)] min-h-screen">
      <SiteNav />

      {/* Breadcrumb */}
      <div className="container-car pt-[100px] md:pt-[140px] pb-4">
        <nav
          aria-label="Breadcrumb"
          className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--ink-lo)] flex items-center gap-2 flex-wrap"
        >
          <Link href="/" className="hover:text-[var(--champagne)] transition-colors">Home</Link>
          <span className="opacity-50">/</span>
          <Link href={categoryAnchor[car.category]} className="hover:text-[var(--champagne)] transition-colors">
            {categoryLabel[car.category]}
          </Link>
          <span className="opacity-50">/</span>
          <span className="text-[var(--ink-hi)]">{car.name}</span>
        </nav>
      </div>

      {/* Hero gallery — swipeable carousel */}
      <div id="detail-hero">
        <CarGallery
          images={getCarGallery(car)}
          alt={`${car.name} — ${car.color ?? car.category} luxury car rental Dubai`}
          category={car.category}
        />
      </div>

      {/* Headline + price + CTAs */}
      <section className="container-car pb-10 md:pb-14">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className={RENTAL_CARD_PLACEMENT === "hero" ? "md:col-span-8" : "md:col-span-12"}>
            <div className="flex items-center justify-between gap-5 md:gap-8">
              <MaskHeading
                text={car.name}
                as="h1"
                className="min-w-0 font-[var(--font-display)] font-medium text-[clamp(2rem,5.5vw,4.5rem)] leading-[1] tracking-[-0.025em] text-[var(--ink-hi)]"
                staggerMs={55}
                breakAfterBold={false}
              />
              {brandLogo && (
                <div className="relative shrink-0 h-16 w-28 md:h-20 md:w-36">
                  <Image
                    src={brandLogo.src}
                    alt={`${car.brandName} logo`}
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {RENTAL_CARD_PLACEMENT === "hero" && (
            <Reveal className="rise md:col-span-4" delay={500}>
              <RentalCard car={car} className="md:ml-auto md:max-w-sm" />
            </Reveal>
          )}
        </div>
      </section>

      {/* Spec grid */}
      <div id="specs">
        <SpecGrid
          car={car}
          aside={RENTAL_CARD_PLACEMENT === "specs" ? <RentalCard car={car} /> : undefined}
        />
      </div>

      {/* Features grid */}
      <FeaturesGrid features={car.featureLabels} />

      {/* SEO description (long-form) */}
      <CarDescription car={car} />

      {/* Related cars */}
      <RelatedCars cars={related} category={car.category} />

      {/* Rental FAQs — renders the same Q&A that the global FAQPage schema
          (components/seo/JsonLd.tsx) already emits, so the structured data is
          backed by visible, crawlable content. Mirrors the live car pages,
          which carried this "Everything You Need To Know" block. */}
      <FAQ />

      {/* Final CTA */}
      <section id="enquire" className="bg-[var(--bg-obsidian)] py-20 md:py-24 border-t border-white/5">
        <div className="container-x max-w-3xl text-center">
          <MaskHeading
            text={`Ready to drive the **${car.name}**?`}
            as="h2"
            className="font-[var(--font-display)] font-medium text-[clamp(1.8rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)]"
            staggerMs={45}
            breakAfterBold={false}
          />
          <p className="mt-5 text-[16.5px] leading-[1.7] text-[var(--ink-lo)]">
            Free delivery anywhere in Dubai, 24/7 concierge, transparent pricing. Reach out and we&apos;ll have the keys waiting.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[15px] font-medium tracking-wide text-[var(--bg-obsidian)] hover:bg-white/90 transition-colors"
            >
              Send enquiry
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-[15px] font-medium hover:bg-[#1ebe5d] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M13.6 2.32A7.85 7.85 0 0 0 8.02 0C3.6 0 0 3.6 0 8.02c0 1.41.37 2.79 1.07 4.01L0 16l4.09-1.07a8.04 8.04 0 0 0 3.92 1c4.42 0 8.02-3.6 8.02-8.02 0-2.14-.83-4.16-2.43-5.6zM8.02 14.66a6.65 6.65 0 0 1-3.4-.93l-.24-.14-2.43.63.65-2.37-.16-.25a6.65 6.65 0 0 1-1.02-3.55c0-3.68 3-6.68 6.68-6.68a6.65 6.65 0 0 1 6.68 6.68c0 3.68-3 6.68-6.68 6.68z" />
              </svg>
              WhatsApp Us
            </a>
            <a
              href={`tel:${waNumber}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 text-[var(--ink-hi)] px-6 py-3 text-[15px] font-medium hover:bg-white/5 transition-colors"
            >
              Call {CONTACT.primaryPhone}
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Persistent car CTA — fixed to the bottom, overlaid on content */}
      <StickyEnquireBar car={car} />
    </main>
  );
}
