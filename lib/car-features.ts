/**
 * Canonical car-feature catalog. Used by:
 *   - components/car-detail/FeaturesGrid.tsx (icon picker + render)
 *   - sanity/schemas/documents/car.ts (Studio checkbox list)
 *
 * Add new features here only. Both the Studio UI and the icon-aware
 * renderer pick them up automatically.
 *
 * The `value` is the human-readable label that ships byte-for-byte
 * on the page — so the live-site SEO crawl text is preserved when
 * editors toggle features on/off.
 */
export interface CarFeatureOption {
  value: string;
  title: string;
}

export const CAR_FEATURE_OPTIONS: CarFeatureOption[] = [
  // Connectivity / infotainment
  { value: "Apple CarPlay",            title: "Apple CarPlay" },
  { value: "Android Auto",             title: "Android Auto" },
  { value: "Bluetooth",                title: "Bluetooth" },
  { value: "Premium Audio",            title: "Premium audio" },
  { value: "Touchscreen LCD",          title: "Touchscreen LCD" },
  { value: "USB Type-C",               title: "USB Type-C" },
  { value: "Navigation System",        title: "Navigation system" },
  // Comfort
  { value: "Leather Seats",            title: "Leather seats" },
  { value: "Power Seats",              title: "Power seats" },
  { value: "Climate Control",          title: "Climate control" },
  { value: "Sunroof / Panoramic roof", title: "Sunroof / panoramic roof" },
  { value: "Tinted Windows",           title: "Tinted windows" },
  // Safety
  { value: "SRS Airbags",              title: "SRS airbags" },
  { value: "Parking Sensors",          title: "Parking sensors" },
  { value: "Parking Assist",           title: "Parking assist" },
  { value: "Reverse Camera",           title: "Reverse camera" },
  { value: "Blind Spot Warning",       title: "Blind spot warning" },
  { value: "Cruise Control",           title: "Cruise control" },
  { value: "Adaptive Cruise Control",  title: "Adaptive cruise control" },
  { value: "Digital HUD",              title: "Digital HUD" },
  { value: "Active steering",          title: "Active steering" },
  // Service / value adds
  { value: "Insurance included",       title: "Insurance included" },
  { value: "Crypto is accepted",       title: "Crypto accepted" },
];

export const CAR_FEATURE_VALUES: readonly string[] =
  CAR_FEATURE_OPTIONS.map((o) => o.value);
