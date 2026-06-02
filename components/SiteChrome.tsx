"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MotionProvider from "@/components/motion/MotionProvider";
import CursorTrail from "@/components/motion/CursorTrail";
import FloatingWhatsApp from "@/components/nav/FloatingWhatsApp";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";

// Car detail pages already have an inline "Enquire on WhatsApp" CTA
// inside the rental card — surfacing the global floating bubble too
// would be redundant.
const CAR_DETAIL_RE = /^\/rent-[a-z-]+-dubai\/[^/]+\/?$/;

/**
 * Wraps the marketing site in our smooth-scroll, cursor trail, WhatsApp
 * floating CTA, and grain overlay. Renders a bare passthrough on the
 * embedded Sanity Studio route (/studio/**) so the Studio UI doesn't
 * fight our motion/cosmetic layers.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio") ?? false;
  const isCarDetail = pathname ? CAR_DETAIL_RE.test(pathname) : false;

  if (isStudio) return <>{children}</>;

  return (
    <CurrencyProvider>
      <MotionProvider>{children}</MotionProvider>
      {!isCarDetail && <FloatingWhatsApp />}
      <CursorTrail />
      <div className="grain" aria-hidden />
      <Analytics />
      <SpeedInsights />
    </CurrencyProvider>
  );
}
