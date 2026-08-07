import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/nav/SiteNav";
import Footer from "@/components/sections/Footer";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { BLOG_POSTS } from "@/lib/blog";
import {
  AUTHORS,
  getAuthorBySlug,
  personJsonLd,
  type Author,
} from "@/lib/authors";
import { PRODUCTION_ORIGIN, SITE_URL } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};

  return {
    title: `${author.name} | ${author.role}, ${author.company}`,
    description: author.metaDescription,
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: {
      title: `${author.name} | ${author.role}, ${author.company}`,
      description: author.metaDescription,
      url: `/authors/${author.slug}/`,
      siteName: "Luxury Supercars Dubai",
      locale: "en_AE",
      type: "profile",
      images: [
        {
          url: author.image,
          width: 1067,
          height: 1261,
          alt: author.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} | ${author.role}, ${author.company}`,
      description: author.metaDescription,
      images: author.image ? [author.image] : undefined,
    },
  };
}

/** Articles whose byline resolves to this author — the brief's dynamic
 *  "Articles by …" section. Newest first; the page shows the latest few. */
function authoredPosts(author: Author) {
  return BLOG_POSTS.filter(
    (p) =>
      p.author &&
      (p.author.toLowerCase() === author.name.toLowerCase() ||
        (author.alternateName ?? "").toLowerCase() ===
          p.author.toLowerCase()),
  ).sort((a, b) => {
    const ta = a.publishedAt || a.date || "";
    const tb = b.publishedAt || b.date || "";
    return ta < tb ? 1 : ta > tb ? -1 : 0;
  });
}

export default async function AuthorProfilePage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const authored = authoredPosts(author);
  const jsonLd = personJsonLd(author);

  return (
    <main>
      <SiteNav />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: author.name, href: `/authors/${author.slug}` },
        ]}
      />

      {/* Hero — portrait fades in from the right, identity on the left. */}
      <section className="isolate relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-[120px] pb-14 md:pt-[170px] md:pb-20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full md:w-[52%] lg:w-[46%]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 48%, black 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 48%, black 100%)",
          }}
        >
          <Image
            src={author.image}
            alt={author.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, (min-width: 768px) 52vw, 100vw"
            className="object-cover object-top opacity-90 md:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-obsidian)]/45 via-transparent to-[var(--bg-obsidian)]/70" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 size-[600px] rounded-full bg-[var(--champagne)]/[0.07] blur-[160px] z-0"
        />

        <div className="container-x relative z-10">
          <Reveal>
            <p className="rise font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] mb-6 flex items-center gap-3 flex-wrap text-[var(--ink-lo)]">
              <span>Author profile</span>
              <span className="text-[var(--champagne)]">·</span>
              <span className="text-[var(--champagne)]">{author.role}</span>
            </p>
          </Reveal>

          <div className="max-w-2xl md:max-w-3xl">
            <MaskHeading
              text={author.name}
              as="h1"
              animate
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.04] tracking-[-0.022em] text-[var(--ink-hi)] text-balance"
              staggerMs={50}
            />
            <Reveal>
              <p className="rise mt-4 font-[var(--font-display)] text-[clamp(1.1rem,1.8vw,1.5rem)] leading-tight text-[var(--champagne)]">
                {author.role}, {author.company}
              </p>
            </Reveal>
            {author.alternateName && (
              <Reveal>
                <p className="rise mt-2 text-[13px] text-[var(--ink-lo)]">
                  {author.alternateName}, professionally known as {author.name}
                </p>
              </Reveal>
            )}
          </div>

          {author.social.length > 0 && (
            <Reveal>
              <div className="rise mt-8 flex flex-wrap items-center gap-2">
                {author.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[12.5px] text-[var(--ink-hi)] hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
                  >
                    {s.label}
                    <span className="text-[var(--ink-lo)]">{s.handle}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Biography */}
      <section className="bg-[var(--bg-obsidian)] border-t border-white/5 py-14 md:py-20">
        <div className="container-x grid md:grid-cols-12 gap-10 md:gap-14">
          <div className="md:col-span-8 lg:col-span-7 prose-blog max-w-none text-[var(--ink-lo)]">
            {author.bio.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "lead text-[var(--ink-hi)]" : ""}>
                {paragraph}
              </p>
            ))}

            {author.highlights.length > 0 && (
              <>
                <h2>How the business works</h2>
                <ul>
                  {author.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </>
            )}

            {(author.firstHandStatement || author.quotes.length > 0) && (
              <>
                <h2>First-hand experience</h2>
                {author.firstHandStatement && (
                  <blockquote>
                    <p>"{author.firstHandStatement}"</p>
                    <p className="mt-3 font-[var(--font-mono)] text-[12px] uppercase tracking-[0.24em] text-[var(--ink-lo)]">
                      — {author.name}
                    </p>
                  </blockquote>
                )}
                {author.quotes.map((q) => (
                  <blockquote key={q}>
                    <p>"{q}"</p>
                    <p className="mt-3 font-[var(--font-mono)] text-[12px] uppercase tracking-[0.24em] text-[var(--ink-lo)]">
                      — {author.name}
                    </p>
                  </blockquote>
                ))}
              </>
            )}

            {(author.featuredIn.length > 0 || author.podcasts.length > 0) && (
              <>
                <h2>Featured in</h2>
                {author.featuredIn.length > 0 && (
                  <p className="flex flex-wrap gap-2">
                    {author.featuredIn.map((outlet) => (
                      <span
                        key={outlet}
                        className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-[var(--ink-hi)]"
                      >
                        {outlet}
                      </span>
                    ))}
                  </p>
                )}
                {author.podcasts.length > 0 && (
                  <p className="mt-3 text-[13.5px]">
                    Podcasts: {author.podcasts.join(", ")}
                  </p>
                )}
              </>
            )}

            <h2>Areas of expertise</h2>
            <ul>
              {author.expertise.map((e) => (
                <li key={e.title}>
                  <strong>{e.title}.</strong> {e.body}
                </li>
              ))}
            </ul>

            {author.editorialApproach.length > 0 && (
              <>
                <h2>Editorial approach</h2>
                <ul>
                  {author.editorialApproach.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-10">
              Rent a supercar and read more on the{" "}
              <Link
                href="/blog"
                className="text-[var(--champagne)] hover:text-[var(--champagne-hi)] transition-colors"
              >
                Luxury Supercars Dubai blog
              </Link>
              .
            </p>
          </div>

          <aside className="md:col-span-4 lg:col-span-5 flex flex-col gap-8">
            {authored.length > 0 && (
              <div>
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-5">
                  Articles by {author.name}
                </p>
                <ul className="flex flex-col gap-3">
                  {authored.slice(0, 6).map((r, i) => (
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
                                alt={r.ogImageAlt || r.h1 || r.title}
                                fill
                                sizes="64px"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-[var(--font-display)] text-[16px] leading-snug text-[var(--ink-hi)] line-clamp-3 group-hover:text-[var(--champagne-hi)] transition-colors">
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
                <Link
                  href="/blog"
                  className="mt-5 inline-flex items-center gap-2 text-[13px] text-[var(--champagne)] hover:text-[var(--champagne-hi)] transition-colors"
                >
                  <span>View all articles</span>
                  <svg width="13" height="9" viewBox="0 0 14 10" fill="none" aria-hidden>
                    <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Link>
              </div>
            )}

            {author.social.length > 0 && (
              <div>
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-5">
                  Connect with {author.name}
                </p>
                <ul className="flex flex-col gap-3">
                  {author.social.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-white/8 bg-[var(--bg-graphite)]/30 px-4 py-3 hover:border-[var(--champagne)]/40 hover:bg-[var(--bg-graphite)]/50 transition-colors"
                      >
                        <span className="text-[13.5px] text-[var(--ink-hi)]">
                          {s.label}
                        </span>
                        <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--ink-lo)]">
                          {s.handle}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/50 p-6 md:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 size-[200px] rounded-full bg-[var(--champagne)]/[0.1] blur-[80px]"
              />
              <div className="relative">
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-3">
                  About the business
                </p>
                <p className="font-[var(--font-display)] text-[clamp(1.15rem,1.6vw,1.4rem)] leading-tight text-[var(--ink-hi)] mb-3">
                  Luxury Supercars Dubai. A fleet of 100+ luxury cars and supercars.
                </p>
                <p className="text-[13.5px] leading-[1.6] text-[var(--ink-lo)] mb-5">
                  {author.name} founded the company in 2019 and still personally
                  selects every car that joins the fleet.
                </p>
                <a
                  href="https://luxurysupercarsdubai.com/our-fleet"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--champagne-hi)] transition-colors"
                >
                  <span>Browse the fleet</span>
                  <svg width="13" height="9" viewBox="0 0 14 10" fill="none">
                    <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Invisible-to-readers structured data: Google reads the Person
          entity; visitors see no visual change on the page. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Footer />
    </main>
  );
}
