/**
 * One-off: owner moved the Dubai showroom. Patches every Sanity field
 * that hard-codes the old address or older mixed spellings.
 *
 * Canonical address:
 *   87 4th St, Al Quoz Industrial Third, Dubai, UAE
 *
 * Touches:
 *   - siteSettings.contact.address (drives footer + contact page)
 *   - blogPost.bodyHtml occurrences
 */
import { client } from "./lib";

const NEW_ADDRESS = "87 4th St, Al Quoz Industrial Third, Dubai, UAE";
const MOJIBAKE_DASH = "\u00e2\u20ac\u201c";
const EN_DASH = "\u2013";

const REPLACEMENTS: Array<[string, string]> = [
  ["Showroom 317, Nadd Al Hamar, Dubai", NEW_ADDRESS],
  [`Showroom 317 ${EN_DASH} Nadd Al Hamar ${EN_DASH} Dubai`, NEW_ADDRESS],
  [`Showroom 317 ${MOJIBAKE_DASH} Nadd Al Hamar ${MOJIBAKE_DASH} Dubai`, NEW_ADDRESS],
  ["87 4th St, Al Qouz Ind.third, Al Quoz, Dubai", NEW_ADDRESS],
  ["87 4th St - Al Qouz Ind.third - Al Quoz - Dubai", NEW_ADDRESS],
  ["87 4th St - Al Quoz Industrial Area 3 - Dubai", NEW_ADDRESS],
  [`59MJ+F95 ${EN_DASH} 87 4th St ${EN_DASH} Al Qouz Ind.third ${EN_DASH} Al Quoz ${EN_DASH} Dubai`, NEW_ADDRESS],
  [`59MJ+F95 ${EN_DASH} 87 4th St ${EN_DASH} Al Quoz ${EN_DASH} Dubai`, NEW_ADDRESS],
  [`59MJ+F95 ${MOJIBAKE_DASH} 87 4th St ${MOJIBAKE_DASH} Al Qouz Ind.third ${MOJIBAKE_DASH} Al Quoz ${MOJIBAKE_DASH} Dubai`, NEW_ADDRESS],
  [`59MJ+F95 ${MOJIBAKE_DASH} 87 4th St ${MOJIBAKE_DASH} Al Quoz ${MOJIBAKE_DASH} Dubai`, NEW_ADDRESS],
  ["Nadd Al Hamar", "Al Quoz"],
];

async function main() {
  await client
    .patch("siteSettings")
    .set({ "contact.address": NEW_ADDRESS, "contact.altAddress": "" })
    .commit();
  console.log("siteSettings.contact.address updated");

  const posts = await client.fetch<{ _id: string; slug: string; bodyHtml: string }[]>(`
    *[
      _type == "blogPost" &&
      (
        bodyHtml match "*Showroom 317*" ||
        bodyHtml match "*Nadd Al Hamar*" ||
        bodyHtml match "*Al Qouz*" ||
        bodyHtml match "*59MJ+F95*"
      )
    ]{
      _id, "slug": slug.current, bodyHtml
    }
  `);
  console.log(`found ${posts.length} blog post(s) referencing old or mixed addresses`);

  let patched = 0;
  for (const p of posts) {
    let next = p.bodyHtml;
    for (const [from, to] of REPLACEMENTS) {
      next = next.split(from).join(to);
    }
    if (next === p.bodyHtml) {
      console.warn(`${p.slug}: matched the query but no literal replacement applied`);
      continue;
    }
    if (/Showroom 317|Nadd Al Hamar|Al Qouz/.test(next)) {
      console.warn(`${p.slug}: still contains old address fragments after patch`);
    }
    await client.patch(p._id).set({ bodyHtml: next }).commit();
    patched++;
    console.log(`${p.slug} patched`);
  }
  console.log(`${patched} blog post(s) patched`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
