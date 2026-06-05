"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "lsr-cookie-consent";

/**
 * Cookie consent banner. The site loads Google Tag Manager, Google Ads and the
 * Meta Pixel (see components/analytics/Analytics.tsx), all of which set cookies,
 * so a notice + accept/decline choice is shown until the visitor responds. The
 * choice is persisted in localStorage; wiring it through to Google Consent Mode
 * (to actually gate the tags before consent) is a follow-up.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* private mode / storage blocked — just don't show it */
    }
  }, []);

  const choose = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-5 left-5 z-[58] w-[min(24rem,calc(100vw-2.5rem))] rounded-2xl border border-white/10 bg-[var(--bg-graphite)]/95 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-[fadeUp_240ms_cubic-bezier(0.22,1,0.36,1)]"
    >
      <p className="text-[14px] leading-[1.6] text-[var(--ink-lo)]">
        We use cookies to run analytics and ads that help us improve your
        experience. See our{" "}
        <Link
          href="/cookie-policy"
          className="text-[var(--champagne)] underline-offset-2 hover:underline"
        >
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="inline-flex items-center justify-center rounded-full bg-[var(--champagne)] px-5 py-2.5 text-[14px] font-medium text-[var(--bg-obsidian)] hover:bg-[var(--champagne-hi)] transition-colors"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("declined")}
          className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-[14px] font-medium text-[var(--ink-hi)] hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
