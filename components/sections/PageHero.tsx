import Image from "next/image";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";

/**
 * Richer reusable hero for standalone pages (contact-us, services, faq,
 * careers, legal, blog). Mirrors the cinematic vocabulary of the
 * homepage / about-us / fleet-type heroes:
 *
 *   - Mono eyebrow → mask-revealed h1 → optional sub-line
 *   - Optional background image with gradient wash to bg-obsidian
 *   - Ambient champagne blur spotlight (positioned variant)
 *   - Optional inline stat strip with CountUp number ramp
 *
 * Important: this component renders the VISIBLE h1. The verbatim
 * live-site SEO h1 must still be rendered as `<h1 className="sr-only">…`
 * on the page itself when it differs from the visible heading.
 */

export type SpotlightVariant = "left" | "right" | "center" | "none";

export interface PageHeroStat {
  /** Numeric value passed to CountUp */
  value: number;
  /** Label rendered below the number (e.g. "Showrooms") */
  label: string;
  /** Optional suffix appended to the number (e.g. "+", "/7") */
  suffix?: string;
  /** Optional prefix prepended to the number */
  prefix?: string;
}

export interface PageHeroProps {
  /** Mono uppercase label above the heading. */
  eyebrow: string;
  /** Visible heading text. Supports `**bold**` markers for gold-emph spans. */
  h1: string;
  /** Optional shorter sub-line rendered below the h1. */
  h2?: string;
  /** Optional shorter sub-line rendered below the h2. */
  subline?: string;
  /** Optional background image URL. Renders at 30% opacity with a dark wash. */
  hideH1?: boolean;
   /** Hide H1 visually but keep it for SEO */
  backgroundImage?: string;
  /** Override the image opacity (default 0.3). */
  backgroundOpacity?: number;
  /** Where to anchor the champagne blur spotlight. */
  spotlight?: SpotlightVariant;
  /** Optional inline stat strip rendered beneath the h1. */
  stats?: PageHeroStat[];
  /** Tighter top padding (e.g. for very long h1s). */
  compact?: boolean;
  
}

const SPOTLIGHT_POS: Record<Exclude<SpotlightVariant, "none">, string> = {
  left: "left-0 top-1/2 -translate-x-1/3 -translate-y-1/2",
  right: "right-0 top-1/2 translate-x-1/3 -translate-y-1/2",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
};

export default function PageHero({
  eyebrow,
  h1,
  h2,
  subline,
  hideH1 = false,
  backgroundImage,
  backgroundOpacity = 0.3,
  spotlight = "right",
  stats,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] overflow-hidden ${
        compact ? "pt-[110px] pb-12 md:pt-[140px] md:pb-14" : "pt-[120px] pb-14 md:pt-[170px] md:pb-20"
      }`}
    >
      {/* Background image — parallax-ready (Reveal will fade it in) */}
      {backgroundImage && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ opacity: backgroundOpacity }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--bg-obsidian)]/30 via-[var(--bg-obsidian)]/70 to-[var(--bg-obsidian)]" />
        </div>
      )}

      {/* Ambient champagne spotlight */}
      {spotlight !== "none" && (
        <div
          aria-hidden
          className={`pointer-events-none absolute size-[600px] rounded-full bg-[var(--champagne)]/[0.06] blur-[160px] ${SPOTLIGHT_POS[spotlight]}`}
        />
      )}

      <div className="container-x relative">
        <Reveal>
          <p className="font-[var(--font-mono)] text-[11px] tracking-[0.28em] uppercase text-[var(--champagne)] mb-6">
            {eyebrow}
          </p>
        </Reveal>

        {hideH1 ? (
  <h1 className="sr-only">{h1}</h1>
) : (
  <div className="max-w-5xl">
    <MaskHeading
      text={h1}
      as="h1"
      animate
      breakAfterBold={false}
      className="font-[var(--font-display)] text-[clamp(2.2rem,6vw,5rem)] leading-[1] tracking-[-0.022em] text-[var(--ink-hi)] text-balance"
      staggerMs={55}
    />
  </div>
)}
    {h2 && (
  <Reveal>
    <h2 className="rise mt-4 max-w-5xl font-[var(--font-display)] text-[clamp(2.2rem,6vw,5rem)] leading-[1] tracking-[-0.022em] text-[var(--ink-hi)] text-balance">
      {h2}
    </h2>
  </Reveal>
)}

{subline && (
  <Reveal>
    <p className="rise mt-6 max-w-2xl text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.45] text-[var(--ink-lo)]">
      {subline}
    </p>
  </Reveal>
)}

        {stats && stats.length > 0 && (
          <Reveal>
            <ul className="rise mt-10 flex flex-wrap items-end gap-x-10 gap-y-6 md:gap-x-14">
              {stats.map((s) => (
                <li key={s.label} className="flex flex-col">
                  <span className="font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em] text-[var(--ink-hi)]">
                    <CountUp
                      value={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                    />
                  </span>
                  <span className="mt-2 font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.24em] text-[var(--ink-lo)]">
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
