/**
 * Central analytics helpers.
 *
 * Every user interaction we want to measure goes through one of these
 * functions so GTM can pick up the dataLayer event and forward it to
 * GA4 / Google Ads / Meta Pixel.
 *
 * No-op guard: each helper checks that `window` exists so it is safe
 * to call from server-rendered code.
 */

/* ------------------------------------------------------------------ */
/*  Event payloads                                                     */
/* ------------------------------------------------------------------ */

export interface AnalyticsPayload {
  /** Category grouping – "whatsapp", "phone", "contact", "booking", "form" */
  category: string;
  /** Specific action – "click", "submit" */
  action: string;
  /** Human-readable label for the UI element – e.g. "Hero CTA" */
  label: string;
  /** Optional value (currency-free number) */
  value?: number;
  /** Optional extra context – e.g. car model, brand name */
  detail?: string;
}

/* ------------------------------------------------------------------ */
/*  Push a custom event to the dataLayer                               */
/* ------------------------------------------------------------------ */

export function pushEvent(payload: AnalyticsPayload): void {
  if (typeof window === "undefined") return;

  const dataLayer = (window as any).dataLayer ?? [];
  dataLayer.push({
    event: `${payload.category}_${payload.action}`,
    eventCategory: payload.category,
    eventAction: payload.action,
    eventLabel: payload.label,
    ...(payload.value !== undefined && { eventValue: payload.value }),
    ...(payload.detail && { eventDetail: payload.detail }),
  });
}

/* ------------------------------------------------------------------ */
/*  Convenience wrappers                                               */
/* ------------------------------------------------------------------ */

export function trackWhatsAppClick(label: string, detail?: string) {
  pushEvent({ category: "whatsapp", action: "click", label, detail });
}

export function trackPhoneClick(label: string, detail?: string) {
  pushEvent({ category: "phone", action: "click", label, detail });
}

export function trackContactClick(label: string, detail?: string) {
  pushEvent({ category: "contact", action: "click", label, detail });
}

export function trackBookNowClick(label: string, detail?: string) {
  pushEvent({ category: "book_now", action: "click", label, detail });
}

export function trackFormSubmit(label: string, detail?: string) {
  pushEvent({ category: "contact_form", action: "submit", label, detail });
}
