"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import AccuracyChart from "./AccuracyChart";
import LiquidGradient from "../code-compare/LiquidGradient";

const LOTTIE_SRC = "/lotties/movemodels.json";
const PROJECTS_HREF = "/projects";

// 9 flip cards positioned to match the lottie's frame-60 grid. Coordinates
// are percentages of the img-cover canvas (which has the same 780x680
// aspect as the lottie viewBox). Image layers in the lottie render at
// scale=20% of a 512px source, so each tile is 512*0.2 / 780 = 13.13%
// wide in canvas coords — keep the HTML cards the same width so they sit
// pixel-aligned over the lottie tiles when the fade swap happens.
const TILES = [
  { id: "python",     name: "Python",     x: 35.62, y: 34.09 },
  { id: "typescript", name: "TypeScript", x: 50.00, y: 34.04 },
  { id: "zig",        name: "Zig",        x: 64.36, y: 34.02 },
  { id: "react",      name: "React",      x: 35.61, y: 50.56 },
  { id: "openai",     name: "OpenAI",     x: 50.00, y: 50.54 },
  { id: "node",       name: "Node",       x: 64.36, y: 50.54 },
  { id: "docker",     name: "Docker",     x: 35.61, y: 67.02 },
  { id: "sqlalchemy", name: "SQLAlchemy", x: 50.00, y: 66.99 },
  { id: "flask",      name: "Flask",      x: 64.35, y: 66.99 },
];

// Each shadow layer renders as a `<g filter="url(#…)">` Gaussian-blur group.
// On animation complete, hide those so the icons sit cleanly on the backdrop
// without the dark blurred halos.
function hideLottieGlowLayers(svg: SVGSVGElement) {
  svg.querySelectorAll<SVGGraphicsElement>("g[filter]").forEach((g) => {
    g.setAttribute("data-vp-hidden", "1");
    g.style.display = "none";
  });
}

function restoreLottieGlowLayers(svg: SVGSVGElement) {
  svg.querySelectorAll<SVGGraphicsElement>("[data-vp-hidden]").forEach((el) => {
    el.style.display = "";
    el.removeAttribute("data-vp-hidden");
  });
}

export default function VisualPanel() {
  const [data, setData] = useState<unknown>(null);
  const [done, setDone] = useState(false);
  const [imgHover, setImgHover] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(LOTTIE_SRC)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Replay on scroll-into-view. .scroll-root in app/page.tsx is the actual
  // snap-scroll container, so IO uses it as the root.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !data) return;
    const root = document.querySelector<HTMLElement>(".scroll-root");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const player = lottieRef.current;
          if (!player) continue;
          const svg = sectionRef.current?.querySelector<SVGSVGElement>(
            ".vp-anim svg",
          );
          if (e.isIntersecting) {
            setDone(false);
            if (svg) restoreLottieGlowLayers(svg);
            player.goToAndPlay(0, true);
          }
          // Leaving the viewport: leave the player wherever it is.
          // Calling .stop() rewinds to frame 0, where every icon is at
          // its offscreen start position — which the user perceives as
          // "icons disappeared" if the section is still partially in
          // view. The next intersect will replay from 0 via goToAndPlay.
        }
      },
      { root, threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [data]);

  return (
    <div ref={sectionRef} className="section-base_visual">
      <div className="visual-cols">
        <div className="visual-col visual-col--chart">
          <AccuracyChart />
        </div>
        <div className="visual-col visual-col--lottie">
          <div className="vp-stage">
            <div
              className="img-cover"
              onMouseEnter={() => setImgHover(true)}
              onMouseLeave={() => setImgHover(false)}
            >
              {/* Always-on backdrop: IMG_4925.jpg sits behind the lottie
                  in the same rounded-square spot the old blue Tile.png
                  occupied. Decorative. */}
              <div className="vp-final vp-final--visible" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/IMG_4925.jpg" alt="" />
              </div>
              {/* Hover-only gradient overlay clipped to the same rounded
                  square the IMG_4925.jpg occupies. Sits above the image
                  (covers it) but below the lottie icons. */}
              <div className="vp-image-bg" aria-hidden="true">
                <div className="vp-image-bg__inner">
                  <LiquidGradient active={imgHover} />
                </div>
              </div>
              <div
                className={`vp-anim${done ? " vp-anim--faded" : ""}`}
                aria-hidden="true"
              >
                {data ? (
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={data}
                    autoplay={false}
                    loop={false}
                    onComplete={() => {
                      setDone(true);
                      const svg = sectionRef.current?.querySelector<SVGSVGElement>(
                        ".vp-anim svg",
                      );
                      if (svg) hideLottieGlowLayers(svg);
                      lottieRef.current?.goToAndStop(60, true);
                    }}
                    rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : null}
              </div>
              {/* Flip-card overlay. Hidden during fly-in; fades in when the
                  lottie completes and takes over for hover interactivity.
                  Each card flips on hover to reveal a blank white back. */}
              <div
                className={`vp-tiles${done ? " vp-tiles--visible" : ""}`}
                aria-hidden={!done}
              >
                {TILES.map((t) => (
                  <div
                    key={t.id}
                    className="vp-tile"
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                  >
                    <div className="vp-tile__inner">
                      <div className="vp-tile__face vp-tile__face--front">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/lotties/tiles/${t.id}.png`} alt={t.name} />
                      </div>
                      <div className="vp-tile__face vp-tile__face--back" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <a
              className={`vp-link${done ? " vp-link--visible" : ""}`}
              href={PROJECTS_HREF}
              tabIndex={done ? 0 : -1}
              aria-hidden={!done}
            >
              view projects built with jaseci
              <span className="vp-link__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
