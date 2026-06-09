import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import StickyToc from "@/components/sections/StickyToc";
import Footer from "@/components/sections/Footer";
import MaskHeading from "@/components/motion/MaskHeading";
import { PRIVACY_POLICY_PAGE } from "@/lib/content";

export const metadata: Metadata = {
  title: PRIVACY_POLICY_PAGE.metaTitle,
  description: PRIVACY_POLICY_PAGE.metaDescription,
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: PRIVACY_POLICY_PAGE.metaTitle,
    description: PRIVACY_POLICY_PAGE.metaDescription,
    url: "/privacy-policy/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

type Section = (typeof PRIVACY_POLICY_PAGE.sections)[number];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TOC_ENTRIES = PRIVACY_POLICY_PAGE.sections.map((s) => ({
  id: slugify(s.title),
  // Trim the lead 'Privacy Policy for' duplicate for cleaner TOC text.
  title: s.title.replace(/^Privacy Policy for /, ""),
}));

export default function PrivacyPolicyPage() {
  return (
    <main>
      <SiteNav />
      <h1 className="sr-only">{PRIVACY_POLICY_PAGE.h1}</h1>

      <PageHero
        eyebrow={PRIVACY_POLICY_PAGE.eyebrow}
        h1={PRIVACY_POLICY_PAGE.h1}
        subline={PRIVACY_POLICY_PAGE.subline}
        spotlight="left"
        compact
      />

      <section className="bg-[var(--bg-obsidian)] border-t border-white/5 py-16 md:py-20">
        <div className="container-x grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-3">
            <StickyToc entries={TOC_ENTRIES} label="On this page" />
          </div>

          <article className="md:col-span-9 lg:col-span-8 legal-article">
            {PRIVACY_POLICY_PAGE.sections.map((section: Section) => {
              const list = "list" in section ? section.list : undefined;
              const trailer = "trailer" in section ? section.trailer : undefined;
              const id = slugify(section.title);
              return (
                <section key={section.title} id={id} className="mb-14">
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
                    {list && (
                      <ul className="list-disc list-outside pl-5 flex flex-col gap-2">
                        {list.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </ul>
                    )}
                    {trailer?.map((t, i) => (
                      <p key={`trailer-${i}`}>{t}</p>
                    ))}
                  </div>
                </section>
              );
            })}
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
