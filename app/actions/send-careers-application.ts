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
  const lines = [
    `Full name: ${data.fullName}`,
    `Nationality: ${data.nationality}`,
    `Email: ${data.email}`,
    `Phone / WhatsApp: ${data.phone}`,
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
  const html = `<pre style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace">${escapeHtml(text)}</pre>`;

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
