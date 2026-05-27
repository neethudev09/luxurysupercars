import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import Requirements from "@/components/sections/Requirements";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/motion/Reveal";
import { SERVICES_PAGE } from "@/lib/content";
import { PAGE_HERO_IMAGES } from "@/lib/assets";

export const metadata: Metadata = {
  title: SERVICES_PAGE.metaTitle,
  description: SERVICES_PAGE.metaDescription,
  alternates: { canonical: "/services" },
  openGraph: {
    title: SERVICES_PAGE.metaTitle,
    description: SERVICES_PAGE.metaDescription,
    url: "/services/",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <main>
      <SiteNav />
      <h1 className="sr-only">{SERVICES_PAGE.h1}</h1>

      <PageHero
        eyebrow="Services"
        h1={SERVICES_PAGE.h1}
        backgroundImage={PAGE_HERO_IMAGES.services}
        backgroundOpacity={0.22}
        spotlight="left"
      />

      <section className="relative bg-[var(--bg-obsidian)] border-t border-white/5 py-20 md:py-24 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/3 size-[520px] translate-x-1/3 rounded-full bg-[var(--champagne)]/[0.05] blur-[140px]"
        />

        <div className="container-x relative">
          <ul className="mx-auto grid max-w-[1200px] grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {SERVICES_PAGE.items.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={i * 90} />
            ))}
          </ul>
        </div>
      </section>

      <Requirements />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </main>
  );
}

function ServiceCard({
  service,
  delay,
}: {
  service: (typeof SERVICES_PAGE.items)[number];
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <li className="rise list-none h-full">
        <Link
          href={`/service/${service.slug}`}
          className="group flex h-full min-h-[340px] flex-col rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/40 p-8 md:p-10 hover:border-[var(--champagne)]/60 hover:bg-[var(--bg-graphite)]/60 transition-colors"
        >
          <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-3">
            Service
          </p>
          <h2 className="font-[var(--font-display)] text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.15] tracking-tight text-[var(--ink-hi)] mb-3">
            {service.title}
          </h2>
          <p className="text-[14.5px] leading-[1.65] text-[var(--ink-lo)] mb-5">
            {service.summary}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 text-[12.5px] text-[var(--champagne)] group-hover:text-[var(--champagne-hi)] transition-colors">
            Learn more
            <svg width="13" height="9" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </Link>
      </li>
    </Reveal>
  );
}
