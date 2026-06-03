/* Placeholder-text "ecosystem" section — three-card showcase modeled
   on the LangChain marketing layout: header row, dark-panel diagram on
   top of each card, mono brand line, bold headline, muted description,
   "Explore →" link. All copy is invented; brand SVGs are minimal
   geometric placeholders meant to be swapped for real assets. */

type Card = {
  slug: string;
  brand: string;
  headline: string;
  description: string;
  href: string;
  Glyph: () => React.JSX.Element;
  Diagram: () => React.JSX.Element;
};

const CARDS: Card[] = [
  {
    slug: "jacpacks",
    brand: "jacpacks",
    headline: "The pack registry for Jac.",
    description: "Search, install, and publish Jac packages.",
    href: "https://github.com/jaseci-labs/jacpacks",
    Glyph: GlyphNodes,
    Diagram: DiagramAgent,
  },
  {
    slug: "jac-shadcn",
    brand: "jac-shadcn",
    headline: "shadcn components for Jac.",
    description: "Drop-in UI primitives for cl def views.",
    href: "https://github.com/jaseci-labs/jac-shadcn",
    Glyph: GlyphLine,
    Diagram: DiagramDeploy,
  },
  {
    slug: "littleX",
    brand: "littleX",
    headline: "A small social platform, fully in Jac.",
    description: "Reference template for end-to-end Jaseci apps.",
    href: "https://github.com/jaseci-labs/littleX",
    Glyph: GlyphWalker,
    Diagram: DiagramWalker,
  },
];

const ORG_URL = "https://github.com/jaseci-labs";

export default function Ecosystem() {
  return (
    <section className="eco" aria-label="Build with the Jac framework family">
      <header className="eco__header">
        <h2 className="eco__title">
          Build with the
          <br />
          Jac framework family
        </h2>
        <p className="eco__lede">
          Three Jac-native frameworks for different jobs. Pick what fits —
          they compose.
        </p>
      </header>

      <div className="eco__grid">
        {CARDS.map(({ slug, brand, headline, description, href, Glyph, Diagram }) => (
          <article key={slug} className="eco__card">
            <a
              className="eco__diagram"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${brand} on GitHub`}
            >
              <Diagram />
            </a>
            <div className="eco__brand">
              <span className="eco__glyph" aria-hidden="true">
                <Glyph />
              </span>
              <span className="eco__wordmark">{brand}</span>
            </div>
            <h3 className="eco__cardline">{headline}</h3>
            <p className="eco__carddesc">{description}</p>
            <a
              className="eco__explore"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Explore {brand}</span>
              <span className="eco__explore-arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
          </article>
        ))}
      </div>

      <a
        className="eco__all"
        href={ORG_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>All packs on github</span>
        <span className="eco__explore-arrow" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </a>
    </section>
  );
}

function ArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.9852 4L12 10.7704H10.9314V6.60741L10.9462 5.80741L4.74211 12L4 11.2444L10.2041 5.03704L9.47681 5.05185L5.21707 5.05185V4L11.9852 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ───────── Brand glyphs (placeholder geometric SVGs) ───────── */

function GlyphNodes() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7.4 7.4 L10.6 16.6 M16.6 7.4 L13.4 16.6 M8 6 L16 6" />
    </svg>
  );
}

function GlyphWalker() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18 L9 12 L14 16 L20 6" />
      <circle cx="4" cy="18" r="1.2" />
      <circle cx="9" cy="12" r="1.2" />
      <circle cx="14" cy="16" r="1.2" />
      <circle cx="20" cy="6" r="1.2" />
    </svg>
  );
}

function GlyphLine() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h6 M15 12h6" />
      <rect x="9" y="8" width="6" height="8" rx="1.5" />
    </svg>
  );
}

/* ───────── Card diagrams (white on dark, architectural style) ───────── */

const NODE_STYLE = {
  fill: "rgba(255,255,255,0.04)",
  stroke: "rgba(255,255,255,0.85)",
  strokeWidth: 1.2,
  rx: 4,
};

const LABEL_STYLE: React.SVGAttributes<SVGTextElement> = {
  fill: "rgba(255,255,255,0.92)",
  fontFamily: "var(--font-code, monospace)",
  fontSize: 10,
  textAnchor: "middle",
  dominantBaseline: "middle",
};

function Node({ x, y, w = 72, h = 26, label }: { x: number; y: number; w?: number; h?: number; label: string; }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} {...NODE_STYLE} />
      <text x={x + w / 2} y={y + h / 2 + 0.5} {...LABEL_STYLE}>
        {label}
      </text>
    </g>
  );
}

const LINK_STYLE = {
  stroke: "rgba(255,255,255,0.7)",
  strokeWidth: 1.2,
  fill: "none",
  markerEnd: "url(#eco-arrow)",
};

const LINK_DASHED = {
  ...LINK_STYLE,
  strokeDasharray: "3 3",
};

function Arrowhead() {
  return (
    <defs>
      <marker
        id="eco-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.8)" />
      </marker>
    </defs>
  );
}

function DiagramAgent() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Arrowhead />
      <Node x={36} y={20} label="prompt" />
      <Node x={36} y={140} label="tools" />
      <Node x={216} y={140} label="memory" />
      <Node x={124} y={80} label="agent" />
      <Node x={216} y={20} label="output" />
      <path d={"M108 33 L124 80"} {...LINK_STYLE} />
      <path d={"M196 80 L216 33"} {...LINK_STYLE} />
      <path d={"M124 100 L108 140"} {...LINK_STYLE} />
      <path d={"M196 100 L216 140"} {...LINK_STYLE} />
      <path d={"M252 140 Q272 100 252 33"} {...LINK_DASHED} />
    </svg>
  );
}

function DiagramWalker() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Arrowhead />
      <Node x={124} y={77} label="walker" />
      <Node x={20} y={20} label="node a" />
      <Node x={228} y={20} label="node b" />
      <Node x={20} y={134} label="node c" />
      <Node x={228} y={134} label="node d" />
      <path d={"M124 90 L92 33"} {...LINK_STYLE} />
      <path d={"M196 90 L228 33"} {...LINK_STYLE} />
      <path d={"M124 103 L92 134"} {...LINK_STYLE} />
      <path d={"M196 103 L228 134"} {...LINK_STYLE} />
    </svg>
  );
}

function DiagramDeploy() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <Arrowhead />
      <Node x={20} y={77} label="walker" />
      <Node x={124} y={77} label="route" />
      <Node x={228} y={77} label="response" />
      <Node x={124} y={20} label="client" w={72} h={26} />
      <path d={"M92 90 L124 90"} {...LINK_STYLE} />
      <path d={"M196 90 L228 90"} {...LINK_STYLE} />
      <path d={"M160 46 L160 77"} {...LINK_DASHED} />
      <path d={"M228 103 Q200 150 160 103"} {...LINK_DASHED} />
    </svg>
  );
}
