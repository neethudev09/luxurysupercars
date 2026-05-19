import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/nav/SiteNav";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Page Not Found — Luxury Supercars Dubai",
  description:
    "The page you're looking for doesn't exist. Browse our luxury car rental fleet or head back home.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main>
      <SiteNav />

      <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-[140px] pb-24 md:pt-[180px] md:pb-32 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] rounded-full bg-[var(--champagne)]/[0.06] blur-[180px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-10 flex items-end justify-center select-none font-[var(--font-display)] font-semibold leading-none text-[var(--champagne)]/[0.06]"
          style={{ fontSize: "clamp(14rem, 38vw, 28rem)" }}
        >
          404
        </div>

        <div className="container-x relative text-center">
          <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-6">
            Off the road
          </p>
          <h1 className="font-[var(--font-display)] text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[1.04] tracking-[-0.022em] text-[var(--ink-hi)] text-balance max-w-3xl mx-auto">
            This page took a wrong turn
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-[15.5px] leading-[1.7] text-[var(--ink-lo)]">
            The page you&apos;re looking for doesn&apos;t exist, has moved, or
            never made it past the showroom doors. Let&apos;s get you back on
            track.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-6 py-3 text-[13px] font-medium tracking-wide hover:bg-[var(--champagne-hi)] transition-colors"
            >
              Back to home
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
            <Link
              href="/our-fleet"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 backdrop-blur px-6 py-3 text-[13px] font-medium tracking-wide text-[var(--ink-hi)] hover:border-[var(--champagne)] hover:bg-[var(--champagne)]/15 transition-all"
            >
              Browse our fleet
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium tracking-wide text-[var(--ink-hi)] hover:text-[var(--champagne)] transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
