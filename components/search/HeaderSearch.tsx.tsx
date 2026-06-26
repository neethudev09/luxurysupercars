"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_CARS } from "@/lib/fleet";


export default function HeaderSearch({ onResultClick }: { onResultClick?: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return ALL_CARS.filter((car) =>
      [car.name, car.brandName, car.slug, car.brand]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={boxRef} className="relative w-full lg:w-[260px]">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--champagne)]"
          width="15"
          height="15"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
        >
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>

        <input
          type="search"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Search cars..."
          aria-label="Search cars"
          className="w-full rounded-full border border-white/15 bg-black/35 py-2.5 pl-9 pr-4 text-[14px] text-white placeholder:text-white/55 outline-none backdrop-blur transition-colors focus:border-[var(--champagne)]/70"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[80] w-full min-w-[320px] overflow-hidden rounded-2xl border border-[var(--champagne)]/35 bg-[var(--bg-obsidian)]/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          {results.length > 0 ? (
            <div className="max-h-[420px] overflow-y-auto p-2">
              {results.map((car) => (
                <Link
                  key={car.key}
                  href={`/${car.brand}/${car.slug}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    onResultClick?.();
                  }}
                  className="flex items-center gap-3 rounded-xl p-2.5 text-white hover:bg-white/10 transition-colors"
                >
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold">
                      {car.name}
                    </span>
                    <span className="block truncate text-[12px] text-white/55">
                      {car.brandName}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-white/60">
              No cars found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}