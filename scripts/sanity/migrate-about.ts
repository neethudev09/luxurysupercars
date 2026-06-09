import {
  ABOUT_HERO,
  ABOUT_FOUNDER,
  ABOUT_ME,
  ABOUT_VENTURES,
  ABOUT_EMBEDS,
  ABOUT_PRESS,
} from "@/lib/content";
import { client, uploadLocalAsset } from "./lib";

/**
 * Seed the About page document's `aboutContent` block (objects/aboutContent.ts)
 * with the current verbatim copy, video lists AND the current images — uploaded
 * from public/ into Sanity — so the team sees and can edit the real content +
 * media in /studio.
 *
 * Run ONCE after deploying the schema:  npx tsx scripts/sanity/migrate-about.ts
 *
 * Uses `setIfMissing`, so re-running never clobbers edits. To re-seed from
 * scratch, clear the "About page content" block in the Studio first.
 *
 * NOT uploaded: the 8.5 MB hero background video — it falls back to the bundled
 * /ahmed-trim.mp4, and the team can upload a replacement in the Studio if they
 * want to change it. Everything else (portrait, signature, venture logos, press
 * tiles) is uploaded here.
 */

const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const rail = (id: string) => {
  const r = ABOUT_EMBEDS.find((b) => b.id === id);
  return { heading: r?.heading ?? "", videos: (r?.videoIds ?? []).map(watch) };
};

async function main() {
  const existing = await client.getDocument("page-about-us");
  if (!existing) {
    throw new Error(
      "page-about-us document not found — run `npx tsx scripts/sanity/migrate-pages.ts` first.",
    );
  }

  console.log("[about] uploading current images to Sanity…");
  const portrait = await uploadLocalAsset(ABOUT_ME.portrait);
  const signature = await uploadLocalAsset(ABOUT_FOUNDER.signature);

  const ventures = await Promise.all(
    ABOUT_VENTURES.items.map(async (it, i) => {
      const logo = it.logo ? await uploadLocalAsset(it.logo) : null;
      return {
        _type: "venture",
        _key: `venture-${i}`,
        title: it.title,
        body: it.body,
        bordered: it.bordered,
        ...(logo ? { logo } : {}),
      };
    }),
  );

  const pressTiles = await Promise.all(
    ABOUT_PRESS.items.map(async (t, i) => {
      const image = await uploadLocalAsset(t.image);
      return {
        _type: "pressTile",
        _key: `press-${i}`,
        category: t.category,
        caption: t.caption,
        ...(image ? { image } : {}),
      };
    }),
  );

  const aboutContent = {
    hero: { heading: ABOUT_HERO.heading, paragraph: ABOUT_HERO.paragraph },
    founder: {
      heading: ABOUT_FOUNDER.heading,
      paragraph: ABOUT_FOUNDER.paragraph,
      videoUrl: watch(ABOUT_FOUNDER.videoId),
      ...(signature ? { signature } : {}),
    },
    aboutMe: {
      heading: ABOUT_ME.heading,
      paragraphs: [...ABOUT_ME.paragraphs],
      ...(portrait ? { portrait } : {}),
    },
    ventures: { eyebrow: ABOUT_VENTURES.eyebrow, items: ventures },
    embeds: {
      tiktok: rail("tiktok"),
      youtube: rail("youtube"),
      podcasts: rail("podcasts"),
    },
    pressReel: { items: pressTiles },
  };

  await client
    .patch("page-about-us")
    .setIfMissing({ aboutContent })
    .commit({ visibility: "async" });

  const seeded = !("aboutContent" in existing);
  console.log(
    seeded
      ? `✓ Seeded page-about-us.aboutContent (uploaded ${[portrait, signature, ...ventures.map((v) => "logo" in v), ...pressTiles.map((p) => "image" in p)].filter(Boolean).length} images).`
      : "• page-about-us.aboutContent already present — left untouched (setIfMissing).",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
