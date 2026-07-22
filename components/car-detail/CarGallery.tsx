"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { getBrandLogo } from "@/lib/assets";

interface CarGalleryProps {
  images: string[];
  alt: string;
  category: string;
  brand: string;
}

export default function CarGallery({ images, alt, category, brand }: CarGalleryProps) {
  const brandLogo = getBrandLogo(brand);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1,
    align: "center",
    duration: 28,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Keyboard support: ← / →
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [emblaApi, onSelect, scrollPrev, scrollNext]);

  const showControls = images.length > 1;

  return (
    <section className="container-car pt-4 pb-10 md:pb-14">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Embla viewport */}
        <div
          className="overflow-hidden rounded-2xl md:rounded-[28px] border border-white/10 bg-black"
          ref={emblaRef}
        >
          <div className="flex">
            {images.map((src, i) => (
              <div key={`${src}-${i}`} className="relative shrink-0 grow-0 basis-full">
                <div className="relative aspect-[16/10] lg:aspect-[16/9]">
                  <Image
                    src={src}
                    alt={`${alt} — view ${i + 1}`}
                    fill
                    priority={i === 0}
                    // Every non-first slide loads eagerly too, so swiping
                    // through the carousel never shows the black slide
                    // background while an image downloads on demand.
                    loading={i === 0 ? undefined : "eager"}
                    sizes="(min-width: 1024px) 90vw, 100vw"
                    className="object-cover select-none"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand logo */}
        {brandLogo && (
          <div className="pointer-events-none absolute top-4 left-4 z-10 size-14 md:size-20 flex items-center justify-center p-2 md:p-3">
            <Image
              src={brandLogo.src}
              alt={`${brandLogo.name} logo`}
              width={80}
              height={40}
              className="object-contain w-full h-full"
            />
          </div>
        )}

        {/* Category chip */}
        <div className="pointer-events-none absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--champagne)]">
          {category}
        </div>

        {/* Counter */}
        {showControls && (
          <div className="pointer-events-none absolute bottom-4 right-4 z-10 inline-flex items-center rounded-full bg-black/55 backdrop-blur px-3 py-1.5 font-[var(--font-mono)] text-[11px] tracking-[0.12em] text-white/90">
            {String(selectedIndex + 1).padStart(2, "0")}{" / "}{String(images.length).padStart(2, "0")}
          </div>
        )}

        {/* Arrows */}
        {showControls && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 md:left-5 -translate-y-1/2 size-11 md:size-12 rounded-full bg-black/55 backdrop-blur border border-white/15 text-white hover:bg-black/70 hover:border-[var(--champagne)] transition-all disabled:opacity-30 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next image"
              className="absolute top-1/2 right-3 md:right-5 -translate-y-1/2 size-11 md:size-12 rounded-full bg-black/55 backdrop-blur border border-white/15 text-white hover:bg-black/70 hover:border-[var(--champagne)] transition-all disabled:opacity-30 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {showControls && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur px-3 py-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`size-1.5 rounded-full transition-all ${
                  selectedIndex === i
                    ? "bg-[var(--champagne)] w-5"
                    : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
