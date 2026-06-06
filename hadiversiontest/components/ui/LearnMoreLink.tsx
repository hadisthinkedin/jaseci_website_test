"use client";

/* Pill-styled external link with the liquid gradient filling the entire
   button on hover. Used by the Scale + Stack showcases. */

import { useState } from "react";
import LiquidGradient from "../code-compare/LiquidGradient";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function LearnMoreLink({ href, children }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <a
      className="cta-pill interop__cta learn-more"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <LiquidGradient active={hover} />
      <span className="learn-more__label">{children}</span>
    </a>
  );
}
