import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/lib/fleet";
import { getCarGallery } from "@/lib/fleet";
import { CONTACT } from "@/lib/content";
import { getBrandLogo } from "@/lib/assets";
import SiteNav from "@/components/nav/SiteNav";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import CarGallery from "./CarGallery";
import SpecGrid from "./SpecGrid";
import FeaturesGrid from "./FeaturesGrid";
import CarDescription from "./CarDescription";
import RelatedCars from "./RelatedCars";
import StickyEnquireBar from "./StickyEnquireBar";
import RentalCard from "./RentalCard";
import FleetEnquiryDialog from "./FleetEnquiryDialog";
import FAQ from "@/components/sections/FAQ";
import type { FAQItem } from "@/components/sections/FAQ";

function carFaqs(car: Car): FAQItem[] {
  const b = car.brandName;
  const n = car.name;
  const p = car.price ? `AED ${car.price.toLocaleString()}/day` : "varies by season";
  const dp = car.deposit || "AED 5,000–10,000";
  const eng = car.engine || "a high-performance engine";
  const perf = car.zeroToHundred ? `0–100 km/h in ${car.zeroToHundred}` : "blistering acceleration";
  const ts = car.topSpeed ? `a top speed of ${car.topSpeed}` : "an exhilarating top speed";
  const seats = car.seats ? `${car.seats} passengers` : "two";
  const drs = car.doors ? `${car.doors} doors` : "two";
  const bg = car.baggage || "light luggage";

  return [
    {
      q: `What makes the ${n} special?`,
      a: `The ${n} is a ${car.category} vehicle from ${b}, powered by ${eng} delivering ${perf} and ${ts}. With seating for ${seats} and ${drs}, it strikes a balance between performance and practicality that makes it one of the most popular ${b} models available for rental in Dubai.`
    },
    {
      q: `How much does it cost to rent the ${n} in Dubai?`,
      a: `The ${n} is available from ${p}. A refundable security deposit of ${dp} is held on your credit card at pickup and released after the rental. All rates include insurance with a Collision Damage Waiver and free delivery within Dubai.`
    },
    {
      q: `What documents do I need to rent the ${n}?`,
      a: `Tourists need a valid passport, home-country driving licence (plus an International Driving Permit if your country isn't RTA-exempt), and a credit card in the driver's name. UAE residents need a valid Emirates ID and UAE driving licence. The minimum age to rent this ${b} model is typically 25, though some luxury vehicles are available from 21.`
    },
    {
      q: `Can tourists rent the ${n} in Dubai?`,
      a: `Yes. Tourists from the US, UK, Canada, Australia, and most of the EU can rent the ${n} using their home driving licence directly. Drivers from other countries need an International Driving Permit arranged before travel. The car is delivered free to your hotel, villa, or Dubai Airport.`
    },
    {
      q: `What fuel does the ${n} use?`,
      a: `Like all supercars in Dubai, the ${n} requires premium "Super 98" octane petrol. The rental includes a full tank at handover — return it at the same level. Fuel stations are widely available across Dubai, with ADNOC, ENOC, and EPPCO stations on every major route.`
    },
    {
      q: `How many people can the ${n} accommodate?`,
      a: `The ${n} seats ${seats} with ${drs} and ${bg} capacity. It is ideal for couples, solo travellers, or small groups looking to experience Dubai in a premium ${b} vehicle.`
    },
    {
      q: `What is the performance of the ${n}?`,
      a: `The ${n} features ${eng} delivering ${perf} and ${ts}. The ${car.transmission || "automatic"} transmission and ${car.driveType || "rear-wheel"} drivetrain make it well-suited to Dubai's smooth highways and Sheikh Zayed Road cruising.`
    },
    {
      q: `Where can I drive the ${n} in Dubai?`,
      a: `The ${n} is perfect for Sheikh Zayed Road sunset cruises, Palm Jumeirah arrivals, Dubai Marina coastal drives, and the Abu Dhabi E11 highway. For a longer road trip, Jebel Jais in Ras Al Khaimah is a popular 90-minute drive. All rental insurance covers the entire UAE. Off-road driving is strictly prohibited.`
    },
    {
      q: `Is delivery available for the ${n} rental?`,
      a: `Yes. Free delivery is included for the ${n} across all major Dubai locations — Dubai Marina, Downtown, Palm Jumeirah, Business Bay, DIFC, JBR, Dubai Airport, Al Barsha, JVC, and Emirates Hills. We also deliver to Abu Dhabi, Sharjah, and Ras Al Khaimah.`
    },
  ];
}

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
          brand={car.brand}
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

      {/* Car-specific FAQs — unique per model to avoid duplicate content */}
      <FAQ
        heading={`${car.brandName} ${car.name} — FAQs`}
        subheading={`**Everything** you need to know about renting the **${car.name}** in Dubai`}
        items={carFaqs(car)}
        cta={null}
      />

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
            <FleetEnquiryDialog
              carName={car.name}
              brandName={car.brandName}
              pagePath={`/${car.brand}/${car.slug}`}
              buttonClassName="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3 text-[15px] font-medium tracking-wide text-[var(--bg-obsidian)] transition-colors hover:bg-white/90"
            >
              Send enquiry
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </FleetEnquiryDialog>
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


      {/* Persistent car CTA — fixed to the bottom, overlaid on content */}
      <StickyEnquireBar car={car} />
    </main>
  );
}
