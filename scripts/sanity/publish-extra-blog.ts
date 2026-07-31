/**
 * Publish a hand-authored blog post from lib/blog-extra.json into Sanity.
 *
 * Run: npx tsx scripts/sanity/publish-extra-blog.ts
 */
import { uploadImageFromUrl } from "./lib";
import { client, isConfigured } from "./lib";
import blogExtraRaw from "../../lib/blog-extra.json" with { type: "json" };
interface ExtraPost { slug: string; url: string; canonical: string; title: string; metaDescription: string; ogTitle: string; ogDescription: string; ogImage: string; ogImageAlt?: string; ogImageWidth?: number; ogImageHeight?: number; h1: string; date: string | null; publishedAt?: string | null; author?: string; keywords?: string[]; excerpt: string; bodyHtml: string }
const blogExtra = blogExtraRaw as ExtraPost[];

function isoFromDate(d: string | null): string | undefined {
  if (!d) return undefined;
  const parsed = Date.parse(d);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString();
}

async function main() {
  if (!isConfigured) {
    console.error("Sanity API token not configured in .env.local");
    process.exit(1);
  }

  for (const raw of blogExtra) {
    const existing = await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]`, { slug: raw.slug });
    if (existing) {
      console.log(`Skipping "${raw.slug}" — already exists in Sanity`);
      continue;
    }

    process.stdout.write(`Uploading hero image for "${raw.slug}"… `);
    const heroImageRef = raw.ogImage
      ? await uploadImageFromUrl(raw.ogImage, `${raw.slug}-hero.jpg`)
      : null;
    const heroImage = heroImageRef
      ? { ...heroImageRef, alt: raw.ogImageAlt || raw.h1 || raw.title }
      : null;
    console.log("done");

    const doc = {
      _id: `blogPost-${raw.slug}`,
      _type: "blogPost",
      title: raw.title,
      h1: raw.h1,
      slug: { _type: "slug", current: raw.slug },
      publishedAt: raw.publishedAt || isoFromDate(raw.date),
      excerpt: raw.excerpt,
      author: raw.author,
      keywords: raw.keywords,
      heroImage,
      bodyHtml: raw.bodyHtml,
      seo: {
        title: raw.title,
        description: raw.metaDescription,
        noIndex: false,
      },
    };

    await client.createOrReplace(doc);
    console.log(`✓ Published "${raw.slug}" to Sanity`);
  }

  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
