"use client";

import { type ReactNode, useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { sendEnquiry, type EnquiryFormState } from "@/app/actions/send-enquiry";
import PhoneCountrySelect from "@/components/contact/PhoneCountrySelect";

const INITIAL_STATE: EnquiryFormState = { ok: false, message: "" };

interface FleetEnquiryDialogProps {
  carName: string;
  brandName: string;
  pagePath: string;
  buttonClassName: string;
  children: ReactNode;
}

export default function FleetEnquiryDialog({
  carName,
  brandName,
  pagePath,
  buttonClassName,
  children,
}: FleetEnquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(sendEnquiry, INITIAL_STATE);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClassName}
      >
        {children}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 py-10 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="fleet-enquiry-title"
            >
              <button
                type="button"
                aria-label="Close enquiry form"
                onClick={() => setOpen(false)}
                className="absolute inset-0 cursor-default"
              />

              <div className="relative z-10 w-full max-w-[34rem]">
              <button
                type="button"
                aria-label="Close enquiry form"
                onClick={() => setOpen(false)}
                  className="absolute -right-3 -top-3 z-20 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[var(--bg-obsidian)] text-[var(--ink-hi)] shadow-[0_12px_35px_-14px_rgba(0,0,0,0.8)] transition-colors hover:border-[var(--champagne)]/60 hover:text-[var(--champagne)]"
              >
                <span aria-hidden>X</span>
              </button>

                <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-2xl border border-white/12 bg-[var(--bg-obsidian)] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.85)]">
                  <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5 md:px-7">
                    <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.26em] text-[var(--champagne)]">
                      Fleet Enquiry
                    </p>
                    <h2
                      id="fleet-enquiry-title"
                      className="mt-2 font-[var(--font-display)] text-[clamp(1.55rem,4vw,2.15rem)] leading-tight text-[var(--ink-hi)]"
                    >
                      {carName}
                    </h2>
                    <p className="mt-2 text-[14.5px] leading-6 text-[var(--ink-lo)]">
                      Share your details and our support team will contact you shortly.
                    </p>
                  </div>

                  <form action={action} className="space-y-4 px-6 py-6 md:px-7">
              <input type="hidden" name="enquiryType" value="fleet" />
              <input type="hidden" name="car" value={carName} />
              <input type="hidden" name="brand" value={brandName} />
              <input
                type="hidden"
                name="sourcePage"
                value={`${carName} fleet page`}
              />
              <input type="hidden" name="pagePath" value={pagePath} />
              <input type="hidden" name="pageUrl" value={pagePath} />

              <DialogInput label="Full name" name="name" required />
              <DialogInput
                label="Email address"
                name="email"
                type="email"
                required
              />

              <div>
                <label
                  htmlFor="fleet-phone"
                  className="mb-2 block text-[13px] font-medium text-[var(--ink-hi)]"
                >
                  Mobile / WhatsApp
                </label>
                <div className="flex gap-2">
                  <PhoneCountrySelect variant="box" />
                  <input
                    id="fleet-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)] focus:border-[var(--champagne)]/60 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[var(--champagne)] px-6 py-3 text-[15px] font-semibold text-[var(--bg-obsidian)] transition-colors hover:bg-[var(--champagne-hi)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Sending..." : "Submit Enquiry"}
              </button>

              {state.message && (
                <p
                  role="status"
                  className={`text-center text-[14px] leading-6 ${
                    state.ok ? "text-[var(--champagne)]" : "text-red-400"
                  }`}
                >
                  {state.message}
                </p>
              )}
                  </form>
                </div>
              </div>
            </div>
          ),
          document.body,
        )}
    </>
  );
}

function DialogInput({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-[var(--ink-hi)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={
          name === "name" ? "name" : name === "email" ? "email" : undefined
        }
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)] focus:border-[var(--champagne)]/60 focus:outline-none"
      />
    </label>
  );
}
