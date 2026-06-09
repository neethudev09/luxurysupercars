import {
  HERO,
  FLEET_SECTIONS,
  BRAND_STORY,
  REQUIREMENTS,
  WHY_US,
  TESTIMONIALS,
  FAQ,
  BLOG,
  INSTAGRAM,
} from "@/lib/content";
import { client } from "./lib";

/**
 * Seed the Home page document's `homeContent` block (objects/homeContent.ts)
 * with the current verbatim homepage copy, so the team sees and can edit the
 * real text in /studio.
 *
 * Run ONCE after deploying the schema:  npx tsx scripts/sanity/migrate-homepage.ts
 *
 * Uses `setIfMissing`, so it only seeds when the block is absent — re-running
 * never clobbers edits the team has already made. To re-seed from scratch,
 * clear the "Homepage content" block in the Studio first.
 *
 * Source values come from lib/content.ts. At seed time lib/generated/home.json
 * is `{}`, so those exports equal the verbatim live literals — the seed is
 * byte-exact and the rendered homepage is unchanged.
 */

const fleet = (s: { eyebrow: string; h2: string; body: string; cta: string }) => ({
  eyebrow: s.eyebrow,
  h2: s.h2,
  body: s.body,
  cta: s.cta,
});

const homeContent = {
  hero: {
    h1: HERO.h1,
    subline: HERO.sub,
    ctaPrimary: HERO.ctaPrimary,
    ctaSecondary: HERO.ctaSecondary,
    ratingStars: HERO.rating.stars,
    ratingCount: HERO.rating.count,
  },
  fleetSports: fleet(FLEET_SECTIONS.sports),
  fleetConvertible: fleet(FLEET_SECTIONS.convertibles),
  fleetLuxury: fleet(FLEET_SECTIONS.luxury),
  fleetSuv: fleet(FLEET_SECTIONS.suvs),
  brandStory: {
    eyebrow: BRAND_STORY.eyebrow,
    h2: BRAND_STORY.h2,
    paragraphs: [...BRAND_STORY.paragraphs],
    stats: BRAND_STORY.stats.map((s, i) => ({
      _type: "stat",
      _key: `stat-${i}`,
      value: s.value,
      decimals: "decimals" in s ? (s as { decimals: number }).decimals : 0,
      suffix: s.suffix,
      label: s.label,
    })),
  },
  requirements: {
    eyebrow: REQUIREMENTS.eyebrow,
    h2: REQUIREMENTS.h2,
    items: REQUIREMENTS.items.map((it, i) => ({
      _type: "requirement",
      _key: `req-${i}`,
      title: it.title,
      body: it.body,
    })),
  },
  whyUs: {
    eyebrow: WHY_US.eyebrow,
    h2: WHY_US.h2,
    cards: WHY_US.cards.map((c, i) => ({
      _type: "whyCard",
      _key: `why-${i}`,
      title: c.title,
      body: c.body,
    })),
  },
  testimonialsHeading: { eyebrow: TESTIMONIALS.eyebrow, h2: TESTIMONIALS.h2 },
  faqHeading: { eyebrow: FAQ.eyebrow, h2: FAQ.h2, h3: FAQ.h3 },
  blogHeading: { eyebrow: BLOG.eyebrow, h2: BLOG.h2 },
  instagramHeading: { eyebrow: INSTAGRAM.eyebrow, h2: INSTAGRAM.h2 },
};

async function main() {
  const existing = await client.getDocument("page-home");
  if (!existing) {
    throw new Error(
      "page-home document not found — run `npx tsx scripts/sanity/migrate-pages.ts` first.",
    );
  }

  await client
    .patch("page-home")
    .setIfMissing({ homeContent })
    .commit({ visibility: "async" });

  const seeded = !("homeContent" in existing);
  console.log(
    seeded
      ? "✓ Seeded page-home.homeContent with the current homepage copy."
      : "• page-home.homeContent already present — left untouched (setIfMissing).",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
