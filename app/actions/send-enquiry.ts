"use server";

/**
 * Server action that handles every enquiry-form submission on the site
 * (Home, /contact-us, /services, /faq, /careers, and the per-car
 * StickyEnquireBar). Routes to Resend if RESEND_API_KEY is set,
 * otherwise records the enquiry to server logs so the form is wired
 * end-to-end during dev/staging.
 *
 * Add to .env.local + Vercel project envs to enable email delivery:
 *   RESEND_API_KEY=re_xxx
 *   ENQUIRY_TO=info@luxurysupercarsdubai.com
 *   ENQUIRY_FROM="LSR Enquiries <enquiries@notifications.luxurysupercarsdubai.com>"
 */

export type EnquiryFormState = {
  ok: boolean;
  message: string;
};

const REQUIRED = ["name", "email", "phone"] as const;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendEnquiry(
  _prev: EnquiryFormState | undefined,
  form: FormData,
): Promise<EnquiryFormState> {
  const data: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (typeof v === "string") data[k] = v.trim();
  }

  for (const field of REQUIRED) {
    if (!data[field]) {
      return { ok: false, message: `Please provide your ${field}.` };
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, message: "Please provide a valid email address." };
  }

  const carContext = data.car ? ` regarding ${data.car}` : "";
  const subject = `New enquiry from ${data.name}${carContext}`;

  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    data.brand && `Brand: ${data.brand}`,
    data.car && `Car: ${data.car}`,
    data.dateFrom && `Date from: ${data.dateFrom}`,
    data.dateTo && `Date to: ${data.dateTo}`,
    data.message && `\nMessage:\n${data.message}`,
  ].filter(Boolean);
  const text = lines.join("\n");
  const html = `<pre style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace">${escapeHtml(text)}</pre>`;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO || "info@luxurysupercarsdubai.com";
  const from = process.env.ENQUIRY_FROM || "LSR Enquiries <onboarding@resend.dev>";

  if (!apiKey) {
    // Dev / staging fallback — log only.
    console.log("[enquiry]", { subject, ...data });
    return {
      ok: true,
      message:
        "Thanks — we received your enquiry and will be in touch shortly.",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[enquiry] resend error", res.status, body);
      return {
        ok: false,
        message:
          "We couldn't send your enquiry right now. Please call +971 56 526 6295.",
      };
    }
    return {
      ok: true,
      message:
        "Thanks — we received your enquiry and will be in touch shortly.",
    };
  } catch (err) {
    console.error("[enquiry] fetch failure", err);
    return {
      ok: false,
      message:
        "We couldn't send your enquiry right now. Please call +971 56 526 6295.",
    };
  }
}
