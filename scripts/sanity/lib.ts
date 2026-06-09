/**
 * Shared migration helpers — used by every migrate-*.ts script.
 *
 *   - Loads the write-capable Sanity client (reads .env.local)
 *   - Downloads a remote image and uploads it as a Sanity asset
 *   - Batches transactions to stay under the 200-mutation API limit
 *   - Tiny utility: Portable Text block from a paragraph string
 */
import { createClient, type SanityClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Load .env.local for the SANITY_API_TOKEN. dotenv lookups walk up; pin to
// the project root so a script run from any cwd still finds the right file.
const __dirname = fileURLToPath(new URL(".", import.meta.url));
loadEnv({ path: resolve(__dirname, "../../.env.local") });

const projectId = required("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = required("NEXT_PUBLIC_SANITY_DATASET");
const token = required("SANITY_API_TOKEN");
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-05-01";

export const client: SanityClient = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} (add to .env.local)`);
  return v;
}

/* -------------------------------------------------------------------------- */
/*  Image uploads                                                             */
/* -------------------------------------------------------------------------- */

const UPLOADED_CACHE = new Map<string, SanityImageRef>();

export interface SanityImageRef {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
}

/**
 * Download a remote image and upload it to Sanity as an asset. Returns
 * a Sanity image reference suitable for use as a document field value.
 * Idempotent within a single script run — repeated URLs hit the cache.
 */
export async function uploadImageFromUrl(
  url: string,
  filename?: string,
): Promise<SanityImageRef | null> {
  if (!url) return null;
  if (UPLOADED_CACHE.has(url)) return UPLOADED_CACHE.get(url)!;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
      },
    });
    if (!res.ok) {
      console.warn(`  [image] ${res.status} ${url}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const inferredName = filename || url.split("/").pop() || "image.jpg";

    const asset = await client.assets.upload("image", buf, {
      filename: inferredName,
    });
    const ref: SanityImageRef = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
    UPLOADED_CACHE.set(url, ref);
    return ref;
  } catch (e) {
    console.warn(`  [image] fetch failed for ${url}: ${(e as Error).message}`);
    return null;
  }
}

export interface SanityAssetRef {
  _type: "image" | "file";
  asset: { _type: "reference"; _ref: string };
}
const LOCAL_ASSET_CACHE = new Map<string, SanityAssetRef>();

/**
 * Upload a file from the repo's public/ folder as a Sanity asset and return a
 * reference. Pass a public-absolute path (e.g. "/images/Ahmed-portrait.png").
 * `kind` is "image" for image fields or "file" for file fields (e.g. video).
 * Idempotent within a run.
 */
export async function uploadLocalAsset(
  publicPath: string,
  kind: "image" | "file" = "image",
): Promise<SanityAssetRef | null> {
  if (!publicPath) return null;
  if (LOCAL_ASSET_CACHE.has(publicPath)) return LOCAL_ASSET_CACHE.get(publicPath)!;
  try {
    const abs = resolve(__dirname, "../../public", publicPath.replace(/^\//, ""));
    const buf = readFileSync(abs);
    const filename = publicPath.split("/").pop() || "asset";
    const asset = await client.assets.upload(kind, buf, { filename });
    const ref: SanityAssetRef = {
      _type: kind,
      asset: { _type: "reference", _ref: asset._id },
    };
    LOCAL_ASSET_CACHE.set(publicPath, ref);
    return ref;
  } catch (e) {
    console.warn(`  [asset] failed for ${publicPath}: ${(e as Error).message}`);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Portable Text helpers                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Convert a plain string (or multi-paragraph block) into Portable Text
 * blocks. One paragraph per double-newline.
 */
export function paragraphsToPortableText(text: string): PortableTextBlock[] {
  if (!text) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      _type: "block",
      _key: randomKey(),
      style: "normal",
      markDefs: [],
      children: [
        { _type: "span", _key: randomKey(), text: p, marks: [] },
      ],
    }));
}

export interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: string;
  markDefs: unknown[];
  children: { _type: "span"; _key: string; text: string; marks: string[] }[];
}

let counter = 0;
function randomKey(): string {
  counter += 1;
  return `k${Date.now().toString(36)}${counter.toString(36)}`;
}

/* -------------------------------------------------------------------------- */
/*  Transactions                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Submit documents in batches. Sanity caps each transaction at ~200
 * mutations; we stay well under that.
 */
export async function batchCreateOrReplace(
  docs: Array<Record<string, unknown> & { _id: string; _type: string }>,
  { batchSize = 100, label = "" } = {},
): Promise<void> {
  for (let i = 0; i < docs.length; i += batchSize) {
    const slice = docs.slice(i, i + batchSize);
    const tx = client.transaction();
    for (const doc of slice) tx.createOrReplace(doc);
    await tx.commit({ visibility: "async" });
    process.stdout.write(
      `  [${label}] committed ${Math.min(i + batchSize, docs.length)}/${docs.length}\n`,
    );
  }
}
