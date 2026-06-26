"use server";

import { CONTACT } from "@/lib/content";

/**
 * Server action that handles every enquiry-form submission on the site
 * (Home, /contact-us, /services, /faq, /careers, and the per-car
 * StickyEnquireBar). Routes to Resend if RESEND_API_KEY is set,
 * otherwise records the enquiry to server logs so the form is wired
 * end-to-end during dev/staging.
 *
 * Add to .env.local + live project envs to enable email delivery:
 *   RESEND_API_KEY=re_xxx
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://luxurysupercarsdubai.com";
const EMAIL_LOGO_URL = `${SITE_URL}/images/branding/logo.png`;
const WHATSAPP_NUMBER = CONTACT.primaryPhone;
const WHATSAPP_URL = `https://wa.me/${CONTACT.primaryPhone.replace(/\D/g, "")}`;
const ADMIN_ENQUIRY_EMAIL = "developer@luxurysupercarsdubai.com";
const ENQUIRY_FROM = "LSR Enquiries <onboarding@resend.dev>";
const ENQUIRY_BCC: string = "";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function bccRecipients(visibleRecipients: string[]) {
  if (!ENQUIRY_BCC) {
    return undefined;
  }

  const visible = new Set(
    visibleRecipients.map((recipient) => recipient.toLowerCase()),
  );

  return visible.has(ENQUIRY_BCC.toLowerCase()) ? undefined : [ENQUIRY_BCC];
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

function enquirySuccessMessage(data: Record<string, string>) {
  if (data.enquiryType === "fleet") {
    return "Thanks - your fleet enquiry has been received. One of our customer support specialists will contact you shortly.";
  }

  return "Thanks - we received your enquiry and will be in touch shortly.";
}

function buildEnquiryEmailHtml(data: Record<string, string>, phone: string) {
  const enquiryRows = [
    renderEmailRow(
      "Enquiry type",
      data.enquiryType === "fleet" ? "Fleet enquiry" : "Website enquiry",
    ),
    renderEmailRow("Name", data.name),
    renderEmailRow("Email", data.email),
    renderEmailRow("Phone", phone),
    renderEmailRow("Brand", data.brand),
    renderEmailRow("Car", data.car),
    renderEmailRow("Source page", data.sourcePage),
    renderEmailRow("Page URL", data.pageUrl || data.pagePath),
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

function buildCustomerConfirmationHtml(data: Record<string, string>, phone: string) {
  const carLabel = data.car || "your selected vehicle";
  const isFleet = data.enquiryType === "fleet";
  const heading = isFleet
    ? "Your fleet enquiry is received"
    : "Your enquiry is received";
  const intro = data.car
    ? `Thank you for enquiring about ${escapeHtml(carLabel)}.`
    : "Thank you for contacting Luxury Supercar Rentals Dubai.";
  const detailRows = [
    renderEmailRow("Vehicle", data.car),
    renderEmailRow("Name", data.name),
    renderEmailRow("Phone", phone),
    renderEmailRow("Email", data.email),
  ].join("");

  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f4f1eb;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#171717;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:640px;background:#ffffff;border:1px solid #e6dece;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#141414;padding:26px 32px;text-align:center;">
                    <img src="${EMAIL_LOGO_URL}" width="112" alt="Luxury Supercar Rentals Dubai" style="display:block;margin:0 auto 18px;max-width:112px;height:auto;border:0;" />
                    <div style="color:#d3aa5b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Luxury Supercar Rentals Dubai</div>
                    <h1 style="margin:12px 0 0;color:#ffffff;font-size:24px;line-height:32px;font-weight:700;">${escapeHtml(heading)}</h1>
                    <p style="margin:8px 0 0;color:#d7d0c4;font-size:15px;line-height:22px;">${intro}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px 32px;">
                    <p style="margin:0;color:#333333;font-size:15px;line-height:24px;text-align:center;">
                      One of our customer support specialists will contact you shortly with availability, pricing, and booking details.
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-collapse:collapse;border-top:1px solid #e8e2d5;">
                      ${detailRows}
                    </table>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;border-collapse:collapse;">
                      <tr>
                        <td align="center">
                          <a href="${WHATSAPP_URL}" style="display:inline-block;border-radius:999px;background:#25D366;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;">Chat on WhatsApp: ${escapeHtml(WHATSAPP_NUMBER)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background:#fbfaf7;border-top:1px solid #eee7da;padding:18px 32px;color:#8a806f;font-size:12px;line-height:18px;">
                    Luxury Supercar Rentals Dubai - premium fleet, doorstep delivery, and concierge support across Dubai.
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
  const successMessage = enquirySuccessMessage(data);

  const lines = [
    `Enquiry type: ${data.enquiryType === "fleet" ? "Fleet enquiry" : "Website enquiry"}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${phone}`,
    data.brand && `Brand: ${data.brand}`,
    data.car && `Car: ${data.car}`,
    data.sourcePage && `Source page: ${data.sourcePage}`,
    (data.pageUrl || data.pagePath) &&
      `Page URL: ${data.pageUrl || data.pagePath}`,
    data.dateFrom && `Date from: ${data.dateFrom}`,
    data.dateTo && `Date to: ${data.dateTo}`,
    data.message && `\nMessage:\n${data.message}`,
  ].filter(Boolean);
  const text = lines.join("\n");
  const html = buildEnquiryEmailHtml(data, phone);

  const apiKey = process.env.RESEND_API_KEY;
  const to = ADMIN_ENQUIRY_EMAIL;
  const from = ENQUIRY_FROM;

  if (!apiKey) {
    // Dev / staging fallback — log only.
    console.log("[enquiry]", { subject, phone, ...data });
    return {
      ok: true,
      message: successMessage,
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
        bcc: bccRecipients([to]),
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

    const customerSubject = data.car
      ? `We received your ${data.car} enquiry`
      : "We received your enquiry";
    const customerText = [
      `Hello ${data.name},`,
      "",
      data.car
        ? `Thanks for enquiring about ${data.car}.`
        : "Thanks for your enquiry.",
      "One of our customer support specialists will contact you shortly.",
      "",
      `Phone: ${phone}`,
      data.car && `Vehicle: ${data.car}`,
      `WhatsApp: ${WHATSAPP_NUMBER}`,
    ]
      .filter(Boolean)
      .join("\n");

    const confirmation = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [data.email],
        bcc: bccRecipients([data.email]),
        subject: customerSubject,
        text: customerText,
        html: buildCustomerConfirmationHtml(data, phone),
      }),
    });

    if (!confirmation.ok) {
      const body = await confirmation.text();
      console.error(
        "[enquiry] customer confirmation error",
        confirmation.status,
        body,
      );
    }

    return {
      ok: true,
      message: successMessage,
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
