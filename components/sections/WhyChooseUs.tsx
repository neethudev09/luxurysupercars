import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { WHY_US } from "@/lib/content";

export default function WhyChooseUs() {
  return (
    <section id={WHY_US.id} className="bg-[var(--bg-obsidian)] py-20 md:py-24 overflow-hidden border-t border-white/5">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-6 mb-12 md:mb-14 items-end">
          <div className="md:col-span-12">
            <MaskHeading
              text={WHY_US.h2}
              as="h2"
              className="font-[var(--font-display)] text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.06] tracking-[-0.018em] text-[var(--ink-hi)]"
              staggerMs={45}
            />
          </div>
        </div>

        <Reveal className="rise mb-10 md:mb-14">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/8 bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/TjB258kdQFc?autoplay=1&mute=1&loop=1&playlist=TjB258kdQFc&playsinline=1&modestbranding=1&rel=0&controls=0"
              title="Luxury Supercars Dubai"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full pointer-events-none"
            />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_US.cards.map((c, i) => (
            <Reveal
              key={c.title}
              className="rise group relative overflow-hidden rounded-xl border border-white/8 bg-[var(--bg-graphite)]/60 p-6 md:p-7 hover:border-[var(--champagne)]/50 transition-colors flex flex-col min-h-[240px] md:min-h-[280px]"
              delay={i * 90}
            >
              <span
                aria-hidden
                className="absolute -top-8 -right-2 font-[var(--font-display)] font-semibold select-none text-[var(--champagne)]/10 group-hover:text-[var(--champagne)]/15 transition-colors"
                style={{ fontSize: "8rem", lineHeight: 1 }}
              >
                0{i + 1}
              </span>
              <h3 className="relative font-[var(--font-display)] text-[20px] leading-tight tracking-tight text-[var(--ink-hi)]">
                {c.title}
              </h3>
              <div className="mt-auto pt-7 md:pt-9">
                <span className="hairline block mb-5 max-w-[80px]" />
                <p className="relative text-[15.5px] leading-[1.7] text-[var(--ink-lo)]">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="my-8 md:my-10">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-4 text-[13px] md:text-[14px] text-white/75">
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-champagne"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M4.5 7l2 2 3-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Free Dubai Delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-champagne"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M4.5 7l2 2 3-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Basic Insurance Included
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-champagne"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M4.5 7l2 2 3-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Daily • Weekly • Monthly
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-champagne"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M4.5 7l2 2 3-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              24/7 Support
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-champagne"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M4.5 7l2 2 3-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Instant WhatsApp Booking
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
