import SiteNav from "@/components/nav/SiteNav";
import FleetTypeHero from "@/components/sections/FleetTypeHero";
import FleetTypeAbout from "@/components/sections/FleetTypeAbout";
import FleetExplorer from "@/components/fleet/FleetExplorer";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import type { FAQItem } from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import type { Car } from "@/lib/fleet";
import type { FleetTypeMeta } from "@/lib/fleet-types";

function typeFaqs(typeLabel: string, cars: Car[]): FAQItem[] {
  const prices = cars.map((c) => c.price?.daily).filter(Boolean) as number[];
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  return [
    {
      q: `How much does it cost to rent ${typeLabel.toLowerCase()} in Dubai?`,
      a: `${typeLabel} rental prices in Dubai start from AED ${minPrice.toLocaleString()}/day and go up to AED ${maxPrice.toLocaleString()}/day depending on the model and rental duration. We offer daily, weekly, and monthly options with free UAE delivery.`,
    },
    {
      q: `What ${typeLabel.toLowerCase()} models are available for rent?`,
      a: `Our ${typeLabel.toLowerCase()} fleet includes the latest models from top brands like Ferrari, Lamborghini, Porsche, Bentley, and more. Each vehicle is meticulously maintained to ensure peak performance. Contact us for the current availability.`,
    },
    {
      q: `Do you offer free delivery for ${typeLabel.toLowerCase()} rentals?`,
      a: `Yes, we provide free delivery and pickup for all ${typeLabel.toLowerCase()} rentals across Dubai and the UAE. Your car will be delivered to your hotel, residence, office, or the airport at your preferred time.`,
    },
    {
      q: `What is the minimum age to rent ${typeLabel.toLowerCase()} in Dubai?`,
      a: `The minimum age to rent ${typeLabel.toLowerCase()} in Dubai is 21 years. A valid driving license is required — international visitors can drive with a valid license from their home country or an International Driving Permit (IDP).`,
    },
    {
      q: `Is insurance included with ${typeLabel.toLowerCase()} rentals?`,
      a: `Yes, basic insurance is included with every ${typeLabel.toLowerCase()} rental. Comprehensive coverage options are also available for added peace of mind.`,
    },
    {
      q: `Can I rent ${typeLabel.toLowerCase()} for a week or a month in Dubai?`,
      a: `Absolutely. We offer flexible rental periods — daily, weekly, and monthly — with discounted rates for longer durations. Perfect for extended stays, business trips, or special events in Dubai.`,
    },
    {
      q: `How do I book ${typeLabel.toLowerCase()} in Dubai?`,
      a: `Booking is quick and easy. Reach us via WhatsApp, phone, or the contact form on our website. Our team will confirm availability, arrange free delivery, and have your car ready within hours.`,
    },
  ];
}

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
      <FAQ heading={meta.faqHeading} items={typeFaqs(meta.visibleTitle, cars)} />
      <Footer />
    </main>
  );
}
