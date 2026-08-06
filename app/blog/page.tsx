import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import PageHero from "@/components/sections/PageHero";
import BlogFeaturedHero from "@/components/sections/BlogFeaturedHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import Reveal from "@/components/motion/Reveal";
import { BLOG_POSTS, blogImageAlt } from "@/lib/blog";
import Footer from "@/components/sections/Footer";

const PAGE_SIZE = 12;

// Single featured post above the archive grid; remaining posts flow into
// the uniform grid below. The featured post is only rendered on page 1.
const ARCHIVE_POSTS = BLOG_POSTS.slice(1);
const TOTAL_PAGES = Math.max(1, Math.ceil(ARCHIVE_POSTS.length / PAGE_SIZE));

/** Clamp the requested page into the valid range; non-numeric → 1. */
function resolvePage(pageParam: string | undefined): number {
  const raw = Number.parseInt(pageParam ?? "1", 10);
  if (!Number.isFinite(raw)) return 1;
  return Math.min(Math.max(raw, 1), TOTAL_PAGES);
}

/**
 * Canonical URL for a given page, generated server-side from the `page`
 * search parameter. Page 1 (and the bare URL) canonicalize without the
 * `?page=1` parameter; every other page canonicalizes to itself so each
 * paginated set of posts has a distinct canonical.
 */
function canonicalFor(page: number): string {
  return page > 1 ? `/blog?page=${page}` : "/blog";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const currentPage = resolvePage((await searchParams).page);
  const canonical = canonicalFor(currentPage);
  return {
    title: "Blog | Insights & News on Super Car Rentals in Dubai",
    description:
      "Explore the Luxury Supercars Dubai journal — guides, brand histories, rental tips, and stories from the world's most extraordinary car rental fleet.",
    alternates: { canonical },
    openGraph: {
      title: "Blog | Insights & News on Super Car Rentals in Dubai",
      description:
        "Guides, brand histories, rental tips, and stories from Luxury Supercars Dubai.",
      url: canonical,
      siteName: "Luxury Supercars Dubai",
      locale: "en_AE",
      type: "website",
    },
  };
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Live h1 verbatim: "Latest News & Article"
  const visibleH1 = "Latest News & Article";
  const featured = BLOG_POSTS[0];
  const archive = ARCHIVE_POSTS;

  const currentPage = resolvePage((await searchParams).page);
  const start = (currentPage - 1) * PAGE_SIZE;
  const grid = archive.slice(start, start + PAGE_SIZE);

  const pageHref = (n: number) => (n === 1 ? "/blog" : `/blog?page=${n}`);

  return (
    <main>
      <SiteNav />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />
       {/* <h1 className="sr-only">{visibleH1}</h1> */}

      <PageHero
        eyebrow="Journal"
        h1={visibleH1}
        spotlight="right"
      />

      {featured && currentPage === 1 && <BlogFeaturedHero featured={featured} />}

      <section id="archive" className="bg-[var(--bg-obsidian)] pb-16 md:pb-20 scroll-mt-24">
        <div className="container-x">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {grid.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 12) * 30}>
                <Link
                  href={`/blogs/${post.slug}`}
                  className="rise group block h-full overflow-hidden rounded-xl border border-white/8 bg-[var(--bg-graphite)]/30 hover:border-[var(--champagne)]/50 transition-colors"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {post.ogImage ? (
                      <Image
                        src={post.ogImage}
                        alt={blogImageAlt(post)}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[var(--bg-graphite)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    {post.date && (
                      <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/45 backdrop-blur px-3 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--champagne)]">
                        {post.date}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-[var(--font-display)] text-[19px] leading-snug tracking-tight text-[var(--ink-hi)] line-clamp-3 mb-2 group-hover:text-[var(--champagne-hi)] transition-colors">
                      {post.h1 || post.title}
                    </h3>
                    <p className="text-[13.5px] leading-[1.55] text-[var(--ink-lo)] line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[13.5px] text-[var(--champagne)] tracking-wide">
                      Read article
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none" className="transition-transform group-hover:translate-x-1">
                        <path d="M0 4.5h10M7 1l3 3.5L7 8" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>

          {TOTAL_PAGES > 1 && (
            <Pagination current={currentPage} total={TOTAL_PAGES} hrefFor={pageHref} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/** Show every page number when there are at most this many pages. */
const MAX_UNWINDOWED_PAGES = 15;

/**
 * Page numbers to render. Small page counts emit the full range
 * (1 2 3 … 13) so every page is a direct crawlable link; large counts
 * fall back to a windowed range that still keeps first/last reachable.
 */
function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= MAX_UNWINDOWED_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [];
  const push = (v: number | "…") => {
    if (pages[pages.length - 1] !== v) pages.push(v);
  };
  for (let n = 1; n <= total; n++) {
    if (
      n === 1 ||
      n === total ||
      (n >= current - 1 && n <= current + 1)
    ) {
      push(n);
    } else if (n < current - 1 || n > current + 1) {
      push("…");
    }
  }
  return pages;
}

function Pagination({
  current,
  total,
  hrefFor,
}: {
  current: number;
  total: number;
  hrefFor: (n: number) => string;
}) {
  const pages = buildPageNumbers(current, total);

  const itemBase =
    "inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-full px-3 text-[13.5px] tracking-wide transition-colors";
  const navLink = (disabled: boolean) =>
    `${itemBase} border border-white/10 ${
      disabled
        ? "pointer-events-none opacity-40 text-[var(--ink-lo)]"
        : "text-[var(--ink-hi)] hover:border-[var(--champagne)] hover:text-[var(--champagne)]"
    }`;

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={hrefFor(1)}
        aria-label="First page"
        aria-disabled={current === 1}
        tabIndex={current === 1 ? -1 : 0}
        className={navLink(current === 1)}
      >
        First
      </Link>

      <Link
        href={hrefFor(Math.max(1, current - 1))}
        aria-label="Previous page"
        aria-disabled={current === 1}
        tabIndex={current === 1 ? -1 : 0}
        className={navLink(current === 1)}
      >
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
          <path d="M14 5H2M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Link>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className={`${itemBase} text-[var(--ink-lo)]`}
          >
            …
          </span>
        ) : p === current ? (
          <span
            key={p}
            aria-current="page"
            className={`${itemBase} bg-[var(--champagne)] text-[var(--bg-obsidian)] font-medium`}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            className={`${itemBase} border border-white/10 text-[var(--ink-hi)] hover:border-[var(--champagne)] hover:text-[var(--champagne)]`}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={hrefFor(Math.min(total, current + 1))}
        aria-label="Next page"
        aria-disabled={current === total}
        tabIndex={current === total ? -1 : 0}
        className={navLink(current === total)}
      >
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
          <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Link>

      <Link
        href={hrefFor(total)}
        aria-label="Last page"
        aria-disabled={current === total}
        tabIndex={current === total ? -1 : 0}
        className={navLink(current === total)}
      >
        Last
      </Link>
    </nav>
  );
}
