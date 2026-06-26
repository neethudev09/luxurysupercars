"use server";

/**
 * Server action for the careers application form.
 *
 * Add to .env.local + Vercel project envs to enable email delivery:
 *   RESEND_API_KEY=re_xxx
 *   CAREERS_FROM="LSR Careers <careers@notifications.luxurysupercarsdubai.com>"
 */

export type CareersApplicationState = {
  ok: boolean;
  message: string;
};

export type EnquiryFormState = CareersApplicationState;

const CAREERS_TO = "developer@luxurysupercarsdubai.com";
const MAX_CV_BYTES = 7 * 1024 * 1024;

const REQUIRED_FIELDS = [
  ["fullName", "full name"],
  ["nationality", "nationality"],
  ["email", "email address"],
  ["phone", "phone / WhatsApp number"],
  ["currentLocation", "current location"],
  ["position", "position applying for"],
  ["experienceYears", "years of relevant experience"],
  ["luxuryVehicleExperience", "luxury vehicle experience"],
  ["experienceSummary", "experience summary"],
  ["currentlyEmployed", "current employment status"],
  ["uaeEligible", "UAE work eligibility"],
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
      <td style="padding:10px 0;color:#7a7a7a;font-size:13px;line-height:18px;vertical-align:top;width:42%;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#171717;font-size:14px;line-height:20px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function renderEmailSection(title: string, rows: string) {
  if (!rows.trim()) {
    return "";
  }

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 22px;">
      <tr>
        <td style="padding:0 0 8px;">
          <div style="color:#b8944f;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">${escapeHtml(title)}</div>
        </td>
      </tr>
      <tr>
        <td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #e8e2d5;">
            ${rows}
          </table>
        </td>
      </tr>
    </table>
  `;
}

function renderMultilineBlock(label: string, value?: string) {
  if (!value) {
    return "";
  }

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 22px;">
      <tr>
        <td style="padding:0;">
        <div style="color:#7a7a7a;font-size:13px;line-height:18px;">${escapeHtml(label)}</div>
        <div style="margin-top:8px;padding:14px 16px;background:#f8f6f0;border:1px solid #ebe3d4;border-radius:8px;color:#171717;font-size:14px;line-height:22px;white-space:pre-wrap;">${escapeHtml(value)}</div>
        </td>
      </tr>
    </table>
  `;
}

function buildCareersEmailHtml(
  data: Record<string, string>,
  cvName: string,
  phone: string,
) {
  const personalRows = [
    renderEmailRow("Full name", data.fullName),
    renderEmailRow("Nationality", data.nationality),
    renderEmailRow("Email", data.email),
    renderEmailRow("Phone / WhatsApp", phone),
    renderEmailRow("Current location", data.currentLocation),
  ].join("");

  const experienceRows = [
    renderEmailRow("Position applying for", data.position),
    renderEmailRow("Years of relevant experience", data.experienceYears),
    renderEmailRow(
      "Luxury/performance vehicle experience",
      data.luxuryVehicleExperience,
    ),
  ].join("");

  const availabilityRows = [
    renderEmailRow("Currently employed", data.currentlyEmployed),
    renderEmailRow("Notice period", data.noticePeriod),
    renderEmailRow("Eligible to work in the UAE", data.uaeEligible),
  ].join("");

  const documentsRows = [
    renderEmailRow("CV file", cvName),
    renderEmailRow("LinkedIn profile", data.linkedin),
  ].join("");

  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f4f1eb;padding:24px;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:680px;background:#ffffff;border:1px solid #e6dece;border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="background:#141414;padding:28px 32px;">
                    <div style="color:#d3aa5b;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Luxury Supercar Rentals</div>
                    <h1 style="margin:12px 0 0;color:#ffffff;font-size:24px;line-height:32px;font-weight:700;">New careers application</h1>
                    <p style="margin:8px 0 0;color:#d7d0c4;font-size:15px;line-height:22px;">${escapeHtml(data.fullName)} has applied for ${escapeHtml(data.position)}.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 32px 32px;">
                    ${renderEmailSection("Personal details", personalRows)}
                    ${renderEmailSection("Position and experience", experienceRows)}
                    ${renderMultilineBlock("Experience summary", data.experienceSummary)}
                    ${renderEmailSection("Availability", availabilityRows)}
                    ${renderEmailSection("Documents", documentsRows)}
                    ${renderMultilineBlock("Why they would like to join Luxury Group", data.whyJoin)}
                  </td>
                </tr>
                <tr>
                  <td style="background:#fbfaf7;border-top:1px solid #eee7da;padding:18px 32px;color:#8a806f;font-size:12px;line-height:18px;">
                    This application was submitted from the Luxury Supercars Dubai careers form. The CV is attached to this email.
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

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "size" in value &&
    typeof value.name === "string" &&
    typeof value.size === "number"
  );
}

async function fileToAttachment(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return {
    filename: file.name,
    content: buffer.toString("base64"),
  };
}

async function handleCareersApplication(
  _prev: CareersApplicationState | undefined,
  form: FormData,
): Promise<CareersApplicationState> {
  const data: Record<string, string> = {};

  for (const [key, value] of form.entries()) {
    if (typeof value === "string") {
      data[key] = value.trim();
    }
  }

  for (const [field, label] of REQUIRED_FIELDS) {
    if (!data[field]) {
      return { ok: false, message: `Please provide your ${label}.` };
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, message: "Please provide a valid email address." };
  }

  const cv = form.get("cv");
  if (!isUploadedFile(cv) || cv.size === 0) {
    return { ok: false, message: "Please upload your CV." };
  }

  if (cv.size > MAX_CV_BYTES) {
    return {
      ok: false,
      message: "Please upload a CV smaller than 7MB.",
    };
  }

  const subject = `New careers application: ${data.fullName} - ${data.position}`;
  const phone = [data.countryCode, data.phone].filter(Boolean).join(" ");
  const lines = [
    `Full name: ${data.fullName}`,
    `Nationality: ${data.nationality}`,
    `Email: ${data.email}`,
    `Phone / WhatsApp: ${phone}`,
    `Current location: ${data.currentLocation}`,
    "",
    `Position applying for: ${data.position}`,
    `Years of relevant experience: ${data.experienceYears}`,
    `Experience with luxury/performance vehicles: ${data.luxuryVehicleExperience}`,
    "",
    `Experience summary:`,
    data.experienceSummary,
    "",
    `Currently employed: ${data.currentlyEmployed}`,
    data.noticePeriod && `Notice period: ${data.noticePeriod}`,
    `Legally eligible to work in the UAE: ${data.uaeEligible}`,
    "",
    `CV file: ${cv.name}`,
    data.linkedin && `LinkedIn profile: ${data.linkedin}`,
    data.whyJoin && "",
    data.whyJoin && `Why they would like to join Luxury Group:`,
    data.whyJoin,
  ].filter(Boolean);

  const text = lines.join("\n");
  const html = buildCareersEmailHtml(data, cv.name, phone);

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.CAREERS_FROM ||
    process.env.ENQUIRY_FROM ||
    "LSR Careers <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("[careers-application]", {
      subject,
      to: CAREERS_TO,
      cv: { name: cv.name, size: cv.size, type: cv.type },
      ...data,
    });

    return {
      ok: true,
      message: "Thanks - we received your application and will review it shortly.",
    };
  }

  try {
    const attachment = await fileToAttachment(cv);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [CAREERS_TO],
        reply_to: data.email,
        subject,
        text,
        html,
        attachments: [attachment],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[careers-application] resend error", res.status, body);
      return {
        ok: false,
        message:
          "We couldn't send your application right now. Please call +971 56 526 6295.",
      };
    }

    return {
      ok: true,
      message: "Thanks - we received your application and will review it shortly.",
    };
  } catch (err) {
    console.error("[careers-application] fetch failure", err);
    return {
      ok: false,
      message:
        "We couldn't send your application right now. Please call +971 56 526 6295.",
    };
  }
}

export async function sendCareersApplication(
  prev: CareersApplicationState | undefined,
  form: FormData,
): Promise<CareersApplicationState> {
  return handleCareersApplication(prev, form);
}

export async function sendEnquiry(
  prev: CareersApplicationState | undefined,
  form: FormData,
): Promise<CareersApplicationState> {
  return handleCareersApplication(prev, form);
}
