"use client";

/* Pill-styled external link with the liquid gradient playing in its
   border halo on hover. Used by the Scale + Stack showcases. */

import { useState } from "react";
import LiquidGradient from "../code-compare/LiquidGradient";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function LearnMoreLink({ href, children }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="learn-more-wrap"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <LiquidGradient active={hover} />
      <a
        className="cta-pill interop__cta"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    </span>
  );
}
