"use client";

import { useEffect } from "react";

/**
 * Light deterrent against casual image saving — blocks the right-click context
 * menu and drag-to-save on every <img> on the site. Not a hard protection
 * (anyone determined can still pull from the network tab), but it stops the
 * obvious "right-click → Save image" path the owner asked to close off.
 */
export default function ImageProtection() {
  useEffect(() => {
    const isImage = (t: EventTarget | null) =>
      t instanceof HTMLElement && t.tagName === "IMG";

    const onContextMenu = (e: MouseEvent) => {
      if (isImage(e.target)) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if (isImage(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
