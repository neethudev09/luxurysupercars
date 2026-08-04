/**
 * Blog post: "7 Things To Know When Renting a Luxury Car in Dubai"
 *
 * Run: npx tsx scripts/sanity/migrate-blog-mistakes-luxury-car-dubai.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { batchCreateOrReplace } from "./lib";

const SLUG = "mistakes-consider-when-renting-luxury-car-dubai";

interface LocalPost {
  bodyHtml?: string;
  excerpt?: string;
  keywords?: string[];
  faqSchema?: Array<{ name: string; acceptedAnswer: { text: string } }>;
}

async function main() {
  const localFile = resolve(
    process.cwd(),
    "blog-local",
    "posts.json",
  );
  const raw: LocalPost[] = JSON.parse(readFileSync(localFile, "utf8"));
  const local = raw.find((p) => p.bodyHtml) ?? {};

  const doc = {
    _id: `blogPost-${SLUG}`,
    _type: "blogPost",
    title: "7 Things To Know When Renting a Luxury Car in Dubai",
    h1: "7 Things To Know When Renting a Luxury Car in Dubai",
    slug: { _type: "slug", current: SLUG },
    publishedAt: new Date("2026-08-04T08:00:00Z").toISOString(),
    excerpt:
      local.excerpt ||
      "Seven common mistakes people make when renting a luxury car in Dubai: driver eligibility, hidden charges, insurance details, car selection, inspection, traffic laws, and last-minute bookings, plus how to avoid them.",
    keywords: local.keywords,
    faq: (local.faqSchema ?? []).map((f) => ({
      question: f.name,
      answer: f.acceptedAnswer.text,
    })),
    bodyHtml:
      local.bodyHtml ||
      "<p>Missing local body — run with blog-local/posts.json present.</p>",
    seo: {
      title: "7 Things To Know When Renting a Luxury Car in Dubai",
      description:
        "Don't make mistakes when renting a luxury car in Dubai. Important Tips For Renting Exotic Cars In Dubai: Driving Regulations, Insurance Tips, Booking Suggestions For A Trouble-Free Driving Experience.",
      noIndex: false,
    },
  };

  await batchCreateOrReplace([doc], { label: "blog-mistakes-luxury-car-dubai" });
  console.log("✓ Blog post created in Sanity");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
