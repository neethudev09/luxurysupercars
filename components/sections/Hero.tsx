"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HERO } from "@/lib/content";
import { HERO_IMAGE } from "@/lib/assets";
import MaskHeading from "@/components/motion/MaskHeading";
import MagneticCTA from "@/components/motion/MagneticCTA";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const durationRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.55, 0.75], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.75], ["0%", "-6%"]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      durationRef.current = video.duration || 0;
      // Prime the video so iOS Safari allows currentTime writes.
      video.play().then(() => video.pause()).catch(() => {});
    };

    if (video.readyState >= 1) onMeta();
    else video.addEventListener("loadedmetadata", onMeta, { once: true });

    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reducedMotion) return;
    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !duration) return;
    const t = Math.min(Math.max(v, 0), 1) * duration;
    if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`relative bg-[var(--bg-obsidian)] ${reducedMotion ? "h-[100svh]" : "h-[300vh]"}`}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <video
          ref={videoRef}
          src="/scroller-header-video.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          poster={HERO_IMAGE}
          className="absolute inset-0 size-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

        <motion.div
          className="absolute inset-0 flex flex-col items-start justify-end text-left px-6 md:px-12 pt-20 pb-12 md:pb-20"
          style={reducedMotion ? undefined : { y: textY, opacity: textOpacity }}
        >
          <MaskHeading
            text={HERO.h1}
            as="h1"
            className="font-[var(--font-display)] font-medium text-[clamp(1.7rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-white max-w-[22ch]"
            staggerMs={55}
          />

          <p className="mt-6 max-w-xl text-[14.5px] md:text-[15.5px] leading-[1.65] text-white/75">
            {HERO.sub}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-start gap-3">
            <MagneticCTA
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3 text-[13px] font-medium tracking-wide text-[var(--bg-obsidian)] hover:bg-white/90 transition-colors"
            >
              {HERO.ctaPrimary}
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </MagneticCTA>
            <MagneticCTA
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/10 backdrop-blur px-6 py-3 text-[13px] font-medium tracking-wide text-white hover:border-[var(--champagne)] hover:bg-[var(--champagne)]/15 transition-all"
            >
              {HERO.ctaSecondary}
            </MagneticCTA>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
