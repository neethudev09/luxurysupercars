"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MaskHeading from "@/components/motion/MaskHeading";
import { FAQ as FAQ_CONTENT } from "@/lib/content";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  /** Override the section heading (defaults to "FAQs"). Type pages pass
   *  e.g. "Sports Cars FAQs". */
  heading?: string;
  /** Override the subheading rendered with MaskHeading. */
  subheading?: string;
  /** Override the Q&A list. */
  items?: FAQItem[];
  /** Optional read-more CTA. Set to null to hide it. */
  cta?: { href: string; label: string } | null;
}

export default function FAQ({ heading, subheading, items, cta }: FAQProps = {}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const resolvedHeading = heading ?? "FAQs";
  const resolvedSubheading = subheading ?? FAQ_CONTENT.h3;
  const resolvedItems = items ?? FAQ_CONTENT.items;
  const resolvedCta = cta === undefined ? { href: "/faq", label: "Read More" } : cta;

  return (
    <section id={FAQ_CONTENT.id} className="bg-[var(--bg-pearl)] text-[var(--ink-dark-hi)] py-20 md:py-24">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-5">
            <h2 className="font-[var(--font-display)] text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-0.018em] text-[var(--ink-dark-hi)] mb-2">
              {resolvedHeading}
            </h2>
            <MaskHeading
              text={resolvedSubheading}
              as="h3"
              breakAfterBold={false}
              className="font-[var(--font-display)] text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.25] text-[var(--ink-dark-lo)] mt-2 text-balance"
              staggerMs={35}
            />
            {resolvedCta && (
              <a
                href={resolvedCta.href}
                className="mt-8 hidden md:inline-flex items-center gap-2 rounded-full border border-[var(--ink-dark-hi)]/30 px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--ink-dark-hi)] hover:text-[var(--bg-bone)] transition-colors"
              >
                {resolvedCta.label}
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            )}
          </div>

          <div className="md:col-span-7">
            <ul className="border-t border-[var(--ink-dark-hi)]/15">
              {resolvedItems.map((it, i) => {
                const open = openIdx === i;
                return (
                  <li
                    key={i}
                    className="border-b border-[var(--ink-dark-hi)]/15"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : i)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                    >
                      <span className="font-[var(--font-display)] text-[18px] md:text-[20px] leading-tight tracking-tight text-[var(--ink-dark-hi)] pr-6">
                        {it.q}
                      </span>
                      <span
                        className={`relative shrink-0 inline-flex size-9 items-center justify-center rounded-full border border-[var(--ink-dark-hi)]/20 group-hover:border-[var(--champagne)] transition-colors`}
                        aria-hidden
                      >
                        <span className="absolute h-px w-3.5 bg-[var(--ink-dark-hi)]" />
                        <span
                          className={`absolute h-3.5 w-px bg-[var(--ink-dark-hi)] transition-transform duration-300 ${
                            open ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pr-12 text-[16px] leading-[1.75] text-[var(--ink-dark-lo)]">
                            {it.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Hidden full text for crawlers when collapsed */}
                    {!open && (
                      <p className="sr-only">{it.a}</p>
                    )}
                  </li>
                );
              })}
            </ul>
            {resolvedCta && (
              <a
                href={resolvedCta.href}
                className="mt-8 inline-flex md:hidden items-center gap-2 rounded-full border border-[var(--ink-dark-hi)]/30 px-5 py-2.5 text-[12.5px] font-medium hover:bg-[var(--ink-dark-hi)] hover:text-[var(--bg-bone)] transition-colors"
              >
                {resolvedCta.label}
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
