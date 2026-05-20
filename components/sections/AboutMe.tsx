import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

/**
 * "About me" section — verbatim from live /about-us/. Closes the page
 * with Ahmed's first-person quote and the long-form one-stop paragraph.
 * Headings + body copy must remain identical to the live site for SEO.
 */
export default function AboutMe() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-20 md:py-28 border-t border-white/5 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 top-1/3 size-[600px] rounded-full bg-[var(--champagne)]/[0.05] blur-[180px]"
      />

      <div className="container-x relative max-w-4xl">
        <MaskHeading
          text="About me"
          as="h2"
          breakAfterBold={false}
          className="font-[var(--font-display)] text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)] mb-10 md:mb-12"
          staggerMs={45}
        />

        <Reveal>
          <p className="text-[16px] md:text-[17px] leading-[1.85] text-[var(--ink-lo)]">
            I&rsquo;m Ahmed Amwell, the proud owner of Luxury Supercar Rentals,
            Dubai&rsquo;s superior destination for the most luxury and
            exclusive cars available. Join us as we showcase the latest
            supercars, share expert insights into the world of luxury
            automobiles, and take you behind the scenes of our iconic showroom.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-6 text-[16px] md:text-[17px] leading-[1.85] text-[var(--ink-lo)]">
            If you are looking to rent the latest luxury Car in Dubai,
            luxurysupercarsdubai.com is a one-stop destination for all. You
            can avail the widest range of the most exotic luxury cars,
            including everything from the latest Sports Cars, Convertible
            Cars, SUVs, Supercars, and Prestige Cars, all of which would
            surely provide you with a fascinating experience.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
