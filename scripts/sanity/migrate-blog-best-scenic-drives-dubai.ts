/**
 * Blog post: "Best Scenic Drives in Dubai: Luxury Car Rental Routes"
 *
 * Replaces the removed desert-safari post. Paved/on-road routes only.
 * Flagged as the featured post on /blog.
 *
 * Run: npx tsx scripts/sanity/migrate-blog-best-scenic-drives-dubai.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { batchCreateOrReplace, client, uploadLocalAsset } from "./lib";

const SLUG = "best-scenic-drives-dubai-luxury-car-rental";

interface LocalPost {
  slug?: string;
  bodyHtml?: string;
  excerpt?: string;
  keywords?: string[];
  faqSchema?: Array<{ name: string; acceptedAnswer: { text: string } }>;
}

async function main() {
  const localFile = resolve(process.cwd(), "blog-local", "posts.json");
  const raw: LocalPost[] = JSON.parse(readFileSync(localFile, "utf8"));
  const local = raw.find((p) => p.slug === SLUG) ?? {};

  const heroImage = await uploadLocalAsset(
    "/images/legacy/2025/08/DSCF9336-scaled.jpg",
  );

  const doc = {
    _id: `blogPost-${SLUG}`,
    _type: "blogPost",
    title: "Best Scenic Drives in Dubai: Luxury Car Rental Routes",
    h1: "Best Scenic Drives in Dubai: Where to Go in a Luxury Rental Car",
    slug: { _type: "slug", current: SLUG },
    publishedAt: new Date("2026-08-12T08:00:00Z").toISOString(),
    isFeatured: true,
    heroImage: heroImage
      ? { ...heroImage, alt: "Best scenic drives in Dubai in a luxury rental car" }
      : undefined,
    excerpt:
      local.excerpt ||
      "From Sheikh Zayed Road's glass skyline to Jumeirah Beach Road, the Palm and the Hatta mountain pass, these are the best scenic drives in Dubai for a luxury car rental.",
    keywords: local.keywords,
    author: "Ahmed Amwell",
    faq: (local.faqSchema ?? []).map((f) => ({
      question: f.name,
      answer: f.acceptedAnswer.text,
    })),
    bodyHtml:
      local.bodyHtml ||
      "<p>Missing local body — run with blog-local/posts.json present.</p>",
    seo: {
      title: "Best Scenic Drives in Dubai: Luxury Car Rental Routes",
      description:
        "Discover the best scenic drives in Dubai for a luxury car rental — skyline boulevards, coastal roads, Palm Jumeirah and the Hatta mountain route, plus when to drive in the summer heat.",
      noIndex: false,
    },
  };

  await batchCreateOrReplace([doc], { label: "blog-best-scenic-drives-dubai" });

  const live = await client.fetch(
    `*[_id == "blogPost-${SLUG}"][0]{ "featured": isFeatured, "slug": slug.current, "asset": heroImage.asset._ref }`,
  );
  console.log("Sanity check:", JSON.stringify(live, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
