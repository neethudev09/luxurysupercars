import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import Requirements from "@/components/sections/Requirements";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/motion/Reveal";
import { SERVICES_PAGE } from "@/lib/content";
import { PAGE_HERO_IMAGES, SERVICE_IMAGES } from "@/lib/assets";

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
          <ul className="mx-auto grid max-w-[1400px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {SERVICES_PAGE.items.map((service, i) => (
              <ServiceCard key={service.slug} service={service} delay={i * 90} />
            ))}
          </ul>
        </div>
      </section>

      <Requirements />
      <WhyChooseUs />
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
  const bg = SERVICE_IMAGES[service.slug];
  return (
    <Reveal delay={delay}>
      <li className="rise list-none h-full">
        <Link
          href={`/service/${service.slug}`}
          className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-white/8 p-7 md:p-8 hover:border-[var(--champagne)]/60 transition-colors"
        >
          {bg && (
            <Image
              src={bg}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-40 transition-all duration-500 group-hover:opacity-55 group-hover:scale-[1.04]"
            />
          )}
          {/* Dark scrim keeps the title + body legible over the photo. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[var(--bg-obsidian)] via-[var(--bg-obsidian)]/85 to-[var(--bg-obsidian)]/45"
          />
          <div className="relative z-10 flex h-full flex-col">
            <h2 className="font-[var(--font-display)] text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.15] tracking-tight text-[var(--ink-hi)] mb-3">
              {service.title}
            </h2>
            <p className="text-[16.5px] leading-[1.65] text-[var(--ink-hi)]/80 mb-5">
              {service.summary}
            </p>
            <span className="mt-auto inline-flex items-center gap-2 text-[16.5px] text-[var(--champagne)] group-hover:text-[var(--champagne-hi)] transition-colors">
              Learn more
              <svg width="13" height="9" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </div>
        </Link>
      </li>
    </Reveal>
  );
}
