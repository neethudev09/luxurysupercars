import type { Car, Category, Tag } from "./fleet";

/**
 * Cross-listings + tags keyed by `brand+slug`. Mirrors the live site's
 * behaviour where one car can appear under multiple types (a 911 Turbo S
 * sits in Sports, Convertible, and Luxury). A per-car `categories` or
 * `tags` field on the Car record takes precedence over this map.
 */
const FACET_MAP: Record<string, { categories: Category[]; tags: Tag[] }> = {
  "rent-mclaren-dubai/mclaren-750s-spyder-tiffany-blue": {
    categories: ["sports", "convertible", "luxury"],
    tags: ["supercar", "track-ready", "limited-edition"],
  },
  "rent-porsche-dubai/porsche-911-gt3-white": {
    categories: ["sports", "luxury"],
    tags: ["track-ready"],
  },
  "rent-lamborghini-dubai/lamborghini-huracan-sto-orange": {
    categories: ["sports", "luxury"],
    tags: ["supercar", "track-ready", "limited-edition"],
  },
  "rent-lamborghini-dubai/lamborghini-revuelto": {
    categories: ["sports", "luxury"],
    tags: ["hypercar", "hybrid", "awd", "v12", "limited-edition"],
  },
  "rent-rolls-royce-dubai/rolls-royce-dawn-white": {
    categories: ["convertible", "luxury"],
    tags: ["grand-tourer", "v12"],
  },
  "rent-rolls-royce-dubai/rolls-royce-dawn-black": {
    categories: ["convertible", "luxury"],
    tags: ["grand-tourer", "v12"],
  },
  "rent-porsche-dubai/porsche-911-turbo-s": {
    categories: ["sports", "convertible", "luxury"],
    tags: ["awd", "track-ready"],
  },
  "rent-porsche-dubai/porsche-911-carrera-s-spyder": {
    categories: ["sports", "convertible"],
    tags: [],
  },
  "rent-mercedes-benz-dubai/mercedes-benz-amg-g63-800-widestar": {
    categories: ["luxury", "suv"],
    tags: ["off-road", "family-friendly", "awd", "limited-edition"],
  },
  "rent-bentley-dubai/bentley-bentayga-brown": {
    categories: ["luxury", "suv"],
    tags: ["family-friendly", "grand-tourer", "awd"],
  },
  "rent-ferrari-dubai/ferrari-f8-tributo-spyder-yellow": {
    categories: ["sports", "convertible", "luxury"],
    tags: ["supercar"],
  },
  "rent-lamborghini-dubai/lamborghini-urus-mansory": {
    categories: ["luxury", "suv"],
    tags: ["supercar", "family-friendly", "awd", "limited-edition"],
  },
  "rent-audi-dubai/audi-sq7": {
    categories: ["suv"],
    tags: ["family-friendly", "awd"],
  },
  "rent-rolls-royce-dubai/rolls-royce-cullinan-mansory": {
    categories: ["luxury", "suv"],
    tags: ["family-friendly", "limited-edition", "awd", "v12"],
  },
};

export interface CarFacets {
  categories: Category[];
  tags: Tag[];
}

/**
 * Effective categories + tags for a car. Falls back to the FACET_MAP,
 * then to `[car.category]` and `[]`.
 */
export function getCarFacets(car: Car): CarFacets {
  const key = `${car.brand}/${car.slug}`;
  const fromMap = FACET_MAP[key];
  return {
    categories: car.categories ?? fromMap?.categories ?? [car.category],
    tags: car.tags ?? fromMap?.tags ?? [],
  };
}

/**
 * Subset of cars belonging to a given category, respecting cross-listings
 * (e.g. a 911 Turbo S appears on Sports, Convertible AND Luxury pages).
 */
export function getCarsByCategory(cars: Car[], category: Category): Car[] {
  return cars.filter((c) => getCarFacets(c).categories.includes(category));
}

/**
 * Subset of cars belonging to a given brand slug (e.g. "rent-ferrari-dubai").
 * Used to lock the fleet view on /brands/rent-{brand}-dubai pages.
 */
export function getCarsByBrand(cars: Car[], brandSlug: string): Car[] {
  return cars.filter((c) => c.brand === brandSlug);
}

/**
 * Related cars for the detail page. Matches on cross-listed categories so a
 * convertible-sports-luxury car can pull candidates from any of those buckets.
 */
export function getRelatedCars(cars: Car[], car: Car, limit = 4): Car[] {
  const carCats = getCarFacets(car).categories;
  return cars.filter((c) => {
    if (c.brand === car.brand && c.slug === car.slug) return false;
    const cats = getCarFacets(c).categories;
    return cats.some((cc) => carCats.includes(cc));
  }).slice(0, limit);
}

/* ------------------------------------------------------------------ */
/*  COLOR FAMILIES                                                     */
/* ------------------------------------------------------------------ */

export type ColorFamily =
  | "black"
  | "white"
  | "silver"
  | "gray"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "brown"
  | "gold";

const COLOR_FAMILY_MAP: Record<ColorFamily, { label: string; swatch: string }> = {
  black: { label: "Black", swatch: "#0d0d0f" },
  white: { label: "White", swatch: "#ececec" },
  silver: { label: "Silver", swatch: "#c8ccd1" },
  gray: { label: "Gray", swatch: "#6b6e74" },
  red: { label: "Red", swatch: "#a01818" },
  blue: { label: "Blue", swatch: "#6fb1d6" },
  green: { label: "Green", swatch: "#1d5d3b" },
  yellow: { label: "Yellow", swatch: "#e8c441" },
  orange: { label: "Orange", swatch: "#c45a17" },
  brown: { label: "Brown", swatch: "#6a4a30" },
  gold: { label: "Gold", swatch: "#c9a86a" },
};

const COLOR_LABEL_OVERRIDES: Record<string, ColorFamily> = {
  "tiffany blue": "blue",
  "arctic white": "white",
  "diamond black": "black",
  "matte gray": "gray",
  "guards red": "red",
  "tan brown": "brown",
  "silver metallic": "silver",
  "emerald green": "green",
  "arancio bruciato": "orange",
  "rosso mars": "red",
  "giallo modena": "yellow",
  "mansory edition": "black",
};

export function colorFamily(color: string | undefined): ColorFamily | null {
  if (!color) return null;
  const normalized = color.toLowerCase().trim();
  if (COLOR_LABEL_OVERRIDES[normalized]) return COLOR_LABEL_OVERRIDES[normalized];
  for (const family of Object.keys(COLOR_FAMILY_MAP) as ColorFamily[]) {
    if (normalized.includes(family)) return family;
  }
  return null;
}

export function colorFamilyMeta(family: ColorFamily) {
  return COLOR_FAMILY_MAP[family];
}

export const ALL_COLOR_FAMILIES: ColorFamily[] = Object.keys(
  COLOR_FAMILY_MAP,
) as ColorFamily[];

/* ------------------------------------------------------------------ */
/*  BRAND DISPLAY                                                      */
/* ------------------------------------------------------------------ */

export function brandLabel(brandSlug: string): string {
  return brandSlug
    .replace(/^rent-/, "")
    .replace(/-dubai$/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/^Mercedes Benz$/, "Mercedes-Benz")
    .replace(/^Rolls Royce$/, "Rolls-Royce");
}

/* ------------------------------------------------------------------ */
/*  TAG DISPLAY                                                        */
/* ------------------------------------------------------------------ */

const TAG_LABELS: Record<Tag, string> = {
  supercar: "Supercar",
  hypercar: "Hypercar",
  "track-ready": "Track-ready",
  "family-friendly": "Family-friendly",
  "off-road": "Off-road",
  "grand-tourer": "Grand tourer",
  "limited-edition": "Limited edition",
  v12: "V12",
  hybrid: "Hybrid",
  electric: "Electric",
  awd: "All-wheel drive",
  "crypto-accepted": "Crypto accepted",
};

export function tagLabel(tag: Tag): string {
  return TAG_LABELS[tag] ?? tag;
}

export const ALL_TAGS: Tag[] = Object.keys(TAG_LABELS) as Tag[];
