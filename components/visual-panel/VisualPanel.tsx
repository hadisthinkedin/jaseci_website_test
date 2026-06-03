"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

const LOTTIE_SRC =
  "https://cdn.prod.website-files.com/68c9c3107effc2ea46e1a81f/69b6b37ab732de7af40519e5_MoveModels.json";

export default function VisualPanel() {
  const [data, setData] = useState<unknown>(null);
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
  // The .scroll-root in app/page.tsx is the actual scroll container, so
  // IntersectionObserver uses it as the root (not document).
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
      <div className="img-cover" aria-hidden="true">
        {data ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={data}
            autoplay={false}
            loop={false}
            rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : null}
      </div>
    </div>
  );
}
