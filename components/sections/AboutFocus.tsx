import Image from "next/image";
import Link from "next/link";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

const CAR_TYPES = [
  { label: "Sports", href: "/rent-sports-cars-dubai" },
  { label: "Convertibles", href: "/rent-convertible-cars-dubai" },
  { label: "Luxury", href: "/rent-luxury-cars-dubai" },
  { label: "SUV", href: "/rent-suv-cars-dubai" },
];

// Three ventures — H3 labels + body paragraphs verbatim from live /about-us/.
const VENTURES = [
  {
    h3: "LUXURY SUPERCAR RENTALS",
    body: "The Premier Luxury Supercars Rental in Dubai. With a fleet of more than 100 exclusive super cars to choose from!",
  },
  {
    h3: "LUXURY CHAUFFEUR DUBAI",
    body: "Specialised to provide high-end chauffeur services Dubai with the best 24/7 customer service experience.",
  },
  {
    h3: "Luxury Property Experts",
    body: "Real Estate Agency Specialized mostly in exclusive and luxurious properties in the UAE.",
  },
];

/**
 * "About me" — Ahmed portrait on the left, the verbatim live-site bio
 * paragraphs on the right, followed by the car-type chips and the three
 * venture cards. Consolidates what used to be two separate sections.
 *
 * Image expected at /public/images/ahmed-portrait.jpg (next/image rewrites
 * to /_next/image at runtime).
 */
export default function AboutFocus() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-28 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-1/3 size-[700px] rounded-full bg-[var(--champagne)]/[0.05] blur-[180px]"
      />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left — Ahmed portrait */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 bg-[var(--bg-graphite)]">
                <Image
                  src="/images/ahmed-portrait.jpg"
                  alt="Ahmed Amwell — Founder and CEO of Luxury Supercar Rentals Dubai"
                  fill
                  sizes="(min-width: 1024px) 38vw, 90vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
            </Reveal>
          </div>

          {/* Right — heading, bio, car types, ventures */}
          <div className="lg:col-span-7">
            <MaskHeading
              text="About me"
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)]"
              staggerMs={45}
            />

            {/* Verbatim bio paragraphs from live /about-us/ */}
            <Reveal>
              <p className="mt-8 text-[16px] md:text-[17px] leading-[1.85] text-[var(--ink-lo)]">
                I&rsquo;m Ahmed Amwell, the proud owner of Luxury Supercar
                Rentals, Dubai&rsquo;s superior destination for the most luxury
                and exclusive cars available. Join us as we showcase the latest
                supercars, share expert insights into the world of luxury
                automobiles, and take you behind the scenes of our iconic
                showroom.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 text-[16px] md:text-[17px] leading-[1.85] text-[var(--ink-lo)]">
                If you are looking to rent the latest luxury Car in Dubai,
                luxurysupercarsdubai.com is a one-stop destination for all. You
                can avail the widest range of the most exotic luxury cars,
                including everything from the latest Sports Cars, Convertible
                Cars, SUVs, Supercars, and Prestige Cars, all of which would
                surely provide you with a fascinating experience.
              </p>
            </Reveal>

            {/* Car types */}
            <div className="mt-10">
              <Reveal>
                <p className="font-[var(--font-mono)] text-[10.5px] tracking-[0.22em] uppercase text-[var(--ink-lo)] mb-4">
                  Car types
                </p>
              </Reveal>
              <div className="flex flex-wrap gap-2">
                {CAR_TYPES.map((t, i) => (
                  <Reveal key={t.label} className="rise" delay={i * 60}>
                    <Link
                      href={t.href}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12.5px] hover:border-[var(--champagne)]/60 hover:text-[var(--champagne-hi)] transition-colors"
                    >
                      {t.label}
                      <svg
                        width="11"
                        height="8"
                        viewBox="0 0 14 10"
                        fill="none"
                        aria-hidden
                        className="opacity-60"
                      >
                        <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Three ventures — H3 labels preserved verbatim from live /about-us/ */}
            <div className="mt-10">
              <Reveal>
                <p className="font-[var(--font-mono)] text-[10.5px] tracking-[0.22em] uppercase text-[var(--ink-lo)] mb-5">
                  Company types
                </p>
              </Reveal>
              <div className="grid md:grid-cols-3 gap-4">
                {VENTURES.map((v, i) => (
                  <Reveal
                    key={v.h3}
                    className="rise rounded-xl border border-white/8 bg-[var(--bg-graphite)]/40 p-5 hover:border-[var(--champagne)]/40 transition-colors"
                    delay={i * 100}
                  >
                    <h3 className="font-[var(--font-display)] text-[16px] leading-tight tracking-tight text-[var(--ink-hi)] mb-3">
                      {v.h3}
                    </h3>
                    <p className="text-[13px] leading-[1.7] text-[var(--ink-lo)]">
                      {v.body}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
