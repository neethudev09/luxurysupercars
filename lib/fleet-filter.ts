import type { Car, Category, Tag } from "./fleet";
import {
  brandLabel,
  colorFamily,
  getCarFacets,
  type ColorFamily,
} from "./fleet-tags";

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "speed-asc"
  | "speed-desc"
  | "name-asc";

export interface FleetFilterState {
  categories: Category[];
  brands: string[];
  tags: Tag[];
  doors: number[];
  seats: number[];
  colors: ColorFamily[];
  minPrice?: number;
  maxPrice?: number;
  search: string;
  sort: SortKey;
}

export const EMPTY_FILTERS: FleetFilterState = {
  categories: [],
  brands: [],
  tags: [],
  doors: [],
  seats: [],
  colors: [],
  search: "",
  sort: "featured",
};

/* ------------------------------------------------------------------ */
/*  URL <-> STATE                                                      */
/* ------------------------------------------------------------------ */

export function filtersFromSearchParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): FleetFilterState {
  const get = (k: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(k) ?? undefined;
    const v = params[k];
    if (Array.isArray(v)) return v[0];
    return v;
  };
  const split = (k: string): string[] => {
    const raw = get(k);
    if (!raw) return [];
    return raw.split(",").filter(Boolean);
  };
  return {
    categories: split("category") as Category[],
    brands: split("brand"),
    tags: split("tag") as Tag[],
    doors: split("doors").map((d) => Number(d)).filter((n) => !Number.isNaN(n)),
    seats: split("seats").map((s) => Number(s)).filter((n) => !Number.isNaN(n)),
    colors: split("color") as ColorFamily[],
    minPrice: Number(get("min")) || undefined,
    maxPrice: Number(get("max")) || undefined,
    search: get("q") ?? "",
    sort: (get("sort") as SortKey) ?? "featured",
  };
}

export function filtersToSearchString(state: FleetFilterState): string {
  const sp = new URLSearchParams();
  if (state.categories.length) sp.set("category", state.categories.join(","));
  if (state.brands.length) sp.set("brand", state.brands.join(","));
  if (state.tags.length) sp.set("tag", state.tags.join(","));
  if (state.doors.length) sp.set("doors", state.doors.join(","));
  if (state.seats.length) sp.set("seats", state.seats.join(","));
  if (state.colors.length) sp.set("color", state.colors.join(","));
  if (state.minPrice) sp.set("min", String(state.minPrice));
  if (state.maxPrice) sp.set("max", String(state.maxPrice));
  if (state.search.trim()) sp.set("q", state.search.trim());
  if (state.sort !== "featured") sp.set("sort", state.sort);
  return sp.toString();
}

/* ------------------------------------------------------------------ */
/*  FILTER PREDICATE + SORT                                            */
/* ------------------------------------------------------------------ */

function parseTopSpeed(s: string | undefined): number {
  if (!s) return 0;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export function applyFilters(cars: Car[], f: FleetFilterState): Car[] {
  const q = f.search.trim().toLowerCase();

  const filtered = cars.filter((car) => {
    const facets = getCarFacets(car);

    if (f.categories.length && !f.categories.some((c) => facets.categories.includes(c)))
      return false;
    if (f.brands.length) {
      const carBrands = [car.brand, ...(car.tuners ?? [])];
      if (!f.brands.some((b) => carBrands.includes(b))) return false;
    }
    if (f.tags.length && !f.tags.some((t) => facets.tags.includes(t))) return false;
    if (f.doors.length && !f.doors.includes(car.doors)) return false;
    if (f.seats.length && !f.seats.includes(car.seats)) return false;
    if (f.colors.length) {
      const fam = colorFamily(car.color);
      if (!fam || !f.colors.includes(fam)) return false;
    }
    if (f.minPrice !== undefined && car.price < f.minPrice) return false;
    if (f.maxPrice !== undefined && car.price > f.maxPrice) return false;
    if (q) {
      const haystack = `${car.name} ${brandLabel(car.brand)} ${car.engine} ${car.color ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  switch (f.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    case "speed-asc":
      return [...filtered].sort(
        (a, b) => parseTopSpeed(a.topSpeed) - parseTopSpeed(b.topSpeed),
      );
    case "speed-desc":
      return [...filtered].sort(
        (a, b) => parseTopSpeed(b.topSpeed) - parseTopSpeed(a.topSpeed),
      );
    case "name-asc":
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return filtered;
  }
}

/* ------------------------------------------------------------------ */
/*  FACETS — derive option lists from the actual data                  */
/* ------------------------------------------------------------------ */

export function deriveBrandOptions(cars: Car[]): { value: string; label: string; count: number }[] {
  // Count each car under its primary brand AND each tuner brand it carries,
  // so coachbuilders like Mansory / Brabus surface as filter options.
  const counts = new Map<string, number>();
  for (const c of cars) {
    counts.set(c.brand, (counts.get(c.brand) ?? 0) + 1);
    for (const t of c.tuners ?? []) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, label: brandLabel(value), count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function deriveDoorOptions(cars: Car[]): number[] {
  return Array.from(new Set(cars.map((c) => c.doors))).sort((a, b) => a - b);
}

export function deriveSeatOptions(cars: Car[]): number[] {
  return Array.from(new Set(cars.map((c) => c.seats))).sort((a, b) => a - b);
}

export function deriveColorOptions(cars: Car[]): ColorFamily[] {
  const families = new Set<ColorFamily>();
  for (const c of cars) {
    const fam = colorFamily(c.color);
    if (fam) families.add(fam);
  }
  return Array.from(families);
}

export function deriveTagOptions(cars: Car[]): { value: Tag; count: number }[] {
  const counts = new Map<Tag, number>();
  for (const c of cars) {
    for (const t of getCarFacets(c).tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

export function derivePriceBounds(cars: Car[]): { min: number; max: number } {
  if (cars.length === 0) return { min: 0, max: 0 };
  let min = Infinity;
  let max = -Infinity;
  for (const c of cars) {
    if (c.price < min) min = c.price;
    if (c.price > max) max = c.price;
  }
  return { min, max };
}

export function countActiveFilters(f: FleetFilterState): number {
  return (
    f.categories.length +
    f.brands.length +
    f.tags.length +
    f.doors.length +
    f.seats.length +
    f.colors.length +
    (f.minPrice !== undefined ? 1 : 0) +
    (f.maxPrice !== undefined ? 1 : 0) +
    (f.search.trim() ? 1 : 0)
  );
}
