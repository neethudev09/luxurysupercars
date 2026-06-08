"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeEmail, type SubscribeState } from "@/app/actions/subscribe";

const STORAGE_KEY = "lsr-promo-seen";
const DELAY_MS = 10_000;
const INITIAL_STATE: SubscribeState = { ok: false, message: "" };

/**
 * Entry promo pop-up. Appears once, 10s after a visitor's first arrival (a
 * localStorage flag stops it nagging on refresh / return visits). Captures an
 * email into the marketing list (app/actions/subscribe.ts) — separate from the
 * enquiry form. Copy is placeholder and easy to swap.
 */
export default function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(subscribeEmail, INITIAL_STATE);

  // Show once, 10s after first arrival.
  useEffect(() => {
    let seen = false;
    try {
      seen = !!localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked — treat as unseen */
    }
    if (seen) return;

    const timer = setTimeout(() => {
      setOpen(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Escape to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Special offer"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[var(--champagne)]/30 bg-[var(--bg-graphite)] p-7 md:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] animate-[fadeUp_260ms_cubic-bezier(0.22,1,0.36,1)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-[220px] rounded-full bg-[var(--champagne)]/[0.12] blur-[80px]"
        />

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 text-[var(--ink-lo)] hover:text-[var(--ink-hi)] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative">
          <p className="eyebrow mb-4">Exclusive Offer</p>
          <h2 className="font-[var(--font-display)] text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.1] tracking-[-0.018em] text-[var(--ink-hi)]">
            Get <span className="text-[var(--champagne)]">15% off</span> your rental
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-[var(--ink-lo)]">
            Drop your email below and our team will be in touch with your exclusive discount.
          </p>

          {state.ok ? (
            <p role="status" className="mt-6 text-[15px] leading-[1.6] text-[var(--champagne)]">
              {state.message}
            </p>
          ) : (
            <form action={action} className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@email.com"
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[16px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)]/60 outline-none focus:border-[var(--champagne)] transition-colors [color-scheme:dark]"
              />
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--champagne)] px-6 py-3 text-[15px] font-medium text-[var(--bg-obsidian)] hover:bg-[var(--champagne-hi)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pending ? "Submitting…" : "Claim 15% Off"}
              </button>
              {state.message && !state.ok && (
                <p role="status" className="text-[13px] text-red-400">
                  {state.message}
                </p>
              )}
              <p className="text-center font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--ink-lo)]/70">
                No spam — unsubscribe anytime
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
