"use client";

import { useEffect, useRef, useState } from "react";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

type Block = {
  id: string;
  label: string;
  heading: string;
  layout: "shorts" | "wide";
  videoIds: readonly string[];
};

const BLOCKS: Block[] = [
  {
    id: "tiktok",
    label: "TikTok",
    heading: "TikTok",
    layout: "shorts",
    videoIds: ["gIho6aTDC6k", "LEWBL8DzhIU", "3_oc4OdQ-4o", "k-xGgGabnXA"],
  },
  {
    id: "youtube",
    label: "YouTube",
    heading: "YouTube",
    layout: "wide",
    videoIds: [
      "0K-TsnRHNE4",
      "1nt0GYv4n9k",
      "khZNxVoI1K8",
      "qtnhEl9ogk4",
      "TjB258kdQFc",
      "VE48aZyvf7g",
      "zrIdggcPOk4",
      "QD87hNbhf-M",
    ],
  },
  {
    id: "podcasts",
    label: "Podcasts",
    heading: "PODCASTS",
    layout: "wide",
    videoIds: ["-1W-Vo3F1_I", "4o4XCiiJtm4", "d48kC2D8MwY", "pZ5-_3Oownw"],
  },
];

function embedSrc(id: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id,
    controls: "1",
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
            <MaskHeading
              text={block.heading}
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(1.7rem,3.6vw,2.8rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)] text-balance mb-8 md:mb-10"
              staggerMs={40}
            />

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
                  delay={Math.min(i * 70, 420)}
                >
                  <LazyEmbed
                    src={embedSrc(vid)}
                    title={`${block.label} clip ${i + 1}`}
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
 * Mounts the YouTube iframe only when the tile scrolls into view.
 * The embed URL already includes autoplay=1&mute=1, so once mounted
 * the clip plays automatically. Off-screen tiles unmount to keep
 * page memory + battery in check.
 */
function LazyEmbed({
  src,
  title,
  aspect,
}: {
  src: string;
  title: string;
  aspect: "9/16" | "16/9";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden rounded-2xl border border-white/8 bg-black ${
        aspect === "9/16" ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      {active && (
        <iframe
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full pointer-events-none"
        />
      )}
    </div>
  );
}
