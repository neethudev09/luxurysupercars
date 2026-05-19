import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { REQUIREMENTS } from "@/lib/content";

const ICONS = [
  // Age — calendar/check
  (
    <svg key="age" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="4" y="7" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4 13h24M10 4v6M22 4v6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11 19l3 3 6-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // License — id card
  (
    <svg key="lic" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="3" y="7" width="26" height="18" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11" cy="16" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M18 13h7M18 17h7M18 21h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  // Delivery — truck
  (
    <svg key="del" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M2 9h14v12H2zM16 13h8l4 4v4H16z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="9" cy="23" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="22" cy="23" r="2.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
];

export default function Requirements() {
  return (
    <section
      id={REQUIREMENTS.id}
      className="relative bg-[var(--bg-obsidian)] py-20 md:py-24 border-t border-white/5"
    >
      <div className="container-x">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <MaskHeading
            text={REQUIREMENTS.h2}
            as="h2"
            breakAfterBold={false}
            className="font-[var(--font-display)] text-[clamp(1.8rem,4.2vw,3.2rem)] leading-[1.07] tracking-[-0.018em] text-[var(--ink-hi)] text-balance"
            staggerMs={40}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {REQUIREMENTS.items.map((it, i) => (
            <Reveal
              key={it.title}
              className="rise relative flex flex-col gap-5 rounded-xl border border-white/8 bg-[var(--bg-graphite)]/60 p-7 hover:border-[var(--champagne)]/50 transition-colors group"
              delay={i * 100}
            >
              <span className="absolute top-5 right-6 font-[var(--font-mono)] text-[10px] tracking-[0.25em] text-[var(--champagne)]/70">
                0{i + 1}
              </span>
              <span className="text-[var(--champagne)]">{ICONS[i]}</span>
              <h3 className="font-[var(--font-display)] text-[22px] tracking-tight text-[var(--ink-hi)]">
                {it.title}
              </h3>
              <p className="text-[16px] leading-[1.7] text-[var(--ink-lo)]">
                {it.body}
              </p>
              <span className="hairline mt-auto" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
