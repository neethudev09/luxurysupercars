/**
 * One-off: download every image still hot-linked from the OLD WordPress site
 * (luxurysupercarsdubai.com/wp-content/...) and the OLD Vercel deployment
 * (luxury-supercars-dubai.vercel.app/images/...) into this repo's public/
 * folder, so nothing 404s when the old site is switched off at launch.
 *
 * It scans the source itself (app/, components/, lib/*.ts) for the URL
 * patterns, so the download list can never drift from what the code uses.
 *
 *   node scripts/migrate-images.mjs          # download missing files
 *   node scripts/migrate-images.mjs --force  # re-download everything
 *
 * Local destinations (mirrors source paths so repointing is a simple swap):
 *   …/wp-content/uploads/<path>  →  public/images/legacy/<path>
 *   …vercel.app/images/<path>    →  public/images/<path>
 *
 * After running, references are repointed in lib/assets.ts, the About
 * components and components/seo/JsonLd.tsx (done separately).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const FORCE = process.argv.includes("--force");
const WP_HOST = "https://luxurysupercarsdubai.com";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

/* ---- Collect source files -------------------------------------------- */
const SRC_DIRS = ["app", "components", "lib"];
const SRC_EXT = new Set([".ts", ".tsx"]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (SRC_EXT.has(extname(p))) out.push(p);
  }
  return out;
}

const sourceFiles = SRC_DIRS.flatMap((d) => walk(join(ROOT, d)));
const sourceBlob = sourceFiles.map((f) => readFileSync(f, "utf8")).join("\n");

// Migrated blog/brand HTML can hot-link inline images from old hosts
// (e.g. the agency staging subdomain), so scan the generated JSON too.
const JSON_FILES = ["lib/blog-data.json", "lib/generated/brands.json"];
const jsonBlob = JSON_FILES.map((f) => join(ROOT, f))
  .filter((f) => existsSync(f))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

const IMG_EXT = "(?:png|jpe?g|avif|svg|webp|gif)";

/* ---- Extract every download target ------------------------------------ */
const jobs = new Map(); // dest → { url, dest } (dedupes)
const add = (url, dest) => jobs.set(dest, { url, dest });

// 1) Source files: wp-content paths (host assumed = old WordPress). Also
//    catches the `${SITE}/wp-content/...` template form (matched on path).
for (const m of sourceBlob.matchAll(new RegExp(`wp-content/uploads/([A-Za-z0-9/_.\\-]+\\.${IMG_EXT})`, "g"))) {
  add(`${WP_HOST}/wp-content/uploads/${m[1]}`, join(PUBLIC, "images", "legacy", m[1]));
}
// 2) Source files: the old Vercel deployment's /images/ assets.
for (const m of sourceBlob.matchAll(new RegExp(`luxury-supercars-dubai\\.vercel\\.app/(images/[A-Za-z0-9/_.\\-]+\\.${IMG_EXT})`, "g"))) {
  add(`https://luxury-supercars-dubai.vercel.app/${m[1]}`, join(PUBLIC, m[1]));
}
// 3) Generated JSON: inline-image URLs from ANY old host. The original host
//    in migrated HTML may be a now-dead agency subdomain, but the canonical
//    live site still serves the same /wp-content/uploads/<path>, so we always
//    fetch by path from WP_HOST.
for (const m of jsonBlob.matchAll(new RegExp(`https?://[A-Za-z0-9.\\-]+/wp-content/uploads/([A-Za-z0-9/_.\\-]+\\.${IMG_EXT})`, "g"))) {
  add(`${WP_HOST}/wp-content/uploads/${m[1]}`, join(PUBLIC, "images", "legacy", m[1]));
}

/* ---- Download --------------------------------------------------------- */
async function download({ url, dest }) {
  const rel = dest.replace(ROOT + "/", "");
  if (!FORCE && existsSync(dest)) return { rel, status: "skip (exists)" };
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/*,*/*" } });
    if (!res.ok) return { rel, status: `FAIL ${res.status}`, fail: true };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) return { rel, status: "FAIL empty", fail: true };
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    return { rel, status: `ok (${(buf.length / 1024).toFixed(0)} KB)` };
  } catch (e) {
    return { rel, status: `FAIL ${e.message}`, fail: true };
  }
}

const jobList = [...jobs.values()];
console.log(`[images] ${jobList.length} unique images found across ${sourceFiles.length} source + ${JSON_FILES.length} JSON files\n`);

const results = [];
for (const job of jobList) {
  const r = await download(job);
  results.push(r);
  console.log(`  ${r.fail ? "✗" : "·"} ${r.rel}  —  ${r.status}`);
}

const failed = results.filter((r) => r.fail);
console.log(
  `\n[images] done: ${results.filter((r) => !r.fail).length} ok/skipped, ${failed.length} failed`,
);
if (failed.length) {
  console.error("\n[images] FAILURES (old site may already be down for these):");
  for (const f of failed) console.error(`  ${f.rel}  ${f.status}`);
  process.exit(1);
}
