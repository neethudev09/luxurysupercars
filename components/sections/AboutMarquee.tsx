import Image from "next/image";
import MaskHeading from "@/components/motion/MaskHeading";

type Tile = {
  category: "Award" | "Press" | "Instagram";
  caption: string;
  image: string;
};

const TILES: Tile[] = [
  {
    category: "Award",
    caption: "Luxury Service Award 2024",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/a.avif",
  },
  {
    category: "Press",
    caption: "Featured · Gulf News",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Article-1.avif",
  },
  {
    category: "Instagram",
    caption: "@luxurysupercarsdubai",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/instagram-1.avif",
  },
  {
    category: "Press",
    caption: "Featured · Khaleej Times",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Article-2.avif",
  },
  {
    category: "Award",
    caption: "Top Luxury Rental — UAE",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/award.avif",
  },
  {
    category: "Instagram",
    caption: "@luxurysupercarsdubai",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/instagram-2.avif",
  },
  {
    category: "Press",
    caption: "Featured · Esquire ME",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Article-3.avif",
  },
  {
    category: "Instagram",
    caption: "@luxurysupercarsdubai",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/instagram-3.avif",
  },
  {
    category: "Instagram",
    caption: "@luxurysupercarsdubai",
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/instagram-4.avif",
  },
];

export default function AboutMarquee() {
  // Duplicate the list so the CSS keyframe loops seamlessly.
  const reel = [...TILES, ...TILES];

  return (
    <section className="relative bg-[var(--bg-obsidian)] py-20 md:py-28 overflow-hidden border-t border-white/5">
      <div className="container-x mb-12 md:mb-16">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-7">
            <MaskHeading
              text="**Awarded, featured, followed**"
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.1] tracking-[-0.022em] text-[var(--ink-hi)] text-balance"
              staggerMs={45}
            />
          </div>
          <div className="md:col-span-5">
            <p className="text-[14.5px] leading-[1.7] text-[var(--ink-lo)]">
              From industry awards to features in the regional press and tags
              from clients you already know — a quick look at the company we
              keep.
            </p>
          </div>
        </div>
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[12%] bg-gradient-to-r from-[var(--bg-obsidian)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[12%] bg-gradient-to-l from-[var(--bg-obsidian)] to-transparent" />

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

        {/* Category chip */}
        <span
          className={`absolute top-3 left-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm ${labelColorByCategory[tile.category]}`}
        >
          {tile.category}
        </span>
      </div>

      <figcaption className="text-left text-[12.5px] leading-snug text-white/85">
        {tile.caption}
      </figcaption>
    </figure>
  );
}
