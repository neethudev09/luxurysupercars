import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { BRAND_STORY } from "@/lib/content";

export default function BrandStory() {
  // Split the heading at the colon so "Luxury Supercars Dubai" sits on its own
  // line, followed by a rule, then the remainder of the heading below it.
  const [storyTitle, ...storyRestParts] = BRAND_STORY.h2.split(": ");
  const storyLead = storyRestParts.join(": ");
  return (
    <section
      id={BRAND_STORY.id}
      className="relative bg-[var(--bg-pearl)] text-[var(--ink-dark-hi)] py-20 md:py-24 overflow-hidden"
    >
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-7">
            <MaskHeading
              text={storyTitle}
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(2.1rem,4.8vw,3.6rem)] leading-[1.05] tracking-[-0.018em] text-[var(--ink-dark-hi)]"
              staggerMs={42}
            />
            {storyLead && (
              <MaskHeading
                text={storyLead}
                as="p"
                breakAfterBold={false}
                className="mt-7 font-[var(--font-display)] text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.18] tracking-[-0.01em] text-[var(--ink-dark-hi)]"
                staggerMs={28}
              />
            )}
          </div>
          <div className="md:col-span-5 md:pt-10 space-y-5">
            {BRAND_STORY.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <p className="rise text-[16.5px] leading-[1.75] text-[var(--ink-dark-lo)]">
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
              className={`rise flex flex-col items-center text-center gap-1 py-7 px-2 ${i > 0 ? "md:border-l border-black/10" : ""}`}
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
