import {
  CONTACT_PAGE,
  CAREERS_PAGE,
  SERVICES_PAGE,
  FAQ_PAGE,
  BOOKING_TERMS_PAGE,
  PRIVACY_POLICY_PAGE,
  COOKIE_POLICY_PAGE,
} from "@/lib/content";
import { client } from "./lib";

/**
 * Seed the six standalone page documents' content blocks (objects/
 * standalonePages.ts) with the current verbatim copy, so the team sees and can
 * edit the real content in /studio. The SEO title/description were already set
 * on these docs by migrate-pages.ts.
 *
 * Run ONCE after deploying the schema:  npx tsx scripts/sanity/migrate-standalone-pages.ts
 *
 * Uses `setIfMissing`, so re-running never clobbers edits. At seed time the
 * generated/pages.json is `{}`, so the *_PAGE consts equal the verbatim live
 * copy — the seed is byte-exact and the pages render unchanged.
 */

const SEEDS: { id: string; field: string; value: Record<string, unknown> }[] = [
  {
    id: "page-contact-us",
    field: "contactPageContent",
    value: {
      eyebrow: CONTACT_PAGE.eyebrow,
      h1: CONTACT_PAGE.h1,
      h2: CONTACT_PAGE.h2,
      intro: CONTACT_PAGE.intro,
      body: CONTACT_PAGE.body,
    },
  },
  {
    id: "page-careers",
    field: "careersPageContent",
    value: {
      eyebrow: CAREERS_PAGE.eyebrow,
      h1: CAREERS_PAGE.h1,
      subline: CAREERS_PAGE.subline,
      h2: CAREERS_PAGE.h2,
      paragraphs: [...CAREERS_PAGE.paragraphs],
    },
  },
  {
    id: "page-services",
    field: "servicesPageContent",
    value: { eyebrow: SERVICES_PAGE.eyebrow, h1: SERVICES_PAGE.h1 },
  },
  {
    id: "page-faq",
    field: "faqPageContent",
    value: { eyebrow: FAQ_PAGE.eyebrow, h1: FAQ_PAGE.h1, subline: FAQ_PAGE.subline },
  },
  {
    id: "page-booking-tcs",
    field: "bookingTermsContent",
    value: {
      eyebrow: BOOKING_TERMS_PAGE.eyebrow,
      h1: BOOKING_TERMS_PAGE.h1,
      subline: BOOKING_TERMS_PAGE.subline,
      intro: BOOKING_TERMS_PAGE.intro,
      sections: BOOKING_TERMS_PAGE.sections.map((s, i) => ({
        _type: "termsSection",
        _key: `sec-${i}`,
        title: s.title,
        groups: s.groups.map((g, j) => ({
          _type: "termsGroup",
          _key: `grp-${i}-${j}`,
          subtitle: g.subtitle,
          items: [...g.items],
        })),
      })),
    },
  },
  {
    id: "page-privacy-policy",
    field: "privacyPolicyContent",
    value: {
      eyebrow: PRIVACY_POLICY_PAGE.eyebrow,
      h1: PRIVACY_POLICY_PAGE.h1,
      subline: PRIVACY_POLICY_PAGE.subline,
      sections: PRIVACY_POLICY_PAGE.sections.map((s, i) => {
        const section: Record<string, unknown> = {
          _type: "policySection",
          _key: `sec-${i}`,
          title: s.title,
          paragraphs: [...s.paragraphs],
        };
        if ("list" in s && s.list?.length) section.list = [...s.list];
        if ("trailer" in s && s.trailer?.length) section.trailer = [...s.trailer];
        return section;
      }),
    },
  },
  {
    id: "page-cookie-policy",
    field: "cookiePolicyContent",
    value: {
      eyebrow: COOKIE_POLICY_PAGE.eyebrow,
      h1: COOKIE_POLICY_PAGE.h1,
      subline: COOKIE_POLICY_PAGE.subline,
      sections: COOKIE_POLICY_PAGE.sections.map((s, i) => {
        const section: Record<string, unknown> = {
          _type: "cookieSection",
          _key: `sec-${i}`,
          title: s.title,
          paragraphs: [...s.paragraphs],
        };
        if ("list" in s && s.list?.length) section.list = [...s.list];
        return section;
      }),
    },
  },
];

async function main() {
  for (const { id, field, value } of SEEDS) {
    const existing = await client.getDocument(id);
    if (!existing) {
      console.warn(`• ${id} not found — run migrate-pages.ts first. Skipping.`);
      continue;
    }
    await client.patch(id).setIfMissing({ [field]: value }).commit({ visibility: "async" });
    console.log(`✓ ${id}.${field}`);
  }
  console.log("Done — standalone page content seeded.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
