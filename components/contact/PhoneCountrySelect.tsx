"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRY_CODES, DEFAULT_DIAL } from "@/lib/country-codes";

const DEFAULT_ISO =
  COUNTRY_CODES.find((c) => c.dial === DEFAULT_DIAL)?.iso ?? "AE";

function flagImageUrl(iso: string, size: 20 | 40 = 20) {
  return `https://flagcdn.com/w${size}/${iso.toLowerCase()}.png`;
}

function CountryFlag({ iso, name }: { iso: string; name: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagImageUrl(iso)}
      srcSet={`${flagImageUrl(iso, 40)} 2x`}
      width={20}
      height={15}
      alt=""
      aria-hidden
      className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover"
      loading="lazy"
      title={name}
    />
  );
}

/**
 * Country dialling-code picker for the enquiry form. Unlike a native <select>,
 * the closed control shows only the flag + dial code (e.g. "🇦🇪 +971"), while the
 * open list shows the full country names (with a search box). The chosen dial
 * code is submitted via a hidden input named `countryCode`.
 */
type PhoneCountrySelectProps = {
  variant?: "underline" | "box";
};

export default function PhoneCountrySelect({
  variant = "underline",
}: PhoneCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [iso, setIso] = useState(DEFAULT_ISO);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected =
    COUNTRY_CODES.find((c) => c.iso === iso) ?? COUNTRY_CODES[0];

  const filtered = query.trim()
    ? COUNTRY_CODES.filter((c) => {
        const q = query.trim().toLowerCase();
        return c.name.toLowerCase().includes(q) || c.dial.includes(q);
      })
    : COUNTRY_CODES;

  const isBox = variant === "box";

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`relative shrink-0 ${isBox ? "w-[7.25rem]" : "w-[6.5rem]"}`}
    >
      <input type="hidden" name="countryCode" value={selected.dial} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${selected.name} ${selected.dial}`}
        onClick={() => setOpen((v) => !v)}
        className={
          isBox
            ? "flex h-[46px] w-full items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-[14px] text-[var(--ink-hi)] outline-none transition-colors focus:border-[var(--champagne)]/60"
            : "flex w-full items-center gap-1.5 border-b border-white/15 py-2 text-[16px] text-[var(--ink-hi)] outline-none transition-colors focus:border-[var(--champagne)]"
        }
      >
        <CountryFlag iso={selected.iso} name={selected.name} />
        <span>{selected.dial}</span>
        <svg
          className="ml-auto text-[var(--ink-lo)]"
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
          aria-hidden
        >
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-2 w-[19rem] max-w-[80vw] overflow-hidden rounded-xl border border-white/12 bg-[var(--bg-obsidian)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
          <div className="p-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country…"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[14px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)]/70 outline-none focus:border-[var(--champagne)]"
            />
          </div>
          <ul role="listbox" data-lenis-prevent className="max-h-64 overflow-y-auto overscroll-contain pb-1">
            {filtered.map((c) => (
              <li key={c.iso}>
                <button
                  type="button"
                  onClick={() => {
                    setIso(c.iso);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[14.5px] transition-colors hover:bg-white/10 ${
                    c.iso === iso
                      ? "text-[var(--champagne)]"
                      : "text-[var(--ink-hi)]"
                  }`}
                >
                  <CountryFlag iso={c.iso} name={c.name} />
                  <span className="w-[3.5rem] shrink-0 font-[var(--font-mono)] text-[var(--ink-lo)]">
                    {c.dial}
                  </span>
                  <span className="truncate">{c.name}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-[14px] text-[var(--ink-lo)]">
                No matches
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
