import Image from "next/image";
import Link from "next/link";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import type { BlogPost } from "@/lib/blog";

interface BlogFeaturedHeroProps {
  /** The lead/newest post — gets the large editorial card. */
  featured: BlogPost;
  /** Two secondary posts rendered in a 2-col strip beneath the featured card. */
  secondary?: [BlogPost, BlogPost?];
}

/**
 * Editorial featured-post hero for the /blog index. The newest post is
 * elevated into a 2-col card (image left, headline right) and two
 * secondary highlights are shown as medium cards below.
 *
 * Aligns with the cinematic vocabulary: champagne mono eyebrow → mask
 * reveal headline → champagne CTA with arrow translate on hover.
 */
export default function BlogFeaturedHero({ featured, secondary }: BlogFeaturedHeroProps) {
  return (
    <section className="bg-[var(--bg-obsidian)] border-t border-white/5 py-14 md:py-20">
      <div className="container-x">
        <Reveal>
          <p className="rise font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-8">
            Featured
          </p>
        </Reveal>

        <Link
          href={`/blogs/${featured.slug}`}
          className="group block rounded-2xl overflow-hidden border border-white/8 hover:border-[var(--champagne)]/50 transition-colors"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-[16/11] md:aspect-auto md:min-h-[440px] overflow-hidden">
              {featured.ogImage ? (
                <Image
                  src={featured.ogImage}
                  alt={featured.h1 || featured.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--bg-graphite)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/40 via-black/0 to-transparent" />
              {featured.date && (
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-black/45 backdrop-blur px-3 py-1.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[var(--champagne)]">
                  {featured.date}
                </div>
              )}
            </div>

            <div className="relative flex flex-col justify-center p-7 md:p-12 bg-[var(--bg-graphite)]/40">
              <MaskHeading
                text={featured.h1 || featured.title}
                as="h2"
                breakAfterBold={false}
                className="font-[var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.12] tracking-[-0.012em] text-[var(--ink-hi)] text-balance mb-5"
                staggerMs={40}
              />
              <Reveal>
                <p className="rise text-[17px] leading-[1.7] text-[var(--ink-lo)] line-clamp-4 mb-6">
                  {featured.excerpt}
                </p>
              </Reveal>
              <span className="inline-flex items-center gap-2 text-[15px] text-[var(--champagne)] group-hover:text-[var(--champagne-hi)] transition-colors">
                Read full article
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1.5">
                  <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {secondary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-6">
            {secondary.filter(Boolean).map((post, i) => {
              if (!post) return null;
              return (
                <Reveal key={post.slug} delay={i * 80}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="rise group block rounded-xl overflow-hidden border border-white/8 hover:border-[var(--champagne)]/50 transition-colors"
                  >
                    <div className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr]">
                      <div className="relative aspect-square overflow-hidden">
                        {post.ogImage && (
                          <Image
                            src={post.ogImage}
                            alt={post.h1 || post.title}
                            fill
                            sizes="(min-width: 768px) 180px, 140px"
                            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center p-5 md:p-6 bg-[var(--bg-graphite)]/30">
                        {post.date && (
                          <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--champagne)] mb-2">
                            {post.date}
                          </p>
                        )}
                        <h3 className="font-[var(--font-display)] text-[16px] md:text-[17px] leading-snug tracking-tight text-[var(--ink-hi)] line-clamp-3 group-hover:text-[var(--champagne-hi)] transition-colors">
                          {post.h1 || post.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
