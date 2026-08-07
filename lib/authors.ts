/**
 * Author profiles. Mirrors the "Author document type" pattern from the
 * Ahmed Amwell E-E-A-T implementation brief: one canonical Person entity
 * per author, referenced by @id from every BlogPosting authored by them.
 *
 * NOTE (pre-publication review): this profile is derived from the local
 * `Ahmed_Amwell_Author_Profile_EEAT` brief plus the local CEO feature
 * draft. Before it goes live, confirm the display name, the exact founding
 * year, the LinkedIn URL and the use of the real company-owned portrait.
 */
import { SITE_URL } from "@/lib/site";

export type AuthorExpertise = { title: string; body: string };

export type Author = {
  slug: string;
  /** Professional display name. */
  name: string;
  /** Legal / alternate name. */
  alternateName?: string;
  role: string;
  company: string;
  metaDescription: string;
  image: string;
  imageAlt: string;
  /** Biographical paragraphs — E-E-A-T copy, mixed from the EEAT brief and
   *  the local CEO feature draft, kept to verified claims. */
  bio: string[];
  /** Verified operating specifics drawn from the local CEO feature draft. */
  highlights: string[];
  expertise: AuthorExpertise[];
  firstHandStatement: string;
  /** Real quotes from public interviews — strong first-hand E-E-A-T signal. */
  quotes: string[];
  /** Press outlets that have covered the author / the business. */
  featuredIn: string[];
  /** Podcasts the author has appeared on. */
  podcasts: string[];
  editorialApproach: string[];
  social: { label: string; handle: string; url: string }[];
  knowsAbout: string[];
  /** Stable schema.org Person @id — referenced by every BlogPosting. */
  personId: string;
};

export const AUTHORS: Author[] = [
  {
    slug: "ahmed-amwell",
    name: "Ahmed Amwell",
    alternateName: "Ahmed Mansour",
    role: "Founder & CEO",
    company: "Luxury Supercars Dubai",
    metaDescription:
      "Founder and CEO of Luxury Supercars Dubai, Ahmed Amwell writes about supercar rental operations, vehicle selection and the Dubai luxury car market.",
    image: "/images/Ahmed-portrait.png",
    imageAlt: "Ahmed Amwell, founder and CEO of Luxury Supercars Dubai",
    bio: [
      "Ahmed Mansour, professionally known as Ahmed Amwell, is the founder and CEO of Luxury Supercars Dubai. He started the company on the idea that renting a special car should feel as well handled as a five-star hotel stay. The car, the booking, delivery, support and the terms all have to work together.",
      "Ahmed moved from Australia to Dubai and founded the company in 2019 with a handful of cars. The fleet has since grown past 100 luxury, supercar and prestige vehicles, including Ferrari, Lamborghini, McLaren, Bugatti, Rolls-Royce, Bentley, Porsche and Mercedes-AMG. During the COVID-19 downturn he bought while others sat out, and the company later put the Middle East's first self-drive Bugatti Chiron on the rental market. The group also runs Luxury Chauffeur Dubai, its chauffeured-travel arm.",
      "His articles cover the practical questions that come up before renting: which car suits a given trip, what documents are needed, how deposits and insurance work, what mileage limits mean, and how to compare models on more than horsepower. The aim is to give readers the full picture before they book.",
    ],
    highlights: [
      "Every car in the fleet is directly owned. No middlemen, no brokering.",
      "Ahmed personally selects every vehicle that joins the fleet.",
      "If it is in the fleet, it can be driven.",
      "The Middle East's first self-drive Bugatti Chiron rental, backed by a refundable AED 250,000 deposit and straightforward terms.",
    ],
    expertise: [
      {
        title: "Luxury and supercar rental operations",
        body: "Fleet availability, booking workflows, delivery logistics and customer support in Dubai.",
      },
      {
        title: "Vehicle selection and comparison",
        body: "Helping customers compare body styles, performance, comfort, luggage space and occasion suitability.",
      },
      {
        title: "Premium client experience",
        body: "Understanding what international visitors, business travellers and VIP customers expect from a high-value rental.",
      },
      {
        title: "Dubai luxury automotive market",
        body: "First-hand knowledge of the local rental environment, customer expectations and premium vehicle demand.",
      },
    ],
    firstHandStatement:
      "My perspective comes from operating a luxury rental fleet in Dubai and speaking directly with customers about the cars, the booking process and the details that matter after the excitement of choosing a model. I want every article published under my name to give readers useful, honest guidance they can apply before making a booking.",
    quotes: [
      "As people were panicking, I wasn't panicking. I was taking the gamble and just buying stuff.",
      "You work hard, you do right by people, and God gives you more. You look after people, you give to the poor, you help people — you've got to help people.",
    ],
    featuredIn: [
      "Gulf News",
      "Khaleej Times",
      "Rolling Stone MENA",
      "TechBullion",
      "The Influential",
      "Supercar Blondie",
    ],
    podcasts: ["CEOCAST", "The Disruptive Entrepreneur", "Cars & Money"],
    editorialApproach: [
      "Advice is based on the current fleet and the rental terms actually in place.",
      "Prices, age requirements, deposits and insurance details get checked before anything goes out.",
      "Car comparisons focus on real differences in comfort, usability and driving character.",
      "Articles are updated when models, terms or Dubai rules change.",
      "Promotional claims stay grounded and never take the place of practical guidance.",
    ],
    social: [
      {
        label: "Instagram",
        handle: "@ahmed.amwell",
        url: "https://www.instagram.com/ahmed.amwell/",
      },
      {
        label: "TikTok",
        handle: "@ahmed_amwell",
        url: "https://www.tiktok.com/@ahmed_amwell",
      },
      {
        label: "YouTube",
        handle: "@Ahmed.Amwell",
        url: "https://www.youtube.com/@Ahmed.Amwell",
      },
    ],
    knowsAbout: [
      "Luxury car rentals in Dubai",
      "Supercar fleet operations",
      "Luxury vehicle selection",
      "Premium automotive customer experience",
    ],
    personId: `${SITE_URL}/authors/ahmed-amwell#person`,
  },
];

export const AUTHORS_BY_SLUG: Map<string, Author> = new Map(
  AUTHORS.map((a) => [a.slug, a]),
);

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS_BY_SLUG.get(slug);
}

/** Resolve an article byline to a known author (name or legal name). */
export function getAuthorByName(name: string): Author | undefined {
  const needle = name.trim().toLowerCase();
  return AUTHORS.find(
    (a) =>
      a.name.toLowerCase() === needle ||
      (a.alternateName ?? "").toLowerCase() === needle,
  );
}

/**
 * The stable schema.org Person entity. Every BlogPosting that is authored
 * by this author should reference `personId` rather than a fresh inline
 * Person object, so Google sees one identity instead of many duplicates.
 * `worksFor` points at the global Organization @id already used sitewide.
 */
export function personJsonLd(author: Author): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": author.personId,
    name: author.name,
    alternateName: author.alternateName,
    url: author.personId.replace(/#person$/, ""),
    image: `${SITE_URL}${author.image}`,
    jobTitle: author.role,
    description: author.metaDescription,
    knowsAbout: author.knowsAbout,
    worksFor: { "@id": `${SITE_URL}/#business` },
    sameAs: author.social.map((s) => s.url),
  };
}
