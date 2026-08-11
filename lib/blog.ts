/**
 * Blog content registry. Populated by `scripts/scrape-blog.mjs` from the
 * live luxurysupercarsdubai.com `/blogs-sitemap.xml`. Re-run the script
 * any time the live blog updates.
 *
 * The redesign mirrors live SEO verbatim: titles, meta descriptions, OG
 * tags, hero images, and full body HTML are preserved per post.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import data from "./blog-data.json";

// Local draft merge marker — bump to force Turbopack recompile. (bump 2026-08-12: best-scenic-drives-dubai draft, desert post removed)

export type BlogPost = {
  slug: string;
  url: string;
  canonical: string;
  title: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  h1: string;
  date: string | null;
  /** ISO 8601 publication date (from Sanity publishedAt). */
  publishedAt?: string | null;
  /** ISO 8601 creation date (Sanity _createdAt). */
  createdAt?: string | null;
  /** ISO 8601 last-modified date (Sanity _updatedAt). */
  updatedAt?: string | null;
  author?: string;
  keywords?: string[];
  /** Sanity blogPost.isFeatured — rendered as the large card atop /blog. */
  featured?: boolean;
  excerpt: string;
  bodyHtml: string;
  /** Optional FAQPage JSON-LD for posts with a FAQs section. */
  faqSchema?: Record<string, unknown>[];
};

export const BLOG_POSTS: BlogPost[] = (() => {
  const posts: BlogPost[] = data as BlogPost[];

  const localPosts = readLocalPosts();
  const slugs = new Set(posts.map((p) => p.slug));
  for (const p of localPosts) {
    if (!slugs.has(p.slug)) {
      posts.push(p);
      slugs.add(p.slug);
    }
  }

  return posts;
})();

function readLocalPosts(): BlogPost[] {
  try {
    const localFile = join(process.cwd(), "blog-local", "posts.json");
    if (!existsSync(localFile)) return [];
    return JSON.parse(readFileSync(localFile, "utf8")) as BlogPost[];
  } catch {
    return [];
  }
}

export const BLOG_POSTS_BY_SLUG: Map<string, BlogPost> = new Map(
  BLOG_POSTS.map((p) => [p.slug, p]),
);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS_BY_SLUG.get(slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}

export function blogImageAlt(post: Pick<BlogPost, "ogImageAlt" | "h1" | "title">): string {
  return post.ogImageAlt || post.h1 || post.title;
}
