"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import CarCard from "@/components/cards/CarCard";
import FAQ, { type FAQItem } from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import SiteNav from "@/components/nav/SiteNav";
import Testimonials from "@/components/sections/Testimonials";
import { CONTACT } from "@/lib/content";
import { carHref, type Car } from "@/lib/fleet";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/analytics";
import { getBrandLogo } from "@/lib/assets";

type PricingData = { headers: string[]; rows: string[][] };

interface LamborghiniDesignPreviewProps {
  cars: Car[];
  heroCar?: Car;
  pricing: PricingData;
  costCopy: string;
  included: string[];
  requirements: string[];
  whyChoose: string[];
  depositCopy: string[];
  faqs: FAQItem[];
}

const BENEFITS = [
  { title: "Free Dubai Delivery", detail: "Delivery and collection", icon: "delivery" },
  { title: "250 KM / Day", detail: "Mileage allowance", icon: "mileage" },
  { title: "Basic Insurance", detail: "Included with every rental", icon: "insurance" },
  { title: "24/7 Support", detail: "Phone and WhatsApp", icon: "support" },
] as const;

const RENTAL_STEPS = [
  { title: "Choose Your Lamborghini", detail: "Select your preferred model." },
  { title: "Send Your Details", detail: "Share your dates, location and requirements." },
  { title: "Confirm & Pay", detail: "We confirm availability, pricing and applicable terms." },
  { title: "Enjoy Your Drive", detail: "We arrange free delivery across Dubai." },
];

const MODEL_NOTES: Record<string, string> = {
  "lamborghini-huracan-evo-coupe": "Sports · 2 seats",
  "lamborghini-huracan-evo-spyder-yellow": "Sports · Convertible · 2 seats",
  "lamborghini-urus-yellow": "Sports · SUV · 5 seats",
  "lamborghini-huracan-sto": "Sports · Luxury · 2 seats",
  "lamborghini-urus-mansory": "Sports · Luxury · SUV · 4 seats",
  "lamborghini-revuelto": "Sports · 2 seats",
};

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M13.6 2.32A7.85 7.85 0 0 0 8.02 0C3.6 0 0 3.6 0 8.02c0 1.41.37 2.79 1.07 4.01L0 16l4.09-1.07a8.04 8.04 0 0 0 3.92 1c4.42 0 8.02-3.6 8.02-8.02 0-2.14-.83-4.16-2.43-5.6zM8.02 14.66a6.65 6.65 0 0 1-3.4-.93l-.24-.14-2.43.63.65-2.37-.16-.25a6.65 6.65 0 0 1-1.02-3.55c0-3.68 3-6.68 6.68-6.68a6.65 6.65 0 0 1 6.68 6.68c0 3.68-3 6.68-6.68 6.68zm3.66-5c-.2-.1-1.18-.58-1.36-.65-.18-.07-.32-.1-.45.1-.13.2-.52.65-.64.78-.12.13-.23.15-.43.05a5.45 5.45 0 0 1-1.6-.99 6.04 6.04 0 0 1-1.11-1.38c-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.34.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34-.12 0-.25-.01-.39-.01a.74.74 0 0 0-.54.25c-.18.2-.7.69-.7 1.67 0 .98.72 1.93.82 2.07.1.13 1.41 2.16 3.42 3.03.48.21.85.33 1.14.42.48.15.91.13 1.26.08.38-.06 1.18-.48 1.35-.95.16-.46.16-.86.12-.95-.05-.08-.18-.13-.38-.23z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-[#b99228]/45 text-[#9b7415]">
      <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden>
        <path d="m1 4 2.7 2.7L10 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function FeatureIcon({ kind }: { kind: "delivery" | "mileage" | "insurance" | "support" }) {
  const paths = {
    delivery: <><path d="M2 5h8v6H2zM10 7h3l2 2v2h-5z" /><circle cx="5" cy="12" r="1.5" /><circle cx="12.5" cy="12" r="1.5" /></>,
    mileage: <><path d="M2 12a6 6 0 0 1 12 0" /><path d="m8 10 3-4" /><circle cx="8" cy="10" r="1" /></>,
    insurance: <><path d="M8 1.5 14 4v4.5c0 3.5-2.4 5.6-6 7-3.6-1.4-6-3.5-6-7V4z" /><path d="m5 8 2 2 4-4" /></>,
    support: <><circle cx="8" cy="8" r="6" /><path d="M5 9V7a3 3 0 0 1 6 0v2M5 9H3.5M11 9h1.5M11 11c-.6 1-1.6 1.5-3 1.5" /></>,
  };
  return <svg width="26" height="26" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[kind]}</svg>;
}

export default function LamborghiniDesignPreview({ cars, heroCar, pricing, costCopy, included, requirements, whyChoose, depositCopy, faqs }: LamborghiniDesignPreviewProps) {
  const [rateColumn, setRateColumn] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("article")?.offsetWidth ?? 320;
    el.scrollBy({ left: dir * (cardWidth + 24), behavior: "smooth" });
  };

  /* ---- drag-to-scroll ---- */
  const dragState = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    // ignore right-click or clicks on interactive children
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) return;
    dragState.current = { down: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds.down) return;
    const dx = e.clientX - ds.startX;
    if (Math.abs(dx) > 3) ds.moved = true;
    const el = scrollRef.current;
    if (el) el.scrollLeft = ds.scrollLeft - dx;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const ds = dragState.current;
    ds.down = false;
    const el = scrollRef.current;
    if (el) {
      el.style.cursor = "";
      el.releasePointerCapture(e.pointerId);
    }
    // prevent the whole-card link from firing if we dragged
    if (ds.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const waNumber = CONTACT.primaryPhone.replace(/\D/g, "");
  const waMessage = encodeURIComponent("Hi, I'd like to enquire about renting a Lamborghini in Dubai. Could you share availability?");
  const waHref = `https://wa.me/${waNumber}?text=${waMessage}`;
  const telHref = `tel:${CONTACT.primaryPhone.replace(/\s/g, "")}`;

  return (
    <main className="bg-[var(--bg-bone)] text-[var(--ink-dark-hi)]">
      <SiteNav />

      <section className="relative isolate min-h-[700px] overflow-hidden bg-[#050607] pt-[118px] text-white md:min-h-[720px] md:pt-[148px]">
        {/* Full-width hero artwork layer — image extends behind the left content
            so there is no visible column split. The car stays on the right. */}
        <div className="absolute inset-0">
          <Image
            src="/images/Lamborghini Huracan yellow.webp"
            alt="Lamborghini Huracán available from Luxury Supercars Dubai"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
          {/* Cinematic depth — subtle dark wash so the scene is not brighter than the black UI */}
          <div className="absolute inset-0 bg-[#050607]/25" />
          {/* Seamless left-to-right blend: black on the left, transparent toward the
              right, so the car emerges naturally from the black content area. */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050607cc_0%_32%,#20262dc9_40%,#0506078c_52%,#0506072e_66%,#0000_82%)]" />
          {/* Stronger dark veil behind the text on mobile for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050607] via-[#050607]/70 to-transparent md:hidden" />
          {/* Soft bottom fade to anchor the trust bar */}
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#050607]/95 via-[#050607]/40 to-transparent" />
        </div>
        <div className="container-x relative z-10">
          <nav className="mb-12 flex flex-wrap items-center gap-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#f6c500]">Home</Link><span>/</span><Link href="/brands" className="hover:text-[#f6c500]">Brands</Link><span>/</span><span className="text-white/85">Lamborghini preview</span>
          </nav>
          <div className="max-w-[610px]">
            <p className="mb-4 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.26em] text-[#f6c500]">Luxury Supercars Dubai</p>
            <h1
              className="max-w-xl font-[var(--font-display)] font-semibold leading-[0.94] tracking-[-0.045em]"
              style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
            >
              Rent Lamborghini in Dubai
            </h1>
            <p className="mt-6 max-w-lg text-[16px] leading-7 text-white/75 md:text-[18px]">Lamborghini rentals in Dubai start from AED 2,500 per day, with daily, weekly and monthly packages available.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#lamborghini-fleet" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-[#f6c500] px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-[#ffda33]">View Lamborghini fleet <span aria-hidden>→</span></a>
              <a href={waHref} target="_blank" rel="noreferrer" onClick={() => trackWhatsAppClick("Lamborghini design preview hero", "Lamborghini")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-[#f6c500]/70 bg-black/30 px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm transition hover:bg-[#f6c500] hover:text-black"><WhatsAppIcon /> WhatsApp us</a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-14 pb-8 md:-mt-16">
        <div className="container-x"><div className="grid overflow-hidden rounded-md border border-white/10 bg-black/75 text-white shadow-2xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item) => <div key={item.title} className="flex items-center gap-3 border-b border-white/10 px-5 py-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"><span className="text-[#f6c500]"><FeatureIcon kind={item.icon} /></span><span><strong className="block text-[12px] uppercase tracking-[0.06em]">{item.title}</strong><small className="mt-0.5 block text-[11px] text-white/55">{item.detail}</small></span></div>)}
        </div></div>
      </section>

      <section id="lamborghini-fleet" className="py-16 md:py-24">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[#9b7415]">Available models</p><h2 className="font-[var(--font-display)] text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-tight">Our Lamborghini Fleet</h2><p className="mt-2 text-[15px] text-[var(--ink-dark-lo)]">Prices and specifications are pulled from the project&apos;s current fleet data.</p></div><div className="flex items-center gap-2"><Link href="/brands/rent-lamborghini-dubai" className="text-[12px] font-semibold uppercase tracking-[0.1em] hover:text-[#9b7415]">View current brand page →</Link><button type="button" onClick={() => scroll(-1)} disabled={!canScrollLeft} className="ml-2 inline-flex size-9 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--ink-dark-hi)] transition hover:bg-[#9b7415] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Scroll left"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3 5 7l4 4" /></svg></button><button type="button" onClick={() => scroll(1)} disabled={!canScrollRight} className="inline-flex size-9 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--ink-dark-hi)] transition hover:bg-[#9b7415] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Scroll right"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l4 4-4 4" /></svg></button></div></div>
          <div ref={scrollRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} className="flex gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-2 -mx-1 px-1 touch-pan-y">{cars.map((car, index) => <div key={car.slug} className="w-[280px] min-w-[280px] shrink-0 sm:w-[320px] sm:min-w-[320px] lg:w-[calc(25%-18px)] lg:min-w-[calc(25%-18px)]"><CarCard car={car} theme="light" index={index} /></div>)}</div>
          <p className="mt-6 rounded-md border border-dashed border-[#a37c1b]/40 bg-[#fff9dd] px-4 py-3 text-[12px] text-[#70550d]"><strong>Availability note:</strong> Current model availability is confirmed by the team at enquiry time.</p>
        </div>
      </section>

      <section className="bg-[#080b0f] py-16 text-white md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><p className="mb-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[#f6c500]">Verified pricing</p><h2 className="max-w-lg font-[var(--font-display)] text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.05]">How Much Does It Cost to Rent a Lamborghini in Dubai?</h2><p className="mt-6 max-w-xl text-[16px] leading-7 text-white/65">{costCopy}</p><ul className="mt-7 space-y-3 text-[13px] text-white/75"><li className="flex gap-3"><CheckIcon /> Prices vary by model, duration, and availability.</li><li className="flex gap-3"><CheckIcon /> VAT at 5% is not included in the displayed pricing.</li></ul></div>
          <PricingTable pricing={pricing} activeColumn={rateColumn} onColumnChange={setRateColumn} />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="mx-auto mb-12 max-w-2xl text-center"><p className="mb-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[#9b7415]">Compare the fleet</p><h2 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3.3rem)] font-semibold">Which Lamborghini Is Right for You?</h2><p className="mt-3 text-[15px] text-[var(--ink-dark-lo)]">Compare verified categories, seating and daily rates, then confirm availability with the team.</p></div>
          <div className="grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3">{cars.map((car) => <Link key={car.slug} href={carHref(car)} className="group bg-white p-6 transition hover:bg-[#fff8da]"><span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[#9b7415]">From AED {car.price.toLocaleString()} / day</span><h3 className="mt-3 text-[18px] font-semibold group-hover:text-[#806008]">{car.name.replace("Lamborghini ", "")}</h3><p className="mt-2 text-[13px] text-[var(--ink-dark-lo)]">{MODEL_NOTES[car.slug] ?? `${car.categories.join(" · ")} · ${car.seats} seats`}</p></Link>)}</div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-x grid items-stretch gap-5 lg:grid-cols-3">
          <InfoPanel items={included} />
          <RequirementsPanel requirements={requirements} />
          <StepsPanel />
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#f1f0ec] py-14"><div className="container-x grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 md:grid-cols-3"><PolicyCard title="Security Deposit" body={depositCopy[0] ?? "TODO: Confirm the applicable deposit with the team before booking."} /><PolicyCard title="Insurance" body="Basic insurance is included with every rental." /><PolicyCard title="Mileage Policy" body="The mileage allowance is 250 km per day. Additional kilometres are charged at AED 20/km." /></div></section>

      <section className="py-16 md:py-24"><div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="mb-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[#9b7415]">Luxury Supercars Dubai</p><h2 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-semibold">Why Choose LSR?</h2></div><ul className="grid gap-4 sm:grid-cols-2">{whyChoose.map((item) => <li key={item} className="flex gap-3 rounded-md border border-black/10 bg-white p-5 text-[14px] leading-6"><CheckIcon /><span>{item}</span></li>)}</ul></div></section>

      <Testimonials />
      <FAQ heading="Lamborghini FAQs" subheading="Verified answers before you book." items={faqs} cta={null} />

      <section className="relative overflow-hidden bg-black py-16 text-white md:py-20">
        {heroCar && <div className="absolute inset-y-0 left-0 hidden w-[42%] opacity-45 lg:block"><Image src={heroCar.image} alt="" fill sizes="42vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/50 to-black" /></div>}
        <div className="container-x relative flex flex-col items-start gap-8 lg:ml-[42%] lg:w-[58%]"><div><p className="mb-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[#f6c500]">Contact the team</p><h2 className="font-[var(--font-display)] text-[clamp(2.1rem,4.5vw,4rem)] font-semibold leading-tight">Ready to Drive a Lamborghini?</h2><p className="mt-3 text-[15px] text-white/65">Confirm your preferred model, current rate, and availability directly with Luxury Supercars Dubai.</p></div><div className="flex flex-wrap gap-3"><a href={waHref} target="_blank" rel="noreferrer" onClick={() => trackWhatsAppClick("Lamborghini design preview final CTA", "Lamborghini")} className="inline-flex min-h-12 items-center gap-2 bg-[#f6c500] px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-black hover:bg-[#ffda33]"><WhatsAppIcon /> WhatsApp now</a><a href={telHref} onClick={() => trackPhoneClick("Lamborghini design preview final CTA", "Lamborghini")} className="inline-flex min-h-12 items-center border border-[#f6c500]/60 px-6 text-[12px] font-bold uppercase tracking-[0.08em] hover:bg-[#f6c500] hover:text-black">Call {CONTACT.primaryPhone}</a></div></div>
      </section>

      <Footer />
    </main>
  );
}

function PricingTable({ pricing, activeColumn, onColumnChange }: { pricing: PricingData; activeColumn: number; onColumnChange: (column: number) => void }) {
  const tabs = pricing.headers.slice(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const prDrag = useRef({ down: false, startY: 0, scrollTop: 0 });

  const prMove = (e: MouseEvent) => {
    const ds = prDrag.current;
    if (!ds.down) return;
    const el = bodyRef.current;
    if (el) el.scrollTop = ds.scrollTop - (e.clientY - ds.startY);
  };
  const prUp = () => {
    prDrag.current.down = false;
    window.removeEventListener("mousemove", prMove);
    window.removeEventListener("mouseup", prUp);
    if (bodyRef.current) bodyRef.current.style.userSelect = "";
  };
  const prDown = (e: React.MouseEvent) => {
    const el = bodyRef.current;
    if (!el || e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("a, button")) return;
    el.style.userSelect = "none";
    prDrag.current = { down: true, startY: e.clientY, scrollTop: el.scrollTop };
    window.addEventListener("mousemove", prMove);
    window.addEventListener("mouseup", prUp);
  };
  const prLeave = () => {
    if (!prDrag.current.down) return;
    prUp();
  };

  if (!pricing.rows.length) return <div className="rounded-md border border-dashed border-[#f6c500]/50 p-6 text-sm text-[#f6c500]">TODO: Pricing data is unavailable. Connect the verified Sanity pricing table.</div>;
  return <div className="overflow-hidden rounded-md border border-white/15 bg-white/[0.035] shadow-2xl"><div className="grid grid-cols-3 border-b border-white/10">{tabs.map((tab, index) => <button key={tab} type="button" onClick={() => onColumnChange(index + 1)} className={`px-3 py-4 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.1em] transition ${activeColumn === index + 1 ? "bg-[#f6c500] font-bold text-black" : "text-white/65 hover:bg-white/5"}`}>{tab}</button>)}</div><div className="grid grid-cols-[1fr_auto] gap-x-5 border-b border-white/10 px-5 py-3 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.16em] text-white/45"><span>Model</span><span>{pricing.headers[activeColumn]}</span></div><div ref={bodyRef} onMouseDown={prDown} onMouseUp={prLeave} onMouseLeave={prLeave} className="max-h-[430px] touch-pan-y overflow-y-auto overscroll-contain cursor-grab select-none [scrollbar-width:thin] [scrollbar-color:#f6c500_rgba(255,255,255,0.08)] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-[#f6c500]/60 [&::-webkit-scrollbar-thumb:hover]:bg-[#f6c500]">{pricing.rows.map((row) => <div key={row[0]} className="grid grid-cols-[1fr_auto] gap-x-5 border-b border-white/[0.07] px-5 py-3.5 text-[12px] last:border-b-0 sm:text-[13px]"><span className="pr-3 text-white/75">{row[0]}</span><strong className="whitespace-nowrap font-medium text-[#f6c500]">{row[activeColumn]}</strong></div>)}</div><p className="border-t border-white/10 px-5 py-3 text-[10px] text-white/40">Prices last updated in the project data: July 2026. Confirm the final rate before booking.</p></div>;
}

function InfoPanel({ items }: { items: string[] }) {
  const logo = getBrandLogo("rent-lamborghini-dubai");
  const highlights = [
    items.find((item) => item.toLowerCase().includes("basic insurance")) ?? "Basic insurance included",
    "250 KM per day",
    "Free delivery in Dubai",
    "Free pick-up",
    items.find((item) => item.includes("24/7")) ?? "24/7 customer support",
    "Cash, card and crypto accepted",
  ];

  return (
    <article className="relative min-h-[365px] overflow-hidden rounded-md border border-black bg-gradient-to-br from-[#080b0e] to-[#15191d] p-7 text-white shadow-sm md:p-8">
      {logo && (
        <Image
          src={logo.src}
          alt=""
          width={220}
          height={220}
          className="pointer-events-none absolute bottom-4 right-2 h-48 w-48 object-contain opacity-[0.07] grayscale"
        />
      )}
      <h2 className="relative mb-7 text-[22px] font-semibold">What&apos;s Included</h2>
      <ul className="relative space-y-4">
        {highlights.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[13px] leading-5 text-white/75">
            <CheckIcon />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function RequirementsPanel({ requirements }: { requirements: string[] }) {
  const [activeTab, setActiveTab] = useState<"resident" | "tourist">("resident");
  const residentText = requirements.find((item) => item.toLowerCase().startsWith("for uae residents")) ?? "";
  const touristText = requirements.find((item) => item.toLowerCase().startsWith("for tourists")) ?? "";
  const residentItems = ["Emirates ID / Passport", "UAE Driving License", "Minimum Age 21 Years"];
  const touristItems = ["Passport and Visit Visa", "Driving License", "IDP Where Required", "Minimum Age 21 Years"];
  const visibleItems = activeTab === "resident" ? residentItems : touristItems;
  const sourceText = activeTab === "resident" ? residentText : touristText;

  return (
    <article className="min-h-[365px] rounded-md border border-black/10 bg-[#f4f4f3] p-7 shadow-sm md:p-8">
      <h2 className="mb-5 text-[22px] font-semibold">Requirements</h2>
      <div className="mb-6 grid grid-cols-2 border-b border-black/10" role="tablist" aria-label="Rental document requirements">
        <button type="button" role="tab" aria-selected={activeTab === "resident"} onClick={() => setActiveTab("resident")} className={`relative pb-3 text-[10px] font-bold uppercase tracking-[0.08em] ${activeTab === "resident" ? "text-black" : "text-black/45"}`}>
          UAE Residents
          {activeTab === "resident" && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#e5b500]" />}
        </button>
        <button type="button" role="tab" aria-selected={activeTab === "tourist"} onClick={() => setActiveTab("tourist")} className={`relative pb-3 text-[10px] font-bold uppercase tracking-[0.08em] ${activeTab === "tourist" ? "text-black" : "text-black/45"}`}>
          Tourists
          {activeTab === "tourist" && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#e5b500]" />}
        </button>
      </div>
      <ul className="space-y-4">
        {visibleItems.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[13px] font-medium"><CheckIcon /><span>{item}</span></li>
        ))}
      </ul>
      <p className="sr-only">{sourceText}</p>
      <p className="mt-7 text-[11px] leading-5 text-[var(--ink-dark-lo)]">Documents must be valid. An International Driving Permit applies where required.</p>
    </article>
  );
}

function StepsPanel() {
  return (
    <article className="min-h-[365px] rounded-md border border-black/10 bg-white p-7 shadow-sm md:p-8">
      <h2 className="mb-6 text-[22px] font-semibold">How to Rent</h2>
      <ol className="space-y-5">
        {RENTAL_STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-black text-[12px] font-bold text-[#f6c500] ring-1 ring-[#e5b500] ring-offset-2 ring-offset-white">{index + 1}</span>
            <span><strong className="block text-[14px] leading-5">{step.title}</strong><span className="mt-0.5 block text-[12px] leading-5 text-[var(--ink-dark-lo)]">{step.detail}</span></span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function PolicyCard({ title, body }: { title: string; body: string }) {
  return <article className="bg-white p-7 md:p-9"><span className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-[#fff5c0] text-[#9b7415]"><FeatureIcon kind={title === "Insurance" ? "insurance" : title === "Mileage Policy" ? "mileage" : "support"} /></span><h2 className="text-[19px] font-semibold">{title}</h2><p className="mt-3 text-[13px] leading-6 text-[var(--ink-dark-lo)]">{body}</p></article>;
}
