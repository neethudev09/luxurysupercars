import type { Car } from "@/lib/fleet";
import MaskHeading from "@/components/motion/MaskHeading";

const ICON: Record<string, React.ReactNode> = {
  engine: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="10" rx="1" />
      <path d="M6 8V5M11 8V5M16 8V5M3 12h-1M22 12h1" />
    </svg>
  ),
  zero100: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="7" />
      <path d="M12 14l3-4M12 3v3M10 3h4" />
    </svg>
  ),
  topSpeed: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16a9 9 0 0118 0" />
      <path d="M12 16l4-4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  transmission: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M6 8v8M18 8v8M8 6h8M8 18h8" />
    </svg>
  ),
  drive: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </svg>
  ),
  horsepower: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" stroke="none" />
    </svg>
  ),
  doors: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 21V4l11-1.5V21" />
      <path d="M6 21h12" />
      <circle cx="14.5" cy="13" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  ),
  seats: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v11h8" />
      <path d="M5 17h11" />
      <path d="M16 14v3" />
    </svg>
  ),
  color: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c-5 0-9 4-9 9s4 9 9 9c1.5 0 2.5-1 2.5-2.5S13 16 13 14.5s1-2.5 2.5-2.5H18a3 3 0 003-3c0-3.9-4-7-9-7z" />
      <circle cx="8" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  year: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  deposit: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="M3 10h18" />
      <circle cx="12" cy="14.5" r="1.5" />
    </svg>
  ),
  mileage: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18a8 8 0 1116 0" />
      <path d="M12 18l-3-4" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  extraKm: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h13" />
      <path d="M12 6l4 6-4 6" />
      <path d="M19 9v6M22 12h-6" />
    </svg>
  ),
  baggage: (
    // Suitcase with a handle on top + a clasp strap across the body.
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="7" width="17" height="13" rx="1.6" />
      <path d="M9 7V4.5h6V7" />
      <path d="M3.5 13.5h17" />
    </svg>
  ),
};

function ccToLitres(s?: string): string | null {
  if (!s) return null;
  // "2993 cc" → "3.0L"; "5204 cc" → "5.2L". Leave anything already in L form.
  const m = s.match(/^(\d{3,5})\s*cc/i);
  if (!m) return null;
  return `${(parseInt(m[1], 10) / 1000).toFixed(1)}L`;
}

function composeEngine(car: Car): string | undefined {
  if (!car.engine) return undefined;
  const cap = ccToLitres(car.engineCapacity) || car.engineCapacity;
  if (cap && !car.engine.includes(cap)) {
    return `${car.engine} · ${cap}`;
  }
  return car.engine;
}

const PLACEHOLDER_RE = /^(—|-|n\/?a|unknown|tbc|on request)$/i;
function present(v: string | number | undefined | null): v is string | number {
  if (v == null) return false;
  if (typeof v === "number") return v > 0;
  const s = v.trim();
  return s.length > 0 && !PLACEHOLDER_RE.test(s);
}

export default function SpecGrid({
  car,
  aside,
}: {
  car: Car;
  /** Optional sidebar slot. When provided, the spec grid narrows to 8
   *  columns and the aside takes the remaining 4 on md+ viewports. */
  aside?: React.ReactNode;
}) {
  // Only render rows where the live page actually provides data — better
  // to show fewer real specs than a wall of "On request" placeholders.
  const candidates: { icon: React.ReactNode; label: string; value: string | number | undefined }[] = [
    { icon: ICON.engine,       label: "Engine",       value: composeEngine(car) },
    { icon: ICON.zero100,      label: "0–100 km/h",   value: car.zeroToHundred },
    { icon: ICON.horsepower,   label: "Power",        value: car.horsepower },
    { icon: ICON.transmission, label: "Transmission", value: car.transmission },
    { icon: ICON.drive,        label: "Drivetrain",   value: car.driveType },
    { icon: ICON.doors,        label: "Doors",        value: car.doors },
    { icon: ICON.seats,        label: "Seats",        value: car.seats },
    { icon: ICON.baggage,      label: "Baggage",      value: car.baggage },
    { icon: ICON.color,        label: "Colour",       value: car.color },
    { icon: ICON.year,         label: "Year",         value: car.year },
    // Top speed last — only shown if the live page exposed it (rare).
    // Rental terms (deposit / mileage / extra km) live in the hero
    // pricing card on the right rail, not here.
    { icon: ICON.topSpeed,     label: "Top speed",    value: car.topSpeed },
  ];
  const items = candidates
    .filter((it) => present(it.value))
    .map((it) => ({ ...it, value: String(it.value) }));

  return (
    <section className="py-16 md:py-20 border-t border-white/5">
      <div className="container-car">
        <div className="mb-10">
          <MaskHeading
            text="Specifications"
            as="h2"
            className="font-[var(--font-display)] text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.1] tracking-[-0.018em] text-[var(--ink-hi)]"
            staggerMs={45}
            breakAfterBold={false}
          />
        </div>

        <div className={aside ? "grid md:grid-cols-12 gap-8 md:gap-10 items-start" : ""}>
          <div
            className={`grid grid-cols-2 ${
              aside ? "md:grid-cols-2 lg:grid-cols-3 md:col-span-8" : "md:grid-cols-3 lg:grid-cols-5"
            } gap-4`}
          >
            {items.map((it) => (
              <div
                key={it.label}
                className="flex flex-col gap-3 rounded-xl border border-white/8 bg-[var(--bg-graphite)]/60 p-5"
              >
                <span className="text-[var(--champagne)]">{it.icon}</span>
                <div>
                  <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--ink-lo)] mb-1">
                    {it.label}
                  </p>
                  <p className="text-[17px] font-medium text-[var(--ink-hi)] leading-tight">
                    {it.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {aside && (
            <aside className="md:col-span-4">
              <div className="md:sticky md:top-28">{aside}</div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
