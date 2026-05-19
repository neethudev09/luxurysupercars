import Image from "next/image";
import Link from "next/link";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { BRAND_LOGOS } from "@/lib/assets";

/**
 * Premium-brand showcase. Light-pearl background — breaks the dark
 * rhythm of the rest of the page, signalling a deliberate switch in
 * tone (per the "different colour" brief). Brand logos link to their
 * dedicated /brands/* page where one exists.
 */
export default function AboutBrands() {
  return (
    <section className="relative bg-[var(--bg-pearl)] text-[var(--ink-dark-hi)] py-20 md:py-28 overflow-hidden">
      <div className="container-x relative">
        <div className="mb-14 md:mb-16 text-center">
          <MaskHeading
            text="Our **premium** car brands"
            as="h2"
            breakAfterBold={false}
            className="font-[var(--font-display)] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] tracking-[-0.022em] text-[var(--ink-dark-hi)] text-balance"
            staggerMs={45}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {BRAND_LOGOS.map((b, i) => {
            const tileClassName =
              "group relative flex items-center justify-center aspect-[5/3] rounded-xl border border-[var(--ink-dark-hi)]/10 bg-[var(--bg-bone)] hover:border-[var(--champagne)] hover:-translate-y-1 transition-all duration-500";
            // Porsche ships as the multicolor crest — desaturate to keep
            // the brand strip visually consistent on the pearl background.
            const GRAYSCALE_LOGOS = new Set(["Porsche"]);
            const isGrayscale = GRAYSCALE_LOGOS.has(b.name);
            const inner = (
              <>
                <Image
                  src={b.src}
                  alt={`${b.name} logo`}
                  width={92}
                  height={48}
                  sizes="92px"
                  className="object-contain max-h-[48%] max-w-[60%] opacity-95 group-hover:opacity-100 transition-opacity"
                  style={isGrayscale ? { filter: "grayscale(1)" } : undefined}
                />
                <span className="absolute bottom-2.5 right-3 font-[var(--font-mono)] text-[9px] tracking-[0.16em] uppercase text-[var(--ink-dark-lo)]/60">
                  {b.name}
                </span>
              </>
            );
            return (
              <Reveal
                key={b.name}
                className="rise"
                delay={Math.min(i * 50, 600)}
              >
                {b.slug ? (
                  <Link href={`/brands/${b.slug}`} className={tileClassName}>
                    {inner}
                  </Link>
                ) : (
                  <div className={tileClassName}>{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
