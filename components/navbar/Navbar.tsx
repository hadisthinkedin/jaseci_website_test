"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Compare", href: "#code" },
  { label: "Interop", href: "#interop" },
  { label: "Cases", href: "#cases" },
  { label: "Packs", href: "#ecosystem" },
  { label: "Contact", href: "#contact" },
];

const SCROLL_THRESHOLD = 60;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".scroll-root");
    if (!root) return;
    const onScroll = () => setScrolled(root.scrollTop > SCROLL_THRESHOLD);
    onScroll();
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`nav-wrap${scrolled ? " nav-wrap--scrolled" : ""}`}>
      <nav className="nav" aria-label="Primary">
        <CornerMark pos="tl" />
        <CornerMark pos="tr" />
        <CornerMark pos="bl" />
        <CornerMark pos="br" />

        <div className="nav__row">
          <a className="nav__brand" href="#home" aria-label="Jaseci home">
            JASECI
          </a>

          <ul className="nav__links" role="list">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a className="nav__link" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__cta">
            <a
              className="nav__cta-secondary"
              href="https://github.com/jaseci-labs"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a className="nav__cta-primary" href="#code">
              Get started
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}

function CornerMark({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  return (
    <span className={`nav__corner nav__corner--${pos}`} aria-hidden="true">
      <span className="nav__corner-h" />
      <span className="nav__corner-v" />
    </span>
  );
}
