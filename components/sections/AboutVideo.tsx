import Image from "next/image";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

// Ahmed Amwell's signature, sourced from the live /about-us/ page. Rendered in
// white (brightness-0 invert) so the dark ink reads on the obsidian section.
const SIGNATURE_SRC =
  "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/signature-img.avif";

/**
 * Founder bio + video. H2 + body paragraph are verbatim from live
 * /about-us/ — preserved word-for-word for SEO. Centred single-column
 * layout: signature → video stacked above → heading + bio.
 */
export default function AboutVideo() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-28 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 bottom-0 size-[600px] rounded-full bg-[var(--champagne)]/[0.05] blur-[160px]"
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
              className="h-auto w-[190px] md:w-[230px] opacity-90 [filter:brightness(0)_invert(1)]"
            />
          </Reveal>

          <Reveal delay={150} className="mt-9 w-full md:mt-11">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/12 bg-black shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]">
              <iframe
                src="https://www.youtube-nocookie.com/embed/TjB258kdQFc?rel=0&modestbranding=1"
                title="Ahmed Amwell · CEO of Luxury Supercar Rentals Dubai"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </Reveal>

          <MaskHeading
            text="Ahmed Mansour redefines opulence with luxury super car rentals Dubai"
            as="h2"
            breakAfterBold={false}
            className="mt-11 font-[var(--font-display)] text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.12] tracking-[-0.018em] text-[var(--ink-hi)] text-balance md:mt-14"
            staggerMs={35}
          />
          <Reveal>
            <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-[1.85] text-[var(--ink-lo)]">
              Within the glowing and glossy world of luxury car rentals, Ahmed
              Mansour (Ahmed Amwell) stands out as the visionary behind Luxury
              Super Car Rentals Dubai. A true trailblazer, Luxury Super Car
              Rentals Dubai is transforming the industry, epitomizing success,
              and making renting the car of your dreams a hassle-free process.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
