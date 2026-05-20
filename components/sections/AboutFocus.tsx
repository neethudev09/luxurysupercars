import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

// Three ventures — H3 labels + body paragraphs verbatim from live /about-us/.
const VENTURES = [
  {
    h3: "LUXURY SUPERCAR RENTALS",
    body: "The Premier Luxury Supercars Rental in Dubai. With a fleet of more than 100 exclusive super cars to choose from!",
  },
  {
    h3: "LUXURY CHAUFFEUR DUBAI",
    body: "Specialised to provide high-end chauffeur services Dubai with the best 24/7 customer service experience.",
  },
  {
    h3: "Luxury Property Experts",
    body: "Real Estate Agency Specialized mostly in exclusive and luxurious properties in the UAE.",
  },
];

export default function AboutFocus() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-28 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-1/3 size-[700px] rounded-full bg-[var(--champagne)]/[0.05] blur-[180px]"
      />

      <div className="container-x relative">
        <MaskHeading
          text="CEO"
          as="h2"
          breakAfterBold={false}
          className="font-[var(--font-display)] text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)] mb-12 md:mb-16"
          staggerMs={45}
        />

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {VENTURES.map((v, i) => (
            <Reveal
              key={v.h3}
              className="rise rounded-xl border border-white/8 bg-[var(--bg-graphite)]/40 p-6 md:p-7 hover:border-[var(--champagne)]/40 transition-colors"
              delay={i * 100}
            >
              <h3 className="font-[var(--font-display)] text-[18px] leading-tight tracking-tight text-[var(--ink-hi)] mb-3">
                {v.h3}
              </h3>
              <p className="text-[14px] leading-[1.7] text-[var(--ink-lo)]">
                {v.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
