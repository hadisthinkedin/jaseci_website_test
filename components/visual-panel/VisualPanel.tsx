"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import AccuracyChart from "./AccuracyChart";

const LOTTIE_SRC =
  "https://cdn.prod.website-files.com/68c9c3107effc2ea46e1a81f/69b6b37ab732de7af40519e5_MoveModels.json";
const PROJECTS_HREF = "/projects";

const BIG_TILE_MIN_AREA = 20000;

/**
 * The lottie SVG resolves to a big rounded tile holding 9 icon tiles. To
 * replace the tile background with IMG_4925.jpg while keeping the icons,
 * find the 2 largest filled elements in the SVG (empirically the front
 * and shadow of the big tile, ~171×152 each) and clear their fill so the
 * texture below shows through. Smaller fills (100×100 icon faces, black
 * shadows, colorful glyphs) are untouched.
 */
function hideBigTileBg(svg: SVGSVGElement) {
  type Item = { el: Element; area: number; orig: string };
  const items: Item[] = [];
  svg.querySelectorAll<SVGElement>("[fill]").forEach((el) => {
    const f = el.getAttribute("fill");
    if (!f || f === "none") return;
    try {
      // @ts-expect-error getBBox is on SVGGraphicsElement
      const b = el.getBBox();
      items.push({ el, area: b.width * b.height, orig: f });
    } catch {
      // not a graphics element
    }
  });
  items.sort((a, b) => b.area - a.area);
  for (let i = 0; i < 2; i++) {
    const item = items[i];
    if (item && item.area > BIG_TILE_MIN_AREA) {
      item.el.setAttribute("data-orig-fill", item.orig);
      item.el.setAttribute("fill", "none");
    }
  }
}

function restoreBigTileBg(svg: SVGSVGElement) {
  svg.querySelectorAll<SVGElement>("[data-orig-fill]").forEach((el) => {
    const orig = el.getAttribute("data-orig-fill");
    if (orig) el.setAttribute("fill", orig);
    el.removeAttribute("data-orig-fill");
  });
}

export default function VisualPanel() {
  const [data, setData] = useState<unknown>(null);
  const [done, setDone] = useState(false);
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
            if (svg) restoreBigTileBg(svg);
            player.goToAndPlay(0, true);
          } else {
            player.stop();
          }
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
            <div className="img-cover">
              {/* Backdrop layer (z-index 1) — IMG_4925.jpg, cropped to the
                  same rounded-square shape as the lottie's big tile. Fades
                  in once the animation completes. */}
              <div
                className={`vp-final${done ? " vp-final--visible" : ""}`}
                aria-hidden={!done}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/IMG_4925.jpg" alt="Projects built with Jaseci" />
              </div>
              {/* Lottie layer (z-index 2) — always visible. On complete we
                  strip the big tile bg so the icons sit on the texture. */}
              <div className="vp-anim" aria-hidden="true">
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
                      if (svg) hideBigTileBg(svg);
                    }}
                    rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : null}
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
