"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import AccuracyChart from "./AccuracyChart";

const LOTTIE_SRC =
  "https://cdn.prod.website-files.com/68c9c3107effc2ea46e1a81f/69b6b37ab732de7af40519e5_MoveModels.json";
const PROJECTS_HREF = "/projects";

/**
 * The lottie SVG paints the big rounded tile and each of the 9 icon tiles
 * through `<g filter="url(#__lottie_element_…)">` groups whose only filter
 * is a Gaussian blur. The blur of the white tile face + the blurs of nine
 * dark icon-tile backings stack into the soft blueish halo we see behind
 * the icons. Hiding every filter group strips the big-tile background
 * AND the icon-tile shadows in one pass, leaving only the unfiltered
 * icon-face squares + colorful glyphs on top of the IMG_4925.jpg texture
 * behind.
 */
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
  // Clean up any legacy state from earlier fill-clearing approach
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
            if (svg) restoreLottieGlowLayers(svg);
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
                  same rounded-square shape as the lottie's big tile.
                  Instant-on at done (no fade); covered by the lottie's
                  glow layers until they're hidden. */}
              <div
                className={`vp-final${done ? " vp-final--visible" : ""}`}
                aria-hidden={!done}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/IMG_4925.jpg" alt="Projects built with Jaseci" />
              </div>
              {/* Lottie layer (z-index 2) — always visible. On complete we
                  strip the filter groups so the icons sit on the texture. */}
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
                      if (svg) hideLottieGlowLayers(svg);
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
