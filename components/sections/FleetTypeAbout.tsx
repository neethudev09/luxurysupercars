import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

interface FleetTypeAboutProps {
  /** Verbatim intro paragraphs from the live page. */
  paragraphs: string[];
  /** Visible label used in the heading (e.g. "Sports Cars" → "About Sports Cars"). */
  eyebrowLabel: string;
}

/**
 * Editorial body section that carries the verbatim live-page SEO paragraphs.
 * Sits BELOW the FleetExplorer grid on /rent-{type}-cars-dubai routes.
 * Layout: large "About {Type}" heading on the left, paragraphs stacked on
 * the right — matches the pattern used on the car detail pages.
 */
export default function FleetTypeAbout({
  paragraphs,
  eyebrowLabel,
}: FleetTypeAboutProps) {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-16 md:py-24 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--champagne)]/[0.05] blur-[140px]"
      />

      <div className="container-x relative">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <MaskHeading
              text={`About ${eyebrowLabel}`}
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-[var(--ink-hi)] text-balance"
              staggerMs={50}
            />
          </div>

          <div className="md:col-span-7 space-y-6">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={100 + i * 80}>
                <p className="text-[17px] leading-[1.85] text-[var(--ink-lo)]">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
