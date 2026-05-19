"use client";

import { useActionState } from "react";
import { CARS_BRANDS, CONTACT } from "@/lib/content";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";
import { sendEnquiry, type EnquiryFormState } from "@/app/actions/send-enquiry";

const INITIAL_STATE: EnquiryFormState = { ok: false, message: "" };

export default function Contact() {
  const [state, action, pending] = useActionState(sendEnquiry, INITIAL_STATE);
  return (
    <section id="contact" className="bg-[var(--bg-obsidian)] py-20 md:py-28 border-t border-white/5 overflow-hidden">
      <div className="container-x grid md:grid-cols-12 gap-12 md:gap-20">
        <div className="md:col-span-5 flex flex-col gap-8">
          <div>
            <MaskHeading
              text="Let's put you **behind the wheel**"
              as="h2"
              className="font-[var(--font-display)] text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-0.018em] text-[var(--ink-hi)]"
              staggerMs={45}
            />
            <p className="mt-5 max-w-md text-[14.5px] leading-[1.7] text-[var(--ink-lo)]">
              24/7 concierge support, free delivery anywhere in Dubai, and a fleet that turns heads. Reach out and we&apos;ll have the keys waiting.
            </p>
          </div>

          <Reveal className="rise flex flex-col divide-y divide-white/8 border-y border-white/8">
            {[
              { label: "Primary", value: CONTACT.primaryPhone, href: `tel:${CONTACT.primaryPhone.replace(/\s/g, "")}` },
              { label: "Secondary", value: CONTACT.secondaryPhone, href: `tel:${CONTACT.secondaryPhone.replace(/\s/g, "")}` },
              { label: "Landline", value: CONTACT.landline, href: `tel:${CONTACT.landline.replace(/\s/g, "")}` },
              { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { label: "Showroom", value: CONTACT.address, href: "#" },
            ].map((r) => (
              <a
                key={r.label}
                href={r.href}
                className="group flex items-center justify-between py-4 text-[16px] hover:text-[var(--champagne)] transition-colors"
              >
                <span className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--ink-lo)] w-28">
                  {r.label}
                </span>
                <span className="text-[var(--ink-hi)] group-hover:text-[var(--champagne)] text-right flex-1 ml-4">
                  {r.value}
                </span>
                <svg width="13" height="9" viewBox="0 0 13 9" fill="none" className="ml-3 opacity-50 transition-transform group-hover:translate-x-1">
                  <path d="M0 4.5h11M8 1l3 3.5L8 8" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            ))}
          </Reveal>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <form
            className="rounded-2xl border border-white/8 bg-[var(--bg-graphite)]/60 p-6 md:p-8 backdrop-blur"
            action={action}
          >
            <h3 className="font-[var(--font-display)] text-[22px] tracking-tight text-[var(--ink-hi)] mb-6">
              How Can We Help You?
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Full name" name="name" placeholder="John Smith" />
              <Field label="Email" name="email" type="email" placeholder="you@email.com" />
              <Field label="Mobile" name="phone" type="tel" placeholder="+971 ..." />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="brand" className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--ink-lo)]">
                  Select Brand
                </label>
                <select
                  id="brand"
                  name="brand"
                  defaultValue=""
                  className="bg-transparent border-b border-white/15 py-2 text-[14px] text-[var(--ink-hi)] outline-none focus:border-[var(--champagne)] transition-colors [color-scheme:dark]"
                >
                  <option value="" disabled className="bg-[var(--bg-obsidian)]">Choose a brand</option>
                  {CARS_BRANDS.map((b) => (
                    <option key={b} value={b} className="bg-[var(--bg-obsidian)]">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Date from" name="dateFrom" type="date" />
              <Field label="Date to" name="dateTo" type="date" />
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="message" className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--ink-lo)]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your trip, dates, and dream car…"
                  className="bg-transparent border-b border-white/15 py-2 text-[14px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)]/60 outline-none focus:border-[var(--champagne)] transition-colors resize-none [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
              <p className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--ink-lo)]">
                We will respond as fast as possible.
              </p>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2.5 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-7 py-3 text-[13px] font-medium hover:bg-[var(--champagne-hi)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
                className={`mt-4 text-[13px] ${state.ok ? "text-[var(--champagne)]" : "text-red-400"}`}
              >
                {state.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--ink-lo)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="bg-transparent border-b border-white/15 py-2 text-[14px] text-[var(--ink-hi)] placeholder:text-[var(--ink-lo)]/60 outline-none focus:border-[var(--champagne)] transition-colors [color-scheme:dark]"
      />
    </div>
  );
}
