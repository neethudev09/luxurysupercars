"use client";

import { useEffect, useState } from "react";

interface TocEntry {
  id: string;
  title: string;
}

interface StickyTocProps {
  entries: TocEntry[];
  /** Heading label rendered above the list. */
  label?: string;
}

/**
 * Sticky table of contents for long-form legal pages. On desktop sits
 * in a sticky sidebar and highlights the section currently in view;
 * on mobile collapses into a `<details>` summary at the top of the
 * article. Smooth-scrolls with a 96px header offset on click.
 */
export default function StickyToc({ entries, label = "On this page" }: StickyTocProps) {
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return;
    const nodes = entries
      .map((e) => document.getElementById(e.id))
      .filter((n): n is HTMLElement => !!n);
    if (nodes.length === 0) return;

    const io = new IntersectionObserver(
      (observed) => {
        // Track all currently-visible sections; pick the top-most one.
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, [entries]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const node = document.getElementById(id);
    if (!node) return;
    const top = node.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  if (entries.length === 0) return null;

  const list = (
    <ul className="flex flex-col gap-1.5">
      {entries.map((e) => {
        const active = activeId === e.id;
        return (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              onClick={(ev) => handleClick(ev, e.id)}
              className={`group flex items-start gap-3 py-1.5 text-[13.5px] leading-snug transition-colors ${
                active
                  ? "text-[var(--champagne)]"
                  : "text-[var(--ink-lo)] hover:text-[var(--ink-hi)]"
              }`}
            >
              <span
                aria-hidden
                className={`mt-2 h-px w-4 shrink-0 transition-all ${
                  active ? "bg-[var(--champagne)] w-6" : "bg-white/15 group-hover:bg-white/40"
                }`}
              />
              <span className="flex-1">{e.title}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav
        aria-label={label}
        className="hidden md:block sticky top-28 self-start"
      >
        <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-4">
          {label}
        </p>
        {list}
      </nav>

      {/* Mobile collapsible */}
      <details className="md:hidden mb-8 rounded-xl border border-white/8 bg-[var(--bg-graphite)]/40 p-5">
        <summary className="cursor-pointer list-none flex items-center justify-between text-[13px] font-[var(--font-mono)] uppercase tracking-[0.24em] text-[var(--champagne)]">
          <span>{label}</span>
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden>
            <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </summary>
        <div className="mt-4">{list}</div>
      </details>
    </>
  );
}
