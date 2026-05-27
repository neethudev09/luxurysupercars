/**
 * Single source of truth for ALL homepage copy. Verbatim from
 * luxurysupercarsdubai.com — preserves SEO crawl signals.
 * Heading strings use **bold** markers; renderer parses them into
 * champagne-italic spans.
 *
 * CMS-backed slices (CONTACT, SOCIAL, FOOTER.description, TESTIMONIALS,
 * FAQ, FAQ_PAGE, SERVICES_PAGE.items) are sourced from lib/generated/*.json,
 * which scripts/sanity/export-to-json.ts regenerates from Sanity on every
 * build. Everything else here is hand-authored and not in the CMS.
 */
import siteSettingsData from "./generated/site-settings.json";
import testimonialsData from "./generated/testimonials.json";
import faqData from "./generated/faq.json";
import servicesData from "./generated/services.json";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Cars Types", href: "/our-fleet" },
  { label: "Cars Brands", href: "/our-fleet" },
  { label: "Our Fleet", href: "/our-fleet" },
  { label: "Services", href: "/services" },
  // "Contact Us" is rendered separately as a button on the desktop nav;
  // FAQs and Blog live in the footer only. Keep "Contact Us" last so the
  // mobile menu shows it at the bottom.
  { label: "Contact Us", href: "/contact-us" },
];

export const CARS_TYPES = ["Luxury", "Convertible", "Sports", "Electric", "SUV"];

export const CARS_BRANDS = [
  "Aston Martin", "Audi", "Bentley", "BMW", "Cadillac", "Ferrari",
  "Lamborghini", "Rolls Royce", "Maserati", "McLaren", "Mercedes Benz",
  "Porsche", "Range Rover",
];

// Phone numbers, email, showroom address — from Sanity `siteSettings`.
export const CONTACT = siteSettingsData.contact;

// Social profile URLs — from Sanity `siteSettings`. `twitter` is currently
// a placeholder and is not surfaced by any UI (nav + footer render only
// facebook/instagram/youtube/tiktok).
export const SOCIAL = siteSettingsData.social;

export const HERO = {
  // Owner-approved rewrite (2026-05-13) — replaces the live site's ungrammatical
  // "Are You Looking To Rent Luxury Car In Dubai?". Bold markers force the
  // line break to land after "rent" so the H1 renders as two clean lines.
  h1: "**Looking to rent** a luxury car in Dubai",
  sub: "Dubai's Most Trusted Supercar Rentals. Premium Services with 24/7 Support and Free Delivery Across Dubai.",
  ctaPrimary: "Rent A Car",
  ctaSecondary: "Contact Us",
  rating: { stars: 4.9, count: 377 },
};

export const FLEET_SECTIONS = {
  sports: {
    id: "sports",
    eyebrow: "Sports",
    h2: "**Sports Car** Rental in Dubai",
    body: "Experience the pinnacle of luxury and performance with Luxury Supercars Dubai, your premier destination for exotic car rentals. Whether you're exploring the vibrant streets of Dubai, cruising along the scenic coastline, or making a statement at a high-profile event, our fleet of world-class supercars is designed to elevate every journey.",
    cta: "View All Sports Cars",
  },
  convertibles: {
    id: "convertibles",
    eyebrow: "Convertible",
    h2: "**Convertible** Car Rental in Dubai",
    body: "Experience the thrill of the open road and the beauty of Dubai's skyline with our convertible car rental services. At Luxury Supercars Dubai, we offer a premium collection of convertible cars that combine style, luxury, and performance, making every drive a memorable experience.",
    cta: "View All Convertible Cars",
  },
  luxury: {
    id: "luxury",
    eyebrow: "Luxury",
    h2: "**Rent Luxury** Cars in Dubai",
    body: "Make your journey in Dubai unforgettable with our luxury car rental services. At Luxury Supercars Dubai, we specialize in providing a world-class fleet of high-end vehicles, perfect for those who value style, comfort, and performance. Whether you're exploring the city's iconic landmarks, attending a business meeting, or celebrating a special occasion, our luxury cars are designed to elevate every moment.",
    cta: "View All Luxury Cars",
  },
  suvs: {
    id: "suvs",
    eyebrow: "SUV",
    h2: "**Rent SUVs** in Dubai",
    body: "Discover unmatched comfort and versatility with Luxury Supercars Dubai's SUV rental service. Perfect for family trips, group outings, or simply exploring Dubai in style, our premium SUVs offer space, luxury, and top-notch performance.",
    cta: "View All SUVs Cars",
  },
} as const;

export const BRAND_STORY = {
  id: "story",
  eyebrow: "About",
  h2: "Luxury **Supercars** Dubai: Your **Premier** Luxury Car Rental Service in **Dubai, UAE**",
  paragraphs: [
    "When it comes to Luxury Car Rental in Dubai, Luxury Supercars Dubai is your ultimate destination. We pride ourselves on offering a premium selection of world-class vehicles, allowing you to immerse yourself in Dubai's vibrant and luxurious lifestyle in the most sophisticated way imaginable. With the largest fleet and showroom of luxury cars in the city, we provide an unrivaled variety of options to cater to your every need.",
    "Dubai is a city synonymous with opulence, and there's no better way to explore its iconic landmarks and breathtaking skyline than behind the wheel of a prestigious luxury car. At Luxury Supercars Dubai, we feature an exclusive collection from top-tier brands like Lamborghini, Ferrari, Porsche, Bentley, and Mercedes-Benz. Whether you're here for business, leisure, or a special event, our fleet of the latest models ensures a driving experience that epitomizes comfort, performance, and elegance.",
  ],
  stats: [
    { value: 14, suffix: "+",  label: "Brands" },
    { value: 4.9, decimals: 1, suffix: "★", label: "Google rating" },
    { value: 377, suffix: "",  label: "Reviews" },
    { value: 24,  suffix: "/7", label: "Support" },
  ],
} as const;

export const REQUIREMENTS = {
  id: "requirements",
  eyebrow: "What you'll need",
  h2: "What **documents** Are Needed To **Rent** A Car in Dubai",
  items: [
    {
      title: "AGE",
      body: "You should be at least 21 years old.",
    },
    {
      title: "Driving License",
      body: "You should have a valid UAE driving license if you are UAE resident or You should have an International driving license.",
    },
    {
      title: "Free Delivery",
      body: "We offer a free delivery to our customers to their desired location.",
    },
  ],
} as const;

// Reviews — from Sanity `testimonial` docs, split by `source` into the
// two marquee tracks. Section heading is hand-authored.
export const TESTIMONIALS = {
  id: "testimonials",
  eyebrow: "Reviews",
  h2: "What Our **Customers** are Saying **About Us**",
  named: testimonialsData
    .filter((t) => t.source === "named")
    .map((t) => ({ name: t.name, quote: t.quote })),
  google: testimonialsData
    .filter((t) => t.source === "google")
    .map((t) => ({ name: t.name, quote: t.quote })),
};

export const WHY_US = {
  id: "why",
  eyebrow: "Why us",
  h2: "Why Choose **Luxury Supercars Dubai?**",
  cards: [
    {
      title: "Largest Fleet and Showroom",
      body: "Experience the luxury of choice with the largest selection of luxury cars in Dubai. Whether you are looking for performance, comfort, or technology, our extensive range ensures we have the perfect car for your needs.",
    },
    {
      title: "No Commitment Necessary",
      body: "Want to drive a supercar? Make this dream a reality with our rental services without locking yourself into a long-term agreement.",
    },
    {
      title: "Flexible Rental Options",
      body: "We cater to all desires and needs, whether you need a car for a few hours or several days, and we ensure timely delivery.",
    },
    {
      title: "Transparent Pricing",
      body: "Enjoy straightforward and \"no hidden fees\" pricing with us. Experience our services without any worries.",
    },
  ],
} as const;

/**
 * Homepage FAQ teaser fallback — the 4 entries originally hand-authored
 * for the homepage. The live data now comes from Sanity `faq` docs flagged
 * "Show in homepage FAQ teaser"; this array only renders if an editor
 * un-ticks every entry, so the homepage section never goes blank.
 */
const HOMEPAGE_FAQ_FALLBACK = [
  {
    q: "What is the age limit to rent a vehicle from LuxurySuperCarsDubai.com?",
    a: "The age limit to benefit from our services is between 21 and 65 years. Additionally, we require our clients to possess a valid driving license for a minimum period of 1 year.",
  },
  {
    q: "What documents will I be asked to submit when hiring a car?",
    a: "The documents required by Luxury Super Cars Dubai are inclusive of: Credit Card, Copy of Passport with visa page, Copy of your valid UAE driving license / Valid International License.",
  },
  {
    q: "How can I pay for my car rental?",
    a: "We have multiple payment options, including Visa, MasterCard, cash, American Express, online banking, and Bitcoin.",
  },
  {
    q: "Is a deposit required to rent a vehicle?",
    a: "Yes, it is necessary for a deposit to be made when renting a vehicle from us. However, the amount, deposit type payment method will vary by the type of agreement.",
  },
];

const homepageFaqItems = faqData
  .filter((f) => f.showOnHomepage)
  .map((f) => ({ q: f.q, a: f.a }));

// Homepage FAQ section — items from Sanity (showOnHomepage entries).
export const FAQ = {
  id: "faq",
  eyebrow: "FAQs",
  h2: "FAQs",
  h3: "**Everything** You Need To Know About Our **Services**",
  items: homepageFaqItems.length ? homepageFaqItems : HOMEPAGE_FAQ_FALLBACK,
};

export const BLOG = {
  id: "blog",
  eyebrow: "Blog",
  h2: "Stay **Informed** And Inspired For Your Next **Journey**",
  posts: [
    {
      date: "January 25, 2026",
      title: "When a Supercar Makes Sense in Dubai: Business, Leisure, Events and Everything In Between",
      href: "https://luxurysupercarsdubai.com/blogs/when-a-supercar-makes-sense-in-dubai/",
    },
    {
      date: "January 6, 2026",
      title: "Choosing the Right Supercar in Dubai: What Fits Your Lifestyle, Not Just Your Instagram",
      href: "https://luxurysupercarsdubai.com/blogs/choosing-the-right-supercar-in-dubai/",
    },
    {
      date: "January 1, 2026",
      title: "Set Your 2026 Resolutions in Style: How a Supercar Drive Can Kickstart Your Year in Dubai",
      href: "https://luxurysupercarsdubai.com/blogs/how-a-supercar-drive-can-kickstart-your-year-in-dubai/",
    },
    {
      date: "December 31, 2025",
      title: "Winter in the Fast Lane: Why December is the Best Month to Drive in Dubai",
      href: "https://luxurysupercarsdubai.com/blogs/why-december-is-the-best-month-to-drive-in-dubai/",
    },
  ],
} as const;

export const INSTAGRAM = {
  id: "instagram",
  eyebrow: "Instagram",
  h2: "Follow Us on **Instagram**",
  reels: [
    { caption: "Lamborghini Urus carbon fiber details", href: "https://www.instagram.com/reel/DYIwB6tIwY5/" },
    { caption: "Lamborghini Huracán STO track-bred features", href: "https://www.instagram.com/reel/DX9J6UroWc-/" },
    { caption: "Lamborghini Revuelto & Ferrari SF90 hybrid comparison", href: "https://www.instagram.com/reel/DXzDYJ8Io3x/" },
    { caption: "Ferrari Roma Spider convertible", href: "https://www.instagram.com/reel/DXwf2Uboliu/" },
    { caption: "McLaren 750S in blue", href: "https://www.instagram.com/reel/DXtfs1NCEKq/" },
  ],
  ctaLoad: "Load More",
  ctaFollow: "Follow on Instagram",
} as const;

/* -------------------------------------------------------------------------- */
/*  Standalone-page copy (live verbatim from luxurysupercarsdubai.com)        */
/* -------------------------------------------------------------------------- */

// Live: /contact-us/ — meta title + headings + body verbatim. Operation hours
// pulled from the live page; CONTACT.* already holds the phone/email/address.
export const CONTACT_PAGE = {
  metaTitle: "Contact Us | Get in Touch & Book Your Ride",
  metaDescription:
    "Get in touch with Luxury Supercars Dubai to book your ride or learn more about our exotic car rental services. Reach us by phone, email, or visit our Dubai showroom — open 9am to 9pm, seven days a week.",
  h1: "Contact Us",
  h2: "Reach Out to Us for Effortless Communication",
  intro: "Get in Touch us! Feel Free to Drop us a note If you Wish to Learn More!",
  body: "If you are looking to rent the latest luxury Car in Dubai, luxurysupercarsdubai.com is a one-stop destination for all. You can avail the widest range of the most exotic luxury cars, including everything from the latest Sports Cars, Convertible Cars, SUVs, Supercars, and Prestige Cars, all of which would surely provide you with a fascinating experience.",
  hours: "9 am – 9 pm (Monday–Sunday)",
} as const;

// Live: /services/ — currently a small directory of 4 sub-services, each at
// /service/{slug}/. Sub-service detail bodies pulled verbatim from each live page.
export const SERVICES_PAGE = {
  metaTitle: "Luxury Car Rental Services in Dubai | Luxury Supercars Dubai",
  metaDescription:
    "Explore the full range of services from Luxury Supercars Dubai — long-term rental, self-drive, weddings and special events, and gift vouchers. Premium service across Dubai with 24/7 concierge support.",
  h1: "Providing Amazing Service To Our Clients",
  body: "If you are looking to rent the latest luxury Car in Dubai, luxurysupercarsdubai.com is a one-stop destination for all. You can avail the widest range of the most exotic luxury cars, including everything from the latest Sports Cars, Convertible Cars, SUVs, Supercars, and Prestige Cars, all of which would surely provide you with a fascinating experience.",
  // Service detail cards — from Sanity `service` docs (slug, title,
  // summary, h1, SEO, flattened body paragraphs).
  items: servicesData,
};

// Live: /faq/ — full Q&A set. Items come from Sanity `faq` docs that are
// NOT flagged for the homepage teaser; the homepage-only entries feed FAQ
// above. metaTitle/metaDescription/h1 are hand-authored page-level copy.
const faqPageItems = faqData
  .filter((f) => !f.showOnHomepage)
  .map((f) => ({ q: f.q, a: f.a }));

export const FAQ_PAGE = {
  metaTitle: "FAQs | Luxury Car Rental Dubai Questions Answered",
  metaDescription:
    "Find answers to every question about renting a luxury car in Dubai — age limits, required documents, payment options, deposits, deliveries, and more.",
  h1: "Frequently Asked Questions",
  // Safety net: if every FAQ were flagged homepage-only, fall back to the
  // full set rather than rendering an empty /faq page.
  items: faqPageItems.length ? faqPageItems : faqData.map((f) => ({ q: f.q, a: f.a })),
};

// Live: /careers/ — verbatim. Live page has no specific job openings; the form
// captures general expressions of interest.
export const CAREERS_PAGE = {
  metaTitle: "Careers at Luxury Group | Join Our Team in Dubai",
  metaDescription:
    "Explore careers at Luxury Group. We're always open to hearing from people who take pride in their work and want to join a professional, well-run luxury automotive business in Dubai.",
  h1: "Careers at Luxury Group",
  h2: "Careers Enquiry",
  paragraphs: [
    "Luxury Group is built around people as much as it is around brands. As the group continues to grow, we're always open to hearing from individuals who take pride in their work and want to be part of a professional, well-run organisation.",
    "We work across luxury automotive and premium services, and our roles naturally vary as the business evolves. Some positions are hands-on, some are customer-focused, and others support the wider operation behind the scenes. What matters most to us is reliability, attention to detail, and the right attitude.",
    "If you feel you'd be a good fit for Luxury Group, we'd be happy to hear from you. Use the form below to share your details and a little about your experience. If there's a suitable opportunity, someone from our team will be in touch.",
  ],
} as const;

// Live: /booking-tcs/ — verbatim terms and conditions. Note the live page
// title uses "Booking T&C 'S" with a stray space + capital; preserved as-is
// since it appears in the live <h1> and may match inbound links.
export const BOOKING_TERMS_PAGE = {
  metaTitle: "Booking T&Cs | Luxury Supercars Dubai",
  metaDescription:
    "Booking terms and conditions for Luxury Supercars Dubai — required documents, age requirements, security deposits, payment methods, rental periods, and delivery information.",
  h1: "Booking T&C 'S",
  intro: "Terms and Conditions:",
  sections: [
    {
      title: "Requirements:",
      groups: [
        {
          subtitle: "Documents for Residents:",
          items: [
            "Passport",
            "Valid Driver's License",
            "International Driver's Permit – required from certain countries.",
          ],
        },
        {
          subtitle: "Documents for UAE Residents:",
          items: [
            "Emirates ID",
            "UAE Driver's License",
          ],
        },
        {
          subtitle: "Age Requirement:",
          items: [
            "Hirer's minimum age for SUVs and Sedans: 18 years old",
            "Hirer's minimum age for Ultra luxury vehicles: 21 years old",
          ],
        },
        {
          subtitle: "Security Deposit:",
          items: [
            "A security deposit of 5000 AED is required.",
            "The security deposit will be refunded after 28 days from the return date to your bank account for any potential traffic fines incurred during the rental period.",
            "Any outstanding traffic fines and salik toll fees will be deducted from the security deposit.",
          ],
        },
        {
          subtitle: "Payment Method:",
          items: [
            "Cash – AED, USD, GBP, AUD and Euro are accepted.",
            "Credit/Debit Card",
            "Payment Link",
            "Crypto",
          ],
        },
        {
          subtitle: "Rental Period:",
          items: [
            "The minimum rental period is 1 day or 24 hours.",
            "Each rental includes a limit of 250 KMs.",
            "Late returns may be subject to additional charges.",
            "Smoking inside the car, off-roading, and using the car on a racetrack are strictly prohibited.",
          ],
        },
        {
          subtitle: "Delivery and Collection:",
          items: [
            "Free delivery and collection are available within Dubai.",
            "Delivery and collection in other Emirates will be chargeable.",
          ],
        },
      ],
    },
  ],
} as const;

// Live: /privacy-policy/ — verbatim policy. Sections preserved in live order.
export const PRIVACY_POLICY_PAGE = {
  metaTitle: "Privacy Policy | Luxury Supercars Dubai",
  metaDescription:
    "How Luxury Supercars Dubai collects, uses, and protects your personal information — consent, cookies, third-party advertising, CCPA and GDPR rights, and children's information.",
  h1: "Privacy Policy",
  sections: [
    {
      title: "Privacy Policy for Luxury Super Cars Dubai",
      paragraphs: [
        "At Luxury Super Cars Dubai, accessible from luxurysupercarsdubai.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Luxury Super Cars Dubai and how we use it.",
        "If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.",
        "This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Luxury Super Cars Dubai. This policy is not applicable to any information collected offline or via channels other than this website.",
      ],
    },
    {
      title: "Consent",
      paragraphs: [
        "By using our website, you hereby consent to our Privacy Policy and agree to its terms.",
      ],
    },
    {
      title: "Information we collect",
      paragraphs: [
        "The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.",
        "If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.",
        "When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.",
      ],
    },
    {
      title: "How we use your information",
      paragraphs: ["We use the information we collect in various ways, including to:"],
      list: [
        "Provide, operate, and maintain our webste",
        "Improve, personalize, and expand our webste",
        "Understand and analyze how you use our webste",
        "Develop new products, services, features, and functionality",
        "Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the webste, and for marketing and promotional purposes",
        "Send you emails",
        "Find and prevent fraud",
      ],
    },
    {
      title: "Log Files",
      paragraphs: [
        "Luxury Super Cars Dubai follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.",
      ],
    },
    {
      title: "Cookies and Web Beacons",
      paragraphs: [
        "Like any other website, Luxury Super Cars Dubai uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.",
        "For more general information on cookies, please read \"What Are Cookies\".",
      ],
    },
    {
      title: "Google Double Click DART Cookie",
      paragraphs: [
        "Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads",
      ],
    },
    {
      title: "Our Advertising Partners",
      paragraphs: [
        "Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.",
      ],
    },
    {
      title: "Advertising Partners Privacy Policies",
      paragraphs: [
        "Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Luxury Super Cars Dubai, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.",
        "Note that Luxury Super Cars Dubai has no access to or control over these cookies that are used by third-party advertisers.",
      ],
    },
    {
      title: "Third Party Privacy Policies",
      paragraphs: [
        "Luxury Super Cars Dubai's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.",
        "You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.",
      ],
    },
    {
      title: "CCPA Privacy Rights (Do Not Sell My Personal Information)",
      paragraphs: ["Under the CCPA, among other rights, California consumers have the right to:"],
      list: [
        "Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.",
        "Request that a business delete any personal data about the consumer that a business has collected.",
        "Request that a business that sells a consumer's personal data, not sell the consumer's personal data.",
      ],
      trailer: ["If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us."],
    },
    {
      title: "GDPR Data Protection Rights",
      paragraphs: ["We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:"],
      list: [
        "The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.",
        "The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.",
        "The right to erasure – You have the right to request that we erase your personal data, under certain conditions.",
        "The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.",
        "The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.",
        "The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.",
      ],
      trailer: ["If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us."],
    },
    {
      title: "Children's Information",
      paragraphs: [
        "Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.",
        "Luxury Super Cars Dubai does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.",
      ],
    },
  ],
} as const;

export const FOOTER = {
  // Footer blurb — from Sanity `siteSettings.footerDescription`.
  description: siteSettingsData.footerDescription,
  brands: [
    "Aston Martin",
    "Audi",
    "Bentley",
    "BMW",
    "Bugatti",
    "Cadillac",
    "Ferrari",
    "Lamborghini",
    "Land Rover",
    "Maserati",
    "McLaren",
    "Mercedes Benz",
    "Porsche",
    "Rolls Royce",
  ],
  // "Rent Exotics" intentionally points at the luxury page — owner direction.
  rent: [
    { label: "Rent Luxury Cars", href: "/rent-luxury-cars-dubai" },
    { label: "Rent Convertible Cars", href: "/rent-convertible-cars-dubai" },
    { label: "Rent Sports Cars", href: "/rent-sports-cars-dubai" },
    { label: "Rent SUV Cars", href: "/rent-suv-cars-dubai" },
    { label: "Rent Exotics", href: "/rent-luxury-cars-dubai" },
  ],
  // hrefs mirror live luxurysupercarsdubai.com slugs exactly so existing
  // backlinks resolve unchanged on launch.
  useful: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Our Fleet", href: "/our-fleet" },
    { label: "Services", href: "/services" },
    { label: "Blogs", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "FAQs", href: "/faq" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  legal: [
    { label: "Booking T&C's", href: "/booking-tcs" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  copyright: "© 2026 Luxury Supercar Rentals. All rights reserved.",
};
