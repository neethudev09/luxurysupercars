import Link from "next/link";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

/**
 * Verbatim from the live luxurysupercarsdubai.com homepage. Twelve
 * brand-page link tiles displayed in a 3-column grid below the
 * Requirements section. The tile styling mirrors the Features & Comfort
 * box on the car detail page (rounded-xl border, dark surface, no icon).
 */
const RENTAL_LINKS: { label: string; href: string }[] = [
  { label: "Rent Ferrari in Dubai",       href: "/brands/rent-ferrari-dubai" },
  { label: "Rent Audi in Dubai",          href: "/brands/rent-audi-dubai" },
  { label: "Rent Aston Martin in Dubai",  href: "/brands/rent-aston-martin-dubai" },
  { label: "Rent Bentley in Dubai",       href: "/brands/rent-bentley-dubai" },
  { label: "Rent BMW in Dubai",           href: "/brands/rent-bmw-dubai" },
  { label: "Rent Cadillac in Dubai",      href: "/brands/rent-cadillac-dubai" },
  { label: "Rent Lamborghini in Dubai",   href: "/brands/rent-lamborghini-dubai" },
  { label: "Rent McLaren in Dubai",       href: "/brands/rent-mclaren-dubai" },
  { label: "Rent Mercedes-Benz in Dubai", href: "/brands/rent-mercedes-benz-dubai" },
  { label: "Rent Range Rover in Dubai",   href: "/brands/rent-range-rover-dubai" },
  { label: "Rent Rolls-Royce in Dubai",   href: "/brands/rent-rolls-royce-dubai" },
  { label: "Rent Maserati in Dubai",      href: "/brands/rent-maserati-dubai" },
];

export default function RentalDirectory() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-24 border-t border-white/5">
      <div className="container-x">
        <div className="mb-10 md:mb-14 text-center">
          <Reveal>
            <p className="rise font-[var(--font-mono)] text-[11.5px] tracking-[0.28em] uppercase text-[var(--champagne)] mb-4">
              Rental Options We Have
            </p>
          </Reveal>
          <MaskHeading
            text="Daily, Weekly & Monthly **Luxury Car Rental**"
            as="h2"
            breakAfterBold={false}
            className="font-[var(--font-display)] text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.06] tracking-[-0.018em] text-[var(--ink-hi)] text-balance"
            staggerMs={42}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {RENTAL_LINKS.map((link, i) => (
            <Reveal key={link.href} delay={Math.min(i * 35, 320)}>
              <Link
                href={link.href}
                className="rise group flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-[var(--bg-obsidian)]/40 px-5 py-4 hover:border-[var(--champagne)]/40 hover:bg-[var(--bg-graphite)]/50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              >
                <span className="text-[14.5px] font-medium text-[var(--ink-hi)] group-hover:text-[var(--champagne)] transition-colors duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                  {link.label}
                </span>
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 14 10"
                  fill="none"
                  className="shrink-0 text-[var(--ink-lo)] opacity-60 group-hover:translate-x-1 group-hover:text-[var(--champagne)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                  <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
