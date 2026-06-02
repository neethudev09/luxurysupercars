import Link from "next/link";
import type { Car } from "@/lib/fleet";
import { CONTACT } from "@/lib/content";
import { Price } from "@/components/currency/Price";

/**
 * Rental card — price headline + live rental terms (deposit / mileage /
 * extra km) + Enquire + WhatsApp CTAs. Rendered in either the hero
 * right column or beside the SpecGrid, controlled by a const in
 * components/car-detail/CarDetail.tsx (so the placement is a one-line
 * flip to roll back).
 */
export default function RentalCard({ car, className = "" }: { car: Car; className?: string }) {
  const waNumber = CONTACT.primaryPhone.replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Hi, I'm interested in renting the ${car.name}. Could you share availability and pricing?`,
  );
  const waHref = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[var(--bg-graphite)]/55 backdrop-blur p-6 ${className}`.trim()}
    >
      <p className="font-[var(--font-display)] text-[clamp(2rem,3.6vw,2.8rem)] font-medium leading-none text-[var(--champagne)]">
        <Price amount={car.price} />
        <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--ink-lo)] ml-2">
          / day
        </span>
      </p>

      <ul className="mt-5 flex flex-col divide-y divide-white/8">
        {car.deposit && (
          <RentalTermRow label="Security deposit" value={car.deposit} />
        )}
        {car.mileageLimit && (
          <RentalTermRow label="Mileage limit" value={car.mileageLimit} />
        )}
        {car.extraKmCharge && (
          <RentalTermRow label="Extra km charge" value={car.extraKmCharge} />
        )}
        <RentalTermRow label="Insurance" value="Included" />
      </ul>

      <div className="mt-6 flex flex-col gap-2.5">
        <Link
          href="#enquire"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-medium tracking-wide text-[var(--bg-obsidian)] hover:bg-white/90 transition-colors"
        >
          Enquire Now
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </Link>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp about the ${car.name}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[13px] font-medium tracking-wide text-white hover:bg-[#1ebe5d] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M13.6 2.32A7.85 7.85 0 0 0 8.02 0C3.6 0 0 3.6 0 8.02c0 1.41.37 2.79 1.07 4.01L0 16l4.09-1.07a8.04 8.04 0 0 0 3.92 1c4.42 0 8.02-3.6 8.02-8.02 0-2.14-.83-4.16-2.43-5.6zM8.02 14.66a6.65 6.65 0 0 1-3.4-.93l-.24-.14-2.43.63.65-2.37-.16-.25a6.65 6.65 0 0 1-1.02-3.55c0-3.68 3-6.68 6.68-6.68a6.65 6.65 0 0 1 6.68 6.68c0 3.68-3 6.68-6.68 6.68zm3.66-5c-.2-.1-1.18-.58-1.36-.65-.18-.07-.32-.1-.45.1-.13.2-.52.65-.64.78-.12.13-.23.15-.43.05a5.45 5.45 0 0 1-1.6-.99 6.04 6.04 0 0 1-1.11-1.38c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.34.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12 0-.25-.01-.39-.01a.74.74 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .98.72 1.93.82 2.07.1.13 1.41 2.16 3.42 3.03.48.21.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.18-.48 1.35-.95.16-.46.16-.86.12-.95-.05-.08-.18-.13-.38-.23z" />
          </svg>
          Enquire on WhatsApp
        </a>
        <p className="mt-1 text-center font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--ink-lo)]">
          <span className="inline-flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M9 7v10M14 8c1.5 0 2.5 1 2.5 2.2S15.5 12 14 12H9M14 12c1.5 0 2.5 1 2.5 2.2S15.5 16 14 16H9" />
            </svg>
            Crypto accepted
          </span>
        </p>
      </div>
    </div>
  );
}

function RentalTermRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <span className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--ink-lo)]">
        {label}
      </span>
      <span className="text-[14px] font-medium text-[var(--ink-hi)]">{value}</span>
    </li>
  );
}
