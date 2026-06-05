// Currency switcher config — indicative, display-only conversion.
//
// Bookings are transacted in AED; converted amounts shown around the site are a
// convenience for international visitors only. That's why non-AED values are
// prefixed with "≈" and rounded, and why SEO/JSON-LD prices stay in AED.
//
// Rates are static and hand-maintained. AED is pegged to USD at 3.6725, so the
// USD rate is effectively fixed; the others are approximate spot rates. Update
// the RATES table here when they drift — it's the single source of truth.

export const CURRENCIES = ["AED", "USD", "GBP", "AUD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const BASE_CURRENCY: Currency = "AED";

/** Value of 1 AED in each currency. */
export const RATES: Record<Currency, number> = {
  AED: 1,
  USD: 0.2723, // AED pegged at 3.6725 to USD
  GBP: 0.214,
  AUD: 0.417,
  EUR: 0.252,
};

type CurrencyMeta = {
  /** Prefix shown before the number, e.g. "AED " or "$". */
  symbol: string;
  /** Rounding granularity for converted values (AED stays exact). */
  round: number;
};

export const CURRENCY_META: Record<Currency, CurrencyMeta> = {
  AED: { symbol: "AED ", round: 1 },
  USD: { symbol: "$", round: 10 },
  GBP: { symbol: "£", round: 10 },
  AUD: { symbol: "$", round: 10 },
  EUR: { symbol: "€", round: 10 },
};

export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);
}

/** Convert an AED amount into the target currency, rounded for display. */
export function convertFromAed(aed: number, currency: Currency): number {
  const { round } = CURRENCY_META[currency];
  const raw = aed * RATES[currency];
  return Math.round(raw / round) * round;
}

/** Just the number, with "≈" for non-base currencies. e.g. "12,000" / "≈ 3,270" */
export function formatAmount(aed: number, currency: Currency): string {
  const value = convertFromAed(aed, currency).toLocaleString("en-US");
  return currency === BASE_CURRENCY ? value : `≈ ${value}`;
}

/** Full inline price with symbol. e.g. "AED 12,000" / "≈ $3,270" */
export function formatPrice(aed: number, currency: Currency): string {
  const value = convertFromAed(aed, currency).toLocaleString("en-US");
  const { symbol } = CURRENCY_META[currency];
  return currency === BASE_CURRENCY ? `${symbol}${value}` : `≈ ${symbol}${value}`;
}
