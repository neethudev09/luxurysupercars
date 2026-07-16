import { NextResponse } from "next/server";

const PLACE_ID = process.env.GOOGLE_PLACE_ID!;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const CACHE_TTL = 24 * 60 * 60 * 1000;

let cache: { data: GoogleReviewsResponse; ts: number } | null = null;

interface GoogleReviewsResponse {
  rating: number;
  totalReviews: number;
  reviews: {
    name: string;
    text: string;
    rating: number;
    timeAgo: string;
  }[];
}

async function fetchReviews(): Promise<GoogleReviewsResponse> {
  const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews",
    },
    next: { revalidate: CACHE_TTL / 1000 },
  });

  if (!res.ok) throw new Error(`Google Places API error: ${res.status}`);

  const data = await res.json();

  return {
    rating: data.rating ?? 4.9,
    totalReviews: data.userRatingCount ?? 486,
    reviews: (data.reviews ?? []).map(
      (r: {
        authorAttribution?: { displayName?: string };
        text?: { text?: string };
        rating?: number;
        relativePublishTimeDescription?: string;
      }) => ({
        name: r.authorAttribution?.displayName ?? "Anonymous",
        text: r.text?.text ?? "",
        rating: r.rating ?? 5,
        timeAgo: r.relativePublishTimeDescription ?? "",
      })
    ),
  };
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      return NextResponse.json(cache.data);
    }

    const data = await fetchReviews();
    cache = { data, ts: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        rating: 4.9,
        totalReviews: 486,
        reviews: [],
        error: "Failed to fetch reviews",
      },
      { status: 200 }
    );
  }
}
