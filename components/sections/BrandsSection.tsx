import Image from "next/image";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { BRAND_LOGOS } from "@/lib/assets";

// Logos that ship dark-on-transparent and need inverting on this dark bg.
// Empty for now — the local McLaren / Maserati / Porsche / Mansory /
// Brabus assets are already designed for a dark background.
const DARK_LOGOS = new Set<string>();

/**
 * "Our Brands" section. Carries the page's semantic <h1> (verbatim from
 * the live luxurysupercarsdubai.com/our-fleet/ page) plus the brand logo
 * marquee. The longform SEO paragraph lives in JsonLd structured data,
 * mirroring its placement on the live site.
 */
export default function BrandsSection() {
  const logos = [...BRAND_LOGOS, ...BRAND_LOGOS]; // double for seamless loop

  return (
    <section
      id="brands"
      aria-label="Our Brands"
      className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-[120px] pb-10 md:pt-[160px] md:pb-12 overflow-hidden"
    >
      <div className="container-x">
        <div className="mb-10 md:mb-14">
          {/* Semantic H1 — verbatim from live /our-fleet/ */}
          <MaskHeading
            text="Our **Brands**"
            as="h1"
            className="font-[var(--font-display)] text-[clamp(2.2rem,6vw,4.8rem)] leading-[0.98] tracking-[-0.022em] text-[var(--ink-hi)]"
            staggerMs={55}
          />
        </div>

        {/* Brand logo marquee */}
        <Reveal delay={300} className="pt-8 border-t border-white/[0.06]">
          <div
            className="overflow-hidden"
            style={{ ["--marquee-speed" as string]: "55s" }}
          >
            <div className="marquee-track gap-12 md:gap-16 py-1">
              {logos.map((b, i) => (
                <div
                  key={`${b.name}-${i}`}
                  className="relative h-10 w-[80px] shrink-0 flex items-center justify-center"
                  title={b.name}
                >
                  <Image
                    src={b.src}
                    alt={`${b.name} logo`}
                    fill
                    sizes="80px"
                    className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                    style={DARK_LOGOS.has(b.name) ? { filter: "invert(1)" } : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
