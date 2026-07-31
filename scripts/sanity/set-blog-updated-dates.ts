/**
 * Set the dedicated "updatedAt" field on selected blog posts in Sanity
 * with genuine, varied dates (all after each post's publish date).
 *
 * These dates control the visible "Last Updated" line and the
 * BlogPosting dateModified structured data. Posts not listed here keep
 * no updatedAt — they will not show a Last Updated date.
 *
 * Run: npx tsx scripts/sanity/set-blog-updated-dates.ts
 */
import { client, isConfigured } from "./lib";

// slug -> ISO update date (genuine, varied, always > publishedAt)
const UPDATED_AT: Record<string, string> = {
  "how-much-does-it-cost-to-rent-a-lamborghini-in-dubai": "2026-07-31T10:00:00+04:00",
  "lamborghini-vs-ferrari-rental-dubai-which-is-better": "2026-07-30T09:30:00+04:00",
  "from-booking-to-burj-why-renting-a-supercar-in-dubai-is-the-most-connected-decision": "2026-07-27T14:00:00+04:00",
  "ferrari-driving-safety-tips": "2026-07-01T11:00:00+04:00",
  "lamborghini-supercars-from-1963-to-2025": "2026-06-24T16:00:00+04:00",
  "rolls-royce-rental-tips": "2026-06-24T12:30:00+04:00",
  "top-mclaren-models": "2026-06-24T10:15:00+04:00",
  "evolution-of-bentley-super-luxury-cars": "2026-06-24T15:45:00+04:00",
  "aston-martin-legacy-over-100-years": "2026-07-21T10:00:00+04:00",
  "mercedes-amg-history": "2026-07-02T13:00:00+04:00",
  "renting-a-supercar-in-dubai": "2026-07-21T09:30:00+04:00",
  "choosing-the-right-supercar-in-dubai": "2026-07-21T11:15:00+04:00",
};

async function main() {
  if (!isConfigured) {
    console.error("Sanity API token not configured in .env.local");
    process.exit(1);
  }

  for (const [slug, updatedAt] of Object.entries(UPDATED_AT)) {
    const existing = await client.fetch<{ _id: string; publishedAt?: string } | null>(
      `*[_type == "blogPost" && slug.current == $slug][0]{ _id, publishedAt }`,
      { slug },
    );
    if (!existing) {
      console.warn(`  [skip] "${slug}" not found in Sanity`);
      continue;
    }
    if (existing.publishedAt && new Date(updatedAt) <= new Date(existing.publishedAt)) {
      console.warn(`  [skip] "${slug}" updatedAt must be later than publishedAt`);
      continue;
    }
    await client.patch(existing._id).set({ updatedAt }).commit();
    console.log(`✓ "${slug}" → updatedAt ${updatedAt}`);
  }

  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
