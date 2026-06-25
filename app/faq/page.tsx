import type { Metadata } from "next";
import Script from "next/script";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/motion/Reveal";
import MagneticCTA from "@/components/motion/MagneticCTA";
import MaskHeading from "@/components/motion/MaskHeading";
import { FAQ_PAGE } from "@/lib/content";
import { PAGE_HERO_IMAGES } from "@/lib/assets";

export const metadata: Metadata = {
  title: FAQ_PAGE.metaTitle,
  description: FAQ_PAGE.metaDescription,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: FAQ_PAGE.metaTitle,
    description: FAQ_PAGE.metaDescription,
    url: "/faq/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_PAGE.items.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
};

export default function FaqPage() {
  return (
    <main>
      <SiteNav />
      {/* <h1 className="sr-only">{FAQ_PAGE.h1}</h1> */}

      <PageHero
        eyebrow={FAQ_PAGE.eyebrow}
        h1={FAQ_PAGE.h1}
        subline={FAQ_PAGE.subline}
        backgroundImage={PAGE_HERO_IMAGES.faq}
        backgroundOpacity={0.22}
        spotlight="right"
      />

      <FAQ
        heading="FAQs"
        subheading="**Everything** you need to know about renting with **Luxury Supercars Dubai**"
        items={[...FAQ_PAGE.items]}
      />

      <section className="relative bg-[var(--bg-obsidian)] border-t border-white/5 py-20 md:py-24 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[640px] rounded-full bg-[var(--champagne)]/[0.06] blur-[160px]"
        />

        <div className="container-x relative text-center max-w-2xl mx-auto">
          <Reveal>
            <p className="rise font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-5">
              Still have questions?
            </p>
          </Reveal>
          <MaskHeading
            text="**Talk** to our concierge team"
            as="h2"
            breakAfterBold={false}
            className="font-[var(--font-display)] text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.05] tracking-[-0.018em] text-[var(--ink-hi)] text-balance"
            staggerMs={45}
          />
          <Reveal>
            <p className="rise mt-5 text-[16px] leading-[1.7] text-[var(--ink-lo)]">
              Available around the clock for bookings, deliveries, and bespoke arrangements. Reach us by phone, email, or the enquiry form below.
            </p>
          </Reveal>
          <Reveal>
            <div className="rise mt-8 flex flex-wrap items-center justify-center gap-3">
              <MagneticCTA
                href="/contact-us"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-6 py-3 text-[15px] font-medium hover:bg-[var(--champagne-hi)] transition-colors"
              >
                <span>Contact us</span>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </MagneticCTA>
              <a
                href="tel:+971565266295"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[15px] text-[var(--ink-hi)] hover:bg-white/5 hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
              >
                +971 56 526 6295
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <Script
        id="faq-page-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
    </main>
  );
}
