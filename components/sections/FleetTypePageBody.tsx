import SiteNav from "@/components/nav/SiteNav";
import FleetTypeHero from "@/components/sections/FleetTypeHero";
import FleetTypeAbout from "@/components/sections/FleetTypeAbout";
import FleetExplorer from "@/components/fleet/FleetExplorer";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import type { Car } from "@/lib/fleet";
import type { FleetTypeMeta } from "@/lib/fleet-types";

interface FleetTypePageBodyProps {
  meta: FleetTypeMeta;
  cars: Car[];
}

/**
 * Shared shell for /rent-{type}-cars-dubai routes. The 4 type pages each
 * pass their own FleetTypeMeta + pre-filtered car list. The Type filter
 * in the sidebar is hidden since the category is locked by the route.
 */
export default function FleetTypePageBody({ meta, cars }: FleetTypePageBodyProps) {
  return (
    <main>
      <SiteNav />
      <FleetTypeHero visibleTitle={meta.visibleTitle} h1={meta.h1} />
      <FleetExplorer cars={cars} hideTypeFilter />
      <FleetTypeAbout
        paragraphs={meta.introParagraphs}
        eyebrowLabel={meta.visibleTitle}
      />
      <Testimonials />
      <FAQ heading={meta.faqHeading} items={meta.faqs} />
      <Footer />
    </main>
  );
}
