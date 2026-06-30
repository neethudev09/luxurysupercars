import Image from "next/image";
import Link from "next/link";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { BLOG } from "@/lib/content";
import { BLOG_POSTS, blogImageAlt } from "@/lib/blog";

// Surface the 4 most recently published blog posts from the scraped
// registry. Each card links to the internal /blogs/[slug] route, which
// mirrors the live luxurysupercarsdubai.com URL exactly.
const FEATURED = BLOG_POSTS.slice(0, 4);

export default function BlogStrip() {
  return (
    <section id={BLOG.id} className="bg-[var(--bg-obsidian)] py-20 md:py-24 border-t border-white/5 overflow-hidden">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-12">
          <div className="md:col-span-9">
            <MaskHeading
              text={BLOG.h2}
              as="h2"
              className="font-[var(--font-display)] text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.06] tracking-[-0.018em] text-[var(--ink-hi)]"
              staggerMs={42}
            />
          </div>
          <div className="md:col-span-3 md:text-right">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[12.5px] text-[var(--ink-hi)] hover:bg-white/5 hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
            >
              View all articles
              <svg width="13" height="9" viewBox="0 0 14 10" fill="none">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {FEATURED.map((post, i) => (
            <Reveal
              key={post.slug}
              className="rise group block"
              delay={i * 90}
            >
              <Link href={`/blogs/${post.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/8">
                  <Image
                    src={post.ogImage}
                    alt={blogImageAlt(post)}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {post.date && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur px-3 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--champagne)]">
                      {post.date}
                    </div>
                  )}
                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="font-[var(--font-display)] text-[18px] leading-snug tracking-tight text-[var(--ink-hi)] line-clamp-3">
                      {post.h1 || post.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[var(--champagne)] tracking-wide">
                      Read article
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none" className="transition-transform group-hover:translate-x-1">
                        <path d="M0 4.5h10M7 1l3 3.5L7 8" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
