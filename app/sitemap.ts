import type { MetadataRoute } from "next";
import { FLEET_BRAND_SLUGS } from "@/lib/fleet-brands";
import { UNIQUE_CARS, carHref } from "@/lib/fleet";
import { BLOG_POSTS } from "@/lib/blog";
import { SERVICES_PAGE } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const ORIGIN = SITE_URL;
const now = new Date();

/**
 * Mirrors the live luxurysupercarsdubai.com sitemap structure verbatim
 * (page-sitemap.xml + service-sitemap.xml + product-sitemap.xml +
 * blogs-sitemap.xml + product_cat-sitemap.xml). Every URL the live site
 * exposes should resolve here at the same slug.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${ORIGIN}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${ORIGIN}/about-us`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${ORIGIN}/our-fleet`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${ORIGIN}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${ORIGIN}/contact-us`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${ORIGIN}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${ORIGIN}/careers`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${ORIGIN}/booking-tcs`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${ORIGIN}/privacy-policy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${ORIGIN}/blog`, changeFrequency: "weekly", priority: 0.8 },
    // Live category pages
    { url: `${ORIGIN}/rent-sports-cars-dubai`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${ORIGIN}/rent-convertible-cars-dubai`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${ORIGIN}/rent-luxury-cars-dubai`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${ORIGIN}/rent-suv-cars-dubai`, changeFrequency: "weekly", priority: 0.85 },
  ];

  // Service detail pages — live: /service/{slug}/
  const servicePages: MetadataRoute.Sitemap = SERVICES_PAGE.items.map((s) => ({
    url: `${ORIGIN}/service/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Brand pages — live: /brands/rent-{brand}-dubai/
  const brandPages: MetadataRoute.Sitemap = FLEET_BRAND_SLUGS.map((slug) => ({
    url: `${ORIGIN}/brands/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Car detail pages — live: /{brand}/{slug}/
  const carPages: MetadataRoute.Sitemap = UNIQUE_CARS.map((c) => ({
    url: `${ORIGIN}${carHref(c)}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  // Blog posts — live: /blogs/{slug}/
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${ORIGIN}/blogs/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages.map((p) => ({ lastModified: now, ...p })),
    ...servicePages.map((p) => ({ lastModified: now, ...p })),
    ...brandPages.map((p) => ({ lastModified: now, ...p })),
    ...carPages.map((p) => ({ lastModified: now, ...p })),
    ...blogPages,
  ];
}
