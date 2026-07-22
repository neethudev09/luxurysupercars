/**
 * Content rewrite for 8 brands — BMW, Cadillac, Mansory, Maserati, McLaren,
 * Mercedes-Benz, Porsche, Range Rover.
 *
 * Follows the same pattern as migrate-five-brands.ts:
 * - 12 sections (intro, prices, why-book, rates, models, requirements,
 *   why-choose, tips, deposit, conditions, included, book)
 * - 16 EEAT FAQs
 * - Owner name, deposit, age, review count consistent
 *
 * Run: npx tsx scripts/sanity/migrate-eight-brands.ts
 * Requires SANITY_API_TOKEN in .env.local
 */
import { paragraphBlock, listBlock, pricingTable, key } from "./blocks";
import { batchCreateOrReplace, isConfigured } from "./lib";

type BrandSlug =
  | "rent-bmw-dubai"
  | "rent-cadillac-dubai"
  | "rent-mansory-dubai"
  | "rent-maserati-dubai"
  | "rent-mclaren-dubai"
  | "rent-mercedes-benz-dubai"
  | "rent-porsche-dubai"
  | "rent-range-rover-dubai";

interface BrandConfig {
  slug: BrandSlug;
  displayName: string;
  h1: string;
  seo: { title: string; description: string };
  models: { name: string; daily: number; weekly: number; monthly: number }[];
}

const BRANDS: BrandConfig[] = [
  {
    slug: "rent-bmw-dubai",
    displayName: "BMW",
    h1: "Rent BMW in Dubai",
    seo: {
      title: "Rent BMW Dubai | BMW Rental Dubai From AED 1,300/Day",
      description:
        "Rent BMW in Dubai from AED 1,300/day. Choose BMW 7 Series, M3, M4, M5, X6 M and X7 with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "BMW 735i", daily: 1300, weekly: 9000, monthly: 30000 },
      { name: "BMW M3 Competition", daily: 1300, weekly: 7800, monthly: 26000 },
      { name: "BMW M4 Competition", daily: 1400, weekly: 8400, monthly: 28000 },
      { name: "BMW M5 Competition", daily: 2000, weekly: 12500, monthly: 50000 },
      { name: "BMW X6 M Competition", daily: 1500, weekly: 8400, monthly: 35000 },
      { name: "BMW X6 M Competition Red", daily: 1500, weekly: 8400, monthly: 35000 },
      { name: "BMW X7 M50i", daily: 1300, weekly: 6000, monthly: 20000 },
      { name: "BMW X7 M60i", daily: 1500, weekly: 9000, monthly: 30000 },
    ],
  },
  {
    slug: "rent-cadillac-dubai",
    displayName: "Cadillac",
    h1: "Rent Cadillac in Dubai",
    seo: {
      title: "Rent Cadillac Dubai | Cadillac Rental Dubai From AED 1,300/Day",
      description:
        "Rent Cadillac in Dubai from AED 1,300/day. Choose Cadillac Escalade Sports Platinum with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Cadillac Escalade Sports Platinum", daily: 1300, weekly: 7800, monthly: 26000 },
    ],
  },
  {
    slug: "rent-mansory-dubai",
    displayName: "Mansory",
    h1: "Rent Mansory in Dubai",
    seo: {
      title: "Rent Mansory Dubai | Mansory Rental Dubai From AED 2,000/Day",
      description:
        "Rent Mansory-tuned luxury cars in Dubai from AED 2,000/day. Choose Bentley, Lamborghini, Range Rover and Rolls-Royce Mansory modifications with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Range Rover Vogue Mansory", daily: 2000, weekly: 12000, monthly: 40000 },
      { name: "Lamborghini Urus Mansory", daily: 4000, weekly: 24000, monthly: 80000 },
      { name: "Bentley Bentayga Mansory", daily: 4500, weekly: 27000, monthly: 90000 },
      { name: "Rolls Royce Cullinan Mansory Black", daily: 4500, weekly: 27000, monthly: 90000 },
      { name: "Rolls Royce Cullinan Mansory", daily: 5500, weekly: 33000, monthly: 110000 },
    ],
  },
  {
    slug: "rent-maserati-dubai",
    displayName: "Maserati",
    h1: "Rent Maserati in Dubai",
    seo: {
      title: "Rent Maserati Dubai | Maserati Rental Dubai From AED 2,000/Day",
      description:
        "Rent Maserati in Dubai from AED 2,000/day. Choose Maserati MC20 with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Maserati MC20", daily: 2000, weekly: 12000, monthly: 40000 },
    ],
  },
  {
    slug: "rent-mclaren-dubai",
    displayName: "McLaren",
    h1: "Rent McLaren in Dubai",
    seo: {
      title: "Rent McLaren Dubai | McLaren Rental Dubai From AED 2,500/Day",
      description:
        "Rent McLaren in Dubai from AED 2,500/day. Choose McLaren 765LT, 720S, Artura and more with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "McLaren 570S", daily: 2500, weekly: 15000, monthly: 50000 },
      { name: "McLaren 570S Spyder", daily: 2500, weekly: 15000, monthly: 50000 },
      { name: "McLaren Artura", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "McLaren 720S Performance", daily: 3500, weekly: 21000, monthly: 70000 },
      { name: "McLaren 720S Spyder White", daily: 3500, weekly: 21000, monthly: 70000 },
      { name: "McLaren Artura Spyder", daily: 3500, weekly: 21000, monthly: 70000 },
      { name: "McLaren Artura Spyder White", daily: 3500, weekly: 21000, monthly: 70000 },
      { name: "McLaren 720S", daily: 4000, weekly: 24000, monthly: 80000 },
      { name: "McLaren 720S Novitec Spyder", daily: 4000, weekly: 24000, monthly: 80000 },
      { name: "McLaren 750S Spyder", daily: 4500, weekly: 27000, monthly: 90000 },
      { name: "McLaren 750S Spyder (Tiffany Blue)", daily: 4500, weekly: 27000, monthly: 90000 },
      { name: "McLaren 765LT", daily: 5000, weekly: 30000, monthly: 100000 },
    ],
  },
  {
    slug: "rent-mercedes-benz-dubai",
    displayName: "Mercedes-Benz",
    h1: "Rent Mercedes Benz in Dubai",
    seo: {
      title: "Rent Mercedes-Benz Dubai | Mercedes-Benz Rental Dubai From AED 1,000/Day",
      description:
        "Rent Mercedes-Benz in Dubai from AED 1,000/day. Choose AMG G63, GT63, GLS Maybach and more with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Mercedes Benz AMG GLC 63S Coupe", daily: 1300, weekly: 7800, monthly: 26000 },
      { name: "Mercedes Benz AMG GLE63s", daily: 1300, weekly: 7800, monthly: 26000 },
      { name: "Mercedes GLC 63S AMG Coupe", daily: 1300, weekly: 7800, monthly: 26000 },
      { name: "Mercedes Benz AMG C63", daily: 1500, weekly: 9000, monthly: 30000 },
      { name: "Mercedes Benz AMG GT63 S", daily: 1500, weekly: 9000, monthly: 30000 },
      { name: "Mercedes Benz AMG G63 (Matte Black)", daily: 1800, weekly: 10800, monthly: 36000 },
      { name: "Mercedes Benz AMG G63 Matte Gray", daily: 1800, weekly: 10800, monthly: 36000 },
      { name: "Mercedes Benz G63 AMG", daily: 1800, weekly: 10800, monthly: 36000 },
      { name: "Mercedes Benz G63 AMG Black", daily: 1800, weekly: 10800, monthly: 36000 },
      { name: "Mercedes Benz G63 AMG White", daily: 1800, weekly: 10800, monthly: 36000 },
      { name: "Mercedes V250 VIP Line", daily: 1800, weekly: 10800, monthly: 36000 },
      { name: "Mercedes Benz AMG GLS63 S BRABUS", daily: 2000, weekly: 12000, monthly: 40000 },
      { name: "Mercedes GLS600 Maybach", daily: 2000, weekly: 12000, monthly: 40000 },
      { name: "Mercedes Benz AMG GT63 Coupe", daily: 2200, weekly: 13200, monthly: 44000 },
      { name: "Mercedes Benz AMG G63 800 Widestar", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "Mercedes Brabus G63 700 Widestar", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "Mercedes Brabus G63 800 Widestar", daily: 3000, weekly: 18000, monthly: 60000 },
    ],
  },
  {
    slug: "rent-porsche-dubai",
    displayName: "Porsche",
    h1: "Rent Porsche in Dubai",
    seo: {
      title: "Rent Porsche Dubai | Porsche Rental Dubai From AED 1,000/Day",
      description:
        "Rent Porsche in Dubai from AED 1,000/day. Choose Porsche 911 GT3 RS, Turbo S, Cayenne and Macan with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Porsche Macan Sports", daily: 1000, weekly: 6000, monthly: 20000 },
      { name: "Porsche Cayenne Coupe", daily: 1300, weekly: 7800, monthly: 26000 },
      { name: "Porsche 911 Carrera S Spyder", daily: 1500, weekly: 9000, monthly: 30000 },
      { name: "Porsche 911 GT3", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "Porsche 911 Turbo S", daily: 3000, weekly: 18000, monthly: 60000 },
      { name: "Porsche 911 GT3 2026 (White)", daily: 3500, weekly: 21000, monthly: 70000 },
      { name: "Porsche 911 GT3 RS", daily: 6500, weekly: 39000, monthly: 130000 },
    ],
  },
  {
    slug: "rent-range-rover-dubai",
    displayName: "Range Rover",
    h1: "Rent Range Rover in Dubai",
    seo: {
      title: "Rent Range Rover Dubai | Range Rover Rental Dubai From AED 1,500/Day",
      description:
        "Rent Range Rover in Dubai from AED 1,500/day. Choose Range Rover Vogue HSE and Vogue Mansory with free delivery across Dubai and UAE.",
    },
    models: [
      { name: "Range Rover Vogue HSE", daily: 1500, weekly: 9000, monthly: 30000 },
      { name: "Range Rover Vogue Mansory", daily: 2000, weekly: 12000, monthly: 40000 },
    ],
  },
];

const PHONE = "+971 56 526 6295";
const SHOWROOM = "87 4th St - Al Qouz Ind.third - Al Quoz - Dubai";
const OWNER = "Ahmed Mansour (Ahmed Amwell)";

function conditionsList(): ReturnType<typeof listBlock> {
  return listBlock([
    "Minimum age: 21 years old with a valid driving license.",
    "No security deposit required for selected models. A refundable AED 5,000 deposit applies to certain high-value or limited models.",
    "Mileage allowance: 250 km per day. Additional kilometres are charged at AED 20/km.",
    "Payment via Visa or MasterCard incurs a 3% fee; American Express incurs a 5% fee.",
    "Smoking inside the vehicle is strictly prohibited. A cleaning fee of AED 1,500 applies if this is violated.",
    "No cleaning charges are applied if the vehicle is returned in proper condition.",
    "Salik tolls and traffic fines will be deducted from the security deposit.",
    "All prices listed exclude VAT at 5%.",
    "The vehicle must be returned with the same fuel level as at pickup. Refuelling costs plus a service fee apply if the tank is low.",
    "The standard rental period is 24 hours. Late returns are charged at the applicable hourly or daily rate.",
    "Extensions must be requested and confirmed before the agreed return time. Availability determines whether an extension is possible.",
    "Off-roading, drifting, stunt driving and track use are prohibited. Violation may result in fines and liability for any damage caused.",
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
    "Compare rates across models — daily prices range depending on the model and specification.",
    "Longer rentals reduce the per-day cost. Weekly and monthly packages offer better value for extended stays.",
    "Inspect the vehicle at pickup or delivery and note any existing marks on the condition report.",
    "Book in advance, especially during peak seasons (November–March, public holidays, major events), to secure your preferred model.",
    "Read the rental agreement carefully — it details mileage limits, insurance coverage, deposit terms and return conditions.",
  ]);
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
      return `Rent the ${m.name} in Dubai — from AED ${m.daily.toLocaleString()}/day`;
    }),
  );
}

function modelParagraph(displayName: string, models: BrandConfig["models"]): string {
  const names = models.map((m) => m.name);
  const last = names.pop()!;
  const list = names.length > 0 ? `${names.join(", ")} and ${last}` : last;
  return `Luxury Supercar Rentals offers the following ${displayName} models: ${list}. Availability changes — contact ${PHONE} for current stock.`;
}

function buildDoc(config: BrandConfig) {
  const { slug, displayName, h1, seo, models } = config;
  const minPrice = Math.min(...models.map((m) => m.daily));
  const maxPrice = Math.max(...models.map((m) => m.daily));
  const label = displayName;
  const brandLower = displayName.toLowerCase();

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
      paragraphBlock("Last updated: July 2026."),
    ],
  };

  const section3 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-why-book`),
    h2: `Why Book with Us for a ${displayName} Rental in Dubai`,
    body: [
      paragraphBlock(
        `Choose from ${brandLower} models with daily, weekly and monthly rental options and delivery across Dubai. Here is what every booking includes:`,
      ),
      ...listBlock([
        "Cars owned or directly managed by Luxury Supercar Rentals — not outsourced",
        "Basic insurance included with every rental",
        "250 km per day mileage allowance",
        "Free delivery and collection across Dubai",
        "24/7 WhatsApp and phone support",
        "Daily, weekly and monthly booking options",
        "Clear deposit policy — no deposit on selected models",
        "Showroom located at 87 4th St - Al Qouz Ind.third - Al Quoz - Dubai",
      ]),
      paragraphBlock(
        `Luxury Supercar Rentals is owned and managed by ${OWNER}, a recognised automotive enthusiast and creator whose hands-on approach means every car in the fleet is personally selected and maintained. This direct ownership model allows us to offer competitive rates without compromising on quality.`,
      ),
    ],
  };

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

  const section6 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-requirements`),
    h2: `Requirements for ${displayName} Rental in Dubai`,
    body: [
      paragraphBlock(`To rent a ${label} in Dubai, you must meet the following document and age requirements:`),
      ...listBlock([
        "For UAE residents: Valid Emirates ID or passport, plus a UAE driving license. You must be at least 21 years old.",
        "For tourists: Valid passport, visit visa, driving license from your country of residence, and an International Driving Permit (IDP) where required. You must be at least 21 years old.",
      ]),
      paragraphBlock(
        `A refundable security deposit may apply to selected models. The deposit is returned at the end of the rental period, subject to the vehicle being returned in the same condition with no outstanding fines or damages. Contact our team to confirm deposit requirements for your preferred model.`,
      ),
    ],
  };

  const section7 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-why-choose`),
    h2: `Why Choose Luxury Supercar Rentals for a ${label} in Dubai`,
    body: [
      paragraphBlock(
        `Luxury Supercar Rentals offers a hand-picked selection of ${label} models maintained to the highest standard. Every car in our fleet is owned and managed directly by the company, giving us full control over condition, availability and pricing.`,
      ),
      paragraphBlock(
        "Rental terms are transparent: basic insurance is included, the mileage allowance is 250 km per day, and delivery is free across Dubai. Payment can be made via bank transfer, cash, credit or debit card, and cryptocurrency.",
      ),
      paragraphBlock(
        "Our verified rating of 4.9 stars from 486 Google reviews reflects the quality of service our clients have experienced. The Luxury Supercar Rentals showroom is located at 87 4th St - Al Qouz Ind.third - Al Quoz - Dubai — you are welcome to view any vehicle before booking.",
      ),
    ],
  };

  const section8 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-tips`),
    h2: `Tips for Renting a ${label} in Dubai`,
    body: [
      paragraphBlock(`A few practical tips to help you get the most from your ${label} rental:`),
      ...tipsList(),
    ],
  };

  const section9 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-deposit`),
    h2: `${displayName} Rental Deposit Policy`,
    body: [
      paragraphBlock(
        `No security deposit is required for selected ${label} models. A refundable security deposit may apply to certain high-value or limited models. Please confirm the applicable terms before booking.`,
      ),
      paragraphBlock(
        "For models that require a deposit, the amount is AED 5,000, payable via credit or debit card or cash. The deposit is refunded via bank transfer within 28 days of the vehicle's return, provided there are no damages, traffic fines or outstanding charges.",
      ),
    ],
  };

  const section10 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-conditions`),
    h2: `${displayName} Rental Conditions — Dubai`,
    body: [
      paragraphBlock(`The following terms apply to all ${label} rentals from Luxury Supercar Rentals:`),
      ...conditionsList(),
    ],
  };

  const section11 = {
    _type: "brandSection" as const,
    _key: key("section", `${slug}-included`),
    h2: `What Is Included in a ${label} Rental`,
    body: [...whatsIncludedList()],
  };

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
        "UAE residents need a valid Emirates ID or passport and a UAE driving license. Tourists need a valid passport, visit visa, their home-country driving license, and an International Driving Permit (IDP) if required by their country of origin. All renters must be at least 21 years old.",
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-us-license`),
      question: `Can I rent a ${label} in Dubai with a US driver\u2019s license?`,
      answer:
        `Yes. A valid US driver\u2019s license is accepted for renting a ${label} in Dubai. An International Driving Permit (IDP) is generally not required for US license holders. You must be at least 21 years old and present a valid passport. UAE residents need a UAE driving license.`,
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
        "Included: basic insurance, 250 km/day mileage, free delivery across Dubai, 24/7 support. Not included: VAT (5%), additional mileage (AED 20/km), Salik tolls, traffic fines, late return fees, and a cleaning fee of AED 1,500 if smoking inside the vehicle is detected. Parking fees during the rental period are also the renter\u2019s responsibility.",
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
        "The vehicle must be returned with the same fuel level as at pickup. If the fuel level is lower, the cost of refuelling plus a service fee will be deducted from the security deposit.",
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-abu-dhabi`),
      question: `Can I drive a rental ${label} to Abu Dhabi?`,
      answer:
        "Yes, driving to Abu Dhabi is permitted. Salik toll charges and any traffic fines incurred during the rental period will be deducted from the security deposit. Confirm any geographic restrictions at the time of booking.",
    },
    {
      _type: "brandFaq" as const,
      _key: key("faq", `${slug}-delivery`),
      question: "Is delivery available at Dubai Airport or my hotel?",
      answer:
        "Yes, free delivery and collection are available across Dubai, including Dubai International Airport (DXB), Al Maktoum International Airport (DWC), and all Dubai hotels. Delivery is coordinated with your flight or check-in schedule.",
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

async function main() {
  if (!isConfigured) {
    console.error(
      "SANITY_API_TOKEN not found in .env.local — skipping Sanity write.\n" +
        "Run the script with a valid token to push changes to Sanity.",
    );
    process.exit(1);
  }

  const docs = BRANDS.map(buildDoc);
  await batchCreateOrReplace(docs, { label: "eight-brands" });
  console.log(`\u2713 ${docs.length} brands updated in Sanity: ${BRANDS.map((b) => b.displayName).join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
