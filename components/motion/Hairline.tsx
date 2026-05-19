"use client";

import Reveal from "./Reveal";

export default function Hairline({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal as="span" className={`block ${className}`} delay={delay}>
      <span className="hairline" />
    </Reveal>
  );
}
