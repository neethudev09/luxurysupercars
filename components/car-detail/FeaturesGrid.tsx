import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Feature label → icon match. Order matters — first regex wins. Anything
 * that doesn't match gets the generic `default` icon, so every feature
 * the live page lists still renders, even brand-new ones we haven't
 * explicitly mapped.
 */
const FEATURE_ICONS: Array<[RegExp, React.ReactNode]> = [
  // Audio / phone / connectivity
  [/apple\s*car\s*play|carplay/i, (
    <svg {...ICON_PROPS}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 19v2M16 19v2M6 19h12" /><circle cx="12" cy="12" r="2.5" /></svg>
  )],
  [/android\s*auto/i, (
    <svg {...ICON_PROPS}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M9 12h6M12 9v6" /></svg>
  )],
  [/bluetooth/i, (
    // Proper bluetooth rune — symmetric and large at 22px.
    <svg {...ICON_PROPS}><path d="M8 7l9 9-5 4V4l5 4-9 9" /></svg>
  )],
  [/premium\s*audio|bose|burmester|naim|sound\s*system/i, (
    <svg {...ICON_PROPS}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>
  )],
  [/touch\s*screen|infotainment|lcd|display/i, (
    <svg {...ICON_PROPS}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
  )],
  [/usb|charger|charging/i, (
    <svg {...ICON_PROPS}><path d="M12 22V8" /><path d="M12 8L8 12M12 8l4 4" /><rect x="9" y="2" width="6" height="5" rx="1" /></svg>
  )],
  [/navigation|nav\s*system|gps/i, (
    <svg {...ICON_PROPS}><circle cx="12" cy="12" r="9" /><path d="M16 8l-5 2-2 5 5-2 2-5z" /></svg>
  )],

  // Seats / climate
  [/heated\s*seats?/i, (
    <svg {...ICON_PROPS}><path d="M7 3v9h7v3H5" /><path d="M16 13v4" /><path d="M19 8s.5-1.5 0-2.5S18 3.5 18 2M22 8s.5-1.5 0-2.5S21 3.5 21 2" /></svg>
  )],
  [/leather\s*seats?|leather\s*upholstery/i, (
    <svg {...ICON_PROPS}><path d="M6 4v10h8M4 18h11" /><path d="M15 14v4" /></svg>
  )],
  [/power\s*seats?|memory\s*seats?|electric\s*seats?/i, (
    <svg {...ICON_PROPS}><path d="M6 4v10h8M4 18h11" /><path d="M15 14v4" /><circle cx="19" cy="6" r="2.5" /></svg>
  )],
  [/climate\s*control|\bA\/?C\b|air\s*conditioning|dual\s*zone|tri\s*zone/i, (
    // Snowflake — universal "cold air" mark
    <svg {...ICON_PROPS}>
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
      <path d="M9 4l3 3 3-3M9 20l3-3 3 3M4 9l3 3-3 3M20 9l-3 3 3 3" />
    </svg>
  )],
  [/sun\s*roof|panoram|moon\s*roof|skyroof/i, (
    <svg {...ICON_PROPS}><rect x="4" y="6" width="16" height="12" rx="2" /><rect x="7" y="8" width="10" height="5" rx="0.6" /></svg>
  )],
  [/tinted\s*windows?/i, (
    <svg {...ICON_PROPS}><rect x="4" y="5" width="16" height="14" rx="1" /><path d="M4 5l16 14" /></svg>
  )],

  // Safety
  [/abs|anti.?lock|brake\s*assist/i, (
    <svg {...ICON_PROPS}><circle cx="12" cy="12" r="9" /><path d="M9 9.5h2.5a1.5 1.5 0 010 3H9V9.5zM9 12.5h3a1.5 1.5 0 010 3H9v-3z" /></svg>
  )],
  [/airbag|srs/i, (
    <svg {...ICON_PROPS}><circle cx="12" cy="14" r="5" /><path d="M7 9c0-2.8 2.2-5 5-5s5 2.2 5 5" /></svg>
  )],
  [/parking\s*sensors?|park\s*assist|parking\s*assist/i, (
    <svg {...ICON_PROPS}><path d="M3 18a9 9 0 0118 0" /><path d="M12 18l-3-4" /><circle cx="12" cy="18" r="1.2" fill="currentColor" /></svg>
  )],
  [/reverse\s*camera|rear\s*camera|backup\s*camera|360\s*camera/i, (
    <svg {...ICON_PROPS}><rect x="3" y="7" width="14" height="11" rx="2" /><path d="M17 11l4-2v8l-4-2z" /><circle cx="10" cy="12.5" r="2.5" /></svg>
  )],
  [/blind\s*spot|lane\s*assist|lane\s*keep/i, (
    <svg {...ICON_PROPS}><path d="M3 12h6M15 12h6" /><circle cx="12" cy="12" r="3" /></svg>
  )],
  [/adaptive\s*cruise|cruise\s*control/i, (
    <svg {...ICON_PROPS}><circle cx="12" cy="14" r="7" /><path d="M12 14l3-4M12 3v3M10 3h4" /></svg>
  )],
  [/digital\s*hud|head.?up\s*display|hud/i, (
    <svg {...ICON_PROPS}><rect x="3" y="6" width="18" height="11" rx="2" /><path d="M8 12h8" /><path d="M3 17l9 5 9-5" /></svg>
  )],
  [/active\s*steering|power\s*steering|electric\s*steering|steering/i, (
    // Steering wheel — outer rim, central hub, and 3 spokes (12 / 4 / 8 o'clock).
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 14.5v6.5M14.2 13.4l5.5 3.2M9.8 13.4l-5.5 3.2" />
    </svg>
  )],

  // Service / value adds
  [/insurance/i, (
    <svg {...ICON_PROPS}><path d="M12 3l8 3v6c0 4.5-3.5 8.5-8 9-4.5-.5-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>
  )],
  [/crypto|bitcoin|btc/i, (
    <svg {...ICON_PROPS}><circle cx="12" cy="12" r="9" /><path d="M9 7v10M14 8c1.5 0 2.5 1 2.5 2.2S15.5 12 14 12H9M14 12c1.5 0 2.5 1 2.5 2.2S15.5 16 14 16H9" /></svg>
  )],
  [/keyless|smart\s*key|push\s*start|push.?to.?start/i, (
    <svg {...ICON_PROPS}><circle cx="9" cy="14" r="4" /><path d="M13 14h7M16 14v3M20 14v3" /></svg>
  )],
];

// Generic check / sparkle icon for unmatched features
const DEFAULT_ICON = (
  <svg {...ICON_PROPS}>
    <path d="M5 12l4 4 10-10" />
  </svg>
);

function iconFor(label: string): React.ReactNode {
  for (const [re, icon] of FEATURE_ICONS) {
    if (re.test(label)) return icon;
  }
  return DEFAULT_ICON;
}

interface FeaturesGridProps {
  /** Raw verbatim feature strings from the live product page. */
  features?: string[];
}

// Features that have a dedicated home elsewhere on the page — strip them
// out of Features & Comfort so the same point isn't made twice.
const EXCLUDE_RE = /^(?:insurance(?:\s+included)?|crypto(?:\s+is)?\s*accepted|bitcoin(?:\s+is)?\s*accepted)$/i;

export default function FeaturesGrid({ features }: FeaturesGridProps) {
  if (!features || features.length === 0) return null;

  // Dedupe (case-insensitive) while preserving display order, and drop
  // any feature whose responsibility lives in another component.
  const seen = new Set<string>();
  const items = features.filter((f) => {
    const k = f.toLowerCase().trim();
    if (EXCLUDE_RE.test(k)) return false;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return (
    <section className="bg-[var(--bg-graphite)]/40 py-16 md:py-20 border-t border-white/5">
      <div className="container-x">
        <div className="mb-10">
          <MaskHeading
            text="Features &amp; comfort"
            as="h2"
            className="font-[var(--font-display)] text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.1] tracking-[-0.018em] text-[var(--ink-hi)]"
            staggerMs={45}
            breakAfterBold={false}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((label) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-xl border border-white/8 bg-[var(--bg-obsidian)]/40 px-5 py-4"
            >
              <span className="text-[var(--champagne)] shrink-0">{iconFor(label)}</span>
              <span className="text-[14px] font-medium text-[var(--ink-hi)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
