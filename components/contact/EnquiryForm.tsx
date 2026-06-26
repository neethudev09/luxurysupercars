"use client";

import { type FormEvent, useActionState, useState } from "react";
import { CARS_BRANDS } from "@/lib/content";
import PhoneCountrySelect from "@/components/contact/PhoneCountrySelect";
import { sendEnquiry, type EnquiryFormState } from "@/app/actions/send-enquiry";

const INITIAL_STATE: EnquiryFormState = { ok: false, message: "" };

/**
 * The "How Can We Help You?" enquiry form. Extracted so it can be dropped in
 * standalone (e.g. the /contact-us right column) as well as inside the home
 * Contact section.
 */
export default function EnquiryForm({ className = "" }: { className?: string }) {
  const [state, action, pending] = useActionState(sendEnquiry, INITIAL_STATE);
  const [clientMessage, setClientMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const fields = Array.from(event.currentTarget.elements);
    const invalidField = fields.find((field) => {
      return (
        (field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement ||
          field instanceof HTMLTextAreaElement) &&
        !field.disabled &&
        !field.validity.valid
      );
    }) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined;

    if (!invalidField) {
      setClientMessage("");
      return;
    }

    event.preventDefault();

    const label =
      invalidField.labels?.[0]?.textContent
        ?.replace(/\s*\*$/, "")
        .trim()
        .toLowerCase() || "this field";
    const message = invalidField.validity.typeMismatch
      ? "Please enter a valid email address."
      : `Please fill out ${label}.`;

    setClientMessage(message);
    invalidField.scrollIntoView({ behavior: "smooth", block: "center" });
    invalidField.focus({ preventScroll: true });
  }

  return (
    <form
      className={`w-full min-w-0 max-w-full rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/60 p-5 sm:p-6 md:p-8 backdrop-blur ${className}`.trim()}
      action={action}
      noValidate
      onChange={() => setClientMessage("")}
      onInput={() => setClientMessage("")}
      onSubmit={handleSubmit}
    >
      <h3 className="font-[var(--font-display)] text-[24px] tracking-tight text-[var(--ink-hi)] mb-6">
        How Can We Help You?
      </h3>
      {clientMessage && (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-[14px] leading-[1.5] text-red-200"
        >
          {clientMessage}
        </p>
      )}
      <div className="grid min-w-0 gap-5 md:grid-cols-2">
        <Field label="Full name *" name="name" placeholder="John Smith" required />
        <Field
          label="Email *"
          name="email"
          type="email"
          placeholder="you@email.com"
          required
        />
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="phone" className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--ink-lo)]">
            Mobile *
          </label>
          <div className="flex min-w-0 items-end gap-2">
            <PhoneCountrySelect />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="56 526 6295"
              required
              autoComplete="tel"
              className="flex-1 min-w-0 bg-transparent border-b border-white/15 py-2 text-[16px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)]/60 outline-none focus:border-[var(--champagne)] transition-colors [color-scheme:dark]"
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label htmlFor="brand" className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--ink-lo)]">
            Select Brand *
          </label>
          <select
            id="brand"
            name="brand"
            defaultValue=""
            required
            className="w-full min-w-0 bg-transparent border-b border-white/15 py-2 text-[16px] text-[var(--ink-hi)] outline-none focus:border-[var(--champagne)] transition-colors [color-scheme:dark]"
          >
            <option value="" disabled className="bg-[var(--bg-obsidian)]">Choose a brand</option>
            {CARS_BRANDS.map((b) => (
              <option key={b} value={b} className="bg-[var(--bg-obsidian)]">
                {b}
              </option>
            ))}
          </select>
        </div>
        <Field label="Date from *" name="dateFrom" type="date" required />
        <Field label="Date to *" name="dateTo" type="date" required />
        <div className="flex min-w-0 flex-col gap-1.5 md:col-span-2">
          <label htmlFor="message" className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--ink-lo)]">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            placeholder="Tell us about your trip, dates, and dream car…"
            className="w-full min-w-0 bg-transparent border-b border-white/15 py-2 text-[16px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)]/60 outline-none focus:border-[var(--champagne)] transition-colors resize-none [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--ink-lo)]">
          We will respond as fast as possible.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-7 py-3 text-[17px] font-medium hover:bg-[var(--champagne-hi)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send enquiry"}
          {!pending && (
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>
      {state.message && (
        <p
          role="status"
          className={`mt-4 text-[17px] ${state.ok ? "text-[var(--champagne)]" : "text-red-400"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={name} className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--ink-lo)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={
          name === "name" ? "name" : name === "email" ? "email" : undefined
        }
        className="w-full min-w-0 bg-transparent border-b border-white/15 py-2 text-[16px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)]/60 outline-none focus:border-[var(--champagne)] transition-colors [color-scheme:dark]"
      />
    </div>
  );
}
