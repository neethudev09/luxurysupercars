import Image from "next/image";
import { BRAND_LOGOS } from "@/lib/assets";

// Logos that ship dark-on-transparent — invert on this section's dark bg.
// Empty for now — the local McLaren / Maserati / Porsche / Mansory /
// Brabus assets are already designed for a dark background.
const DARK_LOGOS = new Set<string>();

export default function BrandMarquee() {
  const logos = [...BRAND_LOGOS, ...BRAND_LOGOS]; // double for seamless loop

  return (
    <section id="brands" aria-label="Trusted brands" className="relative">
      <div className="container-x py-3">
        <div
          className="overflow-hidden"
          style={{ ["--marquee-speed" as string]: "55s" }}
        >
          <div className="marquee-track gap-12 md:gap-16 py-1">
            {logos.map((b, i) => (
              <div
                key={`${b.name}-${i}`}
                className="relative h-10 w-[80px] shrink-0 flex items-center justify-center"
                title={b.name}
              >
                <Image
                  src={b.src}
                  alt={`${b.name} logo`}
                  fill
                  sizes="80px"
                  className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                  style={DARK_LOGOS.has(b.name) ? { filter: "invert(1)" } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
