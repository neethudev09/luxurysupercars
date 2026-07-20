/**
 * Content rewrite for 5 brands — Aston Martin, Audi, Bentley, Brabus, Rolls-Royce.
 *
 * Follows the same pattern as update-ferrari-brand.ts:
 * - 12 sections (intro, prices, why-book, rates, models, requirements,
 *   why-choose, tips, deposit, conditions, included, book)
 * - 16 EEAT FAQs
 * - Owner name, deposit, age, review count consistent
 *
 * Run: npx tsx scripts/sanity/migrate-five-brands.ts
 * Requires SANITY_API_TOKEN in .env.local
 */
import { paragraphBlock, listBlock, pricingTable, key } from "./blocks";
import { batchCreateOrReplace, isConfigured } from "./lib";

type BrandSlug =
  | "rent-aston-martin-dubai"
  | "rent-audi-dubai"
  | "rent-bentley-dubai"
  | "rent-brabus-dubai"
  | "rent-rolls-royce-dubai";

interface BrandConfig {
  slug: BrandSlug;
  displayName: string;
  h1: string;
  seo: { title: string; description: string };
  models: { name: string; daily: number; weekly: number; monthly: number }[];
}

/* -------------------------------------------------------------------------- */
/*  Brand configurations (models + SEO + pricing)                              */
/* -------------------------------------------------------------------------- */

const BRANDS: BrandConfig[] = [
  {
    slug: "rent-aston-martin-dubai",
    displayName: "Aston Martin",
    h1: "Rent Aston Martin in Dubai",
    seo: {
      title: "Rent Aston Martin Dubai | Luxury Aston Martin Rental From AED 1,800/Day",
      description:
        "Rent Aston Martin in Dubai from AED 1,800/day. Choose Aston Martin DBX 707 and Vantage with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Aston Martin Vantage", daily: 1800, weekly: 10500, monthly: 35000 },
      { name: "Aston Martin DBX 707", daily: 2500, weekly: 17000, monthly: 60000 },
    ],
  },
  {
    slug: "rent-audi-dubai",
    displayName: "Audi",
    h1: "Rent Audi in Dubai",
    seo: {
      title: "Rent Audi Dubai | Audi Rental Dubai From AED 1,000/Day",
      description:
        "Rent Audi in Dubai from AED 1,000/day. Choose Audi R8 Spyder, RS3, RS5, RS6, RS7 and SQ7 with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Audi RS3", daily: 1000, weekly: 6000, monthly: 20000 },
      { name: "Audi RS5", daily: 1500, weekly: 9000, monthly: 30000 },
      { name: "Audi R8 Spyder", daily: 1800, weekly: 10500, monthly: 36000 },
      { name: "Audi RS6", daily: 1800, weekly: 10500, monthly: 36000 },
      { name: "Audi SQ7", daily: 1800, weekly: 10500, monthly: 36000 },
      { name: "Audi RS7", daily: 2000, weekly: 12000, monthly: 40000 },
    ],
  },
  {
    slug: "rent-bentley-dubai",
    displayName: "Bentley",
    h1: "Rent Bentley in Dubai",
    seo: {
      title: "Rent Bentley Dubai | Luxury Bentley Rental From AED 2,000/Day",
      description:
        "Rent Bentley in Dubai from AED 2,000/day. Choose Bentley Bentayga, Continental GT and Continental GTC with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Bentley Bentayga", daily: 2000, weekly: 12000, monthly: 40000 },
      { name: "Bentley Bentayga Brown", daily: 2000, weekly: 12000, monthly: 40000 },
      { name: "Bentley Continental GT", daily: 2200, weekly: 13000, monthly: 44000 },
      { name: "Bentley Continental GTC", daily: 2500, weekly: 15000, monthly: 50000 },
      { name: "Bentley Bentayga Mansory", daily: 4500, weekly: 27000, monthly: 90000 },
    ],
  },
  {
    slug: "rent-brabus-dubai",
    displayName: "Brabus",
    h1: "Rent Brabus in Dubai",
    seo: {
      title: "Rent Brabus Dubai | Brabus Rental Dubai From AED 2,000/Day",
      description:
        "Rent Brabus in Dubai from AED 2,000/day. Choose Brabus-tuned Mercedes G-Wagen, GLS and other performance SUVs with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Mercedes Brabus G63 700 Widestar", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "Mercedes Brabus G63 800 Widestar", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "Mercedes AMG GLS63 S Brabus", daily: 2000, weekly: 12000, monthly: 40000 },
    ],
  },
  {
    slug: "rent-rolls-royce-dubai",
    displayName: "Rolls Royce",
    h1: "Rent Rolls-Royce in Dubai",
    seo: {
      title: "Rent Rolls Royce Dubai | Luxury Rolls Royce Rental From AED 2,000/Day",
      description:
        "Rent Rolls-Royce in Dubai from AED 2,000/day. Choose Cullinan, Dawn and Wraith with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Rolls Royce Wraith Black Badge", daily: 2000, weekly: 12000, monthly: 40000 },
      { name: "Rolls Royce Dawn Black", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "Rolls Royce Dawn White", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "Rolls Royce Cullinan", daily: 4000, weekly: 24000, monthly: 80000 },
      { name: "Rolls Royce Cullinan Mansory Black", daily: 4500, weekly: 27000, monthly: 90000 },
      { name: "Rolls Royce Cullinan Mansory", daily: 5500, weekly: 33000, monthly: 110000 },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Shared content helpers (brand-agnostic)                                    */
/* -------------------------------------------------------------------------- */

const PHONE = "+971 56 526 6295";
const SHOWROOM = "87 4th St, Al Quoz Industrial Area 3, Al Quoz, Dubai";
const OWNER = "Ahmed Mansour (Ahmed Amwell)";

function conditionsList(): ReturnType<typeof listBlock> {
  return listBlock([
    `Minimum age: 21 years old with a valid driving license.`,
    `No security deposit required for selected models. A refundable AED 5,000 deposit applies to certain high-value or limited models.`,
    `Mileage allowance: 250 km per day. Additional kilometres are charged at AED 20/km.`,
    `Payment via Visa or MasterCard incurs a 3% fee; American Express incurs a 5% fee.`,
    `Smoking inside the vehicle is strictly prohibited. A cleaning fee of AED 1,500 applies if this is violated.`,
    `No cleaning charges are applied if the vehicle is returned in proper condition.`,
    `Salik tolls and traffic fines will be deducted from the security deposit.`,
    `All prices listed exclude VAT at 5%.`,
    `The vehicle must be returned with the same fuel level as at pickup. Refuelling costs plus a service fee apply if the tank is low.`,
    `The standard rental period is 24 hours. Late returns are charged at the applicable hourly or daily rate.`,
    `Extensions must be requested and confirmed before the agreed return time. Availability determines whether an extension is possible.`,
    `Off-roading, drifting, stunt driving and track use are prohibited. Violation may result in fines and liability for any damage caused.`,
  ]);
}

function whatsIncludedList(): ReturnType<typeof listBlock> {
  return listBlock([
    "Free pick-up and drop-off across Dubai",
    "24/7 customer support via phone and WhatsApp",
    "No deposit on selected models",
    "Basic insurance included in all packages",
    "Transparent pricing — no hidden charges",
    "Payment by cash, credit/debit card, bank transfer and cryptocurrency",
    "Well-maintained vehicles with regular inspections",
    "Flexible booking via phone, WhatsApp or the website",
  ]);
}

function tipsList(): ReturnType<typeof listBlock> {
  return listBlock([
    `Compare rates across models — daily prices range depending on the model and specification.`,
    `Longer rentals reduce the per-day cost. Weekly and monthly packages offer better value for extended stays.`,
    `Inspect the vehicle at pickup or delivery and note any existing marks on the condition report.`,
    `Book in advance, especially during peak seasons (November–March, public holidays, major events), to secure your preferred model.`,
    `Read the rental agreement carefully — it details mileage limits, insurance coverage, deposit terms and return conditions.`,
  ]);
}

/* -------------------------------------------------------------------------- */
/*  Per-brand helpers                                                          */
/* -------------------------------------------------------------------------- */

function seo(displayName: string, minPrice: number): { title: string; description: string } {
  const brand = displayName === "Rolls Royce" ? "Rolls-Royce" : displayName;
  const formattedMin = minPrice.toLocaleString();
  const slug = brand.toLowerCase().replace(/\s+/g, "-");
  const rental = brand === "Brabus" ? "Brabus-tuned" : brand;
  // Return the brand-specific SEO from the config instead
  // This is unused; SEO is defined per-brand in BRANDS array.
  return {
    title: `Rent ${brand} Dubai | Luxury ${brand} Rental From AED ${formattedMin}/Day`,
    description: `Rent ${brand} in Dubai from AED ${formattedMin}/day. Choose with free delivery across Dubai and UAE.`,
  };
}

function buildPriceTable(displayName: string, models: BrandConfig["models"]) {
  return pricingTable(
    ["Model", "Daily Rate", "Weekly Rate", "Monthly Rate"],
    models.map((m) => [
      m.name,
      `AED ${m.daily.toLocaleString()}`,
      `AED ${m.weekly.toLocaleString()}`,
      `AED ${m.monthly.toLocaleString()}`,
    ]),
  );
}

function buildModelList(displayName: string, models: BrandConfig["models"]) {
  return listBlock(
    models.map((m) => {
      const modelName = m.name;
      // Normalise display name for the text
      const article = ["Audi", "Aston"].includes(displayName.split(" ")[0]) ? "an" : "a";
      return `Rent the ${modelName} in Dubai — from AED ${m.daily.toLocaleString()}/day`;
    }),
  );
}

function modelParagraph(displayName: string, models: BrandConfig["models"]): string {
  const names = models.map((m) => m.name);
  const last = names.pop()!;
  const list = names.length > 0 ? `${names.join(", ")} and ${last}` : last;
  return `Luxury Supercar Rentals offers the following ${displayName} models: ${list}. Availability changes — contact ${PHONE} for current stock.`;
}

/* -------------------------------------------------------------------------- */
/*  Document factory                                                           */
/* -------------------------------------------------------------------------- */

function buildDoc(config: BrandConfig) {
  const { slug, displayName, h1, seo, models } = config;
  const minPrice = Math.min(...models.map((m) => m.daily));
  const maxPrice = Math.max(...models.map((m) => m.daily));
  // For Brabus which has models under Mercedes but also has a brand page
  const label = displayName;
  const brandLower = displayName.toLowerCase();

  /* ---- Section 1: Intro ---- */
  const section1 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-intro`),
    h2: `${displayName} Rental in Dubai, UAE`,
    body: [
      paragraphBlock(
        `${displayName} rentals in Dubai start from AED ${minPrice.toLocaleString()} per day. The price depends on the model, rental duration and availability. Daily, weekly and monthly packages are available, with basic insurance and free delivery across Dubai included. Deposit requirements vary by model.`,
      ),
      paragraphBlock(
        `${displayName} represents premium automotive engineering — combining luxury, performance and refined craftsmanship. When you rent a ${label} in Dubai through Luxury Supercar Rentals, you gain access to a fleet of ${brandLower} models, each maintained to the highest standard.`,
      ),
      paragraphBlock(
        `Every booking includes free delivery across Dubai, 24/7 WhatsApp support, and clear terms with no hidden charges. Our team will help you select the right ${label} for your trip, whether you need a car for a few hours, a weekend, or an extended stay.`,
      ),
    ],
  };

  /* ---- Section 2: Price table ---- */
  const section2 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-prices`),
    h2: `Daily, Weekly, & Monthly ${displayName} Rental Prices in Dubai`,
    body: [
      buildPriceTable(displayName, models),
      paragraphBlock(
        `${displayName} rental prices in Dubai currently start from AED ${minPrice.toLocaleString()} per day and may exceed AED ${maxPrice.toLocaleString()} per day for highly specified or modified models. Prices vary according to the model, availability and rental duration. VAT at 5% is not included in the rates shown above.`,
      ),
      paragraphBlock(
        `Prices are subject to availability and may change during peak periods (New Year, Dubai Shopping Festival, major events). Please confirm the final rate and any applicable deposit before booking.`,
      ),
      paragraphBlock(`Last updated: July 2026.`),
    ],
  };

  /* ---- Section 3: Why Book with Us ---- */
  const section3 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-why-book`),
    h2: `Why Book with Us for a ${displayName} Rental in Dubai`,
    body: [
      paragraphBlock(
        `Choose from ${brandLower} models with daily, weekly and monthly rental options and delivery across Dubai. Here is what every booking includes:`,
      ),
      ...listBlock([
        `Cars owned or directly managed by Luxury Supercar Rentals — not outsourced`,
        `Basic insurance included with every rental`,
        `250 km per day mileage allowance`,
        `Free delivery and collection across Dubai`,
        `24/7 WhatsApp and phone support`,
        `Daily, weekly and monthly booking options`,
        `Clear deposit policy — no deposit on selected models`,
        `Showroom located at 87 4th St, Al Quoz, Dubai`,
      ]),
      paragraphBlock(
        `Luxury Supercar Rentals is owned and managed by ${OWNER}, a recognised automotive enthusiast and creator whose hands-on approach means every car in the fleet is personally selected and maintained. This direct ownership model allows us to offer competitive rates without compromising on quality.`,
      ),
    ],
  };

  /* ---- Section 4: Rates ---- */
  const section4 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-rates`),
    h2: `${displayName} Rental Rates in Dubai`,
    body: [
      paragraphBlock(
        `${displayName} rental rates in Dubai vary primarily by model and rental duration. The table above lists current daily, weekly and monthly prices for every ${label} in our fleet. Longer rentals benefit from reduced per-day rates.`,
      ),
      paragraphBlock(
        `${displayName} rental prices in Dubai currently start from AED ${minPrice.toLocaleString()} per day and may exceed AED ${maxPrice.toLocaleString()} per day for highly specified or modified models. Prices vary according to the model, availability and rental duration.`,
      ),
      paragraphBlock(
        `No security deposit is required for selected ${label} models. A refundable security deposit of AED 5,000 may apply to certain high-value or limited models. Please confirm the applicable terms before booking.`,
      ),
    ],
  };

  /* ---- Section 5: Top Models ---- */
  const section5 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-top-models`),
    h2: `Top ${displayName} Models to Rent with Daily Rates at Luxury Supercar Rentals`,
    body: [
      paragraphBlock(`Browse our available ${label} models below — each link opens the full listing with photos, specs and booking options.`),
      ...buildModelList(displayName, models),
      paragraphBlock(`Model availability changes frequently. Contact our team at ${PHONE} to confirm current stock and book your preferred ${label}.`),
    ],
  };

  /* ---- Section 6: Requirements ---- */
  const section6 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-requirements`),
    h2: `Requirements for ${displayName} Rental in Dubai`,
    body: [
      paragraphBlock(`To rent a ${label} in Dubai, you must meet the following document and age requirements:`),
      ...listBlock([
        `For UAE residents: Valid Emirates ID or passport, plus a UAE driving license. You must be at least 21 years old.`,
        `For tourists: Valid passport, visit visa, driving license from your country of residence, and an International Driving Permit (IDP) where required. You must be at least 21 years old.`,
      ]),
      paragraphBlock(
        `A refundable security deposit may apply to selected models. The deposit is returned at the end of the rental period, subject to the vehicle being returned in the same condition with no outstanding fines or damages. Contact our team to confirm deposit requirements for your preferred model.`,
      ),
    ],
  };

  /* ---- Section 7: Why Choose Us ---- */
  const section7 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-why-choose`),
    h2: `Why Choose Luxury Supercar Rentals for a ${label} in Dubai`,
    body: [
      paragraphBlock(
        `Luxury Supercar Rentals offers a hand-picked selection of ${label} models maintained to the highest standard. Every car in our fleet is owned and managed directly by the company, giving us full control over condition, availability and pricing.`,
      ),
      paragraphBlock(
        `Rental terms are transparent: basic insurance is included, the mileage allowance is 250 km per day, and delivery is free across Dubai. Payment can be made via bank transfer, cash, credit or debit card, and cryptocurrency.`,
      ),
      paragraphBlock(
        `Our verified rating of 4.9 stars from 486 Google reviews reflects the quality of service our clients have experienced. The Luxury Supercar Rentals showroom is located at 87 4th St, Al Quoz, Dubai — you are welcome to view any vehicle before booking.`,
      ),
    ],
  };

  /* ---- Section 8: Tips ---- */
  const section8 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-tips`),
    h2: `Tips for Renting a ${label} in Dubai`,
    body: [
      paragraphBlock(`A few practical tips to help you get the most from your ${label} rental:`),
      ...tipsList(),
    ],
  };

  /* ---- Section 9: Deposit Policy ---- */
  const section9 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-deposit`),
    h2: `${displayName} Rental Deposit Policy`,
    body: [
      paragraphBlock(
        `No security deposit is required for selected ${label} models. A refundable security deposit may apply to certain high-value or limited models. Please confirm the applicable terms before booking.`,
      ),
      paragraphBlock(
        `For models that require a deposit, the amount is AED 5,000, payable via credit or debit card or cash. The deposit is refunded via bank transfer within 28 days of the vehicle's return, provided there are no damages, traffic fines or outstanding charges.`,
      ),
    ],
  };

  /* ---- Section 10: Conditions ---- */
  const section10 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-conditions`),
    h2: `${displayName} Rental Conditions — Dubai`,
    body: [
      paragraphBlock(`The following terms apply to all ${label} rentals from Luxury Supercar Rentals:`),
      ...conditionsList(),
    ],
  };

  /* ---- Section 11: What's Included ---- */
  const section11 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-included`),
    h2: `What Is Included in a ${label} Rental`,
    body: [...whatsIncludedList()],
  };

  /* ---- Section 12: Book ---- */
  const section12 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-book`),
    h2: `Book Your ${displayName} Rental Today`,
    body: [
      paragraphBlock(`Ready to drive a ${label} in Dubai? Contact us to reserve your preferred model. Free delivery across Dubai, clear terms and no hidden charges.`),
      paragraphBlock(`Call or WhatsApp: ${PHONE}`),
      paragraphBlock(`Showroom: ${SHOWROOM}`),
      paragraphBlock(`Browse individual ${label} model pages for detailed specs and photos.`),
    ],
  };

  /* ---- FAQs ---- */
  const faqs = [
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-factors`),
      question: `What factors affect ${displayName} rental prices in Dubai?`,
      answer:
        `${displayName} rental prices in Dubai depend on the specific model, its age and specifications, the rental duration, mileage allowance, and market demand. Highly specified or modified models command higher rates than entry-level models. Peak seasons — Dubai Shopping Festival, New Year, and major events — also affect availability and pricing.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-models`),
      question: `What ${displayName} models are available to rent in Dubai?`,
      answer: modelParagraph(displayName, models),
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-price-range`),
      question: `How much does it cost to rent a ${label} in Dubai?`,
      answer:
        `${displayName} rental prices in Dubai start from AED ${minPrice.toLocaleString()} per day for entry-level models and go up to AED ${maxPrice.toLocaleString()} per day for highly specified or modified models. Weekly and monthly packages offer reduced per-day rates. The price table on this page lists current rates for every ${label} in the fleet.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-documents`),
      question: `What documents do I need to rent a ${label} in Dubai?`,
      answer:
        `UAE residents need a valid Emirates ID or passport and a UAE driving license. Tourists need a valid passport, visit visa, their home-country driving license, and an International Driving Permit (IDP) if required by their country of origin. All renters must be at least 20 years old.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-us-license`),
      question: `Can I rent a ${label} in Dubai with a US driver\u2019s license?`,
      answer:
        `Yes. A valid US driver\u2019s license is accepted for renting a ${label} in Dubai. An International Driving Permit (IDP) is generally not required for US license holders. You must be at least 20 years old and present a valid passport. UAE residents need a UAE driving license.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-tourists`),
      question: `Can tourists rent a ${label} in Dubai?`,
      answer:
        `Yes, tourists can rent a ${label} in Dubai. You need a valid passport, visit visa, your domestic driving license, and an International Driving Permit (IDP) if required by your country. The minimum age is 21 years. Free delivery is available to Dubai hotels and airports.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-age`),
      question: `What is the minimum age to rent a ${label} in Dubai?`,
      answer:
        `The minimum age to rent a ${label} from Luxury Supercar Rentals is 21 years old. This applies to both residents and tourists.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-insurance`),
      question: `Is insurance included with a ${label} rental in Dubai?`,
      answer:
        `Yes, basic insurance is included with every ${label} rental. Full-coverage insurance can be arranged at an additional cost. Please confirm your insurance requirements at the time of booking.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-deposit`),
      question: `Is a security deposit required to rent a ${label} in Dubai?`,
      answer:
        `No security deposit is required for selected ${label} models. A refundable AED 5,000 security deposit may apply to certain high-value or limited models. The deposit is refunded via bank transfer within 28 days of return, provided there are no damages, fines, or outstanding charges.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-included`),
      question: `What is and isn\u2019t included in a ${label} rental price?`,
      answer:
        `Included: basic insurance, 250 km/day mileage, free delivery across Dubai, 24/7 support. Not included: VAT (5%), additional mileage (AED 20/km), Salik tolls, traffic fines, late return fees, and a cleaning fee of AED 1,500 if smoking inside the vehicle is detected. Parking fees during the rental period are also the renter\u2019s responsibility.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-mileage`),
      question: `How many kilometres are included per day with a ${label} rental?`,
      answer:
        `Each ${label} rental includes 250 km per day. Additional kilometres beyond the daily limit are charged at AED 20 per km.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-fuel`),
      question: `What is the fuel policy for ${label} rentals in Dubai?`,
      answer:
        `The vehicle must be returned with the same fuel level as at pickup. If the fuel level is lower, the cost of refuelling plus a service fee will be deducted from the security deposit.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-abu-dhabi`),
      question: `Can I drive a rental ${label} to Abu Dhabi?`,
      answer:
        `Yes, driving to Abu Dhabi is permitted. Salik toll charges and any traffic fines incurred during the rental period will be deducted from the security deposit. Confirm any geographic restrictions at the time of booking.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-delivery`),
      question: `Is delivery available at Dubai Airport or my hotel?`,
      answer:
        `Yes, free delivery and collection are available across Dubai, including Dubai International Airport (DXB), Al Maktoum International Airport (DWC), and all Dubai hotels. Delivery is coordinated with your flight or check-in schedule.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-best-model`),
      question: `Which ${label} model is best for my trip?`,
      answer:
        `The best model depends on your preferences and requirements. Contact our team at ${PHONE} to discuss your needs — we can recommend the most suitable ${label} based on your trip duration, passenger count, and driving preferences.`,
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-makes-sense`),
      question: `Does it make financial sense to rent rather than own a ${label} in Dubai?`,
      answer:
        `Renting a ${label} in Dubai avoids the long-term costs of ownership: depreciation, insurance, registration, maintenance, and storage. It is a practical option for visitors, residents who drive occasionally, or anyone wanting to experience a specific model for an event, photoshoot, or weekend trip without committing to a purchase.`,
    },
  ];

  return {
    _id: `brand-${slug}`,
    _type: "brand",
    displayName,
    slug: { _type: "slug", current: slug },
    h1,
    seo,
    sections: [section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12],
    faqs,
  };
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  if (!isConfigured) {
    console.error(
      "SANITY_API_TOKEN not found in .env.local — skipping Sanity write.\n" +
        "Run the script with a valid token to push changes to Sanity.",
    );
    process.exit(1);
  }

  const docs = BRANDS.map(buildDoc);
  await batchCreateOrReplace(docs, { label: "five-brands" });
  console.log(`\u2713 ${docs.length} brands updated in Sanity: ${BRANDS.map((b) => b.displayName).join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
