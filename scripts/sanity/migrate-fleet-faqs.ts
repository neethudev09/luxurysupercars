/**
 * Pushes unique, brand-specific FAQ items to each brand page in Sanity,
 * and type-specific FAQ items to each fleet type page.
 *
 * Run: npx tsx scripts/sanity/migrate-fleet-faqs.ts
 */
import { client, isConfigured } from "./lib";

// ── Brand FAQs ──────────────────────────────────────────────────────────
const BRANDS = [
  "Aston Martin", "Audi", "Bentley", "BMW", "Brabus", "Cadillac",
  "Ferrari", "Lamborghini", "Land Rover", "Mansory", "Maserati",
  "McLaren", "Mercedes", "Porsche", "Rolls Royce",
];

function brandFaqs(brand: string) {
  return [
    {
      question: `How much does it cost to rent a ${brand} in Dubai?`,
      answer: `${brand} rental prices in Dubai start from AED 1,500/day and go up to AED 11,000/day depending on the model and rental duration. We offer daily, weekly, and monthly rental options with free delivery across the UAE.`,
    },
    {
      question: `What ${brand} models are available for rent?`,
      answer: `Our ${brand} fleet includes the latest models from our showroom. Each vehicle is meticulously maintained and regularly serviced to ensure peak performance and reliability during your rental.`,
    },
    {
      question: `Do you offer free delivery for ${brand} rentals in Dubai?`,
      answer: `Yes, we provide free delivery and pickup for all ${brand} rentals across Dubai and the UAE. Whether you're at your hotel, residence, office, or the airport, we'll have your ${brand} ready at your preferred location and time.`,
    },
    {
      question: `What is the minimum age to rent a ${brand} in Dubai?`,
      answer: `The minimum age to rent a ${brand} in Dubai is 21 years. A valid driving license is required — international visitors can drive with a valid license from their home country or an International Driving Permit (IDP).`,
    },
    {
      question: `Is insurance included with ${brand} rentals?`,
      answer: `Yes, basic insurance is included with every ${brand} rental. We also offer comprehensive coverage options for added peace of mind.`,
    },
    {
      question: `Can I rent a ${brand} for a week or a month in Dubai?`,
      answer: `Absolutely. We offer flexible rental periods — daily, weekly, and monthly. Weekly and monthly rentals come with discounted rates, making them ideal for extended stays or business trips in Dubai.`,
    },
    {
      question: `How do I book a ${brand} rental in Dubai?`,
      answer: `Booking a ${brand} is quick and easy. You can reach us via WhatsApp, phone, or the contact form on our website. Our team will confirm availability, arrange free delivery, and have your car ready within hours.`,
    },
  ];
}

async function migrateBrandFaqs() {
  const brands = await client.fetch(`*[_type == "brand" && defined(slug.current)]{ _id, displayName, slug }`);
  console.log(`Found ${brands.length} brand documents`);

  for (const b of brands) {
    const brandName = b.displayName || b.slug.current;
    const faqs = brandFaqs(brandName);
    await client.patch(b._id).set({ faqs }).commit();
    console.log(`  ✓ ${brandName} — ${faqs.length} FAQs pushed`);
  }
}

// ── Type/Category Page FAQs ─────────────────────────────────────────────
const TYPE_PAGES: { id: string; label: string }[] = [
  { id: "page-rent-sports", label: "Sports Cars" },
  { id: "page-rent-convertible", label: "Convertible Cars" },
  { id: "page-rent-luxury", label: "Luxury Cars" },
  { id: "page-rent-suv", label: "SUVs" },
];

function typeFaqs(typeLabel: string) {
  return [
    {
      question: `How much does it cost to rent ${typeLabel.toLowerCase()} in Dubai?`,
      answer: `${typeLabel} rental prices in Dubai start from AED 1,500/day and go up to AED 11,000/day depending on the model and rental duration. We offer daily, weekly, and monthly options with free UAE delivery.`,
    },
    {
      question: `What ${typeLabel.toLowerCase()} models are available for rent?`,
      answer: `Our ${typeLabel.toLowerCase()} fleet includes the latest models from top brands like Ferrari, Lamborghini, Porsche, Bentley, and more. Each vehicle is meticulously maintained to ensure peak performance. Contact us for the current availability.`,
    },
    {
      question: `Do you offer free delivery for ${typeLabel.toLowerCase()} rentals?`,
      answer: `Yes, we provide free delivery and pickup for all ${typeLabel.toLowerCase()} rentals across Dubai and the UAE. Your car will be delivered to your hotel, residence, office, or the airport at your preferred time.`,
    },
    {
      question: `What is the minimum age to rent ${typeLabel.toLowerCase()} in Dubai?`,
      answer: `The minimum age to rent ${typeLabel.toLowerCase()} in Dubai is 21 years. A valid driving license is required — international visitors can drive with a valid license from their home country or an International Driving Permit (IDP).`,
    },
    {
      question: `Is insurance included with ${typeLabel.toLowerCase()} rentals?`,
      answer: `Yes, basic insurance is included with every ${typeLabel.toLowerCase()} rental. Comprehensive coverage options are also available for added peace of mind.`,
    },
    {
      question: `Can I rent ${typeLabel.toLowerCase()} for a week or a month in Dubai?`,
      answer: `Absolutely. We offer flexible rental periods — daily, weekly, and monthly — with discounted rates for longer durations. Perfect for extended stays, business trips, or special events in Dubai.`,
    },
    {
      question: `How do I book ${typeLabel.toLowerCase()} in Dubai?`,
      answer: `Booking is quick and easy. Reach us via WhatsApp, phone, or the contact form on our website. Our team will confirm availability, arrange free delivery, and have your car ready within hours.`,
    },
  ];
}

async function migrateTypeFaqs() {
  for (const p of TYPE_PAGES) {
    const faqs = typeFaqs(p.label);
    await client.patch(p.id).set({ fleetTypeContent: { faqs } }).commit();
    console.log(`  ✓ ${p.label} — ${faqs.length} FAQs pushed`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  if (!isConfigured) {
    console.error("Sanity client is not configured. Check your .env.local file.");
    process.exit(1);
  }

  console.log("Migrating brand FAQs...");
  await migrateBrandFaqs();

  console.log("\nMigrating type/category page FAQs...");
  await migrateTypeFaqs();

  console.log("\nDone! Now re-export to JSON: npx tsx scripts/sanity/export-to-json.ts");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
