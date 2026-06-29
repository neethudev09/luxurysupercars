"use server";

/**
 * Marketing-list signup for the entry promo pop-up. This is separate from the
 * enquiry form, but each promo signup is still emailed to the enquiry inbox so
 * the sales team can follow up quickly.
 *
 * Required in env:
 *   RESEND_API_KEY=re_xxx
 *   ENQUIRY_FROM="LSR Enquiries <no-reply@enquiries.luxurysupercarsdubai.com>"
 *   ENQUIRY_TO=aleona@luxurysupercarsdubai.com
 *
 * Optional:
 *   RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-...   (stores contacts in Resend Audience)
 */

export type SubscribeState = {
  ok: boolean;
  message: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const SUCCESS = "You're in! Keep an eye on your inbox - our team will be in touch with your 15% off.";
const ERROR = "Something went wrong - please try again in a moment.";

export async function subscribeEmail(
  _prev: SubscribeState | undefined,
  form: FormData,
): Promise<SubscribeState> {
  const email = (typeof form.get("email") === "string" ? (form.get("email") as string) : "").trim();

  if (!isEmail(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  const to = process.env.ENQUIRY_TO;

  if (!apiKey || !from || !to) {
    console.error("[promo-subscribe] missing email config", {
      hasApiKey: Boolean(apiKey),
      hasFrom: Boolean(from),
      hasTo: Boolean(to),
    });
    return { ok: false, message: ERROR };
  }

  try {
    const safeEmail = escapeHtml(email);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: "New promo popup signup",
        text: [
          "New promo popup signup",
          "",
          `Email: ${email}`,
          "Offer: 15% off rental",
        ].join("\n"),
        html: `
          <div style="font-family:Arial,sans-serif;background:#f6f1e7;padding:28px;">
            <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5dccb;">
              <div style="background:#111111;color:#ffffff;padding:24px 28px;">
                <p style="margin:0 0 8px;color:#d7b56d;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">Luxury Supercar Rentals</p>
                <h1 style="margin:0;font-size:24px;line-height:1.25;">New promo popup signup</h1>
              </div>
              <div style="padding:26px 28px;color:#222222;">
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">A visitor submitted their email for the 15% rental offer.</p>
                <table style="width:100%;border-collapse:collapse;font-size:15px;">
                  <tr>
                    <td style="padding:12px 0;color:#777777;border-top:1px solid #eee;">Email</td>
                    <td style="padding:12px 0;border-top:1px solid #eee;font-weight:700;"><a href="mailto:${safeEmail}" style="color:#111111;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;color:#777777;border-top:1px solid #eee;">Offer</td>
                    <td style="padding:12px 0;border-top:1px solid #eee;font-weight:700;">15% off rental</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[promo-subscribe] resend error", res.status, body);
      return { ok: false, message: ERROR };
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      const audienceRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });

      if (!audienceRes.ok) {
        const body = await audienceRes.text();
        console.error("[promo-subscribe] audience error", audienceRes.status, body);
      }
    }

    return { ok: true, message: SUCCESS };
  } catch (err) {
    console.error("[promo-subscribe] fetch failure", err);
    return { ok: false, message: ERROR };
  }
}
