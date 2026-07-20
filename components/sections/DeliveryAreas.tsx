import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import { getAllLocations } from "@/lib/locations";

export default function DeliveryAreas() {
  const locations = getAllLocations();

  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-24 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/3 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--champagne)]/[0.04] blur-[140px]"
      />
      <div className="container-x relative">
        <Reveal>
          <p className="font-[var(--font-mono)] text-[10.5px] tracking-[0.26em] uppercase text-[var(--champagne)] mb-4">
            Delivery areas
          </p>
        </Reveal>
        <Reveal>
          <MaskHeading
            text="We **deliver** across **Dubai**"
            as="h2"
            breakAfterBold={false}
            className="font-[var(--font-display)] text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-[-0.018em] text-[var(--ink-hi)] text-balance max-w-2xl mb-4"
            staggerMs={40}
          />
        </Reveal>
        <Reveal>
          <p className="text-[16.5px] leading-[1.8] text-[var(--ink-lo)] max-w-xl mb-10">
            Free delivery to every major Dubai district. Your car, wherever you are - hotel, residence, office or airport.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {locations.map((loc, i) => (
            <Reveal key={loc.slug} delay={i * 40}>
              <Link
                href={`/locations/${loc.slug}`}
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[14px] leading-snug text-[var(--ink-lo)] hover:border-[var(--champagne)]/60 hover:text-[var(--champagne)] hover:bg-white/[0.06] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                  <path d="M6 11S10 7.5 10 5a4 4 0 1 0-8 0c0 2.5 4 6 4 6z" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="6" cy="5" r="1.2" fill="currentColor" stroke="none" />
                </svg>
                <span>{loc.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-10">
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[13px] font-[var(--font-mono)] tracking-[0.04em] hover:border-[var(--champagne)]/60 hover:text-[var(--champagne)] transition-colors"
            >
              View all delivery areas
              <svg width="13" height="9" viewBox="0 0 14 10" fill="none">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
