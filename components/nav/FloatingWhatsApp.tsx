"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT } from "@/lib/content";

type Agent = {
  name: string;
  language: string;
  flags: { code: string; label: string }[];
  phone: string; // any human-readable format; non-digits get stripped for wa.me
  message?: string;
};

// Edit phone numbers here as agents change. The primary site number is used
// as a placeholder until per-agent WhatsApp lines are confirmed.
const TEAM: Agent[] = [
  {
    name: "Aleona",
    language: "Russian, Ukrainian, English",
    flags: [
      { code: "ru", label: "Russia" },
      { code: "ua", label: "Ukraine" },
      { code: "gb", label: "United Kingdom" },
    ],
    phone: "+971 50 204 5552",
    message: "Hi Aleona, I'd like to enquire about renting a car.",
  },
  {
    name: "Ryan",
    language: "French, Arabic",
    flags: [
      { code: "sa", label: "Saudi Arabia" },
      { code: "lb", label: "Lebanon" },
      { code: "ae", label: "United Arab Emirates" },
      { code: "fr", label: "France" },
    ],
    phone: CONTACT.primaryPhone,
    message: "Hi Ryan, I'd like to enquire about renting a car.",
  },
  {
    name: "Claire",
    language: "English",
    flags: [
      { code: "gb", label: "United Kingdom" },
    ],
    phone: "+971 56 578 3875",
    message: "Hi Claire, I'd like to enquire about renting a car.",
  },
];

function waLink(agent: Agent) {
  const num = agent.phone.replace(/\D/g, "");
  const text = encodeURIComponent(agent.message ?? "Hi, I'd like to enquire about renting a car.");
  return `https://wa.me/${num}?text=${text}`;
}

function WhatsAppGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M13.6 2.32A7.85 7.85 0 0 0 8.02 0C3.6 0 0 3.6 0 8.02c0 1.41.37 2.79 1.07 4.01L0 16l4.09-1.07a8.04 8.04 0 0 0 3.92 1c4.42 0 8.02-3.6 8.02-8.02 0-2.14-.83-4.16-2.43-5.6zM8.02 14.66a6.65 6.65 0 0 1-3.4-.93l-.24-.14-2.43.63.65-2.37-.16-.25a6.65 6.65 0 0 1-1.02-3.55c0-3.68 3-6.68 6.68-6.68a6.65 6.65 0 0 1 6.68 6.68c0 3.68-3 6.68-6.68 6.68zm3.66-5c-.2-.1-1.18-.58-1.36-.65-.18-.07-.32-.1-.45.1-.13.2-.52.65-.64.78-.12.13-.23.15-.43.05a5.45 5.45 0 0 1-1.6-.99 6.04 6.04 0 0 1-1.11-1.38c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.34.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12 0-.25-.01-.39-.01a.74.74 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .98.72 1.93.82 2.07.1.13 1.41 2.16 3.42 3.03.48.21.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.18-.48 1.35-.95.16-.46.16-.86.12-.95-.05-.08-.18-.13-.38-.23z" />
    </svg>
  );
}

function PhoneGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M12.5 9.85v1.65c0 .55-.45 1-1 1A10.5 10.5 0 0 1 1.5 2c0-.55.45-1 1-1H4.15c.45 0 .85.3.96.74l.6 2.4a1 1 0 0 1-.26.95L4.4 6.13a8.5 8.5 0 0 0 3.47 3.47l1.04-1.05c.25-.25.6-.35.95-.26l2.4.6c.44.1.74.5.74.96z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TEL_HREF = `tel:${CONTACT.primaryPhone.replace(/[^\d+]/g, "")}`;

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Hide entirely when the Contact section OR the footer is on screen — the
  // contact form sits bottom-right, and over the footer these buttons would
  // crop the social links. Watching both keeps them clear on every page
  // (including ones without a #contact section, e.g. /about-us).
  useEffect(() => {
    const targets = [
      document.getElementById("contact"),
      document.querySelector("footer"),
    ].filter(Boolean) as Element[];
    if (!targets.length) return;

    const onScreen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        const anyVisible = onScreen.size > 0;
        setHidden(anyVisible);
        if (anyVisible) setOpen(false);
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Click-outside + Escape to close the popover.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const node = rootRef.current;
      if (node && !node.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[55] flex flex-col items-end gap-3 transition-all duration-300 ${
        hidden ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat with our team on WhatsApp"
          className="w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] origin-bottom-right animate-[fadeUp_220ms_cubic-bezier(0.22,1,0.36,1)]"
        >
          <header className="flex items-center gap-3 bg-[#25D366] px-4 py-3.5 text-white">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <WhatsAppGlyph size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[17px] font-semibold leading-tight">Start a Conversation</p>
              <p className="mt-1 text-[12.5px] leading-snug text-white/90">
                Hi! Click one of our team below to chat on{" "}
                <span className="font-semibold">WhatsApp</span>.
              </p>
            </div>
          </header>

          <p className="px-4 pt-3 pb-1 text-[11px] text-[var(--ink-dark-lo)]/80">
            The team typically replies in a few minutes.
          </p>

          <ul className="flex flex-col gap-3 px-3 pb-4 pt-1">
            {TEAM.map((agent) => (
              <li key={agent.name}>
                <a
                  href={waLink(agent)}
                  target="_blank"
                  rel="noreferrer"
                  className="group/agent relative flex items-center gap-3 rounded-xl bg-[var(--bg-bone)] px-3 py-3 transition-colors hover:bg-[var(--bg-bone)]/70"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <WhatsAppGlyph size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[16px] font-semibold leading-tight text-[var(--ink-dark-hi)]">
                      <span>{agent.name}</span>
                      <span
                        className="inline-flex flex-wrap items-center gap-1 text-[14px] leading-none"
                        aria-label={`${agent.name} language and region flags: ${agent.flags
                          .map((flag) => flag.label)
                          .join(", ")}`}
                      >
                        {agent.flags.map((flag) => (
                          <img
                            key={flag.code}
                            src={`https://flagcdn.com/w20/${flag.code}.png`}
                            srcSet={`https://flagcdn.com/w40/${flag.code}.png 2x`}
                            width={20}
                            height={15}
                            alt=""
                            aria-hidden
                            className="h-[13px] w-[18px] rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                          />
                        ))}
                      </span>
                    </span>
                    <span className="block text-[12px] leading-tight text-[var(--ink-dark-lo)]">
                      {agent.language}
                    </span>
                  </span>
                  <span className="text-[#25D366] opacity-70 transition-opacity group-hover/agent:opacity-100">
                    <WhatsAppGlyph size={18} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3">
        <a
          href={TEL_HREF}
          aria-label="Call us now"
          title="Call us now"
          className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-white p-3 md:pl-3.5 md:pr-5 md:py-3 text-[var(--bg-obsidian)] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] transition-colors hover:bg-white/90"
        >
          <span className="inline-flex size-7 items-center justify-center">
            <PhoneGlyph size={16} />
          </span>
          <span className="hidden md:inline text-[15px] font-medium tracking-wide leading-none">
            Call Us
          </span>
        </a>

        <button
        type="button"
        aria-label={open ? "Close WhatsApp menu" : "Open WhatsApp menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-2.5 rounded-full bg-[#25D366] p-3 md:pl-3.5 md:pr-5 md:py-3 text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.55)] hover:bg-[#1ebd5b] hover:shadow-[0_18px_40px_-10px_rgba(37,211,102,0.7)] transition-colors"
      >
        <span className="relative inline-flex size-7 items-center justify-center overflow-hidden rounded-full bg-white/15">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.svg
                key="x"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute"
              >
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </motion.svg>
            ) : (
              <motion.span
                key="wa"
                initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inline-flex"
              >
                <WhatsAppGlyph size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="relative hidden md:inline-block min-w-[5.5rem] text-[15px] font-medium tracking-wide leading-none h-[1em] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "wa"}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {open ? "Close" : "WhatsApp Us"}
            </motion.span>
          </AnimatePresence>
        </span>
        </button>
      </div>
    </div>
  );
}
