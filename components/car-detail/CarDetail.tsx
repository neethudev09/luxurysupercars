import Link from "next/link";
import type { Car } from "@/lib/fleet";
import { getCarGallery } from "@/lib/fleet";
import { CONTACT } from "@/lib/content";
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

const STROKE = {
  width: 12,
  height: 12,
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const EngineIcon = () => (
  <svg {...STROKE} aria-hidden>
    <rect x="2" y="4.5" width="10" height="6" rx="0.5" />
    <path d="M4 4.5V2.5M7 4.5V2.5M10 4.5V2.5M2 7h-1M13 7h-1" />
  </svg>
);
const SpeedIcon = () => (
  <svg {...STROKE} aria-hidden>
    <circle cx="7" cy="8.5" r="4.4" />
    <path d="M7 8.5L9 6M7 1.5V1M5.5 1h3" />
  </svg>
);
const PowerIcon = () => (
  <svg {...STROKE} aria-hidden>
    <path d="M7.5 1L3 8h3l-.5 5L10 6H7l.5-5z" />
  </svg>
);
const DoorIcon = () => (
  <svg {...STROKE} aria-hidden>
    <path d="M3 12V2.6l8-1V12M3 12h8" />
    <circle cx="9" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const SeatIcon = () => (
  <svg {...STROKE} aria-hidden>
    <path d="M5 1.5v6.5h5M3.5 11h7M10 8v3" />
  </svg>
);

function InlineSpec({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="shrink-0 text-[var(--champagne)] opacity-90">{icon}</span>
      <span>{value}</span>
    </span>
  );
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

  return (
    <main className="bg-[var(--bg-obsidian)] text-[var(--ink-hi)] min-h-screen">
      <SiteNav />

      {/* Breadcrumb */}
      <div className="container-x pt-[100px] md:pt-[140px] pb-4">
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
      <section className="container-x pb-10 md:pb-14">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className={RENTAL_CARD_PLACEMENT === "hero" ? "md:col-span-8" : "md:col-span-12"}>
            <MaskHeading
              text={car.name}
              as="h1"
              className="font-[var(--font-display)] font-medium text-[clamp(2rem,5.5vw,4.5rem)] leading-[1] tracking-[-0.025em] text-[var(--ink-hi)]"
              staggerMs={55}
              breakAfterBold={false}
            />
            <Reveal
              className="rise mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 max-w-2xl text-[12.5px] leading-none text-[var(--ink-lo)] font-[var(--font-mono)] uppercase tracking-[0.08em]"
              delay={350}
            >
              {car.engine && <InlineSpec icon={<EngineIcon />} value={car.engine} />}
              {car.zeroToHundred && (
                <InlineSpec icon={<SpeedIcon />} value={`0–100 ${car.zeroToHundred}`} />
              )}
              {car.horsepower && (
                <InlineSpec icon={<PowerIcon />} value={car.horsepower} />
              )}
              {car.seats > 0 && (
                <InlineSpec icon={<SeatIcon />} value={`${car.seats} seats`} />
              )}
              {car.doors > 0 && (
                <InlineSpec icon={<DoorIcon />} value={`${car.doors} doors`} />
              )}
            </Reveal>
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
          <p className="mt-5 text-[14.5px] leading-[1.7] text-[var(--ink-lo)]">
            Free delivery anywhere in Dubai, 24/7 concierge, transparent pricing. Reach out and we&apos;ll have the keys waiting.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-medium tracking-wide text-[var(--bg-obsidian)] hover:bg-white/90 transition-colors"
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
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3 text-[13px] font-medium hover:bg-[#1ebe5d] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M13.6 2.32A7.85 7.85 0 0 0 8.02 0C3.6 0 0 3.6 0 8.02c0 1.41.37 2.79 1.07 4.01L0 16l4.09-1.07a8.04 8.04 0 0 0 3.92 1c4.42 0 8.02-3.6 8.02-8.02 0-2.14-.83-4.16-2.43-5.6zM8.02 14.66a6.65 6.65 0 0 1-3.4-.93l-.24-.14-2.43.63.65-2.37-.16-.25a6.65 6.65 0 0 1-1.02-3.55c0-3.68 3-6.68 6.68-6.68a6.65 6.65 0 0 1 6.68 6.68c0 3.68-3 6.68-6.68 6.68z" />
              </svg>
              WhatsApp Us
            </a>
            <a
              href={`tel:${waNumber}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 text-[var(--ink-hi)] px-6 py-3 text-[13px] font-medium hover:bg-white/5 transition-colors"
            >
              Call {CONTACT.primaryPhone}
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Scroll-aware sticky enquire bar */}
      <StickyEnquireBar car={car} />
    </main>
  );
}
