"use client";

import { useEffect } from "react";

/**
 * Light deterrent against casual content saving. This blocks right-click,
 * copy/cut, and drag-to-save on the public site while keeping form fields
 * usable. It is not hard protection, but it closes the obvious copy paths.
 */
export default function ImageProtection() {
  useEffect(() => {
    const isEditable = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return Boolean(
        target.closest(
          'input, textarea, select, [contenteditable="true"], [data-allow-copy="true"]',
        ),
      );
    };

    const isImage = (target: EventTarget | null) =>
      target instanceof HTMLElement && target.tagName === "IMG";

    const onContextMenu = (e: MouseEvent) => {
      if (!isEditable(e.target)) e.preventDefault();
    };
    const onCopy = (e: ClipboardEvent) => {
      if (!isEditable(e.target)) e.preventDefault();
    };
    const onCut = (e: ClipboardEvent) => {
      if (!isEditable(e.target)) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if (isImage(e.target)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
