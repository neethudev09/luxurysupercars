import MaskHeading from "@/components/motion/MaskHeading";
import { INSTAGRAM } from "@/lib/content";

function InstagramLogo({ className = "", gradientId }: { className?: string; gradientId: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <radialGradient id={gradientId} cx="28%" cy="102%" r="145%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="22%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="68%" stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${gradientId})`} />
      <rect x="7" y="7" width="10" height="10" rx="5" fill="none" stroke="white" strokeWidth="1.8" />
      <circle cx="17.25" cy="6.75" r="1.25" fill="white" />
    </svg>
  );
}

export default function InstagramFeed() {
  return (
    <section id={INSTAGRAM.id} className="bg-[var(--bg-bone)] text-[var(--ink-dark-hi)] py-20 md:py-24">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-10">
          <div className="md:col-span-8">
            <MaskHeading
              text={INSTAGRAM.h2}
              as="h2"
              className="font-[var(--font-display)] text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.06] tracking-[-0.018em] text-[var(--ink-dark-hi)]"
              staggerMs={42}
            />
          </div>

          <div className="md:col-span-4 md:text-right">
            <a
              href="https://www.instagram.com/luxurysupercarsdubai/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-start md:justify-end gap-2.5 font-[var(--font-display)] font-semibold uppercase tracking-normal text-[clamp(1.15rem,2.1vw,1.7rem)] leading-[1.1] text-[var(--ink-dark-hi)] transition-opacity hover:opacity-75"
              aria-label="Open Luxury Supercars Dubai on Instagram"
            >
              <InstagramLogo
                gradientId="instagram-logo-header-gradient"
                className="size-8 shrink-0 drop-shadow-[0_6px_14px_rgba(214,36,159,0.25)] md:size-9"
              />
              <span>@LUXURYSUPERCARSDUBAI</span>
            </a>
          </div>
        </div>

        <div>
          <iframe
            src="https://cdn.lightwidget.com/widgets/e29fb0bdf7025c2e80ec75405df5e629.html"
            scrolling="no"
            loading="lazy"
            className="lightwidget-widget"
            style={{ width: "100%", border: 0, overflow: "hidden" }}
            title="Luxury Supercars Dubai Instagram feed"
            suppressHydrationWarning
          />
        </div>

<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
         <a
            href="https://www.instagram.com/luxurysupercarsdubai/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink-dark-hi)] text-[var(--bg-bone)] px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--champagne)] hover:text-[var(--bg-obsidian)] transition-colors"
          >
            <InstagramLogo gradientId="instagram-logo-button-gradient" className="size-4 shrink-0" />
            Follow on Instagram
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
