/**
 * Fleet registry — sourced from lib/fleet-data.json, which is generated
 * by scripts/scrape-fleet.mjs from the live luxurysupercarsdubai.com
 * product pages.
 *
 * Re-run `node scripts/scrape-fleet.mjs` whenever the live fleet changes
 * (new cars added/removed, gallery updates, price changes, etc.).
 *
 * Sanity migration note: the underlying JSON shape (see RawFleetCar
 * below) is intentionally CMS-friendly — image objects carry width/height,
 * specs are nested, categories/features are arrays. When Sanity is wired
 * in, replace the JSON import with a GROQ fetch returning the same shape
 * and this module continues to work unchanged for downstream consumers.
 */
import rawData from "./fleet-data.json";
import featuredData from "./featured-cars.json";

export type Category = "sports" | "convertible" | "luxury" | "suv";

export type Tag =
  | "supercar"
  | "hypercar"
  | "track-ready"
  | "family-friendly"
  | "off-road"
  | "grand-tourer"
  | "limited-edition"
  | "v12"
  | "hybrid"
  | "electric"
  | "awd"
  | "crypto-accepted";

export type FeatureKey =
  | "carplay"
  | "heated-seats"
  | "navigation"
  | "premium-audio"
  | "climate-control"
  | "sunroof"
  | "leather"
  | "parking-sensors"
  | "cruise-control"
  | "keyless"
  | "abs"
  | "bluetooth";

export interface GalleryImage {
  url: string;
  width?: number;
  height?: number;
}

export interface CarSeo {
  title: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  canonical: string;
}

export interface Car {
  name: string;
  slug: string;     // car page slug, e.g. "mclaren-750s-spyder-tiffany-blue"
  brand: string;    // brand directory, e.g. "rent-mclaren-dubai"
  brandName: string; // display brand, e.g. "McLaren"
  /** Coachbuilder / tuner brand slugs the car is also tagged with
   *  (e.g. "rent-mansory-dubai", "rent-brabus-dubai"). The car appears
   *  on each tuner's brand page in addition to its primary brand page. */
  tuners?: string[];
  price: number;    // AED per day; 0 = unknown
  priceCurrency: string;
  /** Optional — live page may not expose every spec. Consumers should
   *  hide their slot when these are missing rather than show "—". */
  engine?: string;
  zeroToHundred?: string;
  doors: number;     // 0 = unknown (consumers should hide the chip)
  seats: number;     // 0 = unknown (consumers should hide the chip)
  image: string;
  category: Category;
  /**
   * Cross-listings for the fleet explorer. Live site allows a single car
   * to appear under multiple types (e.g. Porsche 911 Turbo S → Sports
   * + Convertible + Luxury). Always present; falls back to `[category]`.
   */
  categories: Category[];
  /** Free-form labels surfaced as filter chips on /our-fleet. */
  tags?: Tag[];
  // Extended fields — all sourced from live page when available
  color?: string;
  transmission?: string;
  topSpeed?: string;
  driveType?: string;
  year?: number;
  horsepower?: string;
  engineCapacity?: string;
  baggage?: string;
  // Rental terms — pulled from the live page (every car has them).
  deposit?: string;           // e.g. "AED 5,000"
  mileageLimit?: string;      // e.g. "250 km/day"
  extraKmCharge?: string;     // e.g. "AED 20/km"
  description?: string[];
  features?: FeatureKey[];
  /** Plain-string feature list (unmapped, for richer CMS rendering). */
  featureLabels?: string[];
  /** Full gallery with dimensions — preferred over `image` for hero galleries. */
  gallery: GalleryImage[];
  /** Live SEO mirror — populates the route's <title>, <meta>, OG tags. */
  seo: CarSeo;
  /**
   * Categories in which this car is editorially "featured" — surfaced on
   * the homepage 4-card teaser per category. Editor-curated via
   * lib/featured-cars.json today; will be a Sanity boolean per category
   * once the CMS is wired in.
   */
  featuredIn: Category[];
}

/* -------------------------------------------------------------------------- */
/*  Raw JSON shape (matches scripts/scrape-fleet.mjs output)                  */
/* -------------------------------------------------------------------------- */

interface RawSpecs {
  deposit?: string;
  mileageLimit?: string;
  extraKmCharge?: string;
  year?: string;
  color?: string;
  engine?: string;
  horsepower?: string;
  zeroToHundred?: string;
  engineCapacity?: string;
  driveType?: string;
  transmission?: string;
  doors?: string;
  seats?: string;
  baggage?: string;
  topSpeed?: string;
}

interface RawFleetCar {
  key: string;
  brand: string;
  slug: string;
  name: string;
  brandName: string;
  tuners?: string[];
  url: string;
  canonical: string;
  title: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  price: number | null;
  priceCurrency: string;
  image: string;
  gallery: GalleryImage[];
  categories: string[];
  specs: RawSpecs;
  features: string[];
  bodyText: string;
}

/* -------------------------------------------------------------------------- */
/*  Mapping helpers                                                           */
/* -------------------------------------------------------------------------- */

const FEATURE_KEY_MAP: Array<[RegExp, FeatureKey]> = [
  [/apple\s*carplay|car\s*play/i, "carplay"],
  [/heated\s*seats?/i, "heated-seats"],
  [/navigation|gps/i, "navigation"],
  [/premium\s*audio|bose|burmester|naim/i, "premium-audio"],
  [/climate\s*control|a\/c|air\s*conditioning/i, "climate-control"],
  [/sun\s*roof|panoram|moon\s*roof/i, "sunroof"],
  [/leather\s*seats?|leather\s*upholstery/i, "leather"],
  [/parking\s*sensors?|parking\s*assist/i, "parking-sensors"],
  [/cruise\s*control/i, "cruise-control"],
  [/keyless|smart\s*key|push\s*start/i, "keyless"],
  [/abs|anti.?lock|brake\s*assist/i, "abs"],
  [/bluetooth/i, "bluetooth"],
];

function mapFeatures(raw: string[]): FeatureKey[] {
  const keys = new Set<FeatureKey>();
  for (const label of raw) {
    for (const [re, key] of FEATURE_KEY_MAP) {
      if (re.test(label)) {
        keys.add(key);
        break;
      }
    }
  }
  return [...keys];
}

function isCategory(s: string): s is Category {
  return s === "sports" || s === "convertible" || s === "luxury" || s === "suv";
}

function parseIntOrZero(s?: string): number {
  if (!s) return 0;
  const m = s.match(/-?\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function splitParagraphs(s?: string): string[] | undefined {
  if (!s) return undefined;
  const paras = s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paras.length > 0 ? paras : undefined;
}

// Build a (slug → categories) lookup of featured cars from the editorial
// JSON. Each car's adapter then derives its `featuredIn` array.
const FEATURED_BY_SLUG: Map<string, Set<Category>> = (() => {
  const m = new Map<string, Set<Category>>();
  for (const [cat, slugs] of Object.entries(featuredData)) {
    if (!isCategory(cat) || !Array.isArray(slugs)) continue;
    for (const slug of slugs) {
      if (typeof slug !== "string") continue;
      if (!m.has(slug)) m.set(slug, new Set());
      m.get(slug)!.add(cat);
    }
  }
  return m;
})();

function adaptCar(raw: RawFleetCar): Car {
  const validCategories = raw.categories.filter(isCategory);
  // Fallback: if no categories, default to "sports" (rarest miss); the
  // primary list still excludes uncategorized cars from /rent-* pages.
  const primaryCategory: Category = validCategories[0] || "sports";
  const featuredSet = FEATURED_BY_SLUG.get(raw.slug);
  const featuredIn: Category[] = featuredSet ? [...featuredSet] : [];

  return {
    name: raw.name,
    slug: raw.slug,
    brand: raw.brand,
    brandName: raw.brandName,
    tuners: raw.tuners && raw.tuners.length ? raw.tuners : undefined,
    price: raw.price ?? 0,
    priceCurrency: raw.priceCurrency,
    engine: raw.specs.engine || undefined,
    zeroToHundred: raw.specs.zeroToHundred || undefined,
    doors: parseIntOrZero(raw.specs.doors),
    seats: parseIntOrZero(raw.specs.seats),
    image: raw.image,
    category: primaryCategory,
    categories: validCategories.length > 0 ? validCategories : [primaryCategory],
    color: raw.specs.color,
    transmission: raw.specs.transmission,
    topSpeed: raw.specs.topSpeed,
    driveType: raw.specs.driveType,
    year: raw.specs.year ? parseIntOrZero(raw.specs.year) : undefined,
    horsepower: raw.specs.horsepower,
    engineCapacity: raw.specs.engineCapacity,
    baggage: raw.specs.baggage,
    deposit: raw.specs.deposit,
    mileageLimit: raw.specs.mileageLimit,
    extraKmCharge: raw.specs.extraKmCharge,
    description: splitParagraphs(raw.bodyText),
    features: mapFeatures(raw.features),
    featureLabels: raw.features,
    gallery: raw.gallery,
    seo: {
      title: raw.title,
      metaDescription: raw.metaDescription,
      ogTitle: raw.ogTitle,
      ogDescription: raw.ogDescription,
      ogImage: raw.ogImage,
      ogImageWidth: raw.ogImageWidth,
      ogImageHeight: raw.ogImageHeight,
      canonical: raw.canonical,
    },
    featuredIn,
  };
}

/* -------------------------------------------------------------------------- */
/*  Exported registries                                                       */
/* -------------------------------------------------------------------------- */

export const ALL_CARS: Car[] = (rawData as RawFleetCar[]).map(adaptCar);

// Deduped by brand+slug — used for static route generation.
export const UNIQUE_CARS: Car[] = ALL_CARS.filter(
  (car, idx, arr) =>
    arr.findIndex((c) => c.brand === car.brand && c.slug === car.slug) === idx,
);

/** Cars filtered by primary category membership. */
function byCategory(cat: Category): Car[] {
  return UNIQUE_CARS.filter((c) => c.categories.includes(cat));
}

export const SPORTS_CARS: Car[] = byCategory("sports");
export const CONVERTIBLE_CARS: Car[] = byCategory("convertible");
export const LUXURY_CARS: Car[] = byCategory("luxury");
export const SUV_CARS: Car[] = byCategory("suv");

/**
 * Editorially-featured cars for the homepage 4-card teaser per category.
 * Order honours the editorial slug order in lib/featured-cars.json; if
 * fewer than `limit` cars are featured (or some featured slugs no longer
 * exist), the result is back-filled with other in-category cars so the
 * homepage layout always renders 4 tiles.
 *
 * Sanity migration: replace this with a GROQ query
 *   *[_type == "car" && featured == true && $cat in categories][0...$limit]
 * returning the same Car[] shape.
 */
export function getFeaturedCars(cat: Category, limit = 4): Car[] {
  // Preserve the editorial order from featured-cars.json.
  const editorialMap = featuredData as unknown as Record<string, string[]>;
  const editorialSlugs: string[] = Array.isArray(editorialMap[cat]) ? editorialMap[cat] : [];
  const seen = new Set<string>();
  const ordered: Car[] = [];
  for (const slug of editorialSlugs) {
    const c = UNIQUE_CARS.find((x) => x.slug === slug);
    if (c && !seen.has(c.slug)) {
      ordered.push(c);
      seen.add(c.slug);
      if (ordered.length >= limit) return ordered;
    }
  }
  // Back-fill from same-category cars if we're short.
  for (const c of byCategory(cat)) {
    if (seen.has(c.slug)) continue;
    ordered.push(c);
    seen.add(c.slug);
    if (ordered.length >= limit) break;
  }
  return ordered;
}

export const FEATURED_SPORTS: Car[] = getFeaturedCars("sports", 4);
export const FEATURED_CONVERTIBLES: Car[] = getFeaturedCars("convertible", 4);
export const FEATURED_LUXURY: Car[] = getFeaturedCars("luxury", 4);
export const FEATURED_SUVS: Car[] = getFeaturedCars("suv", 4);

export function carHref(car: Pick<Car, "brand" | "slug">): string {
  return `/${car.brand}/${car.slug}`;
}

export function getCarByPath(brand: string, slug: string): Car | undefined {
  return UNIQUE_CARS.find((c) => c.brand === brand && c.slug === slug);
}

/**
 * Resolve the gallery image list for a car detail page.
 * Falls back to the main `image` if the scraper found no gallery.
 */
export function getCarGallery(car: Car): string[] {
  if (car.gallery && car.gallery.length > 0) {
    return car.gallery.map((g) => g.url);
  }
  return [car.image];
}
