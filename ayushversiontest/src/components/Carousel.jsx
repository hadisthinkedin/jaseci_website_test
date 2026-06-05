import { useEffect, useState } from "react";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

// Auto-advancing, one-at-a-time carousel. Seamless forward loop via a cloned
// first slide; clamped transform + timer-based reset so it never shows a blank
// frame (even when the tab is backgrounded). Pauses on hover.
export default function Carousel({ slides, interval = 2500 }) {
  const isReduced = reduced();
  const [i, setI] = useState(0);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const real = i % n;

  useEffect(() => {
    if (isReduced || paused) return;
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      setI((x) => x + 1);
    }, interval);
    return () => clearInterval(id);
  }, [isReduced, paused, interval]);

  useEffect(() => {
    if (i < n) return;
    const t = setTimeout(() => {
      setAnim(false);
      setI(0);
    }, 750);
    return () => clearTimeout(t);
  }, [i, n]);

  useEffect(() => {
    if (anim) return;
    const t = setTimeout(() => setAnim(true), 30);
    return () => clearTimeout(t);
  }, [anim]);

  if (isReduced) {
    return (
      <div className="space-y-14">
        {slides.map((s, idx) => (
          <div key={idx}>{s}</div>
        ))}
      </div>
    );
  }

  const next = () => setI((x) => x + 1);
  const prev = () => {
    if (i % n === 0) {
      setAnim(false);
      setI(n - 1);
    } else {
      setI(i - 1);
    }
  };

  const items = [...slides, slides[0]];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${clamp(i, 0, n) * 100}%)`,
            transition: anim ? "transform 700ms cubic-bezier(0.22,1,0.36,1)" : "none",
          }}
        >
          {items.map((s, idx) => (
            <div key={idx} className="w-full shrink-0">
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={prev}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center border border-black text-lg hover:bg-black hover:text-white"
        >
          ‹
        </button>
        <div className="flex gap-2.5">
          {slides.map((_, d) => (
            <button
              key={d}
              aria-label={`Go to ${d + 1}`}
              onClick={() => {
                setAnim(true);
                setI(d);
              }}
              className={`h-2.5 w-2.5 rounded-full border border-black transition-colors ${
                real === d ? "bg-black" : "bg-white hover:bg-neutral-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center border border-black text-lg hover:bg-black hover:text-white"
        >
          ›
        </button>
      </div>
    </div>
  );
}
