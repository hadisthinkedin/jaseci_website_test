"use client";

import { useState } from "react";

type Link = { label: string; href: string };

const RESOURCE_LINKS: Link[] = [
  { label: "Documentation", href: "#" },
  { label: "jacpacks", href: "https://github.com/jaseci-labs/jacpacks" },
  {
    label: "Examples",
    href: "https://github.com/jaseci-labs/jaseci/tree/main/jac/examples",
  },
];

const COMMUNITY_LINKS: Link[] = [
  { label: "GitHub", href: "https://github.com/jaseci-labs" },
  { label: "Discord", href: "#" },
  { label: "Twitter", href: "#" },
];

const COMPANY_LINKS: Link[] = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
];

const MORE_LINKS: Link[] = [
  { label: "Privacy policy", href: "#" },
  { label: "Terms of service", href: "#" },
  { label: "Brand assets", href: "#" },
  { label: "Press", href: "#" },
];

export default function Footer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="footer" aria-label="Footer">
      <div className="footer__fade" aria-hidden="true" />
      <div className="footer__body">
        <div className="footer__inner">
          <div className="footer__top">
            <div>
              <h2 className="footer__brand">Jaseci</h2>
              <p className="footer__tagline">
                One language for backend, frontend, and AI.
              </p>
            </div>
            <a className="footer__contact" href="mailto:hello@jaseci.org">
              hello@jaseci.org
            </a>
          </div>

          <div className="footer__columns">
            <FooterCol heading="Resources" items={RESOURCE_LINKS} />
            <FooterCol heading="Community" items={COMMUNITY_LINKS} />
            <FooterCol heading="Company" items={COMPANY_LINKS} />
          </div>

          <button
            type="button"
            className="footer__toggle"
            aria-expanded={expanded}
            aria-controls="footer-more"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Show less" : "Show more"}
            <span className="footer__toggle-icon" aria-hidden="true">
              {expanded ? "▴" : "▾"}
            </span>
          </button>

          <div
            id="footer-more"
            className={`footer__more${expanded ? " footer__more--open" : ""}`}
            aria-hidden={!expanded}
          >
            <div className="footer__more-inner">
              <div className="footer__columns">
                <FooterCol heading="Legal & press" items={MORE_LINKS} />
                <div className="footer__col">
                  <div className="footer__col-heading">Office</div>
                  <p className="footer__addr">
                    Jaseci Labs
                    <br />
                    [Street address]
                    <br />
                    [City, State, Country]
                  </p>
                </div>
                <div className="footer__col">
                  <div className="footer__col-heading">Newsletter</div>
                  <form
                    className="footer__newsletter"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      type="email"
                      className="footer__newsletter-input"
                      placeholder="you@example.com"
                      aria-label="Email for newsletter"
                    />
                    <button
                      type="submit"
                      className="footer__newsletter-btn"
                    >
                      Subscribe
                    </button>
                  </form>
                  <p className="footer__addr">Updates, never spam.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <span className="footer__copy">© 2026 Jaseci Labs</span>
            <span className="footer__legal">All rights reserved.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterCol({ heading, items }: { heading: string; items: Link[] }) {
  return (
    <div className="footer__col">
      <div className="footer__col-heading">{heading}</div>
      <ul className="footer__col-list">
        {items.map((it) => {
          const ext = it.href.startsWith("http");
          return (
            <li key={it.label}>
              <a
                href={it.href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
