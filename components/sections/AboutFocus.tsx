import Image from "next/image";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { ABOUT_ME, ABOUT_VENTURES } from "@/lib/content";

// Venture cards — names, descriptions and logos are all CMS-managed
// (ABOUT_VENTURES.items, each with an asset fallback). `bordered` wraps the
// logo in a white circular badge for photo-style marks; a card with no logo
// renders the company initials.
const VENTURES = ABOUT_VENTURES.items.map((it) => ({
  h3: it.title,
  body: it.body,
  logo: it.logo,
  bordered: it.bordered,
}));

/** Company initials for the placeholder badge — first letter of each word. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}

export default function AboutFocus() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-28 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-1/3 size-[700px] rounded-full bg-[var(--champagne)]/[0.05] blur-[180px]"
      />

      <div className="container-x relative">
        {/* About me — image left, bio right */}
        <div className="mx-auto max-w-6xl grid lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-5">
            <Reveal className="h-full">
              <div className="relative aspect-[4/5] lg:aspect-auto lg:h-full w-full max-w-[340px] lg:max-w-none mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-white/10 bg-[var(--bg-graphite)]">
                <Image
                  src={ABOUT_ME.portrait}
                  alt="Ahmed Amwell — Founder and CEO of Luxury Supercar Rentals Dubai"
                  fill
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="object-cover object-top"
                  priority={false}
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <MaskHeading
              text={ABOUT_ME.heading}
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)]"
              staggerMs={45}
            />

            {ABOUT_ME.paragraphs.map((para, i) => (
              <Reveal key={i} delay={i ? 150 : 0}>
                <p className={`${i === 0 ? "mt-8" : "mt-5"} text-[16px] md:text-[17px] leading-[1.85] text-[var(--ink-lo)]`}>
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* "CEO of" — five ventures, centered */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <p className="text-center font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--champagne)] mb-8">
              {ABOUT_VENTURES.eyebrow}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {VENTURES.map((v, i) => (
              <Reveal
                key={v.h3}
                className="rise rounded-xl border border-white/8 bg-[var(--bg-graphite)]/40 p-5 hover:border-[var(--champagne)]/40 transition-colors flex flex-col items-center text-center"
                delay={Math.min(i * 90, 360)}
              >
                <div
                  className={`relative size-28 mb-5 flex items-center justify-center ${
                    v.bordered
                      ? "rounded-full overflow-hidden bg-white border-2 border-white shadow-[0_4px_18px_-4px_rgba(255,255,255,0.15)]"
                      : ""
                  }`}
                >
                  {v.logo ? (
                    <Image
                      src={v.logo}
                      alt={`${v.h3} logo`}
                      fill
                      sizes="112px"
                      className={`object-contain ${v.bordered ? "p-2.5" : ""}`}
                    />
                  ) : (
                    <span className="font-[var(--font-display)] text-[26px] font-medium tracking-tight text-[var(--bg-obsidian)]">
                      {initials(v.h3)}
                    </span>
                  )}
                </div>
                <h3 className="font-[var(--font-display)] text-[18px] leading-tight tracking-tight text-[var(--ink-hi)] mb-2">
                  {v.h3}
                </h3>
                <p className="text-[15px] md:text-[17px] leading-[1.65] text-[var(--ink-lo)]">
                  {v.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
