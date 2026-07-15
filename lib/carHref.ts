export function carHref(car: { brand: string; slug: string }): string {
  return `/${car.brand}/${car.slug}`;
}
