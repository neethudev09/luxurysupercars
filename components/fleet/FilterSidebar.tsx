"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Tag, Category } from "@/lib/fleet";
import type { FleetFilterState } from "@/lib/fleet-filter";
import {
  countActiveFilters,
  deriveBrandOptions,
  deriveDoorOptions,
  deriveSeatOptions,
  deriveTagOptions,
  derivePriceBounds,
} from "@/lib/fleet-filter";
import { tagLabel } from "@/lib/fleet-tags";
import type { Car } from "@/lib/fleet";

const CATEGORY_META: { value: Category; label: string }[] = [
  { value: "sports", label: "Sports" },
  { value: "convertible", label: "Convertible" },
  { value: "luxury", label: "Luxury" },
  { value: "suv", label: "SUV" },
];

/* ----------------------------- icons ----------------------------- */

const ICON_PROPS = {
  width: 13,
  height: 13,
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SearchIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <circle cx="6" cy="6" r="4.4" />
    <path d="M9.4 9.4L12.5 12.5" />
  </svg>
);
const TypeIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="0.5" />
    <rect x="8" y="1.5" width="4.5" height="4.5" rx="0.5" />
    <rect x="1.5" y="8" width="4.5" height="4.5" rx="0.5" />
    <rect x="8" y="8" width="4.5" height="4.5" rx="0.5" />
  </svg>
);
const BrandIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <path d="M7 1.4l1.55 3.66L12.5 5.5l-3 2.7.9 4.1L7 10.2l-3.4 2.1.9-4.1-3-2.7 3.95-.44z" />
  </svg>
);
const PriceIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <circle cx="7" cy="7" r="5.4" />
    <path d="M7 3.5v7M9 5.2H5.85a1.05 1.05 0 0 0 0 2.1h2.3a1.05 1.05 0 0 1 0 2.1H5" />
  </svg>
);
const TagIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <path d="M1.5 7.4V1.5h5.9L12.5 6.6 7.6 11.5z" />
    <circle cx="4.3" cy="4.3" r="0.9" />
  </svg>
);
const DoorIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <path d="M3 12V2.6l8-1V12" />
    <path d="M3 12h8" />
    <circle cx="9" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const SeatIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <path d="M5 1.5v6.5h5" />
    <path d="M3.5 11h7" />
    <path d="M10 8v3" />
  </svg>
);

interface FilterSidebarProps {
  cars: Car[];
  filters: FleetFilterState;
  onChange: (next: FleetFilterState) => void;
  /** Hide the Type filter group — used on /rent-{type}-cars-dubai pages
   *  where the category is locked by the page itself. */
  hideTypeFilter?: boolean;
  /** Hide the Brand filter group — used on /brands/* pages where the
   *  brand is locked by the page itself. */
  hideBrandFilter?: boolean;
}

export default function FilterSidebar({
  cars,
  filters,
  onChange,
  hideTypeFilter = false,
  hideBrandFilter = false,
}: FilterSidebarProps) {
  const brandOpts = deriveBrandOptions(cars);
  const doorOpts = deriveDoorOptions(cars);
  const seatOpts = deriveSeatOptions(cars);
  const tagOpts = deriveTagOptions(cars);
  const priceBounds = derivePriceBounds(cars);

  const active = countActiveFilters(filters);

  const toggleArray = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  return (
    <aside className="relative flex flex-col gap-7 text-[var(--ink-hi)]">
      {/* Header: count + clear */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-baseline gap-2.5">
          <span className="font-[var(--font-display)] text-[18px] font-medium tracking-tight text-[var(--ink-hi)]">
            Refine
          </span>
          {active > 0 && (
            <span className="font-[var(--font-mono)] text-[10px] text-[var(--champagne)] tracking-[0.14em]">
              {active} active
            </span>
          )}
        </div>
        {active > 0 && (
          <button
            type="button"
            onClick={() =>
              onChange({
                categories: [],
                brands: [],
                tags: [],
                doors: [],
                seats: [],
                colors: [],
                search: "",
                sort: filters.sort,
              })
            }
            className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-lo)] hover:text-[var(--champagne)] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <Group label="Search" icon={<SearchIcon />}>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--champagne)] opacity-60"
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search the fleet"
            aria-label="Search the fleet"
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-[13px] placeholder:text-[var(--ink-lo)] focus:outline-none focus:border-[var(--champagne)]/60 transition-colors"
          />
        </div>
      </Group>

      {/* Type — hidden on category-locked pages */}
      {!hideTypeFilter && (
        <Group label="Type" icon={<TypeIcon />}>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORY_META.map((c) => {
              const checked = filters.categories.includes(c.value);
              return (
                <PillToggle
                  key={c.value}
                  checked={checked}
                  onClick={() =>
                    onChange({
                      ...filters,
                      categories: toggleArray(filters.categories, c.value),
                    })
                  }
                >
                  {c.label}
                </PillToggle>
              );
            })}
          </div>
        </Group>
      )}

      {/* Brand — hidden on brand-locked pages */}
      {!hideBrandFilter && (
        <Group label="Brand" icon={<BrandIcon />} collapsible>
          <ul className="flex flex-col gap-1">
            {brandOpts.map((b) => {
              const checked = filters.brands.includes(b.value);
              return (
                <li key={b.value}>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({ ...filters, brands: toggleArray(filters.brands, b.value) })
                    }
                    className="group w-full flex items-center justify-between gap-2 py-1.5 text-[13px] hover:text-[var(--champagne)] transition-colors"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Checkmark checked={checked} />
                      <span className={checked ? "text-[var(--champagne)]" : ""}>{b.label}</span>
                    </span>
                    <span className="font-[var(--font-mono)] text-[10px] text-[var(--ink-lo)] tracking-[0.1em]">
                      {String(b.count).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Group>
      )}

      {/* Price */}
      <Group label="Daily Rate (AED)" icon={<PriceIcon />}>
        <PriceRange
          bounds={priceBounds}
          min={filters.minPrice}
          max={filters.maxPrice}
          onChange={(min, max) => onChange({ ...filters, minPrice: min, maxPrice: max })}
        />
      </Group>

      {/* Doors */}
      <Group label="Doors" icon={<DoorIcon />}>
        <div className="flex flex-wrap gap-1.5">
          {doorOpts.map((d) => (
            <PillToggle
              key={d}
              small
              checked={filters.doors.includes(d)}
              onClick={() => onChange({ ...filters, doors: toggleArray(filters.doors, d) })}
            >
              {d}
            </PillToggle>
          ))}
        </div>
      </Group>

      {/* Seats */}
      <Group label="Seats" icon={<SeatIcon />}>
        <div className="flex flex-wrap gap-1.5">
          {seatOpts.map((s) => (
            <PillToggle
              key={s}
              small
              checked={filters.seats.includes(s)}
              onClick={() => onChange({ ...filters, seats: toggleArray(filters.seats, s) })}
            >
              {s}
            </PillToggle>
          ))}
        </div>
      </Group>

      {/* Tags */}
      <Group label="Tags" icon={<TagIcon />} collapsible>
        <div className="flex flex-wrap gap-1.5">
          {tagOpts.map((t) => {
            const checked = filters.tags.includes(t.value);
            return (
              <PillToggle
                key={t.value}
                checked={checked}
                onClick={() =>
                  onChange({ ...filters, tags: toggleArray(filters.tags, t.value) })
                }
              >
                {tagLabel(t.value)}
                <span className="ml-1.5 opacity-50 font-[var(--font-mono)] text-[9px]">
                  {t.count}
                </span>
              </PillToggle>
            );
          })}
        </div>
      </Group>
    </aside>
  );
}

/* ----------------------------- subcomponents ----------------------------- */

function Group({
  label,
  icon,
  children,
  collapsible = false,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => collapsible && setOpen((v) => !v)}
        disabled={!collapsible}
        className="flex items-center justify-between text-left disabled:cursor-default group/group"
      >
        <span className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[10.5px] tracking-[0.22em] uppercase text-[var(--ink-lo)] group-hover/group:text-[var(--champagne)] transition-colors">
          {icon && (
            <span className="text-[var(--champagne)] opacity-90">{icon}</span>
          )}
          {label}
        </span>
        {collapsible && (
          <svg
            width="9"
            height="6"
            viewBox="0 0 9 6"
            className={`text-[var(--ink-lo)] transition-transform ${open ? "" : "-rotate-90"}`}
            fill="none"
          >
            <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        )}
      </button>
      {open && (
        <motion.div
          initial={collapsible ? { opacity: 0, height: 0 } : false}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </section>
  );
}

function PillToggle({
  checked,
  children,
  onClick,
  small = false,
}: {
  checked: boolean;
  children: React.ReactNode;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full transition-all border ${
        small ? "px-3 py-1.5 text-[11.5px] min-w-9" : "px-3 py-1.5 text-[12px]"
      } ${
        checked
          ? "bg-[var(--champagne)] text-[var(--bg-obsidian)] border-[var(--champagne)]"
          : "bg-transparent text-[var(--ink-hi)] border-white/12 hover:border-[var(--champagne)]/60 hover:text-[var(--champagne-hi)]"
      }`}
    >
      {children}
    </button>
  );
}

function Checkmark({ checked }: { checked: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center size-4 rounded-[3px] border transition-all ${
        checked
          ? "bg-[var(--champagne)] border-[var(--champagne)]"
          : "bg-transparent border-white/25 group-hover:border-[var(--champagne)]/60"
      }`}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden>
          <path
            d="M1 3.5L3.5 6L8 1"
            stroke="var(--bg-obsidian)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

const PRICE_STEP = 100;

function PriceRange({
  bounds,
  min,
  max,
  onChange,
}: {
  bounds: { min: number; max: number };
  min?: number;
  max?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
}) {
  const lo = min ?? bounds.min;
  const hi = max ?? bounds.max;
  const span = bounds.max - bounds.min || 1;
  const loPct = ((lo - bounds.min) / span) * 100;
  const hiPct = ((hi - bounds.min) / span) * 100;

  const setLo = (n: number) => {
    const clamped = Math.min(Math.max(n, bounds.min), hi - PRICE_STEP);
    onChange(clamped === bounds.min ? undefined : clamped, max);
  };
  const setHi = (n: number) => {
    const clamped = Math.max(Math.min(n, bounds.max), lo + PRICE_STEP);
    onChange(min, clamped === bounds.max ? undefined : clamped);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Live values */}
      <div className="flex items-baseline justify-between font-[var(--font-mono)] text-[11px] tracking-[0.06em]">
        <span className="text-[var(--champagne)]">
          AED {lo.toLocaleString()}
        </span>
        <span className="text-[var(--ink-lo)]">–</span>
        <span className="text-[var(--champagne)]">
          AED {hi.toLocaleString()}
        </span>
      </div>

      {/* Dual-handle slider — 10px insets keep the 18px thumbs from clipping at the extremes */}
      <div className="relative h-6 flex items-center">
        {/* Track (inset 10px each side to match the input track) */}
        <div className="absolute left-[10px] right-[10px] top-1/2 -translate-y-1/2 h-1 rounded-full bg-white/10">
          {/* Active range fill — percentages here are relative to the inset track */}
          <div
            className="absolute top-0 h-full bg-[var(--champagne)] rounded-full"
            style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
          />
        </div>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={PRICE_STEP}
          value={lo}
          aria-label="Minimum daily rate"
          onChange={(e) => setLo(Number(e.target.value))}
          className="range-thumb"
          style={{ zIndex: lo > bounds.max - span * 0.1 ? 5 : 3 }}
        />
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={PRICE_STEP}
          value={hi}
          aria-label="Maximum daily rate"
          onChange={(e) => setHi(Number(e.target.value))}
          className="range-thumb"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Bounds tick labels */}
      <div className="flex justify-between font-[var(--font-mono)] text-[9.5px] text-[var(--ink-lo)]/60 tracking-[0.14em]">
        <span>{bounds.min.toLocaleString()}</span>
        <span>{bounds.max.toLocaleString()}</span>
      </div>
    </div>
  );
}
