"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Initialise Lenis once
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Take scroll restoration off the browser so it can't replay the
  // previous page's offset onto the new route.
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Reset scroll to top on every route change. Lenis keeps its own internal
  // scroll target — if that target is stale from the previous page it will
  // smooth-scroll the new page back down. So we hard-reset immediately AND
  // re-assert after the next frame (once images/fonts have grown the layout)
  // so a stale target can't win the race.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reset = () => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo(0, 0);
    };

    reset();
    const raf1 = requestAnimationFrame(() => {
      reset();
      // Second rAF — covers async layout shifts after hydration.
      requestAnimationFrame(reset);
    });
    return () => cancelAnimationFrame(raf1);
  }, [pathname]);

  return <>{children}</>;
}
