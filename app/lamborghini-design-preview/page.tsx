import type { Metadata } from "next";
import LamborghiniDesignPreview from "@/components/sections/LamborghiniDesignPreview";
import { FLEET_BRANDS, type BrandSectionBlock } from "@/lib/fleet-brands";
import { UNIQUE_CARS } from "@/lib/fleet";
import { getCarsByBrand } from "@/lib/fleet-tags";

const BRAND_SLUG = "rent-lamborghini-dubai";

// This route is intentionally isolated from the production Lamborghini brand page.

export const metadata: Metadata = {
  title: "Lamborghini Design Preview | Luxury Supercars Dubai",
  description:
    "Private design preview for the Luxury Supercars Dubai Lamborghini rental page.",
  alternates: { canonical: `/brands/${BRAND_SLUG}` },
  robots: { index: false, follow: false },
};

const FEATURED_SLUGS = [
  "lamborghini-urus-yellow",
  "lamborghini-huracan-evo-coupe",
  "lamborghini-huracan-evo-spyder-yellow",
  "lamborghini-huracan-sto",
  "lamborghini-urus-mansory",
  "lamborghini-revuelto",
];

function sectionBlocks(heading: string): BrandSectionBlock[] {
  const meta = FLEET_BRANDS[BRAND_SLUG];
  return meta.sections.find((section) => section.h2 === heading)?.body ?? [];
}

function listFrom(heading: string): string[] {
  const block = sectionBlocks(heading).find((item) => item.kind === "list");
  return block?.kind === "list" ? block.items : [];
}

function paragraphsFrom(heading: string): string[] {
  return sectionBlocks(heading).flatMap((item) =>
    item.kind === "paragraph" ? [item.text] : [],
  );
}

export default function LamborghiniDesignPreviewPage() {
  const meta = FLEET_BRANDS[BRAND_SLUG];
  const allCars = getCarsByBrand(UNIQUE_CARS, BRAND_SLUG);
  const featuredCars = FEATURED_SLUGS.flatMap((slug) => {
    const car = allCars.find((item) => item.slug === slug);
    return car ? [car] : [];
  });

  const pricingBlock = sectionBlocks(
    "Daily, Weekly, & Monthly Lamborghini Rental Prices in Dubai",
  ).find((item) => item.kind === "table");

  const pricing =
    pricingBlock?.kind === "table"
      ? { headers: pricingBlock.headers, rows: pricingBlock.rows }
      : { headers: [], rows: [] };

  const verifiedCostCopy = paragraphsFrom("Lamborghini Rental in Dubai, UAE")[0] ?? "";
  const verifiedFaqs = [
    {
      q: "How much does it cost to rent a Lamborghini in Dubai?",
      a: verifiedCostCopy,
    },
    ...meta.faqs.filter(
      (item) => item.q !== "How much does it cost to rent a Lamborghini in Dubai?",
    ),
  ];

  return (
    <LamborghiniDesignPreview
      cars={featuredCars}
      heroCar={featuredCars[0] ?? allCars[0]}
      pricing={pricing}
      costCopy={verifiedCostCopy}
      included={listFrom("What Is Included in a Lamborghini Rental")}
      requirements={listFrom("Requirements for Lamborghini Rental in Dubai")}
      whyChoose={listFrom("Why Book with Us for a Lamborghini Rental in Dubai")}
      depositCopy={paragraphsFrom("Lamborghini Rental Deposit Policy")}
      faqs={verifiedFaqs}
    />
  );
}
