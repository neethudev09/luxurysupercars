/**
 * The new (2025) UAE Dirham currency symbol — a Latin "D" struck through with
 * two horizontal bars. This is a clean approximation; drop in the official SVG
 * from https://u.ae/ when available and the rest of the site picks it up.
 */
export default function AedSymbol({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="AED"
      className={`inline-block h-[0.85em] w-[0.85em] -translate-y-[0.02em] align-[-0.05em] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 4v16" />
      <path d="M8.5 4h2.4a8 8 0 0 1 0 16H8.5" />
      <path d="M3.5 10h9.5" />
      <path d="M3.5 14h9.5" />
    </svg>
  );
}
