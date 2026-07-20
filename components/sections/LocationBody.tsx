import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import type { LocationMeta } from "@/lib/locations";

interface LocationBodyProps {
  location: LocationMeta;
}

export default function LocationBody({ location }: LocationBodyProps) {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-16 md:py-24 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--champagne)]/[0.05] blur-[140px]"
      />

      <div className="container-x relative space-y-14 md:space-y-20">
        {/* Intro */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="font-[var(--font-mono)] text-[10.5px] tracking-[0.26em] uppercase text-[var(--ink-lo)] mb-3">
                About
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <p className="text-[17px] md:text-[18px] leading-[1.8] text-[var(--ink-lo)]">
                {location.intro}
              </p>
            </Reveal>
          </div>
        </div>

        {/* Why Rent */}
        {location.whyRent.length > 0 && (
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-5">
              <Reveal>
                <h2 className="font-[var(--font-display)] text-[clamp(1.3rem,2.4vw,1.8rem)] leading-[1.15] tracking-[-0.018em] text-[var(--ink-hi)] text-balance">
                  Why Rent in {location.name}?
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <ul className="space-y-4">
                {location.whyRent.map((item, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <li className="flex items-start gap-3 text-[16px] leading-[1.7] text-[var(--ink-lo)]">
                      <svg className="mt-1.5 shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#C6A47E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Hotels */}
        {location.hotels.length > 0 && (
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-5">
              <Reveal>
                <h2 className="font-[var(--font-display)] text-[clamp(1.3rem,2.4vw,1.8rem)] leading-[1.15] tracking-[-0.018em] text-[var(--ink-hi)] text-balance">
                  Hotels We Deliver To
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {location.hotels.map((hotel, i) => (
                    <li key={i} className="flex items-center gap-2 text-[15px] leading-[1.6] text-[var(--ink-lo)]">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className="shrink-0">
                        <circle cx="5" cy="5" r="3" fill="#C6A47E" opacity="0.6" />
                      </svg>
                      {hotel}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        )}

        {/* Attractions */}
        {location.attractions.length > 0 && (
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-5">
              <Reveal>
                <h2 className="font-[var(--font-display)] text-[clamp(1.3rem,2.4vw,1.8rem)] leading-[1.15] tracking-[-0.018em] text-[var(--ink-hi)] text-balance">
                  Attractions & Things to Do
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal>
                <ul className="space-y-3">
                  {location.attractions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.7] text-[var(--ink-lo)]">
                      <span className="mt-[5px] shrink-0 size-1.5 rounded-full bg-[var(--champagne)]/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        )}

        {/* Popular Brands */}
        {location.popularBrands.length > 0 && (
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-5">
              <Reveal>
                <h2 className="font-[var(--font-display)] text-[clamp(1.3rem,2.4vw,1.8rem)] leading-[1.15] tracking-[-0.018em] text-[var(--ink-hi)] text-balance">
                  Popular Brands in {location.name}
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal>
                <div className="flex flex-wrap gap-3">
                  {location.popularBrands.map((brand) => (
                    <Link
                      key={brand.name}
                      href={brand.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-[var(--font-mono)] tracking-[0.04em] text-[var(--ink-lo)] hover:border-[var(--champagne)]/60 hover:text-[var(--champagne)] transition-colors"
                    >
                      {brand.name}
                      <svg width="10" height="8" viewBox="0 0 14 10" fill="none" className="opacity-40">
                        <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        )}

        {/* Nearby Areas */}
        {location.nearby && location.nearby.length > 0 && (
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-5">
              <Reveal>
                <h2 className="font-[var(--font-display)] text-[clamp(1.3rem,2.4vw,1.8rem)] leading-[1.15] tracking-[-0.018em] text-[var(--ink-hi)] text-balance">
                  Nearby Areas
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <Reveal>
                <div className="flex flex-wrap gap-3">
                  {location.nearby.map((area) => (
                    <Link
                      key={area.name}
                      href={area.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[13px] font-[var(--font-mono)] tracking-[0.04em] text-[var(--ink-lo)] hover:border-[var(--champagne)]/60 hover:text-[var(--champagne)] transition-colors"
                    >
                      {area.name}
                      <svg width="10" height="8" viewBox="0 0 14 10" fill="none" className="opacity-40">
                        <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
