"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const LOTTIE_SRC =
  "https://cdn.prod.website-files.com/68c9c3107effc2ea46e1a81f/69b6b37ab732de7af40519e5_MoveModels.json";

export default function VisualPanel() {
  const [data, setData] = useState<unknown>(null);

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

  return (
    <div className="section-base_visual">
      <div className="img-cover" aria-hidden="true">
        {data ? (
          <Lottie
            animationData={data}
            autoplay
            loop={false}
            rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : null}
      </div>
    </div>
  );
}
