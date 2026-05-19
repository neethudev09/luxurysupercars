/**
 * Sanity HTTP clients.
 *
 * - `sanityClient` — read-only, used by `sanityFetch` for build-time +
 *   ISR data fetching across server components.
 * - `sanityWriteClient` — server-only, includes the write token; used
 *   by migration scripts and any future server actions that mutate
 *   documents. Never import into a client component.
 */
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, writeToken } from "@/sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,            // CDN edge cache — fine for read-only public content
  perspective: "published", // only published documents on the public site
});

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,           // mutations bypass CDN
  token: writeToken,       // undefined on the public client — throws on write attempt
});

/**
 * Tagged fetch with optional revalidation tags for selective ISR.
 * Pass a tag (e.g. `"car"`, `"blog-post"`) and we'll let the
 * /api/revalidate route purge only those paths when Sanity webhooks fire.
 */
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });
}
