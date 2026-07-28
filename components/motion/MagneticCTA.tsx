"use client";

import { ReactNode } from "react";

interface MagneticCTAProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  ariaLabel?: string;
  target?: string;
  rel?: string;
}

export default function MagneticCTA({
  children,
  href,
  onClick,
  className = "",
  ariaLabel,
  target,
  rel,
}: MagneticCTAProps) {
  if (onClick || !href) {
    return (
      <button
        type="button"
        onClick={onClick || (() => {})}
        aria-label={ariaLabel}
        className={`${className} inline-block transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]`}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={`${className} inline-block transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]`}
    >
      {children}
    </a>
  );
}
