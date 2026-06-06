import { useEffect, useState } from "react";

// Chess 20-game benchmark. Widths are proportional to wall time, slowest = 100%.
const ROWS = [
  { name: "Jac", version: "AOT, run only", pct: 35, time: "2.313 s", winner: true },
  { name: "Python", version: "chess.py", pct: 100, time: "6.584 s", winner: false },
];

const BENCHMARK_URL =
  "https://github.com/Jaseci-Labs/jaseci/tree/main/jac/examples/chess";

export default function BenchmarkWidget() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="border border-black p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
        End-to-end wall-clock
      </p>
      <p className="mt-1 text-sm text-neutral-600">Chess engine, 20 games. Lower is better.</p>

      <div className="mt-6 space-y-5">
        {ROWS.map((row, idx) => (
          <div key={row.name}>
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="font-bold tracking-tight">{row.name}</span>
                <span className="font-mono text-xs text-neutral-500">{row.version}</span>
              </div>
              <span
                className={`font-mono text-sm ${row.winner ? "font-bold" : "text-neutral-500"}`}
              >
                {row.time}
              </span>
            </div>
            <div className="mt-2 h-3.5 w-full border border-black bg-white">
              <div
                className={`h-full ${row.winner ? "bg-black" : "bg-neutral-300"}`}
                style={{
                  width: inView ? `${row.pct}%` : "0%",
                  transition: "width 700ms ease-out",
                  transitionDelay: `${idx * 80}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <a
        href={BENCHMARK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block text-sm font-medium underline"
      >
        View benchmark ↗
      </a>
    </div>
  );
}
