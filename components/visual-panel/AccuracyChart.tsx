"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

// Placeholder dataset — swap for real benchmark numbers later.
const SERIES_A = 570;
const SERIES_B = 1260;
const TOTAL = SERIES_A + SERIES_B;

export default function AccuracyChart() {
  // Mirrors the Hero BenchmarkWidget pattern: bars start at 0 and tween up
  // to their real values when the card enters the snap viewport. Each
  // re-entry replays the animation. Recharts' built-in animation handles
  // the tween between the two states.
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const root = document.querySelector<HTMLElement>(".scroll-root");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setInView(true);
          else setInView(false);
        }
      },
      { root, threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const data = [
    {
      name: "current",
      seriesA: inView ? SERIES_A : 0,
      seriesB: inView ? SERIES_B : 0,
    },
  ];
  const displayedTotal = inView ? TOTAL : 0;

  return (
    <article ref={cardRef} className="accuracy" aria-label="Accuracy benchmark">
      <header className="accuracy__head">
        <h3 className="accuracy__title">Accuracy Benchmark</h3>
        <p className="accuracy__sub">Placeholder dataset</p>
      </header>

      <div className="accuracy__chart">
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={110}
          >
            <RadialBar
              dataKey="seriesA"
              stackId="a"
              cornerRadius={5}
              fill="var(--accent)"
              stroke="transparent"
              strokeWidth={2}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <RadialBar
              dataKey="seriesB"
              stackId="a"
              cornerRadius={5}
              fill="#f4a93c"
              stroke="transparent"
              strokeWidth={2}
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const cx = viewBox.cx ?? 0;
                    const cy = viewBox.cy ?? 0;
                    return (
                      <text x={cx} y={cy} textAnchor="middle">
                        <tspan
                          x={cx}
                          y={cy - 14}
                          className="accuracy__total"
                        >
                          {displayedTotal.toLocaleString()}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 6}
                          className="accuracy__total-sub"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <footer className="accuracy__foot">
        <div className="accuracy__trend">
          Trending up by 5.2% this run
          <TrendingUp className="accuracy__trend-icon" aria-hidden="true" />
        </div>
        <div className="accuracy__caption">Placeholder copy</div>
      </footer>
    </article>
  );
}
