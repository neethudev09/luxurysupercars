"use client";

import { useEffect } from "react";

const FONTSHARE_URL =
  "https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap";

export default function FontLoader() {
  useEffect(() => {
    const exists = document.querySelector(
      `link[href="${FONTSHARE_URL}"]`,
    );
    if (exists) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTSHARE_URL;
    document.head.appendChild(link);
  }, []);

  return null;
}
