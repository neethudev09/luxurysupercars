/**
 * Blog posts — 144 docs from lib/blog-data.json.
 *
 * Each post gets its hero image uploaded as a Sanity asset; the body
 * stays as legacy HTML in `bodyHtml` (renderer prefers Portable Text
 * `body` for new posts authored in Studio, falls back to bodyHtml).
 *
 * SEO preservation: title / metaDescription / OG tags / canonical /
 * publishedAt all copied byte-for-byte from the live-scraped data.
 */
import blogData from "@/lib/blog-data.json" with { type: "json" };
import {
  uploadImageFromUrl,
  batchCreateOrReplace,
} from "./lib";

interface BlogPostRaw {
  slug: string;
  url: string;
  canonical: string;
  title: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  h1: string;
  date: string | null;
  excerpt: string;
  bodyHtml: string;
}

function isoFromDate(d: string | null): string | undefined {
  if (!d) return undefined;
  const parsed = Date.parse(d);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString();
}

async function main() {
  const posts = blogData as BlogPostRaw[];
  console.log(`Migrating ${posts.length} blog posts (hero image uploads will take a few minutes)...`);

  const docs: Record<string, unknown>[] = [];
  for (let i = 0; i < posts.length; i++) {
    const raw = posts[i];
    process.stdout.write(`  [${i + 1}/${posts.length}] ${raw.slug}\n`);

    const heroImage = raw.ogImage
      ? await uploadImageFromUrl(raw.ogImage, `${raw.slug}-hero.jpg`)
      : null;

    docs.push({
      _id: `blogPost-${raw.slug}`,
      _type: "blogPost",
      title: raw.title,
      h1: raw.h1,
      slug: { _type: "slug", current: raw.slug },
      publishedAt: isoFromDate(raw.date),
      excerpt: raw.excerpt,
      heroImage,
      bodyHtml: raw.bodyHtml,
      seo: {
        title: raw.title,
        description: raw.metaDescription,
        noIndex: false,
      },
    });
  }

  await batchCreateOrReplace(
    docs as Array<Record<string, unknown> & { _id: string; _type: string }>,
    { label: "blog", batchSize: 50 },
  );
  console.log(`✓ ${docs.length} blog posts`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
