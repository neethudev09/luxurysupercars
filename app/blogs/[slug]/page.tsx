import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import SiteNav from "@/components/nav/SiteNav";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import ShareStrip from "@/components/sections/ShareStrip";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import MagneticCTA from "@/components/motion/MagneticCTA";
import { BLOG_POSTS, getPost, getRelatedPosts } from "@/lib/blog";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      title: post.ogTitle,
      description: post.ogDescription,
      url: `https://luxurysupercarsdubai.com/blogs/${post.slug}/`,
      siteName: "Luxury Supercars Dubai",
      locale: "en_AE",
      type: "article",
      images: post.ogImage
        ? [
            {
              url: post.ogImage,
              width: post.ogImageWidth,
              height: post.ogImageHeight,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.ogTitle,
      description: post.ogDescription,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 4);
  const canonicalUrl = `https://luxurysupercarsdubai.com/blogs/${post.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.h1 || post.title,
    description: post.metaDescription || post.ogDescription,
    image: post.ogImage || undefined,
    datePublished: post.date || undefined,
    mainEntityOfPage: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Luxury Supercars Dubai",
      url: "https://luxurysupercarsdubai.com/",
    },
  };

  return (
    <main>
      <SiteNav />

      {/* Hero — title on the left, featured image on the right fades in from
          transparent → fully opaque so it bleeds into the dark background. */}
      <section className="isolate relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-[120px] pb-14 md:pt-[170px] md:pb-20 overflow-hidden">
        {post.ogImage && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full md:w-[60%] lg:w-[55%]"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 45%, black 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 45%, black 100%)",
            }}
          >
            <Image
              src={post.ogImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 55vw, (min-width: 768px) 60vw, 100vw"
              className="object-cover opacity-90 md:opacity-100"
            />
            {/* Soft top/bottom fades so the image melts into the dark band on
                tall headers. */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-obsidian)]/45 via-transparent to-[var(--bg-obsidian)]/70" />
          </div>
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 size-[600px] rounded-full bg-[var(--champagne)]/[0.07] blur-[160px] z-0"
        />

        <div className="container-x relative z-10">
          <Reveal>
            <p className="rise font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] mb-6 flex items-center gap-3 flex-wrap">
              <Link href="/blog" className="text-[var(--champagne)] hover:text-[var(--champagne-hi)] transition-colors">
                ← Journal
              </Link>
              {post.date && <span className="text-[var(--ink-lo)]">·</span>}
              {post.date && <span className="text-[var(--ink-lo)]">{post.date}</span>}
            </p>
          </Reveal>

          <div className="max-w-2xl md:max-w-3xl">
            <MaskHeading
              text={post.h1 || post.title}
              as="h1"
              animate
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(2rem,5.4vw,4.4rem)] leading-[1.04] tracking-[-0.022em] text-[var(--ink-hi)] text-balance"
              staggerMs={50}
            />
          </div>

          {post.excerpt && (
            <Reveal>
              <p className="rise mt-6 max-w-xl text-[clamp(1.05rem,1.5vw,1.25rem)] leading-[1.55] text-[var(--ink-hi)]/80">
                {post.excerpt}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-[var(--bg-obsidian)] border-t border-white/5 py-14 md:py-20">
        <div className="container-x grid md:grid-cols-12 gap-10 md:gap-14">
          {/* Desktop sticky share rail */}
          <div className="hidden md:flex md:col-span-1 justify-end">
            <div className="sticky top-28">
              <ShareStrip
                orientation="vertical"
                url={canonicalUrl}
                title={post.h1 || post.title}
              />
            </div>
          </div>

          <article
            className="md:col-span-8 lg:col-span-7 prose-blog max-w-none text-[var(--ink-lo)]"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />

          <aside className="md:col-span-3 lg:col-span-4 flex flex-col gap-8">
            {/* Mobile inline share */}
            <div className="md:hidden">
              <ShareStrip
                orientation="horizontal"
                url={canonicalUrl}
                title={post.h1 || post.title}
              />
            </div>

            <Reveal>
              <div className="rise relative overflow-hidden rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/50 p-6 md:p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 size-[200px] rounded-full bg-[var(--champagne)]/[0.1] blur-[80px]"
                />
                <div className="relative">
                  <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-3">
                    Ready to drive?
                  </p>
                  <p className="font-[var(--font-display)] text-[clamp(1.15rem,1.6vw,1.4rem)] leading-tight text-[var(--ink-hi)] mb-4">
                    Talk to the team about availability and pricing.
                  </p>
                  <p className="text-[13.5px] leading-[1.6] text-[var(--ink-lo)] mb-5">
                    24/7 concierge, free delivery across Dubai, and a fleet that turns heads.
                  </p>
                  <MagneticCTA
                    href="/contact-us"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--champagne-hi)] transition-colors"
                  >
                    <span>Enquire now</span>
                    <svg width="13" height="9" viewBox="0 0 14 10" fill="none">
                      <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </MagneticCTA>
                </div>
              </div>
            </Reveal>

            {related.length > 0 && (
              <div>
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-5">
                  Related reading
                </p>
                <ul className="flex flex-col gap-3">
                  {related.map((r, i) => (
                    <Reveal key={r.slug} delay={i * 70}>
                      <li className="rise">
                        <Link
                          href={`/blogs/${r.slug}`}
                          className="group flex items-start gap-4 rounded-xl border border-white/8 bg-[var(--bg-graphite)]/30 p-3 hover:border-[var(--champagne)]/40 hover:bg-[var(--bg-graphite)]/50 transition-colors"
                        >
                          {r.ogImage && (
                            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={r.ogImage}
                                alt=""
                                fill
                                sizes="64px"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-[var(--font-display)] text-[14px] leading-snug text-[var(--ink-hi)] line-clamp-3 group-hover:text-[var(--champagne-hi)] transition-colors">
                              {r.h1 || r.title}
                            </p>
                            {r.date && (
                              <p className="font-[var(--font-mono)] text-[9.5px] uppercase tracking-[0.22em] text-[var(--ink-lo)] mt-1.5">
                                {r.date}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <Contact />
      <Footer />

      <Script
        id={`blog-jsonld-${post.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
