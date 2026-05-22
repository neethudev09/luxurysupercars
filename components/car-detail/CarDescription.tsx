import type { Car } from "@/lib/fleet";
import Reveal from "@/components/motion/Reveal";
import MaskHeading from "@/components/motion/MaskHeading";

const categoryNoun: Record<Car["category"], string> = {
  sports: "supercar",
  convertible: "convertible",
  luxury: "luxury car",
  suv: "luxury SUV",
};

/**
 * SEO long-form copy. This is templated for now so every car has on-page text
 * for search visibility. The SEO operator should replace per-car via CMS once
 * Sanity is wired up (each `description` paragraph becomes a Portable Text field).
 */
function defaultDescription(car: Car): string[] {
  const noun = categoryNoun[car.category];

  // Compose the performance sentence only from clauses we actually have
  // data for — if engine + 0-100 are both missing, drop the whole clause.
  const perfBits: string[] = [];
  if (car.engine) perfBits.push(`a ${car.engine} engine`);
  if (car.horsepower) perfBits.push(car.horsepower);
  let lead = `The ${car.name} is one of the most sought-after ${noun}s available for rent in Dubai.`;
  if (perfBits.length && car.zeroToHundred) {
    lead += ` With ${perfBits.join(" and ")}, it accelerates from 0–100 km/h in just ${car.zeroToHundred} — the kind of performance that turns an everyday drive down Sheikh Zayed Road into something cinematic.`;
  } else if (perfBits.length) {
    lead += ` With ${perfBits.join(" and ")}, it carries the kind of presence that turns an everyday drive down Sheikh Zayed Road into something cinematic.`;
  } else {
    lead += ` It carries the kind of presence that turns an everyday drive down Sheikh Zayed Road into something cinematic.`;
  }
  lead += ` From the moment you pick up the keys, this ${noun} delivers an experience defined by precision engineering, uncompromising luxury, and the unmistakable presence that only a marque of this calibre can offer.`;

  const priceClause = car.price > 0
    ? ` Pricing starts from AED ${car.price.toLocaleString()} per day with transparent, no-hidden-fee rates and multiple secure payment options.`
    : ` Pricing is transparent with no hidden fees and multiple secure payment options.`;

  return [
    lead,
    `At Luxury Supercars Dubai, every ${car.name} rental includes free delivery anywhere across Dubai, full insurance, 24/7 concierge support, and the flexibility to extend by the hour, day, or week. Whether you're touring Palm Jumeirah, attending a high-profile event, or making the drive from Downtown to the Hajar Mountains, our team handles every detail so you can focus on the road.${priceClause}`,
    `Dubai is a city built for cars like the ${car.name} — wide arterial roads, dramatic skyline backdrops, and the open desert just minutes away. Whether this is your first time renting an exotic in the UAE or you're a returning client, the team at Luxury Supercars Dubai brings over a decade of experience curating bespoke rental experiences for visitors, residents, and business travellers alike. Reserve your ${car.name} today and discover why we're consistently rated 4.9★ across 377+ Google reviews.`,
  ];
}

export default function CarDescription({ car }: { car: Car }) {
  const paragraphs = car.description?.length ? car.description : defaultDescription(car);

  return (
    <section className="bg-[var(--bg-pearl)] text-[var(--ink-dark-hi)] py-20 md:py-24">
      <div className="container-car grid md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-4">
          <MaskHeading
            text={`About the ${car.name}`}
            as="h2"
            className="font-[var(--font-display)] text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.1] tracking-[-0.018em] text-[var(--ink-dark-hi)]"
            staggerMs={40}
            breakAfterBold={false}
          />
        </div>
        <div className="md:col-span-8 space-y-5">
          {paragraphs.map((p, i) => (
            <Reveal as="p" key={i} delay={i * 110} className="rise text-[17px] leading-[1.75] text-[var(--ink-dark-hi)]/85">
              {p}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
