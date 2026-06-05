"use client";

import { useEffect, useRef, useState } from "react";
import { HERO } from "@/lib/content";
import MaskHeading from "@/components/motion/MaskHeading";
import MagneticCTA from "@/components/motion/MagneticCTA";

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let raf = 0;
    let primed = false;

    // Seconds of the clip to skip before the scroll-scrub begins. The source is
    // already trimmed to start on the right frame, so scrub the whole thing from 0.
    const START_OFFSET = 0;

    const tick = () => {
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        if (!primed) {
          primed = true;
          video.play().then(() => video.pause()).catch(() => {});
          try {
            video.currentTime = START_OFFSET;
          } catch {
            /* ignore */
          }
        }
        const rect = container.getBoundingClientRect();
        const scrollable = Math.max(rect.height - window.innerHeight, 1);
        const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
        const playableStart = Math.min(START_OFFSET, duration);
        const target = playableStart + progress * (duration - playableStart);
        const current = video.currentTime;
        const delta = target - current;
        if (Math.abs(delta) > 0.01) {
          try {
            video.currentTime = current + delta * 0.5;
          } catch {
            /* ignore */
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[200vh] bg-[var(--bg-obsidian)]"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 200ms ease-out",
      }}
    >
      {/* Full-bleed hero — fills the viewport (100vw × 100vh) and sits beneath
          the transparent fixed nav, which floats over the top of the video. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/scroller-header-video.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        {/* Bottom fade to the page background so the video dissolves into the
            black and flows seamlessly into the brand slider below. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--bg-obsidian)] via-[var(--bg-obsidian)]/70 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-start justify-end text-left px-6 md:px-12 pt-24 pb-12 md:pb-24">
          <MaskHeading
            text={HERO.h1}
            as="h1"
            className="font-[var(--font-display)] font-medium text-[clamp(2.4rem,5.3vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-white max-w-[22ch]"
            staggerMs={55}
            animate
          />

          <p className="mt-5 md:mt-7 max-w-2xl text-[17px] md:text-[18.5px] leading-[1.6] md:leading-[1.65] text-white/75">
            {HERO.sub}
          </p>

          <div className="mt-6 md:mt-9 flex flex-wrap items-center justify-start gap-3.5">
            <MagneticCTA
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[16px] font-medium tracking-wide text-[var(--bg-obsidian)] hover:bg-white/90 transition-colors"
            >
              {HERO.ctaPrimary}
              <svg width="16" height="11" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </MagneticCTA>
            <MagneticCTA
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/10 backdrop-blur px-7 py-3.5 text-[16px] font-medium tracking-wide text-white hover:border-[var(--champagne)] hover:bg-[var(--champagne)]/15 transition-all"
            >
              {HERO.ctaSecondary}
            </MagneticCTA>
          </div>
        </div>
      </div>
    </div>
  );
}
