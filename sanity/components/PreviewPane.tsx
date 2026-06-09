import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";
import { apiVersion } from "../env";

/**
 * In-Studio "Preview" tab. Shows the live page for the document being edited
 * in an iframe alongside the form, so editors can see the real page without
 * leaving the Studio.
 *
 * NOTE: this shows the PUBLISHED, deployed page (the site renders from a
 * build-time export, not live from Sanity). An editor's changes appear here
 * after they Publish and the site rebuilds (~1–2 min) — then hit Refresh.
 * Wired in sanity/structure.ts (pages) + sanity.config.ts (collections).
 */

// GROQ that resolves the public route for each previewable document type.
const ROUTE_QUERY: Record<string, string> = {
  page: `*[_id == $id][0].routePath`,
  blogPost: `*[_id == $id][0]{ "u": "/blogs/" + slug.current }.u`,
  brand: `*[_id == $id][0]{ "u": "/brands/" + slug.current }.u`,
  service: `*[_id == $id][0]{ "u": "/service/" + slug.current }.u`,
  car: `*[_id == $id][0]{ "u": "/" + brand->slug.current + "/" + slug.current }.u`,
};

interface PreviewPaneProps {
  documentId?: string;
  schemaType?: { name?: string };
}

export function PreviewPane(props: PreviewPaneProps) {
  const client = useClient({ apiVersion });
  const typeName = props.schemaType?.name ?? "";
  const publishedId = (props.documentId ?? "").replace(/^drafts\./, "");

  const [path, setPath] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    const query = ROUTE_QUERY[typeName];
    const run =
      query && publishedId
        ? client.fetch<string | null>(query, { id: publishedId })
        : Promise.resolve<string | null>(null);
    run
      .then((p) => {
        if (active) {
          setPath(p || null);
          setResolved(true);
        }
      })
      .catch(() => {
        if (active) setResolved(true);
      });
    return () => {
      active = false;
    };
  }, [client, typeName, publishedId]);

  const loading = !resolved;
  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = path ? `${origin}${path}` : null;

  const bar: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderBottom: "1px solid var(--card-border-color, #e3e4e8)",
    background: "var(--card-bg-color, #fff)",
    font: "13px/1.4 -apple-system, system-ui, sans-serif",
  };
  const btn: CSSProperties = {
    border: "1px solid var(--card-border-color, #d6d7dc)",
    borderRadius: 4,
    background: "transparent",
    color: "inherit",
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "none",
  };

  if (loading) {
    return <div style={{ padding: 24, font: "14px system-ui", opacity: 0.6 }}>Loading preview…</div>;
  }
  if (!url) {
    return (
      <div style={{ padding: 24, font: "14px/1.5 system-ui", opacity: 0.7 }}>
        No public page to preview for this document yet (add a slug first).
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      <div style={bar}>
        <span style={{ flex: 1, opacity: 0.7 }}>
          Published preview · <code style={{ fontSize: 12 }}>{path}</code>
        </span>
        <button type="button" style={btn} onClick={refresh}>
          ↻ Refresh
        </button>
        <a style={btn} href={url} target="_blank" rel="noreferrer">
          Open ↗
        </a>
      </div>
      <div style={{ padding: "8px 12px", background: "#fff8e6", borderBottom: "1px solid #f0e2b8", font: "12px/1.45 system-ui", color: "#6b5800" }}>
        This shows the <strong>published</strong> page. Your edits appear here after you
        {" "}<strong>Publish</strong> and the site rebuilds (~1–2 min) — then hit Refresh.
      </div>
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <iframe
          key={nonce}
          src={url}
          title="Page preview"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </div>
    </div>
  );
}
