// Real brand logos via the Simple Icons CDN (colored). Jac is the survivor.
const ICON = (slug) => `https://cdn.simpleicons.org/${slug}`;

const TILES = [
  { key: "python", label: "Python", src: ICON("python") },
  { key: "ts", label: "TypeScript", src: ICON("typescript") },
  { key: "c", label: "C", src: ICON("c") },
  { key: "react", label: "React", src: ICON("react") },
  { key: "ai", label: "OpenAI", src: ICON("openai") },
  { key: "node", label: "Node.js", src: ICON("nodedotjs") },
  { key: "docker", label: "Docker", src: ICON("docker") },
  { key: "db", label: "MongoDB", src: ICON("mongodb") },
  { key: "jac", label: "Jac", text: "Jac", keep: true },
];

export default function ReplacesGrid() {
  return (
    <div aria-label="One language replaces all of these">
      <div className="grid grid-cols-3 gap-px border border-black bg-black">
        {TILES.map((t) => (
          <div
            key={t.key}
            className={`relative flex aspect-square items-center justify-center ${
              t.keep ? "bg-black text-white" : "bg-white text-black"
            }`}
            aria-label={t.label}
          >
            {t.text ? (
              <span className="text-3xl font-bold tracking-tight">{t.text}</span>
            ) : (
              <img
                src={t.src}
                alt={t.label}
                loading="lazy"
                className="h-12 w-12 object-contain"
              />
            )}

            {!t.keep && (
              <svg
                viewBox="0 0 100 100"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <line
                  x1="16"
                  y1="16"
                  x2="84"
                  y2="84"
                  stroke="black"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="100"
                  className="slash-loop"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs font-medium uppercase tracking-widest text-neutral-500">
        One language replaces all of this
      </p>
    </div>
  );
}
