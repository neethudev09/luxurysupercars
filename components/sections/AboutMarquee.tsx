import Image from "next/image";
import { ABOUT_PRESS } from "@/lib/content";

type Tile = {
  category: "Award" | "Press" | "Instagram";
  caption: string;
  image: string;
};

// Tiles (caption + image + label) are CMS-managed — see ABOUT_PRESS in
// lib/content.ts. The live site's SEO-load-bearing H2s ("PRIZES & AWARDS",
// "PRESS ARTICLES", "INSTAGRAM") are rendered as sr-only headings below so
// search engines pick them up regardless of which tiles are shown.
const TILES: Tile[] = ABOUT_PRESS.items;

export default function AboutMarquee() {
  // Emptying the reel in the CMS hides the whole strip.
  if (TILES.length === 0) return null;
  // Duplicate the list so the CSS keyframe loops seamlessly.
  const reel = [...TILES, ...TILES];

  return (
    <section className="relative bg-[var(--bg-pearl)] py-20 md:py-28 overflow-hidden border-t border-black/5">
      {/* SEO-only — preserves the live site's section H2s without
          forcing a visual change. */}
      <h2 className="sr-only">PRIZES &amp; AWARDS</h2>
      <h2 className="sr-only">PRESS ARTICLES</h2>
      <h2 className="sr-only">INSTAGRAM</h2>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12%] bg-gradient-to-r from-[var(--bg-pearl)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12%] bg-gradient-to-l from-[var(--bg-pearl)] to-transparent" />

      <div
        className="marquee-pause-hover relative w-full overflow-hidden"
        style={{ ["--marquee-speed" as string]: "55s" }}
      >
        <div className="marquee-track gap-5 md:gap-6">
          {reel.map((tile, i) => (
            <MarqueeTile key={`${tile.caption}-${i}`} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarqueeTile({ tile }: { tile: Tile }) {
  const borderByCategory: Record<Tile["category"], string> = {
    Award: "border-[var(--champagne)]/30",
    Press: "border-white/15",
    Instagram: "border-white/12",
  };

  const labelColorByCategory: Record<Tile["category"], string> = {
    Award: "text-[var(--champagne-hi)]",
    Press: "text-[var(--ink-hi)]",
    Instagram: "text-[var(--ink-hi)]",
  };

  return (
    <figure className="shrink-0 w-[clamp(220px,22vw,300px)] flex flex-col gap-3">
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-2xl border ${borderByCategory[tile.category]} bg-[var(--bg-graphite)]`}
      >
        <Image
          src={tile.image}
          alt={tile.caption}
          fill
          sizes="(min-width: 768px) 22vw, 300px"
          className="object-cover"
        />
        <span
          className={`absolute top-3 left-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm ${labelColorByCategory[tile.category]}`}
        >
          {tile.category}
        </span>
      </div>

      <figcaption className="text-left text-[12.5px] leading-snug text-[var(--ink-dark-lo)]">
        {tile.caption}
      </figcaption>
    </figure>
  );
}
