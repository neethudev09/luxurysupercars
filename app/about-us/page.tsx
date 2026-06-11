import type { Metadata } from "next";
import SiteNav from "@/components/nav/SiteNav";
import AboutScrollHero from "@/components/sections/AboutScrollHero";
import AboutVideo from "@/components/sections/AboutVideo";
import AboutFocus from "@/components/sections/AboutFocus";
import AboutMarquee from "@/components/sections/AboutMarquee";
import AboutSocialEmbeds from "@/components/sections/AboutSocialEmbeds";
import Footer from "@/components/sections/Footer";

/** 
 * SEO copy preserved verbatim from luxurysupercarsdubai.com/about-us/.
 * Page structure follows the carent reference layout: hero → image-fade
 * story → bio + video → stats → brands → focus block → showcase grid.
 * "Our Team" and "FAQs" intentionally omitted per the brief.
 */
export const metadata: Metadata = {
  title: "About Us | Luxury Super Car Rental",
  description:
    "Our mission is to provide the best luxury car rentals and services solutions, with a focus on exclusivity for your holiday or business experience.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About Us | Luxury Super Car Rental",
    description:
      "Our mission is to provide the best luxury car rentals and services solutions, with a focus on exclusivity for your holiday or business experience.",
    url: "/about-us",
    siteName: "Luxury Supercars Dubai",
    locale: "en_AE",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main>
      <SiteNav />
      {/* Visually-hidden — preserves the verbatim live-site <h1> for SEO
          while the visible design uses the AboutStory hero instead. */}
      <h1 className="sr-only">About Us</h1>
      <AboutScrollHero />
      <AboutVideo />
      <AboutMarquee />
      <AboutFocus />
      <AboutSocialEmbeds />
      <Footer />
    </main>
  );
}
