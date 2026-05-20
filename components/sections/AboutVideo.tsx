import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

/**
 * Founder bio + video. H2 + body paragraph are verbatim from live
 * /about-us/ — preserved word-for-word for SEO.
 */
export default function AboutVideo() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-28 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 bottom-0 size-[600px] rounded-full bg-[var(--champagne)]/[0.05] blur-[160px]"
      />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <MaskHeading
              text="Ahmed Mansour redefines opulence with luxury super car rentals Dubai"
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.12] tracking-[-0.018em] text-[var(--ink-hi)] text-balance mb-7"
              staggerMs={35}
            />
            <Reveal>
              <p className="text-[16px] md:text-[17px] leading-[1.85] text-[var(--ink-lo)]">
                Within the glowing and glossy world of luxury car rentals,
                Ahmed Mansour (Ahmed Amwell) stands out as the visionary behind
                Luxury Super Car Rentals Dubai. A true trailblazer, Luxury
                Super Car Rentals Dubai is transforming the industry,
                epitomizing success, and making renting the car of your dreams
                a hassle-free process.
              </p>
            </Reveal>
          </div>

          <Reveal delay={300} className="lg:col-span-6">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/12 bg-black shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]">
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
        </div>
      </div>
    </section>
  );
}
