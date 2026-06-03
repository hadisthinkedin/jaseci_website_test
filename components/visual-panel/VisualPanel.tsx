"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import AccuracyChart from "./AccuracyChart";

const LOTTIE_SRC =
  "https://cdn.prod.website-files.com/68c9c3107effc2ea46e1a81f/69b6b37ab732de7af40519e5_MoveModels.json";
const PROJECTS_HREF = "/projects";

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

  // Replay the animation each time the section enters the snap viewport.
  // Resets the post-animation overlay too, so the sequence (lottie → image →
  // link) restarts each time. .scroll-root is the actual scroll container.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !data) return;
    const root = document.querySelector<HTMLElement>(".scroll-root");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const player = lottieRef.current;
          if (!player) continue;
          if (e.isIntersecting) {
            setDone(false);
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
              <div
                className={`vp-anim${done ? " vp-anim--hidden" : ""}`}
                aria-hidden="true"
              >
                {data ? (
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={data}
                    autoplay={false}
                    loop={false}
                    onComplete={() => setDone(true)}
                    rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : null}
              </div>
              <div
                className={`vp-final${done ? " vp-final--visible" : ""}`}
                aria-hidden={!done}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/IMG_4925.jpg" alt="Projects built with Jaseci" />
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
