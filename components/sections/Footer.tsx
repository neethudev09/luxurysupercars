import Image from "next/image";
import Link from "next/link";
import { CONTACT, FOOTER, SOCIAL } from "@/lib/content";
import { BRAND_LOGOS, SITE_LOGO } from "@/lib/assets";

const BRAND_HREF: Record<string, string> = Object.fromEntries(
  BRAND_LOGOS.filter((b) => b.slug).map((b) => [b.name, `/brands/${b.slug}`])
);

function brandHref(name: string) {
  if (BRAND_HREF[name]) return BRAND_HREF[name];
  if (name === "Mercedes Benz" && BRAND_HREF["Mercedes"]) return BRAND_HREF["Mercedes"];
  return "#brands";
}

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[var(--bg-obsidian)] to-black border-t border-white/5 overflow-hidden">
      <div className="container-x pt-14 pb-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-4 gap-y-10">
          <div className="col-span-2 md:col-span-3">
            <Link href="/" aria-label="Luxury Supercars Dubai — home" className="inline-block mb-6">
              <Image
                src={SITE_LOGO}
                alt="Luxury Supercars Dubai"
                width={360}
                height={72}
                sizes="360px"
                className="h-18 w-auto object-contain"
              />
            </Link>
            <p className="text-[15.5px] leading-[1.7] text-[var(--ink-lo)] max-w-md">
              {FOOTER.description}
            </p>
          </div>
          <div className="col-span-1 md:col-span-3">
            <p className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--champagne)] mb-4">
              Brands
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[15px] text-[var(--ink-hi)]/80">
              {FOOTER.brands.map((b) => (
                <li key={b}>
                  <a href={brandHref(b)} className="hover:text-[var(--champagne)] transition-colors">
                    {b}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--champagne)] mb-4">
              Rent
            </p>
            <ul className="flex flex-col gap-1.5 text-[15px] text-[var(--ink-hi)]/80">
              {FOOTER.rent.map((r) => (
                <li key={r.href + r.label}>
                  <Link href={r.href} className="hover:text-[var(--champagne)] transition-colors">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <p className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--champagne)] mb-4">
              Useful Links
            </p>
            <ul className="flex flex-col gap-1.5 text-[15px] text-[var(--ink-hi)]/80">
              {FOOTER.useful.map((u) => (
                <li key={u.href}>
                  <Link href={u.href} className="hover:text-[var(--champagne)] transition-colors">
                    {u.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2">
            <p className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--champagne)] mb-4">
              Contact Us
            </p>
            <ul className="flex flex-col gap-1.5 text-[15px] text-[var(--ink-hi)]/80">
              <li><a href={`tel:${CONTACT.primaryPhone.replace(/\s/g, "")}`} className="hover:text-[var(--champagne)] transition-colors">{CONTACT.primaryPhone}</a></li>
              <li><a href={`tel:${CONTACT.secondaryPhone.replace(/\s/g, "")}`} className="hover:text-[var(--champagne)] transition-colors">{CONTACT.secondaryPhone}</a></li>
              <li><a href={`tel:${CONTACT.landline.replace(/\s/g, "")}`} className="hover:text-[var(--champagne)] transition-colors">{CONTACT.landline}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-[var(--champagne)] transition-colors">{CONTACT.email}</a></li>
              <li className="mt-2 text-[var(--ink-lo)] text-[14.5px]">{CONTACT.address}</li>
            </ul>

            <p className="font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] text-[var(--champagne)] mt-8 mb-4">
              Accepted Payment
            </p>
            <ul className="flex flex-wrap items-center gap-2.5">
              {[
                { name: "Visa", file: "Visa.svg" },
                { name: "Mastercard", file: "Mastercard.svg" },
                { name: "American Express", file: "Amex.svg" },
                { name: "PayPal", file: "PayPal.svg" },
                { name: "Bitcoin", file: "Bitcoin.svg" },
              ].map((p) => (
                <li key={p.name} title={p.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/Payment%20Method/${p.file}`}
                    alt={p.name}
                    width={56}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-auto"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-6">
          <p className="text-[14px] text-[var(--ink-lo)]">{FOOTER.copyright}</p>
          <ul className="flex items-center gap-5 text-[14px] text-[var(--ink-lo)]">
            {FOOTER.legal.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-[var(--champagne)]">{l.label}</Link></li>
            ))}
          </ul>
          <ul className="flex items-center gap-3 text-[var(--ink-hi)]">
            {(["facebook", "instagram", "youtube", "tiktok"] as const).map((s) => (
              <li key={s}>
                <a
                  href={SOCIAL[s]}
                  aria-label={s}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
                >
                  <SocialIcon name={s} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: "facebook" | "instagram" | "youtube" | "tiktok" }) {
  const common = { width: 14, height: 14, fill: "none", viewBox: "0 0 14 14" as const };
  switch (name) {
    case "facebook":
      return (
        <svg {...common}><path d="M9 4h2V1H9c-1.7 0-3 1.3-3 3v2H4v3h2v5h3V9h2l1-3H9V4z" fill="currentColor" /></svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="7" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10.2" cy="3.8" r="0.7" fill="currentColor" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}><path d="M13 4.5c-.1-1-.7-1.7-1.6-1.8C9.8 2.5 7 2.5 7 2.5s-2.8 0-4.4.2C1.7 2.8 1.1 3.5 1 4.5.8 5.6.8 7 .8 7s0 1.4.2 2.5c.1 1 .7 1.7 1.6 1.8 1.6.2 4.4.2 4.4.2s2.8 0 4.4-.2c.9-.1 1.5-.8 1.6-1.8.2-1.1.2-2.5.2-2.5s0-1.4-.2-2.5zM5.7 9.1V4.9L9.3 7l-3.6 2.1z" fill="currentColor" /></svg>
      );
    case "tiktok":
      return (
        <svg {...common}><path d="M10 1v6.5a2 2 0 1 1-2-2v-2a4 4 0 1 0 4 4V4.4c.7.4 1.4.6 2.2.6V3a3.2 3.2 0 0 1-2.4-1c-.5-.5-.8-1.2-.8-2H10z" fill="currentColor" /></svg>
      );
  }
}
