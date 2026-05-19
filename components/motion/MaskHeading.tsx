"use client";

import { ElementType, Fragment, useEffect, useRef, useState } from "react";

/**
 * Renders heading text with **bold** markers as champagne-emph spans.
 *
 * By default, renders statically (no scroll-in animation). Pass `animate`
 * to opt into the word-by-word mask reveal — reserved for the hero.
 *
 * By default, inserts a line break after the FIRST bold group so headings
 * like "**Sports Car** Rental in Dubai" lay out as two stacked lines.
 * Pass `breakAfterBold={false}` to opt out.
 */
interface MaskHeadingProps {
  text: string;
  as?: ElementType;
  className?: string;
  staggerMs?: number;
  once?: boolean;
  breakAfterBold?: boolean;
  animate?: boolean;
}

export default function MaskHeading({
  text,
  as: Tag = "h2",
  className = "",
  staggerMs = 60,
  once = true,
  breakAfterBold = true,
  animate = false,
}: MaskHeadingProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const node = ref.current;
    if (!node) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [animate, once]);

  // Split by **bold** markers, preserving order
  const tokens = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  const firstBoldTokenIdx = tokens.findIndex((t) => t.startsWith("**") && t.endsWith("**"));

  // Flatten into per-word entries with bold + lineBreakAfter flags
  const words: { word: string; bold: boolean; lineBreakAfter: boolean }[] = [];
  tokens.forEach((token, tIdx) => {
    const bold = token.startsWith("**") && token.endsWith("**");
    const raw = bold ? token.slice(2, -2) : token;
    const wordsFromToken = raw.split(/(\s+)/).filter((w) => w !== "");
    wordsFromToken.forEach((w) => {
      words.push({ word: w, bold, lineBreakAfter: false });
    });
    if (
      breakAfterBold &&
      bold &&
      tIdx === firstBoldTokenIdx &&
      tIdx < tokens.length - 1
    ) {
      for (let i = words.length - 1; i >= 0; i--) {
        if (words[i].bold) {
          words[i].lineBreakAfter = true;
          break;
        }
      }
    }
  });

  const TagAny = Tag as ElementType;

  if (!animate) {
    return (
      <TagAny ref={ref} className={className}>
        {words.map((w, i) => {
          if (/^\s+$/.test(w.word)) {
            return <Fragment key={i}>{w.word}</Fragment>;
          }
          return (
            <Fragment key={i}>
              {w.bold ? <span className="gold-emph">{w.word}</span> : w.word}
              {w.lineBreakAfter && <br />}
            </Fragment>
          );
        })}
      </TagAny>
    );
  }

  return (
    <TagAny
      ref={ref}
      className={`${revealed ? "is-revealed" : ""} ${className}`.trim()}
    >
      {words.map((w, i) => {
        if (/^\s+$/.test(w.word)) {
          return <Fragment key={i}>{w.word}</Fragment>;
        }
        return (
          <Fragment key={i}>
            <span className="mask-line">
              <span
                className={`mask-word ${w.bold ? "gold-emph" : ""}`}
                style={{ transitionDelay: `${i * staggerMs}ms` }}
              >
                {w.word}
              </span>
            </span>
            {w.lineBreakAfter && <br />}
          </Fragment>
        );
      })}
    </TagAny>
  );
}
