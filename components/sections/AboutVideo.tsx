import Reveal from "@/components/motion/Reveal";

/**
 * Bio + founder video — side-by-side layout. Verbatim bio from live
 * /about-us/ on the left, the embedded YouTube interview on the right.
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
          {/* Left — bio (verbatim from live /about-us/) */}
          <div className="lg:col-span-6">
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
            <Reveal delay={250}>
              {/* Verbatim founder statement from live /about-us/ */}
              <p className="mt-7 font-[var(--font-display)] text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.5] tracking-tight text-[var(--ink-hi)]">
                &ldquo;I&rsquo;m Ahmed Amwell, the proud owner of Luxury
                Supercar Rentals, Dubai&rsquo;s superior destination for the
                most luxury and exclusive cars available.&rdquo;
              </p>
            </Reveal>
          </div>

          {/* Right — YouTube embed */}
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
