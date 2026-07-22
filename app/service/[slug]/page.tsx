import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import FleetSection from "@/components/sections/FleetSection";
import Reveal from "@/components/motion/Reveal";
import MagneticCTA from "@/components/motion/MagneticCTA";
import { SERVICES_PAGE } from "@/lib/content";
import { SERVICE_IMAGES } from "@/lib/assets";
import Footer from "@/components/sections/Footer";
import { SPORTS_CARS, CONVERTIBLE_CARS, LUXURY_CARS, SUV_CARS } from "@/lib/fleet";

type Params = { slug: string };

const ITEMS = SERVICES_PAGE.items;

function getService(slug: string) {
  return ITEMS.find((i) => i.slug === slug);
}

export function generateStaticParams(): Params[] {
  return ITEMS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/service/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `/service/${service.slug}/`,
      siteName: "Luxury Supercars Dubai",
      locale: "en_AE",
      type: "website",
    },
  };
}

/**
 * Pairs each service with a curated set of fleet cars whose vibe matches
 * the occasion. Reuses the polished FleetSection layout below the body.
 */
function getRelatedFleet(slug: string) {
  switch (slug) {
    case "weddings-special-events":
      return {
        cars: LUXURY_CARS,
        eyebrow: "Wedding-ready",
        heading: "**Cars** for the moment",
        body: "Rolls-Royce convoys, Lamborghini arrivals and Mercedes G63s — handpicked from the fleet for your day.",
      };
    case "long-term-rental":
      return {
        cars: SUV_CARS,
        eyebrow: "Long-term favourites",
        heading: "**Built** for the weeks ahead",
        body: "Comfortable, premium, and easy to live with. The fleet's most popular long-term cars.",
      };
    case "self-drive-car-rental":
      return {
        cars: SPORTS_CARS,
        eyebrow: "Self-drive picks",
        heading: "**Take** the wheel",
        body: "From McLaren to Ferrari to Lamborghini — the cars our self-drive clients ask for most.",
      };
    case "gift-vouchers":
      return {
        cars: CONVERTIBLE_CARS,
        eyebrow: "Gift-worthy",
        heading: "**Cars** worth gifting",
        body: "Convertibles and head-turners — perfect to pair with a voucher for the car-lover in your life.",
      };
    default:
      return {
        cars: LUXURY_CARS,
        eyebrow: "Fleet",
        heading: "**Explore** the fleet",
        body: "Browse a curated selection from the wider Luxury Supercars Dubai fleet.",
      };
  }
}

export default async function ServiceDetailPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = ITEMS.filter((i) => i.slug !== slug);
  const heroImage = SERVICE_IMAGES[service.slug];
  const related = getRelatedFleet(service.slug);

  return (
    <main>
      <SiteNav />
    {/*   <h1 className="sr-only">{service.h1}</h1>*/}

      <PageHero
        eyebrow="Service"
        h1={service.h1}
        backgroundImage={heroImage}
        backgroundOpacity={0.32}
        spotlight="right"
      />

      <section className="relative bg-[var(--bg-pearl)] border-t border-black/5 py-20 md:py-24 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 bottom-0 size-[520px] -translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--champagne)]/[0.08] blur-[140px]"
        />

        <div className="container-x relative grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-8">
            <div className="flex flex-col gap-7 max-w-2xl">
              {service.paragraphs.map((p, i) => {
                if (i === 0) {
                  return (
                    <Reveal key={i}>
                      <p className="rise font-[var(--font-display)] text-[clamp(1.2rem,1.8vw,1.45rem)] leading-[1.5] text-[var(--ink-dark-hi)]">
                        {p}
                      </p>
                    </Reveal>
                  );
                }
                return (
                  <Reveal key={i} delay={i * 70}>
                    <p className="rise text-[16px] leading-[1.78] text-[var(--ink-dark-lo)]">{p}</p>
                  </Reveal>
                );
              })}
            </div>

            <Reveal>
              <div className="rise mt-12">
                <MagneticCTA
                  href="/contact-us"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-7 py-3.5 text-[15px] font-medium hover:bg-[var(--champagne-hi)] transition-colors"
                >
                  <span>Enquire about {service.title}</span>
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </MagneticCTA>
              </div>
            </Reveal>
          </div>

          <aside className="md:col-span-4">
            <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-5">
              Other Services
            </p>
            <ul className="flex flex-col gap-3">
              {others.map((o, i) => (
                <Reveal key={o.slug} delay={i * 80}>
                  <li className="rise">
                    <Link
                      href={`/service/${o.slug}`}
                      className="group flex items-center gap-4 rounded-xl border border-black/10 bg-[var(--bg-bone)] px-4 py-4 hover:border-[var(--champagne)] hover:bg-[var(--bg-bone)]/70 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-[var(--font-display)] text-[17px] leading-tight text-[var(--ink-dark-hi)] group-hover:text-[var(--champagne)] transition-colors">
                          {o.title}
                        </p>
                        <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--ink-dark-lo)] mt-1">
                          Learn more
                        </p>
                      </div>
                      <svg width="13" height="9" viewBox="0 0 14 10" fill="none" className="text-[var(--ink-dark-lo)] opacity-60 transition-transform group-hover:translate-x-1 group-hover:text-[var(--champagne)]">
                        <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <FleetSection
        id="related-fleet"
        eyebrow={related.eyebrow}
        heading={related.heading}
        body={related.body}
        cars={related.cars}
        ctaLabel="View Full Fleet"
        ctaHref="/our-fleet"
        theme="dark"
      />

      <Footer />
    </main>
  );
}
