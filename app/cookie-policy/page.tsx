import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import Footer from "@/components/sections/Footer";
import MaskHeading from "@/components/motion/MaskHeading";

export const metadata: Metadata = {
  title: "Cookie Policy | Luxury Supercars Dubai",
  description:
    "How Luxury Supercars Dubai uses cookies and similar technologies — analytics, advertising, and your preferences.",
  alternates: { canonical: "/cookie-policy" },
  openGraph: {
    title: "Cookie Policy | Luxury Supercars Dubai",
    description:
      "How Luxury Supercars Dubai uses cookies and similar technologies.",
    url: "/cookie-policy/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

const SECTIONS: { title: string; paragraphs: string[]; list?: string[] }[] = [
  {
    title: "What are cookies?",
    paragraphs: [
      "Cookies are small text files placed on your device when you visit a website. They are widely used to make sites work, to remember your preferences, and to provide information to the site owners. We also use similar technologies such as tracking pixels and browser storage, which we refer to collectively as “cookies” in this policy.",
    ],
  },
  {
    title: "How we use cookies",
    paragraphs: [
      "We use cookies for the following purposes:",
    ],
    list: [
      "Essential — required for the website to function, such as remembering your currency preference.",
      "Analytics — to understand how visitors use the site so we can improve it. We use Google Analytics (via Google Tag Manager) and Vercel Analytics.",
      "Advertising — to measure and improve our marketing campaigns. We use Google Ads and the Meta (Facebook) Pixel.",
    ],
  },
  {
    title: "Third-party cookies",
    paragraphs: [
      "Some cookies are set by third-party services that appear on our pages. These include Google (Tag Manager, Analytics and Ads) and Meta Platforms (the Facebook Pixel). These providers may use the data they collect in accordance with their own privacy and cookie policies.",
    ],
  },
  {
    title: "Managing your cookies",
    paragraphs: [
      "When you first visit the site you can accept or decline non-essential cookies via the banner shown at the bottom of the screen. You can also control or delete cookies through your browser settings at any time. Please note that disabling cookies may affect parts of the site’s functionality.",
    ],
  },
  {
    title: "Contact us",
    paragraphs: [
      "If you have any questions about how we use cookies, please contact us at info@luxurysupercarsdubai.com.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <main>
      <SiteNav />
      <h1 className="sr-only">Cookie Policy</h1>

      <PageHero
        eyebrow="Legal"
        h1="Cookie Policy"
        subline="How Luxury Supercars Dubai uses cookies and similar technologies."
        spotlight="left"
        compact
      />

      <section className="bg-[var(--bg-obsidian)] border-t border-white/5 py-16 md:py-20">
        <article className="container-x max-w-3xl legal-article">
          {SECTIONS.map((section) => (
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
