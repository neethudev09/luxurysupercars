import Image from "next/image";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

/**
 * Full-bleed editorial image that fades into black at the bottom, with
 * the CEO title + Ahmed's lead paragraph overlaid in the dark area.
 * Now also serves as the page hero since the dedicated AboutHero block
 * was removed.
 */
export default function AboutStory() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)]">
      <div className="relative w-full min-h-[100vh] overflow-hidden">
        {/* Background — Lamborghini Revuelto editorial shot */}
        <Image
          src="https://luxurysupercarsdubai.com/wp-content/uploads/2025/08/DSCF9336-scaled.jpg"
          alt="Lamborghini Revuelto — Luxury Supercar Rentals Dubai"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Subtle obsidian tint over the whole image for legibility */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--bg-obsidian)]/30"
        />

        {/* Champagne ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/4 size-[700px] -translate-x-1/2 rounded-full bg-[var(--champagne)]/[0.08] blur-[180px] mix-blend-screen"
        />

        {/* Bottom-half fade to pure black */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-[var(--bg-obsidian)]/85 to-[var(--bg-obsidian)]"
        />

        {/* Top fade — gives the fixed nav something to sit against */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-[var(--bg-obsidian)]/85 to-transparent"
        />

        {/* Content overlay — sits in the dark gradient at the bottom */}
        <div className="absolute inset-x-0 bottom-0 pb-16 md:pb-24">
          <div className="container-x">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
              <div className="md:col-span-7">
                <MaskHeading
                  text="**CEO** of Luxury Supercar Rentals Dubai"
                  as="h2"
                  breakAfterBold={false}
                  className="font-[var(--font-display)] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.1] tracking-[-0.022em] text-[var(--ink-hi)] text-balance"
                  staggerMs={45}
                />
                <Reveal delay={250}>
                  <p className="mt-5 font-[var(--font-mono)] text-[11px] tracking-[0.24em] uppercase text-[var(--ink-lo)]">
                    Ahmed Mansour · Founder &amp; Owner
                  </p>
                </Reveal>
              </div>

              <div className="md:col-span-5">
                <Reveal delay={400}>
                  {/* Verbatim CEO tagline from live /about-us/ */}
                  <p className="font-[var(--font-display)] text-[clamp(1.2rem,1.8vw,1.55rem)] leading-[1.45] tracking-tight text-[var(--ink-hi)]">
                    Ahmed has become a distinctive innovator behind luxury and
                    super-car rentals, making a riveting offer to clients
                    around the world to gain a taste of the opulent lifestyle.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
