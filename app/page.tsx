import dynamic from "next/dynamic";
import SiteNav from "@/components/nav/SiteNav";
import ScrollHero from "@/app/components/ScrollHero";
import BrandMarquee from "@/components/sections/BrandMarquee";
import FleetSection from "@/components/sections/FleetSection";
import BrandStory from "@/components/sections/BrandStory";
import Footer from "@/components/sections/Footer";

import { FLEET_SECTIONS } from "@/lib/content";
import {
  FEATURED_SPORTS,
  FEATURED_CONVERTIBLES,
  FEATURED_LUXURY,
  FEATURED_SUVS,
} from "@/lib/fleet";

const Requirements = dynamic(() => import("@/components/sections/Requirements"), { ssr: true });
const RentalDirectory = dynamic(() => import("@/components/sections/RentalDirectory"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"), { ssr: true });
const WhyChooseUs = dynamic(() => import("@/components/sections/WhyChooseUs"), { ssr: true });
const FAQ = dynamic(() => import("@/components/sections/FAQ"), { ssr: true });
const BlogStrip = dynamic(() => import("@/components/sections/BlogStrip"), { ssr: true });
const InstagramFeed = dynamic(() => import("@/components/sections/InstagramFeed"), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact"), { ssr: true });

export default function Home() {
  return (
    <main>
      <SiteNav />
      <ScrollHero />
      <BrandMarquee />

      <FleetSection
        id={FLEET_SECTIONS.sports.id}
        eyebrow={FLEET_SECTIONS.sports.eyebrow}
        heading={FLEET_SECTIONS.sports.h2}
        body={FLEET_SECTIONS.sports.body}
        cars={FEATURED_SPORTS}
        ctaLabel={FLEET_SECTIONS.sports.cta}
        ctaHref="/rent-sports-cars-dubai"
        theme="dark"
      />

      <BrandStory />

      <FleetSection
        id={FLEET_SECTIONS.convertibles.id}
        eyebrow={FLEET_SECTIONS.convertibles.eyebrow}
        heading={FLEET_SECTIONS.convertibles.h2}
        body={FLEET_SECTIONS.convertibles.body}
        cars={FEATURED_CONVERTIBLES}
        ctaLabel={FLEET_SECTIONS.convertibles.cta}
        ctaHref="/rent-convertible-cars-dubai"
        theme="dark"
      />

      <FleetSection
        id={FLEET_SECTIONS.luxury.id}
        eyebrow={FLEET_SECTIONS.luxury.eyebrow}
        heading={FLEET_SECTIONS.luxury.h2}
        body={FLEET_SECTIONS.luxury.body}
        cars={FEATURED_LUXURY}
        ctaLabel={FLEET_SECTIONS.luxury.cta}
        ctaHref="/rent-luxury-cars-dubai"
        theme="light"
      />

      <FleetSection
        id={FLEET_SECTIONS.suvs.id}
        eyebrow={FLEET_SECTIONS.suvs.eyebrow}
        heading={FLEET_SECTIONS.suvs.h2}
        body={FLEET_SECTIONS.suvs.body}
        cars={FEATURED_SUVS}
        ctaLabel={FLEET_SECTIONS.suvs.cta}
        ctaHref="/rent-suv-cars-dubai"
        theme="dark"
      />

      <Requirements />
      <RentalDirectory />
      <Testimonials />
      <WhyChooseUs />
      <FAQ />
      <BlogStrip />
      <InstagramFeed />
      <Contact />
      <Footer />
    </main>
  );
}
