"use client";

import { useState } from "react";

interface ShareStripProps {
  /** Absolute URL of the page being shared. */
  url: string;
  /** Title text passed to share intents. */
  title: string;
  /** Layout — vertical sticky strip (default) or horizontal inline row. */
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/**
 * Share buttons for blog posts. Vertical = sticky left-margin rail on
 * desktop; horizontal = inline row on mobile (or anywhere else).
 *
 * Opens Twitter / Facebook / LinkedIn share intents in new tabs; the
 * fourth button copies the URL to clipboard with a transient confirmation.
 */
export default function ShareStrip({
  url,
  title,
  orientation = "vertical",
  className = "",
}: ShareStripProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const channels = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <XIcon />,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon />,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <LinkedInIcon />,
    },
  ];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Silently fail — clipboard may be blocked in some browsers.
    }
  };

  const containerCls =
    orientation === "vertical"
      ? "flex flex-col gap-3"
      : "flex flex-row items-center gap-3";

  return (
    <div className={`${containerCls} ${className}`.trim()}>
      <span
        className={`font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[var(--ink-lo)] ${
          orientation === "vertical" ? "[writing-mode:vertical-rl] rotate-180 mb-2" : ""
        }`}
      >
        Share
      </span>
      {channels.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target="_blank"
          rel="noreferrer"
          aria-label={c.label}
          className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-[var(--ink-hi)] hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
        >
          {c.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy link"
        className="relative inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-[var(--ink-hi)] hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
      >
        <LinkIcon />
        {copied && (
          <span
            role="status"
            className={`absolute ${orientation === "vertical" ? "left-12 top-1/2 -translate-y-1/2" : "bottom-11 left-1/2 -translate-x-1/2"} whitespace-nowrap rounded-full bg-[var(--champagne)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--bg-obsidian)]`}
          >
            Copied
          </span>
        )}
      </button>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M12.6 1.5h2.3l-5.1 5.8 6 7.2h-4.7l-3.7-4.5-4.2 4.5H1l5.4-5.8L.6 1.5h4.8l3.4 4.1 3.8-4.1zm-.8 11.7h1.3L4.4 2.8H3l8.8 10.4z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M16 8a8 8 0 1 0-9.25 7.9V10.3H4.72V8h2.03V6.24c0-2 1.2-3.1 3.02-3.1.87 0 1.79.15 1.79.15v1.97h-1.01c-.99 0-1.3.62-1.3 1.25V8h2.22l-.36 2.31H9.25V15.9A8 8 0 0 0 16 8z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M4 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM3.7 5H1.3v9.5h2.4V5zM5.7 5h2.3v1.3h.03c.32-.6 1.1-1.25 2.27-1.25 2.43 0 2.88 1.6 2.88 3.68v5.77H10.8v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.32-1.96 2.69v5.19H4.74V5h.96z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6.5 9.5a3 3 0 0 0 4.24 0l2.83-2.83a3 3 0 1 0-4.24-4.24L7.91 3.85M9.5 6.5a3 3 0 0 0-4.24 0L2.43 9.33a3 3 0 1 0 4.24 4.24l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
