/**
 * Ferrari brand page — comprehensive content rewrite.
 *
 * Fixes price contradictions, owner-name inconsistency, deposit wording,
 * minimum-age claims, review duplication, model-name drift, and weak copy.
 *
 * Run: npx tsx scripts/sanity/update-ferrari-brand.ts
 * Requires SANITY_API_TOKEN in .env.local
 */
import { paragraphBlock, listBlock, pricingTable, key } from "./blocks";
import { batchCreateOrReplace, isConfigured } from "./lib";

const SLUG = "rent-ferrari-dubai";

const doc = {
  _id: `brand-${SLUG}`,
  _type: "brand",
  displayName: "Ferrari",
  slug: { _type: "slug", current: SLUG },
  h1: "Rent Ferrari in Dubai",
  seo: {
    title: "Rent Ferrari Dubai | Luxury Ferrari Rental From AED 2,500/Day",
    description:
      "Rent Ferrari Dubai from AED 2,500/day. Choose Ferrari F8 Tributo, SF90 and other luxury Ferrari models with free delivery across Dubai and UAE.",
    noIndex: false,
  },
  sections: [
    /* ===================================================
       1 — Ferrari Rental in Dubai, UAE (concise answer block + intro)
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "ferrari-rental"),
      h2: "Ferrari Rental in Dubai, UAE",
      body: [
        paragraphBlock(
          "Ferrari rentals in Dubai start from AED 2,500 per day. The price depends on the model, rental duration and availability. Daily, weekly and monthly packages are available, with basic insurance and free delivery across Dubai included. Deposit requirements vary by model.",
        ),
        paragraphBlock(
          "Ferrari represents the pinnacle of Italian automotive engineering — combining racing heritage with refined luxury. When you rent a Ferrari in Dubai through Luxury Supercar Rentals, you gain access to a fleet of Ferrari convertibles, hybrid supercars and high-performance SUVs, each maintained to the highest standard.",
        ),
        paragraphBlock(
          "Every booking includes free delivery across Dubai, 24/7 WhatsApp support, and clear terms with no hidden charges. Our team will help you select the right Ferrari for your trip, whether you need a car for a few hours, a weekend, or an extended stay.",
        ),
      ],
    },

    /* ===================================================
       2 — Daily, Weekly, & Monthly Prices (improved table)
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "ferrari-prices"),
      h2: "Daily, Weekly, & Monthly Ferrari Rental Prices in Dubai",
      body: [
        pricingTable(
          ["Model", "Daily Rate", "Weekly Rate", "Monthly Rate"],
          [
            ["Ferrari 488 Spyder", "AED 2,500", "AED 14,000", "AED 54,000"],
            ["Ferrari Portofino", "AED 2,500", "AED 14,000", "AED 54,000"],
            ["Ferrari Roma Spyder", "AED 3,300", "AED 20,000", "AED 80,000"],
            ["Ferrari F8 Tributo Spyder Black", "AED 3,500", "AED 21,000", "AED 80,000"],
            ["Ferrari F8 Tributo Spyder Yellow", "AED 3,800", "AED 21,000", "AED 80,000"],
            ["Ferrari 296 GTS Spyder", "AED 4,000", "AED 28,000", "AED 90,000"],
            ["Ferrari F8 Tributo Spider Novitec", "AED 4,000", "AED 28,000", "AED 90,000"],
            ["Ferrari SF90 Stradale", "AED 9,000", "AED 63,000", "AED 240,000"],
            ["Ferrari 812 GTS Novitec Spyder", "AED 10,000", "AED 60,000", "AED 210,000"],
            ["Ferrari Purosangue Novitec", "AED 11,000", "AED 63,000", "AED 240,000"],
          ],
        ),
        paragraphBlock(
          "Ferrari rental prices in Dubai currently start from AED 2,500 per day and may exceed AED 10,000 per day for rare, highly specified or Novitec-modified models. Prices vary according to the model, availability and rental duration. VAT at 5% is not included in the rates shown above.",
        ),
        paragraphBlock(
          "Prices are subject to availability and may change during peak periods (New Year, Dubai Shopping Festival, major events). Please confirm the final rate and any applicable deposit before booking.",
        ),
        paragraphBlock(
          "Last updated: July 2026.",
        ),
      ],
    },

    /* ===================================================
       3 — Why Book with Us (replaces old "Dubai Ferrari Rental")
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "why-book"),
      h2: "Why Book with Us for a Ferrari Rental in Dubai",
      body: [
        paragraphBlock(
          "Choose from Ferrari convertibles, hybrid supercars and high-performance SUVs, with daily, weekly and monthly rental options and delivery across Dubai. Here is what every booking includes:",
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
          "Luxury Supercar Rentals is owned and managed by Ahmed Mansour (Ahmed Amwell), a recognised automotive enthusiast and creator whose hands-on approach means every car in the fleet is personally selected and maintained. This direct ownership model allows us to offer competitive rates without compromising on quality.",
        ),
      ],
    },

    /* ===================================================
       4 — Ferrari Rental Rates in Dubai (fixes price contradiction)
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "rates"),
      h2: "Ferrari Rental Rates in Dubai",
      body: [
        paragraphBlock(
          "Ferrari rental rates in Dubai vary primarily by model and rental duration. The table above lists current daily, weekly and monthly prices for every Ferrari in our fleet. Longer rentals benefit from reduced per-day rates.",
        ),
        paragraphBlock(
          "Ferrari rental prices in Dubai currently start from AED 2,500 per day and may exceed AED 10,000 per day for rare, highly specified or Novitec-modified models. Prices vary according to the model, availability and rental duration.",
        ),
        paragraphBlock(
          "No security deposit is required for selected Ferrari models. A refundable security deposit of AED 5,000 may apply to certain high-value or limited models. Please confirm the applicable terms before booking.",
        ),
      ],
    },

    /* ===================================================
       5 — Top Ferrari Models (model-names aligned with fleet)
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "top-models"),
      h2: "Top Ferrari Models to Rent with Daily Rates at Luxury Supercar Rentals",
      body: [
        paragraphBlock(
          "Browse our available Ferrari models below — each link opens the full listing with photos, specs and booking options.",
        ),
        ...listBlock([
          'Rent the Ferrari 488 Spyder in Dubai — from AED 2,500/day',
          'Rent the Ferrari Portofino in Dubai — from AED 2,500/day',
          'Rent the Ferrari Roma Spyder in Dubai — from AED 3,300/day',
          'Rent the Ferrari F8 Tributo Spyder Black in Dubai — from AED 3,500/day',
          'Rent the Ferrari F8 Tributo Spyder Yellow in Dubai — from AED 3,800/day',
          'Rent the Ferrari 296 GTS Spyder in Dubai — from AED 4,000/day',
          'Rent the Ferrari F8 Tributo Spider Novitec in Dubai — from AED 4,000/day',
          'Rent the Ferrari SF90 Stradale in Dubai — from AED 9,000/day',
          'Rent the Ferrari 812 GTS Novitec Spyder in Dubai — from AED 10,000/day',
          'Rent the Ferrari Purosangue Novitec in Dubai — from AED 11,000/day',
        ]),
        paragraphBlock(
          "Model availability changes frequently. Contact our team at +971 56 526 6295 to confirm current stock and book your preferred Ferrari.",
        ),
      ],
    },

    /* ===================================================
       6 — Requirements for Ferrari Rental (age 20 — verified)
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "requirements"),
      h2: "Requirements for Ferrari Rental in Dubai",
      body: [
        paragraphBlock(
          "To rent a Ferrari in Dubai, you must meet the following document and age requirements:",
        ),
        ...listBlock([
          "For UAE residents: Valid Emirates ID or passport, plus a UAE driving license. You must be at least 21 years old.",
          "For tourists: Valid passport, visit visa, driving license from your country of residence, and an International Driving Permit (IDP) where required. You must be at least 21 years old.",
        ]),
        paragraphBlock(
          "A refundable security deposit may apply to selected models. The deposit is returned at the end of the rental period, subject to the vehicle being returned in the same condition with no outstanding fines or damages. Contact our team to confirm deposit requirements for your preferred model.",
        ),
      ],
    },

    /* ===================================================
       7 — Why Choose Us (replaces superlative-heavy copy)
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "why-choose"),
      h2: "Why Choose Luxury Supercar Rentals for a Ferrari in Dubai",
      body: [
        paragraphBlock(
          "Luxury Supercar Rentals offers a hand-picked selection of Ferrari models maintained to the highest standard. Every car in our fleet is owned and managed directly by the company, giving us full control over condition, availability and pricing.",
        ),
        paragraphBlock(
          "Rental terms are transparent: basic insurance is included, the mileage allowance is 250 km per day, and delivery is free across Dubai. Payment can be made via bank transfer, cash, credit or debit card, and cryptocurrency.",
        ),
        paragraphBlock(
          "Our verified rating of 4.9 stars from 486 Google reviews reflects the quality of service our clients have experienced. The Luxury Supercar Rentals showroom is located at 87 4th St - Al Qouz Ind.third - Al Quoz - Dubai — you are welcome to view any vehicle before booking.",
        ),
      ],
    },

    /* ===================================================
       8 — Tips for Renting a Ferrari
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "tips"),
      h2: "Tips for Renting a Ferrari in Dubai",
      body: [
        paragraphBlock(
          "A few practical tips to help you get the most from your Ferrari rental:",
        ),
        ...listBlock([
          "Compare rates across models — daily prices range from AED 2,500 to AED 11,000 depending on the model.",
          "Longer rentals reduce the per-day cost. Weekly and monthly packages offer better value for extended stays.",
          "Inspect the vehicle at pickup or delivery and note any existing marks on the condition report.",
          "Book in advance, especially during peak seasons (November–March, public holidays, major events), to secure your preferred model.",
          "Read the rental agreement carefully — it details mileage limits, insurance coverage, deposit terms and return conditions.",
        ]),
      ],
    },

    /* ===================================================
       9 — Deposit Policy (consistent statement)
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "deposit"),
      h2: "Ferrari Rental Deposit Policy",
      body: [
        paragraphBlock(
          "No security deposit is required for selected Ferrari models. A refundable security deposit may apply to certain high-value or limited models. Please confirm the applicable terms before booking.",
        ),
        paragraphBlock(
          "For models that require a deposit, the amount is AED 5,000, payable via credit or debit card or cash. The deposit is refunded via bank transfer within 28 days of the vehicle's return, provided there are no damages, traffic fines or outstanding charges.",
        ),
      ],
    },

    /* ===================================================
       10 — Rental Conditions (age 20, consistent deposit)
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "conditions"),
      h2: "Ferrari Rental Conditions — Dubai",
      body: [
        paragraphBlock(
          "The following terms apply to all Ferrari rentals from Luxury Supercar Rentals:",
        ),
        ...listBlock([
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
        ]),
      ],
    },

    /* ===================================================
       11 — What's Included
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "included"),
      h2: "What Is Included in a Ferrari Rental",
      body: [
        ...listBlock([
          "Free pick-up and drop-off across Dubai",
          "24/7 customer support via phone and WhatsApp",
          "No deposit on selected Ferrari models",
          "Basic insurance included in all packages",
          "Transparent pricing — no hidden charges",
          "Payment by cash, credit/debit card, bank transfer and cryptocurrency",
          "Well-maintained vehicles with regular inspections",
          "Flexible booking via phone, WhatsApp or the website",
        ]),
      ],
    },

    /* ===================================================
       12 — Book Your Ferrari Rental Today
       =================================================== */
    {
      _type: "brandSection",
      _key: key("section", "book"),
      h2: "Book Your Ferrari Rental Today",
      body: [
        paragraphBlock(
          "Ready to drive a Ferrari in Dubai? Contact us to reserve your preferred model. Free delivery across Dubai, clear terms and no hidden charges.",
        ),
        paragraphBlock(
          "Call or WhatsApp: +971 56 526 6295",
        ),
        paragraphBlock(
          "Showroom: 87 4th St - Al Qouz Ind.third - Al Quoz - Dubai",
        ),
        paragraphBlock(
          "Browse individual Ferrari model pages for detailed specs and photos.",
        ),
      ],
    },
  ],

  faqs: [
    {
      _type: "brandFaq",
      _key: key("faq", "factors"),
      question: "What factors affect Ferrari rental prices in Dubai?",
      answer:
        "Ferrari rental prices in Dubai depend on the specific model, its age and specifications, the rental duration, mileage allowance, and market demand. Novitec-modified or limited-edition models such as the Ferrari Purosangue Novitec (AED 11,000/day) and 812 GTS Novitec Spyder (AED 10,000/day) command higher rates than entry-level models like the Ferrari 488 (AED 2,500/day). Peak seasons \u2014 Dubai Shopping Festival, New Year, and major events \u2014 also affect availability and pricing.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "models"),
      question: "What Ferrari models are available to rent in Dubai?",
      answer:
        "Luxury Supercar Rentals offers the following Ferrari models: Ferrari 488, Portofino, Roma Spyder, F8 Tributo Spyder (Black and Yellow), 296 GTS Spyder, F8 Tributo Spider Novitec, SF90 Stradale, 812 GTS Novitec Spyder, and Purosangue Novitec. Availability changes \u2014 contact +971 56 526 6295 for current stock.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "price-range"),
      question: "How much does it cost to rent a Ferrari in Dubai?",
      answer:
        "Ferrari rental prices in Dubai start from AED 2,500 per day for models such as the Ferrari 488 and Portofino, and go up to AED 11,000 per day for rare or Novitec-modified models. Weekly and monthly packages offer reduced per-day rates. The price table on this page lists current rates for every Ferrari in the fleet.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "documents"),
      question: "What documents do I need to rent a Ferrari in Dubai?",
      answer:
        "UAE residents need a valid Emirates ID or passport and a UAE driving license. Tourists need a valid passport, visit visa, their home-country driving license, and an International Driving Permit (IDP) if required by their country of origin. All renters must be at least 21 years old.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "us-license"),
      question: "Can I rent a Ferrari in Dubai with a US driver\u2019s license?",
      answer:
        "Yes. A valid US driver\u2019s license is accepted for renting a Ferrari in Dubai. An International Driving Permit (IDP) is generally not required for US license holders. You must be at least 21 years old and present a valid passport. UAE residents need a UAE driving license.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "tourists"),
      question: "Can tourists rent a Ferrari in Dubai?",
      answer:
        "Yes, tourists can rent a Ferrari in Dubai. You need a valid passport, visit visa, your domestic driving license, and an International Driving Permit (IDP) if required by your country. The minimum age is 21 years. Free delivery is available to Dubai hotels and airports.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "age"),
      question: "What is the minimum age to rent a Ferrari in Dubai?",
      answer:
        "The minimum age to rent a Ferrari from Luxury Supercar Rentals is 21 years old. This applies to both residents and tourists.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "insurance"),
      question: "Is insurance included with a Ferrari rental in Dubai?",
      answer:
        "Yes, basic insurance is included with every Ferrari rental. Full-coverage insurance can be arranged at an additional cost. Please confirm your insurance requirements at the time of booking.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "deposit"),
      question: "Is a security deposit required to rent a Ferrari in Dubai?",
      answer:
        "No security deposit is required for selected Ferrari models. A refundable AED 5,000 security deposit may apply to certain high-value or limited models. The deposit is refunded via bank transfer within 28 days of return, provided there are no damages, fines, or outstanding charges.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "included"),
      question: "What is and isn\u2019t included in a Ferrari rental price?",
      answer:
        "Included: basic insurance, 250 km/day mileage, free delivery across Dubai, 24/7 support. Not included: VAT (5%), additional mileage (AED 20/km), Salik tolls, traffic fines, late return fees, and a cleaning fee of AED 1,500 if smoking inside the vehicle is detected. Parking fees during the rental period are also the renter\u2019s responsibility.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "mileage"),
      question: "How many kilometres are included per day with a Ferrari rental?",
      answer:
        "Each Ferrari rental includes 250 km per day. Additional kilometres beyond the daily limit are charged at AED 20 per km.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "fuel"),
      question: "What is the fuel policy for Ferrari rentals in Dubai?",
      answer:
        "The vehicle must be returned with the same fuel level as at pickup. If the fuel level is lower, the cost of refuelling plus a service fee will be deducted from the security deposit.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "abu-dhabi"),
      question: "Can I drive a rental Ferrari to Abu Dhabi?",
      answer:
        "Yes, driving to Abu Dhabi is permitted. Salik toll charges and any traffic fines incurred during the rental period will be deducted from the security deposit. Confirm any geographic restrictions at the time of booking.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "delivery"),
      question: "Is delivery available at Dubai Airport or my hotel?",
      answer:
        "Yes, free delivery and collection are available across Dubai, including Dubai International Airport (DXB), Al Maktoum International Airport (DWC), and all Dubai hotels. Delivery is coordinated with your flight or check-in schedule.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "best-model"),
      question: "Which Ferrari model is best for two passengers?",
      answer:
        "All Ferrari models in our fleet seat two passengers except the Portofino (2+2 configuration) and the Purosangue (four-seat SUV). For a focused two-passenger driving experience, the F8 Tributo Spyder, 296 GTS Spyder, and SF90 Stradale are the most popular choices.",
    },
    {
      _type: "brandFaq",
      _key: key("faq", "makes-sense"),
      question: "Does it make financial sense to rent rather than own a Ferrari in Dubai?",
      answer:
        "Renting a Ferrari in Dubai avoids the long-term costs of ownership: depreciation, insurance, registration, maintenance, and storage. It is a practical option for visitors, residents who drive occasionally, or anyone wanting to experience a specific model for an event, photoshoot, or weekend trip without committing to a purchase.",
    },
  ],
};

async function main() {
  if (!isConfigured) {
    console.error(
      "SANITY_API_TOKEN not found in .env.local — skipping Sanity write.\n" +
        "Run the script with a valid token to push changes to Sanity.",
    );
    process.exit(1);
  }

  await batchCreateOrReplace([doc], { label: "ferrari-brand" });
  console.log("✓ Ferrari brand updated in Sanity");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
