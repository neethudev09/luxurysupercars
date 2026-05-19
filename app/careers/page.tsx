import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import MagneticCTA from "@/components/motion/MagneticCTA";
import { CAREERS_PAGE } from "@/lib/content";
import { PAGE_HERO_IMAGES } from "@/lib/assets";

export const metadata: Metadata = {
  title: CAREERS_PAGE.metaTitle,
  description: CAREERS_PAGE.metaDescription,
  alternates: { canonical: "/careers" },
  openGraph: {
    title: CAREERS_PAGE.metaTitle,
    description: CAREERS_PAGE.metaDescription,
    url: "https://luxurysupercarsdubai.com/careers/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

const SUBHEADS = ["Who we are", "What we look for", "How to apply"];

const PILLARS = [
  {
    title: "Culture",
    body: "A small, ambitious team obsessed with how every detail feels — from the keys handed over to the way a car is presented.",
  },
  {
    title: "Locations",
    body: "Two Dubai showrooms — Nadd Al Hamar and Al Quoz — with operations across the wider UAE.",
  },
  {
    title: "Benefits",
    body: "Competitive packages, supportive leadership, and the chance to work hands-on with the most extraordinary cars in the city.",
  },
];

export default function CareersPage() {
  return (
    <main>
      <SiteNav />
      <h1 className="sr-only">{CAREERS_PAGE.h1}</h1>

      <PageHero
        eyebrow="Careers"
        h1={CAREERS_PAGE.h1}
        subline="Join a small, ambitious team behind the most extraordinary car rental fleet in Dubai."
        backgroundImage={PAGE_HERO_IMAGES.careers}
        backgroundOpacity={0.28}
        spotlight="left"
      />

      <section className="relative bg-[var(--bg-obsidian)] border-t border-white/5 py-20 md:py-24 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 size-[520px] translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--champagne)]/[0.05] blur-[140px]"
        />

        <div className="container-x relative grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-7">
            <div className="flex flex-col gap-10 max-w-2xl">
              {CAREERS_PAGE.paragraphs.map((p, i) => (
                <div key={i}>
                  <MaskHeading
                    text={`**${SUBHEADS[i] ?? ""}**`}
                    as="h2"
                    breakAfterBold={false}
                    className="font-[var(--font-display)] text-[clamp(1.3rem,2.2vw,1.7rem)] leading-[1.15] tracking-tight text-[var(--ink-hi)] mb-4"
                    staggerMs={45}
                  />
                  <Reveal delay={120}>
                    <p className="rise text-[16.5px] leading-[1.78] text-[var(--ink-lo)]">
                      {p}
                    </p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <Reveal>
              <div className="rise relative overflow-hidden rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/50 p-7 md:p-8 backdrop-blur">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 size-[280px] rounded-full bg-[var(--champagne)]/[0.10] blur-[90px]"
                />
                <div className="relative">
                  <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-3">
                    {CAREERS_PAGE.h2}
                  </p>
                  <p className="font-[var(--font-display)] text-[clamp(1.3rem,2vw,1.6rem)] leading-tight text-[var(--ink-hi)] mb-5">
                    Tell us about yourself.
                  </p>
                  <p className="text-[14.5px] leading-[1.7] text-[var(--ink-lo)] mb-6">
                    Share your details using the enquiry form below and someone from our team will be in touch if there&apos;s a suitable opportunity.
                  </p>
                  <MagneticCTA
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-6 py-3 text-[13px] font-medium hover:bg-[var(--champagne-hi)] transition-colors"
                  >
                    <span>Submit enquiry</span>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </MagneticCTA>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="bg-[var(--bg-obsidian)] border-t border-white/5 py-20 md:py-24">
        <div className="container-x">
          <header className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-12">
            <div className="md:col-span-7">
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-4">
                Working with us
              </p>
              <MaskHeading
                text="What it's **like** to work at **Luxury Group**"
                as="h2"
                breakAfterBold={false}
                className="font-[var(--font-display)] text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.06] tracking-[-0.018em] text-[var(--ink-hi)]"
                staggerMs={45}
              />
            </div>
          </header>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 90}>
                <li className="rise group h-full rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/30 p-7 md:p-8 hover:border-[var(--champagne)]/40 transition-colors">
                  <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-4">
                    0{i + 1}
                  </p>
                  <h3 className="font-[var(--font-display)] text-[clamp(1.25rem,1.8vw,1.5rem)] leading-tight text-[var(--ink-hi)] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.7] text-[var(--ink-lo)]">{pillar.body}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
