import Link from "next/link";
import type { LocationMeta } from "@/lib/locations";

interface LocationMapProps {
  location: LocationMeta;
}

export default function LocationMap({ location }: LocationMapProps) {
  const query = encodeURIComponent(`${location.name} Dubai`);
  const gmUrl = `https://www.google.com/maps/search/${query}`;

  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] py-16 md:py-20 border-t border-white/[0.05]">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5">
            <h2 className="font-[var(--font-display)] text-[clamp(1.3rem,2.4vw,1.8rem)] leading-[1.15] tracking-[-0.018em] text-[var(--ink-hi)] text-balance mb-4">
              Find Us in {location.name}
            </h2>
            <p className="text-[15px] leading-[1.7] text-[var(--ink-lo)] mb-6 max-w-sm">
              We deliver to every hotel, residence and landmark in {location.name}. Select a pickup location when you book.
            </p>
            <a
              href={gmUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[12.5px] font-[var(--font-mono)] tracking-[0.04em] hover:border-[var(--champagne)]/60 hover:text-[var(--champagne)] transition-colors"
            >
              Open in Google Maps
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="md:col-span-7">
            <div className="relative w-full h-full min-h-[280px] rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-8 flex flex-col">
              <span
                aria-hidden
                className="pointer-events-none absolute right-0 top-0 size-[240px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[var(--champagne)]/[0.04] blur-[100px]"
              />
              <span className="relative font-[var(--font-mono)] text-[10.5px] tracking-[0.26em] uppercase text-[var(--champagne)] mb-5">
                Key Landmarks
              </span>
              <ul className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {location.landmarks.slice(0, 8).map((lm, i) => (
                  <li key={i} className="flex items-center gap-2 text-[14px] leading-[1.5] text-[var(--ink-lo)]">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden className="shrink-0">
                      <circle cx="4" cy="4" r="2.5" stroke="#C6A47E" strokeWidth="1.2" />
                    </svg>
                    {lm}
                  </li>
                ))}
              </ul>
              {location.landmarks.length > 8 && (
                <p className="relative mt-4 text-[13px] text-[var(--ink-lo)]/60 font-[var(--font-mono)] tracking-[0.02em]">
                  +{location.landmarks.length - 8} more landmarks
                </p>
              )}
              <div className="relative mt-auto pt-6">
                <a
                  href={gmUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] font-[var(--font-mono)] tracking-[0.04em] text-[var(--champagne)] hover:text-[var(--champagne-hi)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 13s5-4.5 5-8a5 5 0 1 0-10 0c0 3.5 5 8 5 8z" stroke="currentColor" strokeWidth="1.3" />
                    <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  Get directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
