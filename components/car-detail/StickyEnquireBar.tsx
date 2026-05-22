import Image from "next/image";
import type { Car } from "@/lib/fleet";
import { CONTACT } from "@/lib/content";

interface StickyEnquireBarProps {
  car: Car;
}

/**
 * Persistent car CTA bar, fixed to the bottom of the viewport and overlaid on
 * the page content. Always present in the markup so its links are crawlable,
 * and visible without a scroll trigger.
 */
export default function StickyEnquireBar({ car }: StickyEnquireBarProps) {
  const phoneDigits = CONTACT.primaryPhone.replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Hi, I'm interested in renting the ${car.name}. Could you share availability and pricing?`,
  );
  const waHref = `https://wa.me/${phoneDigits}?text=${waMessage}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="container-x pb-3 md:pb-4">
        <div className="flex items-center gap-3 md:gap-5 rounded-full bg-[var(--bg-obsidian)]/92 backdrop-blur-xl border border-white/12 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)] pl-2 pr-2 py-2 md:pl-3 md:pr-3 md:py-3">
          {/* Thumbnail */}
          <div className="relative shrink-0 size-12 md:size-14 rounded-full overflow-hidden border border-white/12">
            <Image
              src={car.image}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          {/* Name + price */}
          <div className="min-w-0 flex-1 flex items-center justify-between gap-3 md:gap-6">
            <div className="min-w-0">
              <p className="font-[var(--font-display)] text-[14px] md:text-[16px] leading-tight tracking-tight text-[var(--ink-hi)] truncate">
                {car.name}
              </p>
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--ink-lo)] truncate">
                {car.engine} · {car.seats} seats · {car.doors} doors
              </p>
            </div>
            <div className="hidden md:inline-flex items-baseline gap-1.5 whitespace-nowrap shrink-0">
              <span className="font-[var(--font-display)] text-[20px] leading-none text-[var(--champagne)]">
                AED {car.price.toLocaleString()}
              </span>
              <span className="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--ink-lo)]">
                per day
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${phoneDigits}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 md:px-5 py-2.5 md:py-3 text-[12px] md:text-[13px] font-medium text-[var(--bg-obsidian)] hover:bg-white/90 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M12.5 9.85v1.65c0 .55-.45 1-1 1A10.5 10.5 0 0 1 1.5 2c0-.55.45-1 1-1H4.15c.45 0 .85.3.96.74l.6 2.4a1 1 0 0 1-.26.95L4.4 6.13a8.5 8.5 0 0 0 3.47 3.47l1.04-1.05c.25-.25.6-.35.95-.26l2.4.6c.44.1.74.5.74.96z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">Call us now</span>
              <span className="sm:hidden">Call</span>
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp about the ${car.name}`}
              className="inline-flex items-center justify-center size-10 md:size-11 rounded-full bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M13.6 2.32A7.85 7.85 0 0 0 8.02 0C3.6 0 0 3.6 0 8.02c0 1.41.37 2.79 1.07 4.01L0 16l4.09-1.07a8.04 8.04 0 0 0 3.92 1c4.42 0 8.02-3.6 8.02-8.02 0-2.14-.83-4.16-2.43-5.6zM8.02 14.66a6.65 6.65 0 0 1-3.4-.93l-.24-.14-2.43.63.65-2.37-.16-.25a6.65 6.65 0 0 1-1.02-3.55c0-3.68 3-6.68 6.68-6.68a6.65 6.65 0 0 1 6.68 6.68c0 3.68-3 6.68-6.68 6.68zm3.66-5c-.2-.1-1.18-.58-1.36-.65-.18-.07-.32-.1-.45.1-.13.2-.52.65-.64.78-.12.13-.23.15-.43.05a5.45 5.45 0 0 1-1.6-.99 6.04 6.04 0 0 1-1.11-1.38c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.34.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12 0-.25-.01-.39-.01a.74.74 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .98.72 1.93.82 2.07.1.13 1.41 2.16 3.42 3.03.48.21.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.18-.48 1.35-.95.16-.46.16-.86.12-.95-.05-.08-.18-.13-.38-.23z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
