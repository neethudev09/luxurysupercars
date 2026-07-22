import Link from "next/link";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import type { BrandSection, BrandSectionBlock } from "@/lib/fleet-brands";

interface FleetBrandAboutProps {
  /** Brand display name used in the top eyebrow (e.g. "Ferrari"). */
  brandName: string;
  /** Ordered list of H2 sections with body blocks — verbatim. */
  sections: BrandSection[];
}

/**
 * Editorial long-form block carrying the verbatim live-page SEO sections.
 * Each section renders as a row: heading on the left, body blocks (paragraphs,
 * lists, pricing tables) stacked on the right.
 */
export default function FleetBrandAbout({
  brandName,
  sections,
}: FleetBrandAboutProps) {
  if (sections.length === 0) return null;

  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-16 md:py-24 border-t border-white/[0.05] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--champagne)]/[0.05] blur-[140px]"
      />

      <div className="container-x relative">
        <Reveal>
          <p className="font-[var(--font-mono)] text-[10.5px] tracking-[0.26em] uppercase text-[var(--ink-lo)] mb-10 md:mb-12">
            About · {brandName}
          </p>
        </Reveal>

        <div className="flex flex-col gap-14 md:gap-20">
          {sections.map((s, sectionIdx) => (
            <div
              key={`${sectionIdx}-${s.h2}`}
              className="grid md:grid-cols-12 gap-8 md:gap-12"
            >
              <div className="md:col-span-5">
                <MaskHeading
                  text={s.h2}
                  as="h2"
                  breakAfterBold={false}
                  className="font-[var(--font-display)] text-[clamp(1.5rem,2.8vw,2.2rem)] leading-[1.15] tracking-[-0.018em] text-[var(--ink-hi)] text-balance"
                  staggerMs={40}
                />
              </div>
              <div className="md:col-span-7 space-y-10">
                {s.body.map((block, i) => (
                  <BlockRenderer key={i} block={block} delay={100 + i * 50} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlockRenderer({ block, delay }: { block: BrandSectionBlock; delay: number }) {
  if (block.kind === "paragraph") {
    return (
      <Reveal delay={delay}>
        <p className="text-[16.5px] leading-[1.85] text-[var(--ink-lo)]">
          {block.text}
        </p>
      </Reveal>
    );
  }
  if (block.kind === "rich-paragraph") {
    return (
      <Reveal delay={delay}>
        <p className="text-[16.5px] leading-[1.85] text-[var(--ink-lo)]">
          {block.segments.map((seg, i) =>
            seg.href ? (
              <Link
                key={i}
                href={seg.href}
                className="text-[var(--champagne)] hover:text-[var(--champagne-hi)] underline underline-offset-2 transition-colors"
              >
                {seg.text}
              </Link>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </p>
      </Reveal>
    );
  }
  if (block.kind === "list") {
    return (
      <Reveal delay={delay}>
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="relative pl-6 text-[16px] leading-[1.75] text-[var(--ink-lo)]"
            >
              <span
                aria-hidden
                className="absolute left-0 top-[0.72em] inline-block size-1.5 rounded-full bg-[var(--champagne)]"
              />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    );
  }
  if (block.kind === "table") {
    return (
      <Reveal delay={delay}>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="min-w-full text-[15px]">
            <thead>
              <tr className="bg-white/[0.04] border-b border-white/10">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-[var(--font-mono)] text-[10.5px] tracking-[0.16em] uppercase text-[var(--champagne)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-3 align-top ${
                        ci === 0
                          ? "text-[var(--ink-hi)] font-medium"
                          : "font-[var(--font-mono)] tracking-[0.02em] text-[var(--ink-lo)]"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    );
  }
  return null;
}
