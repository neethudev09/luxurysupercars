import Reveal from "@/components/motion/Reveal";

const STATS: { value: string; suffix?: string; label: string }[] = [
  { value: "100", suffix: "+", label: "Exclusive supercars in fleet" },
  { value: "10", suffix: " yrs", label: "Concierge experience" },
  { value: "24", suffix: "/7", label: "On-call support" },
  { value: "4.9", suffix: "★", label: "Google reviews · 377+ ratings" },
];

/**
 * Stat row — quick-glance numbers under the bio. The "100+ fleet" and
 * "4.9★ rating" values are verbatim from the live site marketing copy.
 */
export default function AboutStats() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-16 md:py-20 border-t border-white/[0.05]">
      <div className="container-x">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              className="rise relative pt-8 md:pt-10"
              delay={i * 100}
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--champagne)]/40 via-[var(--champagne)]/15 to-transparent"
              />
              <p className="font-[var(--font-display)] text-[clamp(2.6rem,5vw,4.2rem)] leading-none tracking-[-0.03em] text-[var(--ink-hi)]">
                {s.value}
                <span className="text-[var(--champagne)]">{s.suffix}</span>
              </p>
              <p className="mt-3 font-[var(--font-mono)] text-[10.5px] tracking-[0.2em] uppercase text-[var(--ink-lo)]">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
