"use client";

import { type ReactNode, useActionState } from "react";
import {
  sendCareersApplication,
  type CareersApplicationState,
} from "@/app/actions/send-careers-application";

const INITIAL_STATE: CareersApplicationState = { ok: false, message: "" };

export default function CareersForm() {
  const [state, action, pending] = useActionState(
    sendCareersApplication,
    INITIAL_STATE,
  );

  return (
    <form className="space-y-5" action={action}>
      <div>
        <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--champagne)] mb-3">
          Careers Application
        </p>
        <h2 className="font-[var(--font-display)] text-[clamp(1.3rem,2vw,1.6rem)] leading-tight text-[var(--ink-hi)] mb-2">
          Submit your application
        </h2>
        <p className="text-[15px] leading-[1.6] text-[var(--ink-lo)]">
          Complete the form below and our team will review your profile.
        </p>
      </div>

      <FormSection title="Personal Details">
        <Input label="Full Name *" name="fullName" required />
        <Input label="Nationality *" name="nationality" required />
        <Input label="Email Address *" name="email" type="email" required />
        <Input label="Phone / WhatsApp Number *" name="phone" required />
        <Input label="Current Location *" name="currentLocation" required className="md:col-span-2" />
      </FormSection>

      <FormSection title="Position & Experience">
        <Input label="Position Applying For *" name="position" required />
        <Input label="Years of Relevant Experience *" name="experienceYears" required />

        <RadioGroup
          label="Experience with luxury or performance vehicles?"
          name="luxuryVehicleExperience"
          options={["Yes", "No"]}
          required
          className="md:col-span-2"
        />

        <Textarea
          label="Brief Summary of Your Experience *"
          name="experienceSummary"
          required
          className="md:col-span-2"
        />
      </FormSection>

      <FormSection title="Availability">
        <RadioGroup
          label="Are you currently employed?"
          name="currentlyEmployed"
          options={["Yes", "No"]}
          required
        />

        <Input label="Notice Period" name="noticePeriod" />

        <RadioGroup
          label="Legally eligible to work in the UAE?"
          name="uaeEligible"
          options={["Yes", "No"]}
          required
          className="md:col-span-2"
        />
      </FormSection>

      <FormSection title="Documents">
        <FileInput className="md:col-span-2" />

        <Input
          label="LinkedIn Profile (Optional)"
          name="linkedin"
          type="url"
          className="md:col-span-2"
        />
      </FormSection>

      <FormSection title="Final Question">
        <Textarea
          label="Why would you like to join Luxury Group?"
          name="whyJoin"
          className="md:col-span-2"
        />
      </FormSection>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[var(--champagne)] px-6 py-3 text-[15px] font-medium text-[var(--bg-obsidian)] hover:bg-[var(--champagne-hi)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit Application"}
      </button>

      {state.message && (
        <p
          role="status"
          className={`text-[14px] ${
            state.ok ? "text-green-400" : "text-red-400"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3.5 border-t border-white/10 pt-4">
      <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.24em] text-[var(--champagne)]">
        {title}
      </p>

      <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Input({
  label,
  name,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-2 block text-[13px] font-medium text-[var(--ink-hi)]">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)] focus:border-[var(--champagne)]/60 focus:outline-none"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  required = false,
  className = "",
}: {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-2 block text-[13px] font-medium text-[var(--ink-hi)]">
        {label}
      </span>
      <textarea
        name={name}
        required={required}
        rows={3}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)] focus:border-[var(--champagne)]/60 focus:outline-none"
      />
    </label>
  );
}

function RadioGroup({
  label,
  name,
  options,
  required = false,
  className = "",
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  className?: string;
}) {
  return (
    <fieldset className={`min-w-0 ${className}`}>
      <legend className="mb-3 block text-[13px] font-medium text-[var(--ink-hi)]">
        {label}
      </legend>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] text-[var(--ink-hi)] hover:border-[var(--champagne)]/50"
          >
            <input
              type="radio"
              name={name}
              value={option}
              required={required}
              className="accent-[var(--champagne)]"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FileInput({ className = "" }: { className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label className="mb-2 block text-[13px] font-medium text-[var(--ink-hi)]">
        Upload Your CV *{" "}
        <span className="text-[var(--ink-lo)]">(PDF, DOC or DOCX)</span>
      </label>

      <input
        type="file"
        name="cv"
        required
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-[var(--ink-hi)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--champagne)] file:px-4 file:py-2 file:text-[13px] file:font-medium file:text-[var(--bg-obsidian)] focus:border-[var(--champagne)]/60 focus:outline-none"
      />
    </div>
  );
}
