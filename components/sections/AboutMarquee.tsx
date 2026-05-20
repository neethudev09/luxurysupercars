import Image from "next/image";
import MaskHeading from "@/components/motion/MaskHeading";

type Tile = { image: string; alt: string };

// Image-only tiles, grouped by the live /about-us/ section headings —
// "PRIZES & AWARDS", "PRESS ARTICLES", "INSTAGRAM". Captions deliberately
// omitted: the live site shows photos without labels.
const AWARDS: Tile[] = [
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/a.avif",
    alt: "Award recognition",
  },
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/award.avif",
    alt: "Award recognition",
  },
];

const PRESS: Tile[] = [
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Article-1.avif",
    alt: "Press article",
  },
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Article-2.avif",
    alt: "Press article",
  },
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/Article-3.avif",
    alt: "Press article",
  },
];

const INSTAGRAM: Tile[] = [
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/instagram-1.avif",
    alt: "Instagram post",
  },
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/instagram-2.avif",
    alt: "Instagram post",
  },
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/instagram-3.avif",
    alt: "Instagram post",
  },
  {
    image: "https://luxurysupercarsdubai.com/wp-content/uploads/2024/12/instagram-4.avif",
    alt: "Instagram post",
  },
];

type Block = { h2: string; tiles: Tile[]; cols: string };

const BLOCKS: Block[] = [
  { h2: "PRIZES & AWARDS", tiles: AWARDS, cols: "grid-cols-2 md:grid-cols-2 lg:grid-cols-2" },
  { h2: "PRESS ARTICLES", tiles: PRESS, cols: "grid-cols-1 sm:grid-cols-3" },
  { h2: "INSTAGRAM", tiles: INSTAGRAM, cols: "grid-cols-2 md:grid-cols-4" },
];

export default function AboutMarquee() {
  return (
    <section className="relative bg-[var(--bg-obsidian)] py-20 md:py-28 overflow-hidden border-t border-white/5">
      <div className="container-x space-y-16 md:space-y-20">
        {BLOCKS.map((block) => (
          <div key={block.h2}>
            <MaskHeading
              text={block.h2}
              as="h2"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.1] tracking-[-0.02em] text-[var(--ink-hi)] mb-8 md:mb-10"
              staggerMs={40}
            />
            <div className={`grid ${block.cols} gap-4 md:gap-5`}>
              {block.tiles.map((tile, i) => (
                <figure
                  key={`${block.h2}-${i}`}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/12 bg-[var(--bg-graphite)]"
                >
                  <Image
                    src={tile.image}
                    alt={tile.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
