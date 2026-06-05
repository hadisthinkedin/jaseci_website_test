import { useEffect, useRef, useState } from "react";
import { pillars } from "../../lib/pillars.js";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Heading() {
  return (
    <>
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
        Why we built Jac
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-neutral-700">
        Every app today is really three apps: a backend, a frontend, and an AI
        layer, usually written in three languages that barely talk to each
        other. Jac makes them one.
      </p>
    </>
  );
}

function Slide({ n, total, title, sub, link }) {
  return (
    <div className="w-full shrink-0">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-black bg-neutral-100 text-[10px] uppercase tracking-widest text-neutral-400">
          Icon
        </div>
        <p className="font-mono text-sm text-neutral-500">
          {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h3 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          {title}
        </h3>
        <p className="mt-4 text-lg text-neutral-700">{sub}</p>
        <a href={link} className="mt-6 inline-block font-medium underline">
          Learn more →
        </a>
      </div>
    </div>
  );
}

export default function WhyJaseci() {
  const isReduced = reduced();
  const [i, setI] = useState(0);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);

  // One extra slide (clone of the first) so we always move forward and loop
  // seamlessly, never sliding backward through the deck.
  const slides = [...pillars, pillars[0]];
  const real = i % pillars.length;

  useEffect(() => {
    if (isReduced || paused) return;
    const id = setInterval(() => {
      // Don't advance while the tab is hidden, timers keep firing in the
      // background but paint/reset logic doesn't, which could otherwise run
      // the index past the clone and show a blank frame on return.
      if (typeof document !== "undefined" && document.hidden) return;
      setI((x) => x + 1);
    }, 2000);
    return () => clearInterval(id);
  }, [isReduced, paused]);

  // Seamless reset: once we land on the cloned slide, jump back to the start
  // with no transition. Driven by a timer (not transitionend) so it always
  // fires, even if a transition event is missed.
  useEffect(() => {
    if (i < pillars.length) return;
    const t = setTimeout(() => {
      setAnim(false);
      setI(0);
    }, 750);
    return () => clearTimeout(t);
  }, [i]);

  useEffect(() => {
    if (anim) return;
    const t = setTimeout(() => setAnim(true), 30);
    return () => clearTimeout(t);
  }, [anim]);

  const next = () => setI((x) => x + 1);
  const prev = () => {
    if (i % pillars.length === 0) {
      setAnim(false);
      setI(pillars.length - 1);
    } else {
      setI(i - 1);
    }
  };

  if (isReduced) {
    return (
      <section className="border-b border-black">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Heading />
          <div className="mt-12 grid gap-px border border-black bg-black md:grid-cols-2">
            {pillars.map((p) => (
              <a key={p.title} href={p.link} className="bg-white p-8">
                <h3 className="text-xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-neutral-600">{p.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-24">
        <Heading />
      </div>

      <div
        className="mx-auto mt-14 max-w-6xl px-6 pb-20 md:pb-24"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              // Clamp so the track can never translate past the clone slide:
              // guarantees a real slide is always on screen (never blank).
              transform: `translateX(-${Math.min(Math.max(i, 0), pillars.length) * 100}%)`,
              transition: anim ? "transform 700ms cubic-bezier(0.22,1,0.36,1)" : "none",
            }}
          >
            {slides.map((p, idx) => (
              <Slide
                key={idx}
                n={(idx % pillars.length) + 1}
                total={pillars.length}
                title={p.title}
                sub={p.sub}
                link={p.link}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center border border-black text-lg hover:bg-black hover:text-white"
          >
            ‹
          </button>
          <div className="flex gap-2.5">
            {pillars.map((_, d) => (
              <button
                key={d}
                aria-label={`Go to slide ${d + 1}`}
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
    </section>
  );
}
