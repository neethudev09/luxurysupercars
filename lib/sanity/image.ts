/**
 * Sanity image URL builder. Use the `urlFor` helper anywhere you'd
 * normally pass a static URL into next/image:
 *
 *   <Image src={urlFor(car.heroImage).width(1600).quality(85).url()} ... />
 *
 * Image references come from Sanity in the form { _ref, _type: 'reference' }
 * — pass the whole image asset object (with hotspot) to preserve crops.
 */
import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
