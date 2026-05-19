"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT, NAV_LINKS, SOCIAL } from "@/lib/content";
import { SITE_LOGO, BRAND_LOGOS, NAV_CAR_TYPES } from "@/lib/assets";

const PRIMARY_LINKS = NAV_LINKS;
const CURRENCIES = ["AED", "USD", "EUR", "GBP"] as const;
type Currency = (typeof CURRENCIES)[number];

/** Flip this to true once price-conversion logic is wired up. */
const SHOW_CURRENCY_SELECTOR = false;

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoverMenu, setHoverMenu] = useState<"type" | "brand" | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<"type" | "brand" | null>(null);
  const [currency, setCurrency] = useState<Currency>("AED");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--bg-obsidian)]/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        {/* TOP UTILITY BAR — desktop only */}
        <div
          className={`hidden md:block border-b transition-colors duration-500 ${
            scrolled ? "border-white/[0.06]" : "border-white/[0.04]"
          }`}
        >
          <div className="w-full px-6 md:px-10 flex items-center justify-end h-[36px] gap-5 text-[12px] text-[var(--ink-lo)]">
            <SocialRow />
            <Divider />
            <a
              href={`tel:${CONTACT.primaryPhone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 text-[var(--champagne)] hover:text-[var(--champagne-hi)] transition-colors"
            >
              <PhoneIcon />
              <span className="font-[var(--font-mono)] tracking-[0.04em]">
                {CONTACT.primaryPhone}
              </span>
            </a>
            {SHOW_CURRENCY_SELECTOR && (
              <>
                <Divider />
                <CurrencySelector value={currency} onChange={setCurrency} />
              </>
            )}
          </div>
        </div>

        {/* MAIN BAR */}
        <div className="relative w-full px-6 md:px-10 flex items-center justify-between h-[72px] md:h-[80px]">
          <Link
            href="/"
            aria-label="Luxury Supercars Dubai — home"
            className="relative z-[51] inline-flex items-center h-12 shrink-0 cursor-pointer"
          >
            <Image
              src={SITE_LOGO}
              alt="Luxury Supercars Dubai"
              width={240}
              height={48}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Viewport-centred nav (absolute so it's centred to the page, not
              squeezed between logo and Contact button which have unequal widths) */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 text-[16px] text-[var(--ink-hi)]">
            {PRIMARY_LINKS.filter((l) => l.label !== "Contact Us").map((link) => {
              const isType = link.label === "Cars Types";
              const isBrand = link.label === "Cars Brands";
              const hasMega = isType || isBrand;
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() =>
                    hasMega && setHoverMenu(isType ? "type" : "brand")
                  }
                  onMouseLeave={() => hasMega && setHoverMenu(null)}
                >
                  <Link
                    href={link.href}
                    className="hover:text-[var(--champagne-hi)] transition-colors py-2 inline-flex items-center gap-1"
                  >
                    {link.label}
                    {hasMega && (
                      <svg
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        className="opacity-60"
                        fill="none"
                      >
                        <path
                          d="M1 1l3.5 3.5L8 1"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    )}
                  </Link>

                  <AnimatePresence>
                    {hasMega && hoverMenu === (isType ? "type" : "brand") && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className={`absolute right-0 top-full mt-3 rounded-2xl bg-[var(--bg-obsidian)]/92 backdrop-blur-2xl border border-[var(--champagne)]/40 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] p-3 ${
                          isType ? "w-[480px]" : "w-[600px]"
                        }`}
                      >
                        {isType ? (
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                            {NAV_CAR_TYPES.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setHoverMenu(null)}
                                className="group/item flex items-center gap-3 px-3 py-3 rounded-lg text-[16px] text-[var(--ink-hi)] hover:bg-white/5 hover:text-[var(--champagne-hi)] transition-colors"
                              >
                                <span className="relative shrink-0 size-10 rounded-md bg-white/[0.04] border border-white/8 flex items-center justify-center overflow-hidden">
                                  <Image
                                    src={item.icon}
                                    alt=""
                                    width={28}
                                    height={20}
                                    className="object-contain opacity-90 group-hover/item:opacity-100 transition-opacity"
                                  />
                                </span>
                                <span className="font-medium tracking-tight">
                                  {item.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                            {BRAND_LOGOS.filter((b) => b.slug !== null).map((b) => (
                              <Link
                                key={b.name}
                                href={`/brands/${b.slug}`}
                                onClick={() => setHoverMenu(null)}
                                className="group/item flex items-center gap-3 px-3 py-2.5 rounded-lg text-[16px] text-[var(--ink-hi)] hover:bg-white/5 hover:text-[var(--champagne-hi)] transition-colors"
                              >
                                <span className="relative shrink-0 size-9 rounded-md bg-white/[0.04] border border-white/8 flex items-center justify-center overflow-hidden">
                                  <Image
                                    src={b.src}
                                    alt=""
                                    width={26}
                                    height={18}
                                    className="object-contain opacity-90 group-hover/item:opacity-100 transition-opacity"
                                  />
                                </span>
                                <span className="font-medium tracking-tight truncate">
                                  {b.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Contact Us — pulled out of the main nav and styled as a button */}
          <Link
            href="/contact-us"
            className="hidden lg:inline-flex items-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-5 py-2.5 text-[13px] font-medium tracking-wide hover:bg-[var(--champagne-hi)] transition-colors"
          >
            Contact Us
            <svg width="13" height="9" viewBox="0 0 14 10" fill="none">
              <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
          >
            <span className="block w-6 h-px bg-[var(--ink-hi)]" />
            <span className="block w-6 h-px bg-[var(--ink-hi)]" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-[var(--bg-obsidian)] overflow-y-auto"
          >
            <div className="w-full px-6 md:px-10 flex h-[72px] items-center justify-between">
              <Link
                href="/"
                aria-label="Luxury Supercars Dubai — home"
                onClick={() => setOpen(false)}
                className="relative block h-12 w-auto shrink-0"
              >
                <Image
                  src={SITE_LOGO}
                  alt="Luxury Supercars Dubai"
                  width={240}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 text-[var(--ink-hi)]"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
            <nav className="container-x mt-6 flex flex-col gap-1 pb-10">
              {PRIMARY_LINKS.map((link, i) => {
                const isType = link.label === "Cars Types";
                const isBrand = link.label === "Cars Brands";
                const hasSubmenu = isType || isBrand;
                const key = isType ? "type" : isBrand ? "brand" : null;
                const expanded = key !== null && mobileExpanded === key;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.05,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {hasSubmenu ? (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpanded(expanded ? null : (key as "type" | "brand"))
                        }
                        aria-expanded={expanded}
                        className="flex w-full items-center justify-between py-4 border-b border-white/5 font-[var(--font-display)] text-3xl text-left text-[var(--ink-hi)] hover:text-[var(--champagne-hi)] transition-colors"
                      >
                        {link.label}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          className={`opacity-60 transition-transform duration-300 ${
                            expanded ? "rotate-45" : ""
                          }`}
                        >
                          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block py-4 border-b border-white/5 font-[var(--font-display)] text-3xl text-[var(--ink-hi)] hover:text-[var(--champagne-hi)]"
                      >
                        {link.label}
                      </Link>
                    )}

                    <AnimatePresence>
                      {hasSubmenu && expanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden flex flex-col"
                        >
                          {(isType ? NAV_CAR_TYPES : BRAND_LOGOS.filter((b) => b.slug !== null)).map(
                            (item) => {
                              const itemLabel = "label" in item ? item.label : item.name;
                              const itemHref =
                                "label" in item ? item.href : `/brands/${item.slug}`;
                              return (
                                <li key={itemLabel}>
                                  <Link
                                    href={itemHref}
                                    onClick={() => {
                                      setOpen(false);
                                      setMobileExpanded(null);
                                    }}
                                    className="block pl-4 py-3 border-b border-white/5 text-[17px] text-[var(--ink-hi)]/80 hover:text-[var(--champagne-hi)] transition-colors"
                                  >
                                    {itemLabel}
                                  </Link>
                                </li>
                              );
                            }
                          )}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
              <div className="mt-6 flex items-center gap-4">
                <SocialRow />
                {SHOW_CURRENCY_SELECTOR && (
                  <>
                    <span className="text-[var(--ink-lo)]/50">·</span>
                    <CurrencySelector value={currency} onChange={setCurrency} />
                  </>
                )}
              </div>
              <a
                href={`tel:${CONTACT.primaryPhone.replace(/\s/g, "")}`}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--champagne)] text-[var(--bg-obsidian)] px-6 py-4 text-sm font-medium"
              >
                Call {CONTACT.primaryPhone}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ----------------------------- subcomponents ----------------------------- */

function Divider() {
  return <span aria-hidden className="h-3 w-px bg-white/15" />;
}

function SocialRow() {
  const items: { label: string; href: string; icon: React.ReactNode }[] = [
    { label: "Facebook", href: SOCIAL.facebook, icon: <FacebookIcon /> },
    { label: "Instagram", href: SOCIAL.instagram, icon: <InstagramIcon /> },
    { label: "YouTube", href: SOCIAL.youtube, icon: <YouTubeIcon /> },
    { label: "TikTok", href: SOCIAL.tiktok, icon: <TikTokIcon /> },
  ];
  return (
    <div className="inline-flex items-center gap-3.5 text-[var(--ink-lo)]">
      {items.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--champagne)] transition-colors"
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

function CurrencySelector({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (c: Currency) => void;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Currency</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="appearance-none bg-transparent pr-5 pl-0.5 py-1 text-[12px] font-[var(--font-mono)] tracking-[0.08em] text-[var(--champagne)] hover:text-[var(--champagne-hi)] focus:outline-none cursor-pointer"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c} className="bg-[var(--bg-obsidian)]">
            {c}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[var(--champagne)]"
        width="8"
        height="5"
        viewBox="0 0 9 6"
        fill="none"
        aria-hidden
      >
        <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </label>
  );
}

/* ----------------------------- icons ----------------------------- */

function PhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M12.5 9.85v1.65c0 .55-.45 1-1 1A10.5 10.5 0 0 1 1.5 2c0-.55.45-1 1-1H4.15c.45 0 .85.3.96.74l.6 2.4a1 1 0 0 1-.26.95L4.4 6.13a8.5 8.5 0 0 0 3.47 3.47l1.04-1.05c.25-.25.6-.35.95-.26l2.4.6c.44.1.74.5.74.96z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M16 8a8 8 0 1 0-9.25 7.9V10.3H4.72V8h2.03V6.24c0-2 1.2-3.1 3.02-3.1.87 0 1.79.15 1.79.15v1.97h-1.01c-.99 0-1.3.62-1.3 1.25V8h2.22l-.36 2.31H9.25V15.9A8 8 0 0 0 16 8z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.5" cy="4.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M15.66 4.66c-.18-.69-.72-1.23-1.4-1.42C12.99 2.88 8 2.88 8 2.88s-4.99 0-6.26.36c-.69.2-1.22.73-1.4 1.42C0 5.94 0 8 0 8s0 2.06.34 3.34c.18.69.72 1.23 1.4 1.42 1.27.36 6.26.36 6.26.36s4.99 0 6.26-.36c.69-.2 1.22-.73 1.4-1.42C16 10.06 16 8 16 8s0-2.06-.34-3.34zM6.4 10.7V5.3l4.17 2.7-4.17 2.7z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M12.6 3.85a3.7 3.7 0 0 1-2.2-.94 3.7 3.7 0 0 1-1.18-2.05H6.94V10.5a2.07 2.07 0 1 1-2.07-2.07c.18 0 .36.02.53.07v-2.4a4.43 4.43 0 0 0-.53-.03 4.43 4.43 0 1 0 4.43 4.43V6.2a6.05 6.05 0 0 0 3.52 1.12V4.95a3.7 3.7 0 0 1-.22-1.1z" />
    </svg>
  );
}
