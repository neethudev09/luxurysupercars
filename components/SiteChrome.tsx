"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import MotionProvider from "@/components/motion/MotionProvider";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import CookieConsent from "@/components/CookieConsent";
import ImageProtection from "@/components/ImageProtection";
import PromoPopup from "@/components/PromoPopup";

const CursorTrail = dynamic(() => import("@/components/motion/CursorTrail"), { ssr: false });
const FloatingWhatsApp = dynamic(() => import("@/components/nav/FloatingWhatsApp"), { ssr: false });

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
      <ImageProtection />
      <PromoPopup />
      <CookieConsent />
      <div className="grain" aria-hidden />
    </CurrencyProvider>
  );
}
