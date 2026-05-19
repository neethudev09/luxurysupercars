/**
 * Centralised Sanity env access.
 *
 * Sanity is currently scaffolded but not yet the source of truth for any
 * page (content lives in `lib/*` files). To avoid crashing dev for everyone
 * before a project is provisioned, missing env vars now produce a soft
 * placeholder + console warning. The Studio route itself will throw with a
 * useful message via `assertConfigured()` when an editor actually visits
 * /studio without env set.
 *
 * Wire-up checklist when you're ready to switch Sanity on:
 *   1. Create the project at sanity.io/manage
 *   2. Add NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET to
 *      `.env.local` (and Vercel project envs for staging + prod)
 *   3. Add SANITY_API_TOKEN (write token) if seeding/migrating
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-05-01";

// Write token is server-only — used by migration scripts and any future
// server-side mutations. Leave undefined when only reading.
export const writeToken = process.env.SANITY_API_TOKEN;

export const isConfigured =
  !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  !!process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!isConfigured && typeof window === "undefined") {
  // Server-side warning only — keeps the dev console clean for editors.
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET not set. " +
      "Studio routes and any GROQ fetches will fail until configured.",
  );
}

/**
 * Call this from any code path that requires Sanity to actually function
 * (the /studio route, GROQ queries). Lazy assertion = no boot-time crash.
 */
export function assertConfigured() {
  if (!isConfigured) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and " +
        "NEXT_PUBLIC_SANITY_DATASET in your environment.",
    );
  }
}
