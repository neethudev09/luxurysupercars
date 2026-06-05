"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import type { Car } from "@/lib/fleet";
import { carHref } from "@/lib/fleet";
import { CONTACT } from "@/lib/content";
import { PriceAmount, CurrencyCode } from "@/components/currency/Price";

interface CarCardProps {
  car: Car;
  theme?: "dark" | "light";
  index?: number;
}

const ICON_PROPS = {
  width: 15,
  height: 15,
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const EngineIcon = () => (
  // Steering wheel — three-spoke layout: top spoke + two angled lower spokes
  <svg {...ICON_PROPS} aria-hidden>
    <circle cx="7" cy="7" r="5.4" />
    <circle cx="7" cy="7" r="1.5" />
    <path d="M7 1.6V5.5M2.7 9.4l3.05-1.55M11.3 9.4 8.25 7.85" />
  </svg>
);

const SpeedIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <circle cx="7" cy="8.5" r="4.4" />
    <path d="M7 8.5L9 6" />
    <path d="M7 1.5V1M5.5 1h3" />
  </svg>
);

const DoorIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <path d="M3 12V2.6l8-1V12" />
    <path d="M3 12h8" />
    <circle cx="9" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const SeatIcon = () => (
  <svg {...ICON_PROPS} aria-hidden>
    <path d="M5 1.5v6.5h5" />
    <path d="M3.5 11h7" />
    <path d="M10 8v3" />
  </svg>
);

const WhatsAppIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <path d="M13.6 2.32A7.85 7.85 0 0 0 8.02 0C3.6 0 0 3.6 0 8.02c0 1.41.37 2.79 1.07 4.01L0 16l4.09-1.07a8.04 8.04 0 0 0 3.92 1c4.42 0 8.02-3.6 8.02-8.02 0-2.14-.83-4.16-2.43-5.6zM8.02 14.66a6.65 6.65 0 0 1-3.4-.93l-.24-.14-2.43.63.65-2.37-.16-.25a6.65 6.65 0 0 1-1.02-3.55c0-3.68 3-6.68 6.68-6.68a6.65 6.65 0 0 1 6.68 6.68c0 3.68-3 6.68-6.68 6.68zm3.66-5c-.2-.1-1.18-.58-1.36-.65-.18-.07-.32-.1-.45.1-.13.2-.52.65-.64.78-.12.13-.23.15-.43.05a5.45 5.45 0 0 1-1.6-.99 6.04 6.04 0 0 1-1.11-1.38c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.34.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12 0-.25-.01-.39-.01a.74.74 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .98.72 1.93.82 2.07.1.13 1.41 2.16 3.42 3.03.48.21.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.18-.48 1.35-.95.16-.46.16-.86.12-.95-.05-.08-.18-.13-.38-.23z" />
  </svg>
);

export default function CarCard({ car, theme = "dark", index = 0 }: CarCardProps) {
  const isLight = theme === "light";
  const waNumber = CONTACT.primaryPhone.replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    `Hi, I'm interested in renting the ${car.name}. Could you share availability and pricing?`
  );
  const waHref = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <Reveal
      delay={Math.min(index * 80, 320)}
      className="rise h-full"
    >
      <article
        className={`group relative flex h-full flex-col rounded-2xl overflow-hidden border ${
          isLight
            ? "bg-[var(--bg-bone)] border-black/15 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.28)] hover:border-[var(--champagne)]/60 hover:shadow-[0_28px_60px_-18px_rgba(0,0,0,0.38)]"
            : "bg-[var(--bg-graphite)] border-white/8 hover:border-[var(--champagne)]/60"
        } transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5`}
      >
      {/* Ambient champagne glow on hover */}
      <span className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 blur-3xl bg-[var(--champagne)]/15 transition-opacity duration-700" />

      {/* Whole-card click target — sits behind all interactive children */}
      <Link
        href={carHref(car)}
        aria-label={`View details for the ${car.name}`}
        className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:outline-[var(--champagne)] focus-visible:outline-offset-2 rounded-2xl"
      >
        <span className="sr-only">View details for the {car.name}</span>
      </Link>

      <div className="relative pointer-events-none aspect-[5/4] overflow-hidden">
        <Image
          src={car.image}
          alt={`${car.name} — ${car.category} car rental Dubai`}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 92vw"
          priority={index === 0}
          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? "from-black/40" : "from-black/70"} via-transparent to-transparent`} />
      </div>

      <div className={`relative pointer-events-none flex flex-col gap-3.5 p-6 flex-1 ${isLight ? "text-[var(--ink-dark-hi)]" : "text-[var(--ink-hi)]"}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-[var(--font-display)] text-[20px] leading-[1.2] tracking-tight min-h-[2.4em] group-hover:text-[var(--champagne)] transition-colors">
            {car.name}
          </h3>
          {car.price > 0 && (
            <span className="shrink-0 text-right">
              <PriceAmount className="block font-[var(--font-display)] text-[24px] leading-none text-[var(--champagne)]" amount={car.price} />
              <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] opacity-70">
                <CurrencyCode /> / day
              </span>
            </span>
          )}
        </div>

        <div className={`grid grid-cols-2 gap-x-4 gap-y-2 font-[var(--font-mono)] text-[11.5px] uppercase tracking-[0.08em] ${isLight ? "text-[var(--ink-dark-lo)]" : "text-[var(--ink-lo)]"}`}>
          {car.engine && <Spec icon={<EngineIcon />} value={car.engine} />}
          {car.zeroToHundred && <Spec icon={<SpeedIcon />} value={`0–100 ${car.zeroToHundred}`} />}
          {car.doors > 0 && <Spec icon={<DoorIcon />} value={`${car.doors} doors`} />}
          {car.seats > 0 && <Spec icon={<SeatIcon />} value={`${car.seats} seats`} />}
        </div>

        <div className="mt-auto pt-2 flex items-center gap-2.5">
          {/* Decorative "View Details" pill — the whole card is the click target */}
          <span
            aria-hidden
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[15px] font-medium tracking-wide transition-all ${
              isLight
                ? "bg-[var(--ink-dark-hi)] text-[var(--bg-bone)] group-hover:bg-[var(--champagne)] group-hover:text-[var(--bg-obsidian)]"
                : "bg-white/8 text-[var(--ink-hi)] group-hover:bg-[var(--champagne)] group-hover:text-[var(--bg-obsidian)]"
            }`}
          >
            View Details
            <svg width="12" height="9" viewBox="0 0 11 8" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M0 4h9M6 1l3 3-3 3" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
          {/* WhatsApp opt-out: floats above the whole-card link */}
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp about the ${car.name}`}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto relative z-10 shrink-0 inline-flex items-center justify-center size-11 rounded-full bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors"
          >
            <WhatsAppIcon size={18} />
          </a>
        </div>
      </div>
      </article>
    </Reveal>
  );
}

function Spec({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <span className="shrink-0 text-[var(--champagne)] opacity-90">{icon}</span>
      <span className="truncate">{value}</span>
    </span>
  );
}
