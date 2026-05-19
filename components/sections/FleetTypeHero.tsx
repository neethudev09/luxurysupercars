import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

interface FleetTypeHeroProps {
  /** Visible page heading (renders as <p> styled as display text — matches
   *  the live site's "Sports Cars" / "SUV Cars" header pattern). */
  visibleTitle: string;
  /** Semantic <h1> — verbatim from live site. */
  h1: string;
}

export default function FleetTypeHero({ visibleTitle, h1 }: FleetTypeHeroProps) {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-[120px] pb-10 md:pt-[160px] md:pb-12 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--champagne)]/[0.06] blur-[160px]"
      />

      <div className="container-x relative">
        {/* Visible page title — matches live "Sports Cars" / "SUV Cars" <p> */}
        <Reveal>
          <p className="font-[var(--font-mono)] text-[11.5px] tracking-[0.28em] uppercase text-[var(--champagne)] mb-6">
            {visibleTitle}
          </p>
        </Reveal>

        {/* Semantic <h1> — verbatim from live page */}
        <div className="max-w-4xl">
          <MaskHeading
            text={h1}
            as="h1"
            breakAfterBold={false}
            className="font-[var(--font-display)] text-[clamp(2.2rem,6vw,4.8rem)] leading-[1] tracking-[-0.022em] text-[var(--ink-hi)] text-balance"
            staggerMs={55}
          />
        </div>
      </div>
    </section>
  );
}
