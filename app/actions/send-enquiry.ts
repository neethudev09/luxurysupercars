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

const REQUIRED = [
  ["name", "name"],
  ["email", "email address"],
  ["phone", "mobile number"],
] as const;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderEmailRow(label: string, value?: string) {
  if (!value) {
    return "";
  }

  return `
    <tr>
      <td style="padding:10px 0;color:#7a7a7a;font-size:13px;line-height:18px;vertical-align:top;width:38%;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#171717;font-size:14px;line-height:20px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function renderMessageBlock(message?: string) {
  if (!message) {
    return "";
  }

  return `
    <tr>
      <td style="padding:20px 0 0;">
        <div style="color:#b8944f;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Message</div>
        <div style="margin-top:10px;padding:14px 16px;background:#f8f6f0;border:1px solid #ebe3d4;border-radius:8px;color:#171717;font-size:14px;line-height:22px;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </td>
    </tr>
  `;
}

function buildEnquiryEmailHtml(data: Record<string, string>, phone: string) {
  const enquiryRows = [
    renderEmailRow("Name", data.name),
    renderEmailRow("Email", data.email),
    renderEmailRow("Phone", phone),
    renderEmailRow("Brand", data.brand),
    renderEmailRow("Car", data.car),
    renderEmailRow("Date from", data.dateFrom),
    renderEmailRow("Date to", data.dateTo),
  ].join("");

  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f4f1eb;padding:24px;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:640px;background:#ffffff;border:1px solid #e6dece;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#141414;padding:28px 32px;">
                    <div style="color:#d3aa5b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Luxury Supercar Rentals</div>
                    <h1 style="margin:12px 0 0;color:#ffffff;font-size:24px;line-height:32px;font-weight:700;">New website enquiry</h1>
                    <p style="margin:8px 0 0;color:#d7d0c4;font-size:15px;line-height:22px;">${escapeHtml(data.name)} submitted an enquiry from the website.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px 32px;">
                    <div style="color:#b8944f;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Enquiry details</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;border-collapse:collapse;border-top:1px solid #e8e2d5;">
                      ${enquiryRows}
                    </table>
                    ${renderMessageBlock(data.message)}
                  </td>
                </tr>
                <tr>
                  <td style="background:#fbfaf7;border-top:1px solid #eee7da;padding:18px 32px;color:#8a806f;font-size:12px;line-height:18px;">
                    Reply directly to this email to contact the customer.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function sendEnquiry(
  _prev: EnquiryFormState | undefined,
  form: FormData,
): Promise<EnquiryFormState> {
  const data: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (typeof v === "string") data[k] = v.trim();
  }

  for (const [field, label] of REQUIRED) {
    if (!data[field]) {
      return { ok: false, message: `Please provide your ${label}.` };
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, message: "Please provide a valid email address." };
  }

  const carContext = data.car ? ` regarding ${data.car}` : "";
  const subject = `New enquiry from ${data.name}${carContext}`;
  const phone = [data.countryCode, data.phone].filter(Boolean).join(" ");

  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${phone}`,
    data.brand && `Brand: ${data.brand}`,
    data.car && `Car: ${data.car}`,
    data.dateFrom && `Date from: ${data.dateFrom}`,
    data.dateTo && `Date to: ${data.dateTo}`,
    data.message && `\nMessage:\n${data.message}`,
  ].filter(Boolean);
  const text = lines.join("\n");
  const html = buildEnquiryEmailHtml(data, phone);

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
