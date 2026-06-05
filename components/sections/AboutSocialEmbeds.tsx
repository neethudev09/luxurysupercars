"use client";

import { useState } from "react";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

type Block = {
  id: string;
  label: string;
  heading: string;
  layout: "shorts" | "wide";
  icon: "tiktok" | "youtube" | "podcasts";
  videoIds: readonly string[];
};

function BlockIcon({ name, size = 32 }: { name: Block["icon"]; size?: number }) {
  if (name === "tiktok") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16.6 5.82A4.85 4.85 0 0 1 14.4 3h-3.36v11.55a2.65 2.65 0 1 1-2.4-2.64v-3.42a6.07 6.07 0 1 0 5.76 6.06V9.94a8.12 8.12 0 0 0 4.6 1.41V7.97a4.78 4.78 0 0 1-2.4-2.15z" />
      </svg>
    );
  }
  if (name === "youtube") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M23.5 6.7c-.3-1-1-1.8-2.1-2.1C19.6 4.1 12 4.1 12 4.1s-7.6 0-9.4.5C1.5 4.9.7 5.7.4 6.7 0 8.6 0 12 0 12s0 3.4.4 5.3c.3 1 1 1.8 2.1 2.1 1.9.5 9.4.5 9.4.5s7.6 0 9.4-.5c1-.3 1.8-1 2.1-2.1.4-1.9.4-5.3.4-5.3s0-3.4-.4-5.3zM9.7 15.6V8.4l6.2 3.6-6.2 3.6z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9.5" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 16.7v3.6M8.4 20.3h7.2M5 12.2a7 7 0 0 1 14 0M2.4 12a9.6 9.6 0 0 1 19.2 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const BLOCKS: Block[] = [
  {
    id: "tiktok",
    label: "TikTok",
    heading: "TikTok",
    layout: "shorts",
    icon: "tiktok",
    videoIds: ["gIho6aTDC6k", "LEWBL8DzhIU", "3_oc4OdQ-4o", "k-xGgGabnXA"],
  },
  {
    id: "youtube",
    label: "YouTube",
    heading: "YouTube",
    layout: "wide",
    icon: "youtube",
    videoIds: ["TjB258kdQFc", "VE48aZyvf7g", "zrIdggcPOk4", "QD87hNbhf-M"],
  },
  {
    id: "podcasts",
    label: "Podcasts",
    heading: "PODCASTS",
    layout: "wide",
    icon: "podcasts",
    videoIds: ["-1W-Vo3F1_I", "4o4XCiiJtm4", "d48kC2D8MwY", "pZ5-_3Oownw"],
  },
];

function thumbUrl(id: string) {
  // maxresdefault (1280x720) is far sharper than hqdefault once cropped into
  // the small 9:16 Shorts tiles, which previously looked blurry. Videos that
  // lack a maxres rendition fall back to hqdefault via the <img> onError below.
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

function playerSrc(id: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export default function AboutSocialEmbeds() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] py-20 md:py-28 border-t border-white/5">
      <div className="container-x space-y-20 md:space-y-24">
        {BLOCKS.map((block) => (
          <div key={block.id} id={block.id}>
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-8 md:mb-10 text-[var(--champagne)]">
              <span className="shrink-0 inline-flex items-center justify-center">
                <BlockIcon name={block.icon} size={32} />
              </span>
              <MaskHeading
                text={block.heading}
                as="h2"
                breakAfterBold={false}
                className="font-[var(--font-display)] text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)] text-balance"
                staggerMs={40}
              />
            </div>

            <div
              className={
                block.layout === "shorts"
                  ? "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
              }
            >
              {block.videoIds.map((vid, i) => (
                <Reveal
                  key={vid}
                  className="rise"
                  delay={Math.min(i * 70, 280)}
                >
                  <VideoFacade
                    id={vid}
                    label={`${block.label} clip ${i + 1}`}
                    aspect={block.layout === "shorts" ? "9/16" : "16/9"}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Lightweight YouTube embed — renders a static thumbnail + play button
 * until clicked. The real iframe only mounts on user interaction, and
 * stays mounted afterwards so scrolling past doesn't black it out.
 */
function VideoFacade({
  id,
  label,
  aspect,
}: {
  id: string;
  label: string;
  aspect: "9/16" | "16/9";
}) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/8 bg-black ${
        aspect === "9/16" ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      {active ? (
        <iframe
          src={playerSrc(id)}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play ${label}`}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl(id)}
            alt=""
            loading="lazy"
            onError={(e) => {
              // Fall back to hqdefault when a video has no maxres rendition.
              const img = e.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = "1";
                img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
              }
            }}
            className="absolute inset-0 size-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm border border-white/20 text-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-[var(--champagne)] group-hover:text-[var(--bg-obsidian)] group-hover:border-[var(--champagne)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M5 3.5L17 10 5 16.5V3.5z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
