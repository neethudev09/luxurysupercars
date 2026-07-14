"use client";

import React from "react";
import dynamic from "next/dynamic";
import { isConfigured } from "@/sanity/env";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((m) => m.NextStudio),
  { ssr: false },
);
const config = () => import("@/sanity.config").then((m) => m.default);

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
  return <StudioLoader />;
}

function StudioLoader() {
  const [cfg, setCfg] = React.useState<any>(null);
  React.useEffect(() => { config().then(setCfg); }, []);
  if (!cfg) return null;
  return <NextStudio config={cfg} />;
}
