import { FOOTER, NAV_LINKS, PROMO } from "@/lib/content";
import { client } from "./lib";

/**
 * Seed the site-wide chrome on the siteSettings singleton — footer (copyright,
 * brand list, link columns), the main nav links, and the promo pop-up copy —
 * with the current values, so the team can edit them in /studio.
 *
 * Run ONCE after deploying the schema:  npx tsx scripts/sanity/migrate-chrome.ts
 *
 * Uses `setIfMissing`, so re-running never clobbers edits. At seed time the
 * site-settings.json has no footer/navLinks/promo, so the FOOTER/NAV_LINKS/PROMO
 * consts equal the built-in defaults — the seed is byte-exact, render unchanged.
 */

const keyed = (arr: { label: string; href: string }[], prefix: string) =>
  arr.map((l, i) => ({ _type: "navLink", _key: `${prefix}-${i}`, label: l.label, href: l.href }));

async function main() {
  const existing = await client.getDocument("siteSettings");
  if (!existing) {
    throw new Error("siteSettings not found — run `npx tsx scripts/sanity/migrate-site-settings.ts` first.");
  }

  await client
    .patch("siteSettings")
    .setIfMissing({
      footer: {
        copyright: FOOTER.copyright,
        brands: [...FOOTER.brands],
        rentLinks: keyed(FOOTER.rent, "rent"),
        usefulLinks: keyed(FOOTER.useful, "useful"),
        legalLinks: keyed(FOOTER.legal, "legal"),
      },
      navLinks: keyed(NAV_LINKS, "nav"),
      promo: {
        eyebrow: PROMO.eyebrow,
        heading: PROMO.heading,
        highlight: PROMO.highlight,
        body: PROMO.body,
        buttonLabel: PROMO.buttonLabel,
        disclaimer: PROMO.disclaimer,
      },
    })
    .commit({ visibility: "async" });

  console.log("✓ Seeded siteSettings.footer / navLinks / promo");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
