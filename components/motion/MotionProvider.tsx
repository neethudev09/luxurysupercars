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

  // Initialise Lenis once — defer to idle so it doesn't block hydration
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const init = () => {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      let rafId = 0;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      cleanup = () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
      };
    };

    let cleanup: (() => void) | null = null;

    const ric = typeof window !== "undefined"
      ? (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
      : undefined;
    const id = ric ? ric(init) : (setTimeout(init, 0) as unknown as number);

    return () => {
      clearTimeout(id);
      cleanup?.();
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
