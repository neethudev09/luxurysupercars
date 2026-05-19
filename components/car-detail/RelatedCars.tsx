import Link from "next/link";
import type { Car } from "@/lib/fleet";
import CarCard from "@/components/cards/CarCard";
import MaskHeading from "@/components/motion/MaskHeading";

const categoryLabel: Record<Car["category"], string> = {
  sports: "Sports",
  convertible: "Convertibles",
  luxury: "Luxury",
  suv: "SUVs",
};

const categoryHref: Record<Car["category"], string> = {
  sports: "/rent-sports-cars-dubai",
  convertible: "/rent-convertible-cars-dubai",
  luxury: "/rent-luxury-cars-dubai",
  suv: "/rent-suv-cars-dubai",
};

interface RelatedCarsProps {
  cars: Car[];
  category: Car["category"];
}

export default function RelatedCars({ cars, category }: RelatedCarsProps) {
  if (cars.length === 0) return null;
  return (
    <section className="bg-[var(--bg-obsidian)] py-16 md:py-20 border-t border-white/5">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-10">
          <MaskHeading
            text={`More ${categoryLabel[category]} to consider`}
            as="h2"
            className="md:col-span-8 font-[var(--font-display)] text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.1] tracking-[-0.018em] text-[var(--ink-hi)]"
            staggerMs={40}
            breakAfterBold={false}
          />
          <Link
            href={categoryHref[category]}
            className="md:col-span-4 md:text-right md:ml-auto inline-flex items-center gap-2 text-[12.5px] font-medium text-[var(--champagne)] hover:text-[var(--champagne-hi)] transition-colors"
          >
            View full {categoryLabel[category].toLowerCase()} fleet
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {cars.map((car, i) => (
            <CarCard key={`${car.brand}/${car.slug}`} car={car} theme="dark" index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
