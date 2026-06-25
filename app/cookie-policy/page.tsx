import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import Footer from "@/components/sections/Footer";
import MaskHeading from "@/components/motion/MaskHeading";
import { COOKIE_POLICY_PAGE } from "@/lib/content";

export const metadata: Metadata = {
  title: COOKIE_POLICY_PAGE.metaTitle,
  description: COOKIE_POLICY_PAGE.metaDescription,
  alternates: { canonical: "/cookie-policy" },
  openGraph: {
    title: COOKIE_POLICY_PAGE.metaTitle,
    description: COOKIE_POLICY_PAGE.metaDescription,
    url: "/cookie-policy/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

export default function CookiePolicyPage() {
  return (
    <main>
      <SiteNav />
       {/*<h1 className="sr-only">{COOKIE_POLICY_PAGE.h1}</h1>*/}

      <PageHero
        eyebrow={COOKIE_POLICY_PAGE.eyebrow}
        h1={COOKIE_POLICY_PAGE.h1}
        subline={COOKIE_POLICY_PAGE.subline}
        spotlight="left"
        compact
      />

      <section className="bg-[var(--bg-obsidian)] border-t border-white/5 py-16 md:py-20">
        <article className="container-x max-w-3xl legal-article">
          {COOKIE_POLICY_PAGE.sections.map((section) => (
            <section key={section.title} className="mb-14">
              <MaskHeading
                text={section.title}
                as="h2"
                breakAfterBold={false}
                className="font-[var(--font-display)] text-[clamp(1.5rem,2.4vw,1.95rem)] tracking-tight text-[var(--ink-hi)] mb-6"
                staggerMs={32}
              />
              <div className="flex flex-col gap-4 text-[17.5px] leading-[1.78] text-[var(--ink-lo)]">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {section.list && (
                  <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                    {section.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </article>
      </section>

      <Footer />
    </main>
  );
}
