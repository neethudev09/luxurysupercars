import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { BRAND_LOGOS } from "@/lib/assets";

/**
 * Per-section logo overrides — keyed by `brand.name` from BRAND_LOGOS.
 * Only apply on this About Us grid, which sits on a light pearl
 * background and needs dark-on-transparent variants of a few logos.
 * The shared BRAND_LOGOS entries (used by the homepage marquee,
 * /our-fleet marquee, and car-detail badge) stay untouched.
 */
const ABOUT_LOGO_OVERRIDES: Record<string, string> = {
  Porsche: "/images/brands/about/porsche.png",
  Maserati: "/images/brands/about/maserati.png",
  Mansory: "/images/brands/about/mansory.png",
  Brabus: "/images/brands/about/brabus.png",
};

/**
 * Brands whose About-Us override file is tighter (less built-in padding)
 * than the others — render them roughly 2x larger inside the tile so
 * they read at the same visual weight as Aston Martin / Ferrari / etc.
 */
const ABOUT_BIG_LOGOS = new Set<string>(["Maserati", "Mansory", "Brabus"]);

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {BRAND_LOGOS.map((b, i) => {
            const tileClassName =
              "group relative flex items-center justify-center aspect-[5/3] rounded-xl border border-[var(--ink-dark-hi)]/10 bg-[var(--bg-bone)] hover:border-[var(--champagne)] hover:-translate-y-1 transition-all duration-500";
            const logoSrc = ABOUT_LOGO_OVERRIDES[b.name] ?? b.src;
            const isBig = ABOUT_BIG_LOGOS.has(b.name);
            // Big logos render at 2x the intrinsic size of the others.
            const logoW = isBig ? 184 : 92;
            const logoH = isBig ? 96 : 48;
            const inner = (
              <>
                <Image
                  src={logoSrc}
                  alt={`${b.name} logo`}
                  width={logoW}
                  height={logoH}
                  sizes={`${logoW}px`}
                  className="object-contain opacity-95 group-hover:opacity-100 transition-opacity"
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
