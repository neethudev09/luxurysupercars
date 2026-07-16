"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

export default function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1500,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const finalDisplay = `${prefix}${value.toFixed(decimals)}${suffix}`;
  const [display, setDisplay] = useState(finalDisplay);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrame = 0;
    let started = false;

    const startAnimation = () => {
      if (started) return;
      started = true;

      setDisplay(`${prefix}0${suffix}`);
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentValue = value * progress;

        setDisplay(`${prefix}${currentValue.toFixed(decimals)}${suffix}`);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setDisplay(finalDisplay);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [value, decimals, prefix, suffix, duration, finalDisplay]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {display}
    </span>
  );
}
