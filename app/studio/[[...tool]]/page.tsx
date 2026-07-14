"use client";

/**
 * Embedded Sanity Studio route. Catches every path under /studio and
 * hands it off to NextStudio, which mounts the full Studio SPA.
 *
 * - Editors log in at luxurysupercarsdubai.com/studio
 * - GROQ playground at /studio/vision
 * - Config lives in sanity.config.ts (project root)
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isConfigured } from "@/sanity/env";

export default function StudioPage() {
  if (!isConfigured) {
    return (
      <main
        style={{
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "var(--bg-obsidian, #0a0a0a)",
          color: "var(--ink-hi, #f5f5f5)",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>
            Sanity Studio isn&apos;t configured yet
          </h1>
          <p style={{ opacity: 0.75, lineHeight: 1.6 }}>
            Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code> to your environment, then
            reload. The site itself works without these — only this Studio
            route needs them.
          </p>
        </div>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
