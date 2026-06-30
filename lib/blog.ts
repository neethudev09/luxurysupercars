/**
 * Blog content registry. Populated by `scripts/scrape-blog.mjs` from the
 * live luxurysupercarsdubai.com `/blogs-sitemap.xml`. Re-run the script
 * any time the live blog updates.
 *
 * The redesign mirrors live SEO verbatim: titles, meta descriptions, OG
 * tags, hero images, and full body HTML are preserved per post.
 */
import data from "./blog-data.json";

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
  excerpt: string;
  bodyHtml: string;
};

export const BLOG_POSTS: BlogPost[] = data as BlogPost[];

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
