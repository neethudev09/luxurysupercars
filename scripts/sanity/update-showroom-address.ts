/**
 * One-off: owner moved the Dubai showroom. Patches every Sanity field
 * that hard-codes the old address.
 *
 *   Old: Showroom 317, Nadd Al Hamar, Dubai
 *        (or with en-dash separators: Showroom 317 – Nadd Al Hamar – Dubai)
 *   New: 87 4th St - Al Qouz Ind.third - Al Quoz - Dubai
 *        (Google: https://www.google.com/maps/place/Luxury+Supercars+Rental+LLC/data=!4m2!3m1!1s0x0:0xdee795e93769d1d8)
 *
 * Touches:
 *   - siteSettings.contact.address (drives footer + contact page)
 *   - 10 blogPost.bodyHtml occurrences (both delimiter styles)
 *
 * Hardcoded references in app/careers/page.tsx + components/seo/JsonLd.tsx
 * are updated by separate code edits, not this script.
 */
import { client } from "./lib";

const NEW_ADDRESS = "87 4th St - Al Qouz Ind.third - Al Quoz - Dubai";

const REPLACEMENTS: Array<[string, string]> = [
  // Comma-delimited inline form.
  ["Showroom 317, Nadd Al Hamar, Dubai", "87 4th St, Al Qouz Ind.third, Al Quoz, Dubai"],
  // En-dash delimited form (used in the body's "contact strip" blocks).
  ["Showroom 317 – Nadd Al Hamar – Dubai", "87 4th St – Al Qouz Ind.third – Al Quoz – Dubai"],
  // Catch-all for prose like "visit our showroom at Nadd Al Hamar." — runs
  // last so the full-address replacements above take precedence.
  ["Nadd Al Hamar", "Al Quoz"],
];

async function main() {
  // 1) Site settings.
  await client
    .patch("siteSettings")
    .set({ "contact.address": NEW_ADDRESS, "contact.altAddress": "" })
    .commit();
  console.log("✓ siteSettings.contact.address updated");

  // 2) Blog posts — find every post whose bodyHtml mentions the old address.
  const posts = await client.fetch<{ _id: string; slug: string; bodyHtml: string }[]>(`
    *[_type == "blogPost" && (bodyHtml match "*Showroom 317*" || bodyHtml match "*Nadd Al Hamar*")]{
      _id, "slug": slug.current, bodyHtml
    }
  `);
  console.log(`  found ${posts.length} blog post(s) referencing the old address`);

  let patched = 0;
  for (const p of posts) {
    let next = p.bodyHtml;
    for (const [from, to] of REPLACEMENTS) {
      next = next.split(from).join(to);
    }
    if (next === p.bodyHtml) {
      console.warn(`  - ${p.slug}: matched the query but no literal replacement applied`);
      continue;
    }
    // Sanity-check: nothing residual that would still surface the old text.
    if (/Showroom 317|Nadd Al Hamar/.test(next)) {
      console.warn(`  ! ${p.slug}: still contains old address fragments after patch`);
    }
    await client.patch(p._id).set({ bodyHtml: next }).commit();
    patched++;
    console.log(`  ✓ ${p.slug}`);
  }
  console.log(`✓ ${patched} blog post(s) patched`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
