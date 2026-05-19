"use client";

import { useEffect, useRef, useState } from "react";
import { ElementType, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
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
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { threshold, rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  const TagAny = Tag as ElementType;

  return (
    <TagAny
      ref={ref}
      className={`${revealed ? "is-revealed" : ""} ${className}`.trim()}
      style={delay ? { ["--rise-delay" as string]: `${delay}ms` } : undefined}
    >
      {children}
    </TagAny>
  );
}
