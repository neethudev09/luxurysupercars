import { NextResponse } from "next/server";
import { UNIQUE_CARS, carHref, type Category } from "@/lib/fleet";

const CATEGORY_LABELS: Record<Category, string> = {
  sports: "Sports Cars",
  convertible: "Convertible Cars",
  luxury: "Luxury Cars",
  suv: "SUV Cars",
};

export function GET() {
  return NextResponse.json(
    UNIQUE_CARS.map((car) => ({
      name: car.name,
      brandName: car.brandName,
      category: car.category,
      href: carHref(car),
      search: [
        car.name,
        car.brandName,
        car.brand,
        car.slug,
        CATEGORY_LABELS[car.category],
        ...car.categories.map((category) => CATEGORY_LABELS[category]),
      ]
        .join(" ")
        .toLowerCase(),
    })),
  );
}
