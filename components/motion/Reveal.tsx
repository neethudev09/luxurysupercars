"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ElementType, ReactNode } from "react";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

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
  const prefersReduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
  const [ioRevealed, setIoRevealed] = useState(false);
  const revealed = prefersReduced || ioRevealed;

  useEffect(() => {
    if (prefersReduced) return;
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIoRevealed(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setIoRevealed(false);
          }
        }
      },
      { threshold, rootMargin }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [prefersReduced, threshold, rootMargin, once]);

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
