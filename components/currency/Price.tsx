"use client";

import { useCurrency } from "./CurrencyProvider";
import { formatAmount, formatPrice } from "@/lib/currency";

/**
 * Inline price with symbol, e.g. "AED 12,000" or "≈ $3,270". Use inside text or
 * a single price line. Safe to embed from server components.
 */
export function Price({ amount, className }: { amount: number; className?: string }) {
  const { currency } = useCurrency();
  return (
    <span className={className} suppressHydrationWarning>
      {formatPrice(amount, currency)}
    </span>
  );
}

/**
 * Just the converted number ("12,000" / "≈ 3,270"), for layouts that render the
 * currency unit separately (see CurrencyCode).
 */
export function PriceAmount({ amount, className }: { amount: number; className?: string }) {
  const { currency } = useCurrency();
  return (
    <span className={className} suppressHydrationWarning>
      {formatAmount(amount, currency)}
    </span>
  );
}

/** The active currency code on its own, e.g. "AED" / "USD". */
export function CurrencyCode({ className }: { className?: string }) {
  const { currency } = useCurrency();
  return (
    <span className={className} suppressHydrationWarning>
      {currency}
    </span>
  );
}
