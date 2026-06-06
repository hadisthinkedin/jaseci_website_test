"use client";

import { useState } from "react";
import LiquidGradient from "../code-compare/LiquidGradient";

export default function AnnouncementPill() {
  const [hover, setHover] = useState(false);
  return (
    <span
      className="pill-wrap"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <LiquidGradient active={hover} />
      <a
        className="pill"
        href="https://jac-builder.jaseci.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Try Jac in your browser
        <span className="pill__arrow" aria-hidden="true">
          →
        </span>
      </a>
    </span>
  );
}
