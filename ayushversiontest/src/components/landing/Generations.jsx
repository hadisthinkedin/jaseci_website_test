import { useEffect, useRef, useState } from "react";
import { versions } from "../../lib/generations.js";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

function Toggle({ version, setVersion }) {
  return (
    <div className="inline-flex border border-black text-sm">
      {["A", "B"].map((k) => (
        <button
          key={k}
          onClick={() => setVersion(k)}
          className={`px-4 py-2 font-medium ${
            version === k ? "bg-black text-white" : "bg-white hover:bg-neutral-100"
          }`}
        >
          {versions[k].name}
        </button>
      ))}
    </div>
  );
}

// Shared tag-pile that collapses into a single "Jac" tile.
function CollapseVisual({ tags, showTags, collapsed }) {
  return (
    <div className="relative mx-auto mt-10 flex h-32 max-w-xl items-center justify-center">
      <div
        className={`flex flex-wrap items-center justify-center gap-3 transition-all duration-700 ease-out ${
          collapsed
            ? "scale-50 opacity-0 blur-[1px]"
            : showTags
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
        }`}
      >
        {tags.map((t) => (
          <span key={t} className="border border-black px-3 py-1 text-sm">
            {t}
          </span>
        ))}
      </div>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
          collapsed ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <span className="border border-black bg-black px-7 py-3 text-2xl font-bold tracking-tight text-white">
          Jac
        </span>
      </div>
    </div>
  );
}

function Beat({ beat, active }) {
  return (
    <div
      className={`absolute inset-x-0 top-0 transition-all duration-500 ease-out ${
        active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
        {beat.label}
      </p>
      <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
        {beat.headline}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">{beat.body}</p>
    </div>
  );
}

export default function Generations() {
  const [version, setVersion] = useState("A");
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isReduced = reduced();

  const beats = versions[version].beats;
  const tags = beats.find((b) => b.tags)?.tags || [];

  useEffect(() => {
    if (isReduced) return;
    let ticking = false;
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, total);
      const p = total > 0 ? scrolled / total : 0;
      setActive(clamp(Math.floor(p * beats.length), 0, beats.length - 1));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isReduced, beats.length, version]);

  // Scroll the window so a given beat becomes active (drives the pinned stage).
  const scrollToBeat = (b) => {
    const el = ref.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const target = clamp(b, 0, beats.length - 1);
    const p = (target + 0.5) / beats.length;
    window.scrollTo({ top: top + p * total, behavior: "smooth" });
  };

  // Jump straight past the whole section to what comes next.
  const scrollPast = () => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + el.offsetHeight, behavior: "smooth" });
  };

  // Tags appear on the Gen 2 beat (index 2); collapse on Gen 3 (index 3+).
  const showTags = active >= 2;
  const collapsed = active >= 3;

  // Reduced motion / no-JS-scroll fallback: plain stacked list.
  if (isReduced) {
    return (
      <section className="border-b border-black">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Toggle version={version} setVersion={setVersion} />
          <div className="mt-10 divide-y divide-neutral-200 text-left">
            {beats.map((b, i) => (
              <div key={i} className="py-10">
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  {b.label}
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">{b.headline}</h2>
                <p className="mt-3 text-lg text-neutral-700">{b.body}</p>
                {b.tags && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {b.tags.map((t) => (
                      <span key={t} className="border border-black px-3 py-1 text-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {b.collapse && (
                  <span className="mt-4 inline-block border border-black bg-black px-7 py-3 text-2xl font-bold text-white">
                    Jac
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[650vh] border-b border-black bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-4xl px-6 text-center">
          <Toggle version={version} setVersion={setVersion} />

          {/* Text beats (stacked, cross-faded) */}
          <div className="relative mt-12 min-h-[220px]">
            {beats.map((b, i) => (
              <Beat key={i} beat={b} active={i === active} />
            ))}
          </div>

          {/* Shared collapse visual */}
          <CollapseVisual tags={tags} showTags={showTags} collapsed={collapsed} />
        </div>

        {/* Vertical beat nav */}
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
          <button
            onClick={() => scrollToBeat(active - 1)}
            aria-label="Previous beat"
            className="flex h-8 w-8 items-center justify-center border border-black text-xs hover:bg-black hover:text-white"
          >
            ▲
          </button>
          {beats.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToBeat(i)}
              aria-label={`Go to beat ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-black transition-colors ${
                i === active ? "bg-black" : "bg-white hover:bg-neutral-300"
              }`}
            />
          ))}
          <button
            onClick={() => scrollToBeat(active + 1)}
            aria-label="Next beat"
            className="flex h-8 w-8 items-center justify-center border border-black text-xs hover:bg-black hover:text-white"
          >
            ▼
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={scrollPast}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 border border-black bg-white px-3 py-1.5 text-xs font-medium hover:bg-black hover:text-white"
        >
          Skip ↓
        </button>
      </div>
    </section>
  );
}
