import Image from "next/image";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { ABOUT_FOUNDER } from "@/lib/content";

// Ahmed Amwell's signature (CMS-managed, falls back to the live asset). The
// off-white section means the dark ink reads as-is (no invert needed).
const SIGNATURE_SRC = ABOUT_FOUNDER.signature;

// Looping, muted, controls-off founder embed from Sanity.
const founderEmbedSrc = ABOUT_FOUNDER.video.src;

/**
 * Founder bio + video. H2 + body paragraph are verbatim from live /about-us/
 * for SEO. Centred single-column layout on an off-white background: signature →
 * autoplaying video → heading + bio. The video autoplays muted on a loop and is
 * pointer-events-none so it can't trap the scroll wheel (which felt "sticky").
 */
export default function AboutVideo() {
  return (
    <section className="relative bg-[var(--bg-pearl)] text-[var(--ink-dark-hi)] py-20 md:py-28 border-t border-black/5 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 bottom-0 size-[600px] rounded-full bg-[var(--champagne)]/[0.08] blur-[160px]"
      />

      <div className="container-x relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <Image
              src={SIGNATURE_SRC}
              alt="Ahmed Amwell signature"
              width={260}
              height={96}
              sizes="240px"
              className="h-auto w-[190px] opacity-90 md:w-[230px]"
            />
          </Reveal>

          <Reveal delay={150} className="mt-9 w-full md:mt-11">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-black/10 bg-black shadow-[0_24px_70px_-20px_rgba(0,0,0,0.35)]">
              <iframe
                src={founderEmbedSrc}
                title="Ahmed Amwell · CEO of Luxury Supercar Rentals Dubai"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="pointer-events-none absolute inset-0 h-full w-full"
              />
            </div>
          </Reveal>

          <MaskHeading
            text={ABOUT_FOUNDER.heading}
            as="h2"
            breakAfterBold={false}
            className="mt-11 font-[var(--font-display)] text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.12] tracking-[-0.018em] text-[var(--ink-dark-hi)] text-balance md:mt-14"
            staggerMs={35}
          />
          <Reveal>
            <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-[1.85] text-[var(--ink-dark-lo)]">
              {ABOUT_FOUNDER.paragraph}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
