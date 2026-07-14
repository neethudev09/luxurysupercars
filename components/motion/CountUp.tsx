"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // ms
  className?: string;
}

export default function CountUp({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1600,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState<string>(`${prefix}0${suffix}`);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finalDisplay = `${prefix}${value.toFixed(decimals)}${suffix}`;

    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(finalDisplay);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const t0 = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              const v = value * eased;
              setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`);
              if (p < 1) requestAnimationFrame(tick);
              else setDisplay(finalDisplay);
            };
            requestAnimationFrame(tick);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [value, decimals, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
