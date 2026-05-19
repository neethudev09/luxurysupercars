import Link from "next/link";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

const CAR_TYPES = [
  { label: "Sports", href: "/rent-sports-cars-dubai" },
  { label: "Convertibles", href: "/rent-convertible-cars-dubai" },
  { label: "Luxury", href: "/rent-luxury-cars-dubai" },
  { label: "SUV", href: "/rent-suv-cars-dubai" },
];

// Verbatim "ventures" copy from the live /about-us/ page
const VENTURES = [
  {
    label: "Luxury Supercar Rentals",
    body: "The Premier Luxury Supercars Rental in Dubai. With a fleet of more than 100 exclusive super cars to choose from!",
  },
  {
    label: "Chauffeur Services",
    body: "Specialised to provide high-end chauffeur services Dubai with the best 24/7 customer service experience.",
  },
  {
    label: "Real Estate",
    body: "Real Estate Agency Specialized mostly in exclusive and luxurious properties in the UAE.",
  },
];

/**
 * Image-left / text-right block. Replaces the carent reference's
 * "Focused on quality" section. The right column carries our car-type
 * shortcuts plus the verbatim three-ventures copy from live /about-us/.
 */
export default function AboutFocus() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-28 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-1/3 size-[700px] rounded-full bg-[var(--champagne)]/[0.05] blur-[180px]"
      />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left — image placeholder (swap for hero asset once supplied) */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[var(--bg-graphite)] via-[var(--bg-obsidian)] to-black">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-30deg, transparent 0 36px, rgba(201,168,106,0.06) 36px 37px)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-12 -right-12 size-[400px] rounded-full bg-[var(--champagne)]/[0.12] blur-[140px]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
                  <span className="font-[var(--font-mono)] text-[10px] tracking-[0.26em] uppercase text-[var(--ink-lo)]">
                    Image · placeholder
                  </span>
                  <span className="font-[var(--font-display)] text-[clamp(1.4rem,2vw,1.8rem)] leading-tight tracking-tight text-[var(--ink-hi)]/70 max-w-[14ch]">
                    Showroom, fleet hero or founder portrait
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — text + types + ventures */}
          <div className="lg:col-span-7">
            <MaskHeading
              text="Focused on **quality**, built for your convenience"
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)] text-balance"
              staggerMs={45}
            />

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

            {/* Three ventures */}
            <div className="mt-10">
              <Reveal>
                <p className="font-[var(--font-mono)] text-[10.5px] tracking-[0.22em] uppercase text-[var(--ink-lo)] mb-5">
                  Company types
                </p>
              </Reveal>
              <div className="grid md:grid-cols-3 gap-4">
                {VENTURES.map((v, i) => (
                  <Reveal
                    key={v.label}
                    className="rise rounded-xl border border-white/8 bg-[var(--bg-graphite)]/40 p-5 hover:border-[var(--champagne)]/40 transition-colors"
                    delay={i * 100}
                  >
                    <p className="font-[var(--font-display)] text-[16px] leading-tight tracking-tight text-[var(--ink-hi)] mb-3">
                      {v.label}
                    </p>
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
