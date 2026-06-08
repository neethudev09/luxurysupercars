"use server";

/**
 * Marketing-list signup for the entry promo pop-up. This is a SEPARATE list
 * from the enquiry form (app/actions/send-enquiry.ts) — enquiries are sales
 * leads emailed to the team, whereas these are newsletter/offer subscribers.
 *
 * Routes to a Resend Audience when configured; otherwise logs the email so the
 * pop-up is wired end-to-end on staging. To enable real list storage, set in
 * .env.local + Vercel project envs:
 *   RESEND_API_KEY=re_xxx
 *   RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-...   (the "15% off" marketing audience)
 */

export type SubscribeState = {
  ok: boolean;
  message: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const SUCCESS = "You're in! Keep an eye on your inbox — our team will be in touch with your 15% off.";

export async function subscribeEmail(
  _prev: SubscribeState | undefined,
  form: FormData,
): Promise<SubscribeState> {
  const email = (typeof form.get("email") === "string" ? (form.get("email") as string) : "").trim();

  if (!isEmail(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // No marketing list configured yet — log only so the flow works on staging.
  if (!apiKey || !audienceId) {
    console.log("[promo-subscribe]", { email });
    return { ok: true, message: SUCCESS };
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[promo-subscribe] resend error", res.status, body);
      return { ok: false, message: "Something went wrong — please try again in a moment." };
    }

    return { ok: true, message: SUCCESS };
  } catch (err) {
    console.error("[promo-subscribe] fetch failure", err);
    return { ok: false, message: "Something went wrong — please try again in a moment." };
  }
}
