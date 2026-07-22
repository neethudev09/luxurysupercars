import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import EnquiryForm from "@/components/contact/EnquiryForm";
import Reveal from "@/components/motion/Reveal";
import MagneticCTA from "@/components/motion/MagneticCTA";
import { CONTACT, CONTACT_PAGE } from "@/lib/content";
import { PAGE_HERO_IMAGES } from "@/lib/assets";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: CONTACT_PAGE.metaTitle,
  description: CONTACT_PAGE.metaDescription,
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: CONTACT_PAGE.metaTitle,
    description: CONTACT_PAGE.metaDescription,
    url: "/contact-us/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

const ADDRESSES = [
  {
    label: "Showroom",
    value: "87 4th St - Al Qouz Ind.third - Al Quoz - Dubai",
    maps: "https://www.google.com/maps/search/?api=1&query=Luxury+Supercars+Rental+LLC+Dubai",
  },
];

export default function ContactUsPage() {
  return (
    <main>
      <SiteNav />

      {/* SEO H1 
      <h1 className="sr-only">{CONTACT_PAGE.h1}</h1>*/}
      
<PageHero
  eyebrow={CONTACT_PAGE.eyebrow}
  h1={CONTACT_PAGE.h1}
  h2={CONTACT_PAGE.h2}
  subline={CONTACT_PAGE.intro}
  hideH1
  backgroundImage={PAGE_HERO_IMAGES.contact}
  backgroundOpacity={0.22}
  spotlight="right"
/>

      <section className="relative bg-[var(--bg-obsidian)] border-t border-white/5 py-20 md:py-24 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 bottom-0 size-[520px] -translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--champagne)]/[0.05] blur-[140px]"
        />

        <div className="container-x relative grid min-w-0 gap-12 md:grid-cols-12 md:gap-16">
          {/* LEFT COLUMN */}
          <div className="min-w-0 md:col-span-5">
            <Reveal>
              <p className="rise font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-5">
                Our Contact
              </p>
            </Reveal>

            <Reveal>
              <p className="rise text-[16.5px] leading-[1.78] text-[var(--ink-lo)] max-w-md">
                {CONTACT_PAGE.body}
              </p>
            </Reveal>

            <ul className="mt-10 flex flex-col divide-y divide-white/8 border-y border-white/8">
              {[
                {
                  label: "Primary",
                  value: CONTACT.primaryPhone,
                  href: `tel:${CONTACT.primaryPhone.replace(/\s/g, "")}`,
                },
                {
                  label: "Secondary",
                  value: CONTACT.secondaryPhone,
                  href: `tel:${CONTACT.secondaryPhone.replace(/\s/g, "")}`,
                },
                {
                  label: "Landline",
                  value: CONTACT.landline,
                  href: `tel:${CONTACT.landline.replace(/\s/g, "")}`,
                },
                {
                  label: "Email",
                  value: CONTACT.email,
                  href: `mailto:${CONTACT.email}`,
                },
              ].map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    className="group flex items-center justify-between py-4 text-[16px] text-[var(--ink-hi)] hover:text-[var(--champagne)] transition-colors"
                  >
                    <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--ink-lo)] w-28">
                      {r.label}
                    </span>

                    <span className="flex-1 text-right ml-4 group-hover:text-[var(--champagne)]">
                      {r.value}
                    </span>

                    <svg
                      width="13"
                      height="9"
                      viewBox="0 0 13 9"
                      fill="none"
                      className="ml-3 opacity-50 transition-transform group-hover:translate-x-1"
                    >
                      <path
                        d="M0 4.5h11M8 1l3 3.5L8 8"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-3">
                Operation Hours
              </p>

              <p className="font-[var(--font-display)] text-[clamp(1.3rem,2vw,1.7rem)] leading-tight text-[var(--ink-hi)]">
                {CONTACT_PAGE.hours}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="min-w-0 md:col-span-6 md:col-start-7">
            <Reveal>
              <p className="rise font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-5">
                Locations
              </p>
            </Reveal>

            {/* MAP */}
            <Reveal>
              <div className="rise relative mb-5 h-[260px] w-full overflow-hidden rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/40 md:h-[300px]">
                <iframe
                  title="Luxury Supercars Rental LLC Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.37536195561!2d55.20584247437401!3d25.12299753470402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69963d253865%3A0xdee795e93769d1d8!2sLuxury%20Supercars%20Rental%20LLC!5e0!3m2!1sen!2sae!4v1781683259000!5m2!1sen!2sae"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </Reveal>

            <ul className="grid gap-5">
              {ADDRESSES.map((a, i) => (
                <Reveal key={a.label} delay={i * 90}>
                  <li className="rise group relative overflow-hidden rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/40 p-6 md:p-7 hover:border-[var(--champagne)]/40 transition-colors">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-12 -bottom-16 size-[260px] rounded-full bg-[var(--champagne)]/[0.04] blur-[80px] group-hover:bg-[var(--champagne)]/[0.07] transition-colors"
                    />

                    <div className="relative">
                      <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.24em] text-[var(--champagne)] mb-3">
                        {a.label}
                      </p>

                      <p className="font-[var(--font-display)] text-[clamp(1.05rem,1.5vw,1.25rem)] leading-snug text-[var(--ink-hi)] mb-5">
                        {a.value}
                      </p>

                      <MagneticCTA
                        href={a.maps}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[16.5px] text-[var(--ink-hi)] hover:bg-white/5 hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
                      >
                        <span>Open in Maps</span>

                        <svg
                          width="13"
                          height="9"
                          viewBox="0 0 14 10"
                          fill="none"
                        >
                          <path
                            d="M0 5h12M8 1l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.4"
                          />
                        </svg>
                      </MagneticCTA>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            <EnquiryForm className="mt-5" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
