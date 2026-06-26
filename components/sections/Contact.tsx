"use client";

import { CONTACT } from "@/lib/content";
import EnquiryForm from "@/components/contact/EnquiryForm";
import MaskHeading from "@/components/motion/MaskHeading";
import Reveal from "@/components/motion/Reveal";

export default function Contact({ formOnly = false }: { formOnly?: boolean }) {
  return (
    <section id="contact" className={`bg-[var(--bg-obsidian)] overflow-hidden ${formOnly ? "pb-20 md:pb-28" : "py-20 md:py-28 border-t border-white/5"}`}>
      <div className={formOnly ? "container-x" : "container-x grid min-w-0 gap-12 md:grid-cols-12 md:gap-20"}>
        {!formOnly && (
          <div className="flex min-w-0 flex-col gap-8 md:col-span-5">
            <div>
              <MaskHeading
                text="Let's put you **behind the wheel**"
                as="h2"
                className="font-[var(--font-display)] text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-0.018em] text-[var(--ink-hi)]"
                staggerMs={45}
              />
              <p className="mt-5 max-w-md text-[16.5px] leading-[1.7] text-[var(--ink-lo)]">
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
        )}

        <div className={formOnly ? "mx-auto w-full min-w-0 max-w-2xl" : "min-w-0 md:col-span-5 md:col-start-8"}>
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
