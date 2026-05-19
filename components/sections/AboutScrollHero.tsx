"use client";

import { useEffect, useRef, useState } from "react";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

export default function AboutScrollHero() {
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

    // Touch / coarse-pointer devices (mobile, iPad) — `video.currentTime`
    // seeks are unreliable on iOS Safari, so just autoplay+loop instead.
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (isCoarsePointer) {
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(() => {
        /* autoplay may be blocked — that's fine, poster will show */
      });
      return;
    }

    let raf = 0;
    let primed = false;

    const END_OFFSET = 2;

    const tick = () => {
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        if (!primed) {
          primed = true;
          video.play().then(() => video.pause()).catch(() => {});
        }
        const rect = container.getBoundingClientRect();
        const scrollable = Math.max(rect.height - window.innerHeight, 1);
        const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
        const playableEnd = Math.max(duration - END_OFFSET, 0);
        const target = progress * playableEnd;
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
      className="relative h-[100svh] md:h-[200vh] bg-[var(--bg-obsidian)] px-3 pb-3 md:px-5 md:pb-5"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 200ms ease-out",
      }}
    >
      <div className="sticky top-[76px] md:top-[124px] h-[calc(100vh-88px)] md:h-[calc(100vh-144px)] overflow-hidden rounded-2xl md:rounded-[28px] border border-white/10">
        <video
          ref={videoRef}
          src="/ahmed-trim.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 pb-14 md:pb-20">
          <div className="container-x">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
              <div className="md:col-span-7">
                <MaskHeading
                  text="**CEO** of Luxury Supercar Rentals Dubai"
                  as="h2"
                  breakAfterBold={false}
                  className="font-[var(--font-display)] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.1] tracking-[-0.022em] text-white text-balance"
                  staggerMs={45}
                />
                <Reveal delay={250}>
                  <p className="mt-5 font-[var(--font-mono)] text-[11px] tracking-[0.24em] uppercase text-white/70">
                    Ahmed Mansour · Founder &amp; Owner
                  </p>
                </Reveal>
              </div>

              <div className="md:col-span-5">
                <Reveal delay={400}>
                  <p className="font-[var(--font-display)] text-[clamp(1.2rem,1.8vw,1.55rem)] leading-[1.45] tracking-tight text-white">
                    Ahmed has become a distinctive innovator behind luxury and
                    super-car rentals, making a riveting offer to clients
                    around the world to gain a taste of the opulent lifestyle.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
