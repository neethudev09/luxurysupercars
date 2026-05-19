import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import Image from "next/image";
import { INSTAGRAM } from "@/lib/content";
import { ALL_CARS } from "@/lib/fleet";

// Map reels to a representative fleet image until real reel thumbs are sourced.
const TILE_IMAGES = [
  ALL_CARS[12].image, // Brabus G63
  ALL_CARS[2].image,  // Huracán STO
  ALL_CARS[3].image,  // Revuelto
  ALL_CARS[10].image, // F8 Tributo
  ALL_CARS[0].image,  // McLaren 750S
];

function ReelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 9.5h20M9 2.5l-3.5 7M16 2.5l-3.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="2.5"
        width="20"
        height="19"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 12.5l4 2.5-4 2.5v-5z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor" aria-hidden>
      <path d="M0 0v11l10-5.5L0 0z" />
    </svg>
  );
}

export default function InstagramFeed() {
  return (
    <section id={INSTAGRAM.id} className="bg-[var(--bg-bone)] text-[var(--ink-dark-hi)] py-20 md:py-24">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-10">
          <div className="md:col-span-8">
            <MaskHeading
              text={INSTAGRAM.h2}
              as="h2"
              className="font-[var(--font-display)] text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.06] tracking-[-0.018em] text-[var(--ink-dark-hi)]"
              staggerMs={42}
            />
          </div>
          <div className="md:col-span-4 md:text-right">
            <p className="font-[var(--font-display)] font-semibold uppercase tracking-[-0.01em] text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.1] text-[var(--ink-dark-hi)]">
              @LUXURYSUPERCARSDUBAI
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {INSTAGRAM.reels.map((r, i) => (
            <Reveal
              key={r.href}
              className="rise group"
              delay={i * 80}
            >
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="block relative aspect-[4/5] overflow-hidden rounded-xl bg-black"
              >
                <Image
                  src={TILE_IMAGES[i % TILE_IMAGES.length]}
                  alt={r.caption}
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />

                {/* Top: subtle highlight gradient for icon contrast */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />

                {/* Reel icon */}
                <span className="absolute top-2.5 right-2.5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                  <ReelIcon />
                </span>

                {/* Hover: dark overlay with caption + watch reel */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-[12.5px] leading-[1.45] line-clamp-3 mb-2">
                    {r.caption}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-white/90 font-[var(--font-mono)]">
                    <PlayIcon />
                    Watch reel
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--ink-dark-hi)]/25 px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--ink-dark-hi)] hover:text-[var(--bg-bone)] transition-colors"
          >
            {INSTAGRAM.ctaLoad}
          </button>
          <a
            href="https://www.instagram.com/luxurysupercarsdubai/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink-dark-hi)] text-[var(--bg-bone)] px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--champagne)] hover:text-[var(--bg-obsidian)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.6" cy="6.4" r="1.05" fill="currentColor" />
            </svg>
            {INSTAGRAM.ctaFollow}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
