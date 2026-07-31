// Reference: the deployed 410 Gone handler is ../proxy.ts (Next.js 16 proxy).
// It runs before redirects() and returns HTTP 410 for legacy WordPress URLs
// that have no current replacement, instead of soft-404ing or homepage-redirecting.
// The matcher is inlined (no trailing slashes) because Next requires the
// `config.matcher` value to be statically analyzable at compile time.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { legacyGonePaths } from "./lsr-gone-paths.generated";

const gone = new Set(legacyGonePaths.map((p) => p.replace(/\/+$/, "")));

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/+$/, "");
  if (gone.has(path)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/ar/my-account",
    "/bmw/rent-bmw-x6-m-competition-2022-2",
    "/brands/rent-maserati-dubai/levante",
    "/cars-seats",
    "/cars/bentley-gt-rental",
    "/cars/range-rover-svr-dubai",
    "/cars/rent-ford-mustang-convertible-dubai",
    "/comments/feed",
    "/ferrari/rent-ferrari-f8-tributo-spyder",
    "/lamborghini/rent-lamborghini-huracan-evo-spyder",
    "/lamborghini/rent-lamborghini-huracan-evo-spyder-2022",
    "/lamborghini/rent-lamborghini-urus",
    "/lamborghini/rent-lamborghini-urus-2021",
    "/mercedes/mercedes-maybach-s560",
    "/mercedes/rent-mercedes-benz-g63-amg-2021-2",
    "/mercedes/rent-mercedes-benz-g63-amg-2021-3",
    "/product-tag/911-gt3",
    "/product/4097",
    "/range-rover/rent-range-rover-svr-2021-2",
    "/rent-bentley-dubai/bentley-bentayga-2022-copy",
    "/rent-electric-cars-dubai/feed",
    "/rent-range-rover-dubai/range-rover-svr-orange/feed",
    "/rolls-royce/rent-rolls-royce-dawn-2021-2",
    "/rolls-royce/rent-rolls-royce-dawn-2021-3",
    "/user",
    "/what-happened-when-whats-on-rented-a-lamborghini",
    "/wp-json",
  ],
};
