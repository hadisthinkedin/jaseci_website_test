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
  Glyph: () => React.JSX.Element;
  Diagram: () => React.JSX.Element;
};

const CARDS: Card[] = [
  {
    slug: "nodeforge",
    brand: "nodeforge",
    headline: "Build graphs that reason.",
    description: "For agents and decision loops.",
    Glyph: GlyphNodes,
    Diagram: DiagramAgent,
  },
  {
    slug: "walkerpath",
    brand: "walkerpath",
    headline: "State that lives in your graph.",
    description: "For persistent objects without a database.",
    Glyph: GlyphWalker,
    Diagram: DiagramWalker,
  },
  {
    slug: "jacline",
    brand: "jacline",
    headline: "Deploy any walker as an endpoint.",
    description: "For zero-glue services.",
    Glyph: GlyphLine,
    Diagram: DiagramDeploy,
  },
];

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
        {CARDS.map(({ slug, brand, headline, description, Glyph, Diagram }) => (
          <article key={slug} className="eco__card">
            <div className="eco__diagram" aria-hidden="true">
              <Diagram />
            </div>
            <div className="eco__brand">
              <span className="eco__glyph" aria-hidden="true">
                <Glyph />
              </span>
              <span className="eco__wordmark">{brand}</span>
            </div>
            <h3 className="eco__cardline">{headline}</h3>
            <p className="eco__carddesc">{description}</p>
            <a className="eco__explore" href={`#${slug}`}>
              Explore {brand}
              <span aria-hidden="true"> →</span>
            </a>
          </article>
        ))}
      </div>
    </section>
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
