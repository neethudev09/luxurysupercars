import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import { CAREERS_PAGE } from "@/lib/content";
import { PAGE_HERO_IMAGES } from "@/lib/assets";
import CareersForm from "@/components/careers/CareersForm";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: CAREERS_PAGE.metaTitle,
  description: CAREERS_PAGE.metaDescription,
  alternates: { canonical: "/careers" },
  openGraph: {
    title: CAREERS_PAGE.metaTitle,
    description: CAREERS_PAGE.metaDescription,
    url: "/careers/",
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
    body: "Our Dubai showroom in Al Quoz anchors operations across the wider UAE.",
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
      {/* <h1 className="sr-only">{CAREERS_PAGE.h1}</h1> */}

      <PageHero
        eyebrow={CAREERS_PAGE.eyebrow}
        h1={CAREERS_PAGE.h1}
        subline={CAREERS_PAGE.subline}
        backgroundImage={PAGE_HERO_IMAGES.careers}
        backgroundOpacity={0.28}
        spotlight="left"
      />

      <section className="relative overflow-hidden border-t border-white/5 bg-[var(--bg-obsidian)] py-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 size-[520px] translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--champagne)]/[0.05] blur-[140px]"
        />

        <div className="container-x relative grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="max-w-2xl space-y-10">
              <div className="flex flex-col gap-9">
                {CAREERS_PAGE.paragraphs.map((p, i) => (
                  <div key={i}>
                    <MaskHeading
                      text={`**${SUBHEADS[i] ?? ""}**`}
                      as="h2"
                      breakAfterBold={false}
                      className="mb-4 font-[var(--font-display)] text-[clamp(1.3rem,2.2vw,1.7rem)] leading-[1.15] tracking-tight text-[var(--ink-hi)]"
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

              <Reveal delay={180}>
                <section className="rise border-t border-white/10 pt-8">
                  <p className="mb-4 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)]">
                    Working with us
                  </p>
                  <MaskHeading
                    text="What it's **like** to work at **Luxury Group**"
                    as="h2"
                    breakAfterBold={false}
                    className="font-[var(--font-display)] text-[clamp(1.7rem,3vw,2.35rem)] leading-[1.08] tracking-tight text-[var(--ink-hi)]"
                    staggerMs={45}
                  />

                  <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {PILLARS.map((pillar, i) => (
                      <li
                        key={pillar.title}
                        className="group rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/30 p-5 transition-colors hover:border-[var(--champagne)]/40"
                      >
                        <p className="mb-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[var(--champagne)]">
                          0{i + 1}
                        </p>
                        <h3 className="mb-2 font-[var(--font-display)] text-[clamp(1.15rem,1.5vw,1.35rem)] leading-tight text-[var(--ink-hi)]">
                          {pillar.title}
                        </h3>
                        <p className="text-[15.5px] leading-[1.65] text-[var(--ink-lo)]">
                          {pillar.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            </div>
          </div>

          <aside className="lg:col-span-7 xl:col-span-6 xl:col-start-7">
            <Reveal>
              <div className="rise relative overflow-hidden rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/50 p-6 backdrop-blur md:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 size-[280px] rounded-full bg-[var(--champagne)]/[0.10] blur-[90px]"
                />
                <div className="relative">
                  <CareersForm />
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
