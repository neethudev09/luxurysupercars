import Link from "next/link";
import CarCard from "@/components/cards/CarCard";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import type { Car } from "@/lib/fleet";

interface FleetSectionProps {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  cars: Car[];
  ctaLabel: string;
  ctaHref?: string;
  theme?: "dark" | "light";
}

export default function FleetSection({
  id,
  eyebrow,
  heading,
  body,
  cars,
  ctaLabel,
  ctaHref = "#contact",
  theme = "dark",
}: FleetSectionProps) {
  const isLight = theme === "light";
  return (
    <section
      id={id}
      className={`relative ${
        isLight
          ? "bg-[var(--bg-pearl)] text-[var(--ink-dark-hi)]"
          : "bg-[var(--bg-obsidian)] text-[var(--ink-hi)]"
      } py-20 md:py-24 overflow-hidden`}
    >
      <div className="container-x">
        <header className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-12">
          <div className="md:col-span-7">
            <MaskHeading
              text={heading}
              as="h2"
              className={`font-[var(--font-display)] text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.06] tracking-[-0.018em] ${
                isLight ? "text-[var(--ink-dark-hi)]" : "text-[var(--ink-hi)]"
              }`}
              staggerMs={45}
            />
          </div>
          <div className={`md:col-span-5 md:pl-8 md:border-l ${isLight ? "md:border-black/5" : "md:border-white/[0.06]"}`}>
            <p className={`text-[14.5px] leading-[1.7] ${isLight ? "text-[var(--ink-dark-lo)]" : "text-[var(--ink-lo)]"}`}>
              {body}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {cars.map((car, i) => (
            <CarCard key={`${car.name}-${i}`} car={car} theme={theme} index={i} />
          ))}
        </div>

        <Reveal className="mt-10 md:mt-12 flex justify-center md:justify-end">
          <Link
            href={ctaHref}
            className={`group inline-flex w-full md:w-auto items-center justify-center md:justify-start gap-2.5 rounded-full px-5 py-3.5 md:py-2.5 text-[13.5px] md:text-[12.5px] font-medium tracking-wide transition-all ${
              isLight
                ? "border border-[var(--ink-dark-hi)]/20 text-[var(--ink-dark-hi)] hover:bg-[var(--ink-dark-hi)] hover:text-[var(--bg-bone)]"
                : "border border-white/15 text-[var(--ink-hi)] hover:bg-[var(--champagne)] hover:text-[var(--bg-obsidian)] hover:border-[var(--champagne)]"
            }`}
          >
            {ctaLabel}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </Link>
        </Reveal>
      </div>

      {/* Decorative oversized faded category numeral */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-10 -bottom-20 font-[var(--font-display)] font-semibold select-none ${
          isLight ? "text-[var(--ink-dark-hi)]/4" : "text-[var(--champagne)]/5"
        }`}
        style={{ fontSize: "clamp(14rem, 30vw, 28rem)", lineHeight: 1 }}
      >
        {eyebrow.slice(0, 1)}
      </div>
    </section>
  );
}
