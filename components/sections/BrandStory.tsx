import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { BRAND_STORY } from "@/lib/content";

export default function BrandStory() {
  return (
    <section
      id={BRAND_STORY.id}
      className="relative bg-[var(--bg-pearl)] text-[var(--ink-dark-hi)] py-20 md:py-24 overflow-hidden"
    >
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-7">
            <MaskHeading
              text={BRAND_STORY.h2}
              as="h2"
              className="font-[var(--font-display)] text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.07] tracking-[-0.018em] text-[var(--ink-dark-hi)]"
              staggerMs={42}
            />
          </div>
          <div className="md:col-span-5 md:pt-10 space-y-5">
            {BRAND_STORY.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <p className="rise text-[14.5px] leading-[1.75] text-[var(--ink-dark-lo)]">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-14 grid grid-cols-2 md:grid-cols-4 border-t border-black/10">
          {BRAND_STORY.stats.map((s, i) => (
            <div
              key={s.label}
              className={`rise flex flex-col gap-1 py-7 px-2 ${i > 0 ? "md:border-l border-black/10" : ""} ${i === 2 ? "border-l md:border-l" : ""}`}
              style={{ ["--rise-delay" as string]: `${i * 80}ms` }}
            >
              <span className="font-[var(--font-display)] text-[clamp(2rem,4vw,3.2rem)] leading-none text-[var(--ink-dark-hi)]">
                <CountUp
                  value={s.value}
                  decimals={"decimals" in s ? (s as { decimals: number }).decimals : 0}
                  suffix={s.suffix}
                />
              </span>
              <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--ink-dark-lo)]">
                {s.label}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
