import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import StickyToc from "@/components/sections/StickyToc";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import MaskHeading from "@/components/motion/MaskHeading";
import { BOOKING_TERMS_PAGE } from "@/lib/content";

export const metadata: Metadata = {
  title: BOOKING_TERMS_PAGE.metaTitle,
  description: BOOKING_TERMS_PAGE.metaDescription,
  alternates: { canonical: "/booking-tcs" },
  openGraph: {
    title: BOOKING_TERMS_PAGE.metaTitle,
    description: BOOKING_TERMS_PAGE.metaDescription,
    url: "/booking-tcs/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

// Booking T&Cs has a single H2 ("Terms and Conditions:") with grouped
// subtitles beneath. The TOC entries are the GROUPS (which act as
// section anchors visually), so readers can jump to e.g. "Payment Method".
const TOC_ENTRIES = BOOKING_TERMS_PAGE.sections.flatMap((section) =>
  section.groups.map((g) => ({
    id: slugify(g.subtitle),
    title: g.subtitle.replace(/:$/, ""),
  })),
);

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BookingTermsPage() {
  return (
    <main>
      <SiteNav />
      <h1 className="sr-only">{BOOKING_TERMS_PAGE.h1}</h1>

      <PageHero
        eyebrow="Legal"
        h1={BOOKING_TERMS_PAGE.h1}
        subline="Everything you need to know before you book — required documents, age limits, security deposit, payment methods, rental period, and delivery."
        spotlight="left"
        compact
      />

      <section className="bg-[var(--bg-obsidian)] border-t border-white/5 py-16 md:py-20">
        <div className="container-x grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-3">
            <StickyToc entries={TOC_ENTRIES} label="On this page" />
          </div>

          <article className="md:col-span-9 lg:col-span-8 legal-article">
            <MaskHeading
              text={BOOKING_TERMS_PAGE.intro}
              as="p"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(1.4rem,2.4vw,1.85rem)] leading-[1.2] tracking-tight text-[var(--ink-hi)] mb-12"
              staggerMs={35}
            />

            {BOOKING_TERMS_PAGE.sections.map((section) => (
              <div key={section.title} className="mb-14">
                <MaskHeading
                  text={section.title}
                  as="h2"
                  breakAfterBold={false}
                  className="font-[var(--font-display)] text-[clamp(1.6rem,2.6vw,2.1rem)] tracking-tight text-[var(--ink-hi)] mb-8"
                  staggerMs={35}
                />
                <div className="flex flex-col gap-9">
                  {section.groups.map((group) => {
                    const id = slugify(group.subtitle);
                    return (
                      <div key={group.subtitle} id={id}>
                        <h3 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.24em] text-[var(--champagne)] mb-4">
                          {group.subtitle}
                        </h3>
                        <ul className="list-disc list-outside pl-5 flex flex-col gap-2 text-[15.5px] leading-[1.75] text-[var(--ink-lo)]">
                          {group.items.map((it) => (
                            <li key={it}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </article>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
