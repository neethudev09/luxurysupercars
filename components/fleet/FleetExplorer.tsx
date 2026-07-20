"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CarCard from "@/components/cards/CarCard";
import FilterSidebar from "@/components/fleet/FilterSidebar";
import type { Car } from "@/lib/fleet";
import {
  applyFilters,
  countActiveFilters,
  filtersFromSearchParams,
  filtersToSearchString,
  type FleetFilterState,
  type SortKey,
} from "@/lib/fleet-filter";
import {
  brandLabel,
  colorFamilyMeta,
  tagLabel,
  type ColorFamily,
} from "@/lib/fleet-tags";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { formatPrice } from "@/lib/currency";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price · Low → High" },
  { value: "price-desc", label: "Price · High → Low" },
  { value: "speed-desc", label: "Top Speed · Fastest" },
  { value: "name-asc", label: "Name · A → Z" },
];

const CATEGORY_LABELS: Record<string, string> = {
  sports: "Sports",
  convertible: "Convertible",
  luxury: "Luxury",
  suv: "SUV",
};

interface FleetExplorerProps {
  cars: Car[];
  /** When set, hides the Type filter group in the sidebar.
   *  Used by /rent-{type}-cars-dubai pages where the category is locked. */
  hideTypeFilter?: boolean;
  /** When set, hides the Brand filter group in the sidebar.
   *  Used by /brands/* pages where the brand is locked. */
  hideBrandFilter?: boolean;
}

export default function FleetExplorer(props: FleetExplorerProps) {
  return (
    <Suspense fallback={null}>
      <FleetExplorerInner {...props} />
    </Suspense>
  );
}

function FleetExplorerInner({
  cars,
  hideTypeFilter = false,
  hideBrandFilter = false,
}: FleetExplorerProps) {
  const brandName = hideBrandFilter && cars.length > 0 ? cars[0].brandName : undefined;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FleetFilterState>(() =>
    filtersFromSearchParams(searchParams ?? new URLSearchParams()),
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync URL when filters change (replace, not push, to avoid history clutter)
  useEffect(() => {
    const qs = filtersToSearchString(filters);
    const url = qs ? `${pathname}?${qs}` : pathname;
    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const filtered = useMemo(() => applyFilters(cars, filters), [cars, filters]);
  const activeCount = countActiveFilters(filters);

  return (
    <section className="relative bg-[var(--bg-obsidian)] text-[var(--ink-hi)] pt-6 md:pt-8 pb-16 md:pb-20">
      <div className="container-x">
        {/* Result count + sort + mobile filter trigger */}
        <div className="flex flex-wrap items-end justify-between gap-5 mb-7 md:mb-10">
          <div className="flex items-baseline gap-4">
            <span className="font-[var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] leading-none text-[var(--champagne)] tabular-nums">
              {String(filtered.length).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-0.5 pb-1.5">
              <span className="font-[var(--font-mono)] text-[10.5px] tracking-[0.22em] uppercase text-[var(--ink-lo)]">
                {brandName
                  ? `${filtered.length} ${brandName} ${filtered.length === 1 ? "Model" : "Models"} Available`
                  : `${filtered.length === 1 ? "Vehicle" : "Vehicles"} · matched`}
              </span>
              {!brandName && (
                <span className="font-[var(--font-mono)] text-[10.5px] tracking-[0.22em] uppercase text-[var(--ink-lo)]/60">
                  of {cars.length} in fleet
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[12.5px] hover:border-[var(--champagne)]/60 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Filters
              {activeCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] text-[10px] font-[var(--font-mono)] tracking-normal">
                  {activeCount}
                </span>
              )}
            </button>

            <SortDropdown
              value={filters.sort}
              onChange={(sort) => setFilters({ ...filters, sort })}
            />
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <FilterChips filters={filters} onChange={setFilters} />
        )}

        {/* Main: sidebar + grid */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-12 mt-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div
              data-lenis-prevent
              className="sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto overscroll-contain pr-4 -mr-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
            >
              <FilterSidebar
                cars={cars}
                filters={filters}
                onChange={setFilters}
                hideTypeFilter={hideTypeFilter}
                hideBrandFilter={hideBrandFilter}
              />
            </div>
          </div>

          {/* Grid */}
          <div>
            {filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((car, i) => (
                    <motion.div
                      key={`${car.brand}-${car.slug}`}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(i * 0.04, 0.32),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <CarCard car={car} theme="dark" index={i} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <EmptyState onReset={() =>
                setFilters({
                  categories: [],
                  brands: [],
                  tags: [],
                  doors: [],
                  seats: [],
                  colors: [],
                  search: "",
                  sort: filters.sort,
                })
              } />
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 z-[70]"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              data-lenis-prevent
              className="relative h-full w-[88%] max-w-[360px] bg-[var(--bg-graphite)] border-r border-white/10 overflow-y-auto overscroll-contain"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[var(--bg-graphite)]/95 backdrop-blur border-b border-white/10">
                <span className="font-[var(--font-display)] text-lg">Refine</span>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-[var(--ink-hi)]"
                >
                  <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                    <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
              </div>
              <div className="px-5 py-6">
                <FilterSidebar
                  cars={cars}
                  filters={filters}
                  onChange={setFilters}
                  hideTypeFilter={hideTypeFilter}
                />
              </div>
              <div className="sticky bottom-0 px-5 py-4 bg-[var(--bg-graphite)]/95 backdrop-blur border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] py-3 text-sm font-medium"
                >
                  Show {filtered.length} {filtered.length === 1 ? "result" : "results"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ----------------------------- subcomponents ----------------------------- */

function SortDropdown({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none bg-white/[0.04] border border-white/15 rounded-full pl-4 pr-9 py-2.5 text-[12.5px] text-[var(--ink-hi)] hover:border-[var(--champagne)]/60 focus:outline-none focus:border-[var(--champagne)] transition-colors cursor-pointer"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value} className="bg-[var(--bg-graphite)]">
            {s.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--champagne)]"
        width="9"
        height="6"
        viewBox="0 0 9 6"
        fill="none"
      >
        <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </label>
  );
}

function FilterChips({
  filters,
  onChange,
}: {
  filters: FleetFilterState;
  onChange: (next: FleetFilterState) => void;
}) {
  const { currency } = useCurrency();
  const chips: { key: string; label: string; remove: () => void }[] = [];

  filters.categories.forEach((c) =>
    chips.push({
      key: `cat-${c}`,
      label: CATEGORY_LABELS[c] ?? c,
      remove: () =>
        onChange({ ...filters, categories: filters.categories.filter((x) => x !== c) }),
    }),
  );
  filters.brands.forEach((b) =>
    chips.push({
      key: `brand-${b}`,
      label: brandLabel(b),
      remove: () =>
        onChange({ ...filters, brands: filters.brands.filter((x) => x !== b) }),
    }),
  );
  filters.tags.forEach((t) =>
    chips.push({
      key: `tag-${t}`,
      label: tagLabel(t),
      remove: () => onChange({ ...filters, tags: filters.tags.filter((x) => x !== t) }),
    }),
  );
  filters.doors.forEach((d) =>
    chips.push({
      key: `doors-${d}`,
      label: `${d} doors`,
      remove: () => onChange({ ...filters, doors: filters.doors.filter((x) => x !== d) }),
    }),
  );
  filters.seats.forEach((s) =>
    chips.push({
      key: `seats-${s}`,
      label: `${s} seats`,
      remove: () => onChange({ ...filters, seats: filters.seats.filter((x) => x !== s) }),
    }),
  );
  filters.colors.forEach((c) => {
    const meta = colorFamilyMeta(c as ColorFamily);
    chips.push({
      key: `color-${c}`,
      label: meta.label,
      remove: () => onChange({ ...filters, colors: filters.colors.filter((x) => x !== c) }),
    });
  });
  if (filters.minPrice !== undefined)
    chips.push({
      key: "min-price",
      label: `≥ ${formatPrice(filters.minPrice, currency)}`,
      remove: () => onChange({ ...filters, minPrice: undefined }),
    });
  if (filters.maxPrice !== undefined)
    chips.push({
      key: "max-price",
      label: `≤ ${formatPrice(filters.maxPrice, currency)}`,
      remove: () => onChange({ ...filters, maxPrice: undefined }),
    });
  if (filters.search.trim())
    chips.push({
      key: "search",
      label: `"${filters.search.trim()}"`,
      remove: () => onChange({ ...filters, search: "" }),
    });

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.remove}
          className="group inline-flex items-center gap-2 rounded-full bg-[var(--champagne)]/12 border border-[var(--champagne)]/30 px-3 py-1.5 text-[11.5px] text-[var(--champagne-hi)] hover:bg-[var(--champagne)]/20 transition-colors"
        >
          {c.label}
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            aria-hidden
            className="opacity-70 group-hover:opacity-100"
          >
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-20 md:py-24 rounded-2xl border border-white/10 bg-[var(--bg-graphite)]/40">
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[var(--champagne)]/5 blur-3xl" />
      <span className="relative font-[var(--font-display)] text-[clamp(3rem,8vw,5rem)] leading-none text-[var(--champagne)]/30 mb-3">
        00
      </span>
      <h3 className="relative font-[var(--font-display)] text-[clamp(1.4rem,3vw,1.8rem)] mb-2">
        No vehicles match those filters
      </h3>
      <p className="relative text-[16px] text-[var(--ink-lo)] max-w-sm mb-6">
        Try widening the price band, removing a brand, or clearing the colour filter.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="relative inline-flex items-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--champagne-hi)] transition-colors"
      >
        Reset filters
      </button>
    </div>
  );
}
