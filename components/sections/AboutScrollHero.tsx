"use client";

import { useEffect, useRef, useState } from "react";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { ABOUT_HERO } from "@/lib/content";

export default function AboutScrollHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const isFileVideo = ABOUT_HERO.video.provider === "file";

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // The hero clip autoplays on a loop. `autoPlay` covers most browsers; this
  // play() is a belt-and-braces nudge for any that defer autoplay.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      /* autoplay may be blocked — the first frame still shows as a poster */
    });
  }, [isFileVideo]);

  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden bg-[var(--bg-obsidian)]"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 200ms ease-out",
      }}
    >
      {isFileVideo ? (
        <video
          ref={videoRef}
          src={ABOUT_HERO.video.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <iframe
          src={ABOUT_HERO.video.src}
          title="About Luxury Supercars Dubai"
          allow="autoplay; fullscreen; picture-in-picture"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
      {/* Bottom fade to the page background so the video dissolves into the
          black and flows seamlessly into the section below. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--bg-obsidian)] via-[var(--bg-obsidian)]/70 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 pb-14 md:pb-20">
        <div className="container-x">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
            <div className="md:col-span-7">
              <MaskHeading
                text={ABOUT_HERO.heading}
                as="h2"
                breakAfterBold={false}
                className="font-[var(--font-display)] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.1] tracking-[-0.022em] text-white text-balance"
                staggerMs={45}
              />
            </div>

            <div className="md:col-span-5">
              <Reveal delay={400}>
                <p className="font-[var(--font-display)] text-[clamp(1.2rem,1.8vw,1.55rem)] leading-[1.45] tracking-tight text-white">
                  {ABOUT_HERO.paragraph}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
