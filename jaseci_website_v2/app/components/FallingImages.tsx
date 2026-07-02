"use client";

import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";
import styles from "./FallingImages.module.css";

export interface FallingImage {
  src: string;
  alt: string;
  /** optional explicit size override (px), image variant only; otherwise sized
   *  from the image's natural aspect ratio, longest side = maxSize. */
  width?: number;
  height?: number;
}

interface FallingImagesProps {
  images: FallingImage[];
  /** longest side, in px, that any item is scaled to. */
  maxSize?: number;
  trigger?: "auto" | "scroll";
  gravity?: number;
  mouseConstraintStiffness?: number;
  backgroundColor?: string;
  /** "image" tumbles each logo as-is; "hex" drops an orange hexagon tile per
   *  logo that flips to the logo (white on black) on hover. */
  variant?: "image" | "hex";
}

// flat-top regular hexagon: bbox height = width * sin(60°)
const HEX_RATIO = 0.866;

/* A physics bin that drops items. In "image" mode each logo tumbles in at its
   natural aspect ratio. In "hex" mode each logo becomes an orange flat-top
   hexagon whose rotation is locked, so the tiles pack like a honeycomb and the
   logo — revealed on hover as a white silhouette on black — stays upright.
   Matter.js does the positioning; the tiles/imgs are real DOM nodes so :hover
   works. Waits for images to load before measuring (image mode only) so the
   physics bodies match each logo's shape. */
const FallingImages = ({
  images,
  maxSize = 126,
  trigger = "scroll",
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  backgroundColor = "transparent",
  variant = "image",
}: FallingImagesProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // "auto" starts immediately; "scroll" waits for the bin to come into view
  const [effectStarted, setEffectStarted] = useState(trigger === "auto");
  const isHex = variant === "hex";
  const hexHeight = Math.round(maxSize * HEX_RATIO);

  useEffect(() => {
    if (trigger !== "scroll" || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEffectStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [trigger]);

  useEffect(() => {
    if (
      !effectStarted ||
      !containerRef.current ||
      !targetRef.current ||
      !canvasContainerRef.current
    ) {
      return;
    }

    let cancelled = false;
    let teardown = () => {};

    (async () => {
      const target = targetRef.current!;
      const container = containerRef.current!;
      const canvasHost = canvasContainerRef.current!;
      const itemEls = Array.from(
        target.querySelectorAll<HTMLElement>("[data-falling-item]")
      );

      // image mode sizes each logo from its natural aspect ratio, so wait for
      // the images to load first. hex tiles are a fixed size set in the markup —
      // nothing to wait for or measure.
      if (!isHex) {
        const imgEls = itemEls as HTMLImageElement[];
        await Promise.all(
          imgEls.map((img) =>
            img.complete && img.naturalWidth
              ? Promise.resolve()
              : new Promise<void>((res) => {
                  img.addEventListener("load", () => res(), { once: true });
                  img.addEventListener("error", () => res(), { once: true });
                })
          )
        );
        if (cancelled || !containerRef.current) return;

        // size each image: explicit override, else natural aspect capped at maxSize
        imgEls.forEach((img, i) => {
          const ov = images[i];
          if (ov?.width && ov?.height) {
            img.width = ov.width;
            img.height = ov.height;
            return;
          }
          const nw = img.naturalWidth;
          const nh = img.naturalHeight;
          if (nw > 0 && nh > 0) {
            const s = maxSize / Math.max(nw, nh);
            img.width = Math.round(nw * s);
            img.height = Math.round(nh * s);
          } else {
            img.width = maxSize;
            img.height = maxSize;
          }
        });
      }

      const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
        Matter;

      const containerRect = container.getBoundingClientRect();
      const width = containerRect.width;
      const height = containerRect.height;
      if (width <= 0 || height <= 0) return;

      const engine = Engine.create();
      engine.world.gravity.y = gravity;

      const render = Render.create({
        element: canvasHost,
        engine,
        options: { width, height, background: backgroundColor, wireframes: false },
      });

      const bOpts = { isStatic: true, render: { fillStyle: "transparent" } };
      const floor = Bodies.rectangle(width / 2, height + 25, width, 50, bOpts);
      const leftWall = Bodies.rectangle(-25, height / 2, 50, height, bOpts);
      const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, bOpts);
      const ceiling = Bodies.rectangle(width / 2, -25, width, 50, bOpts);

      const bodies = itemEls.map((elem) => {
        const rect = elem.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        const w = rect.width || maxSize;
        const h = rect.height || maxSize;

        const body = isHex
          ? Bodies.polygon(x, y, 6, w / 2, {
              render: { fillStyle: "transparent" },
              restitution: 0.35,
              frictionAir: 0.02,
              friction: 0.45,
            })
          : Bodies.rectangle(x, y, w, h, {
              chamfer: { radius: 8 },
              render: { fillStyle: "transparent" },
              restitution: 0.55,
              frictionAir: 0.02,
              friction: 0.25,
            });

        Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
        if (isHex) {
          // orient the hexagon flat-top (Matter's default is pointy-top) and
          // lock rotation, so the tiles stay level and the logos read upright
          Matter.Body.setAngle(body, Math.PI / 6);
          Matter.Body.setInertia(body, Infinity);
        } else {
          Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
        }
        return { elem, body };
      });

      bodies.forEach(({ elem }) => {
        elem.style.position = "absolute";
        elem.style.margin = "0";
      });

      const mouse = Mouse.create(container);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: mouseConstraintStiffness,
          render: { visible: false },
        },
      });
      render.mouse = mouse;

      World.add(engine.world, [
        floor,
        leftWall,
        rightWall,
        ceiling,
        mouseConstraint,
        ...bodies.map((b) => b.body),
      ]);

      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);

      let rafId: number;
      const loop = () => {
        bodies.forEach(({ body, elem }) => {
          elem.style.left = `${body.position.x}px`;
          elem.style.top = `${body.position.y}px`;
          // hex tiles keep their fixed flat-top orientation (rotation is locked);
          // image tiles follow the body's tumble
          const rotation = isHex ? 0 : body.angle;
          elem.style.transform = `translate(-50%, -50%) rotate(${rotation}rad)`;
        });
        Matter.Engine.update(engine);
        rafId = requestAnimationFrame(loop);
      };
      loop();

      teardown = () => {
        cancelAnimationFrame(rafId);
        Render.stop(render);
        Runner.stop(runner);
        if (render.canvas && canvasHost.contains(render.canvas)) {
          canvasHost.removeChild(render.canvas);
        }
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      cancelled = true;
      teardown();
    };
  }, [
    effectStarted,
    gravity,
    mouseConstraintStiffness,
    backgroundColor,
    maxSize,
    isHex,
    images,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "grab",
      }}
    >
      <div
        ref={targetRef}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          padding: "16px 10px",
          textAlign: "center",
          fontSize: 0,
        }}
      >
        {images.map((img, i) =>
          isHex ? (
            <div
              key={i}
              data-falling-item
              className={styles.hex}
              style={{ width: maxSize, height: hexHeight, margin: 7 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                draggable={false}
                className={styles.hexLogo}
              />
            </div>
          ) : (
            <img
              key={i}
              data-falling-item
              src={img.src}
              alt={img.alt}
              draggable={false}
              style={{
                display: "inline-block",
                margin: "7px",
                maxWidth: maxSize,
                maxHeight: maxSize,
                userSelect: "none",
                willChange: "transform",
              }}
            />
          )
        )}
      </div>
      <div
        ref={canvasContainerRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
      />
    </div>
  );
};

export default FallingImages;
