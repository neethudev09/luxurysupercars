import { GOOGLE_REVIEW_SUMMARY } from "@/lib/content";

export default function AggregateRatingJsonLd() {
  const aggregateRating = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GOOGLE_REVIEW_SUMMARY.stars,
      reviewCount: GOOGLE_REVIEW_SUMMARY.count,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRating) }}
    />
  );
}
