"use client";

import {
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Theme = "indigo" | "teal" | "amber";

type Slide = {
  theme: Theme;
  stat: string;
  qualifier: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  initials: string;
};

const SLIDES: Slide[] = [
  {
    theme: "indigo",
    stat: "73%",
    qualifier: "More members completing a financial plan",
    name: "Jordan Avery",
    title: "VP of Partnerships",
    company: "Pocketnest",
    quote:
      "Pocketnest turned passive account-holders into engaged members chasing real financial goals.",
    initials: "JA",
  },
  {
    theme: "teal",
    stat: "3×",
    qualifier: "Higher cross-sell conversion for partner institutions",
    name: "Riley Morgan",
    title: "Head of Product",
    company: "Pocketnest",
    quote:
      "We finally meet the next generation where they are — and the engagement data speaks for itself.",
    initials: "RM",
  },
  {
    theme: "amber",
    stat: "<3 min",
    qualifier: "A week to move members' money forward",
    name: "Sam Patel",
    title: "Behavioral Science Lead",
    company: "Pocketnest",
    quote:
      "Behavioral nudges plus AI mean members actually finish what they start — not just sign up.",
    initials: "SP",
  },
];

const NUM = SLIDES.length;
// Virtual track: [last-clone, ...real, first-clone]. Indexes 1..NUM are real;
// 0 and NUM+1 are clones used only for the seamless wrap animation.
const VIRTUAL: Slide[] = [SLIDES[NUM - 1], ...SLIDES, SLIDES[0]];
const FIRST_REAL = 1;
const LAST_REAL = NUM;
const LEFT_CLONE = 0;
const RIGHT_CLONE = NUM + 1;

const READ_STORY_URL = "#";
const CARD_RATIO = 0.8;
const CARD_RATIO_NARROW = 0.9;
const GAP = 26;
const DRAG_THRESHOLD_RATIO = 0.18;
const CLICK_VS_DRAG_PX = 5;

export default function CaseStudies() {
  // `displayPos` is the position in the VIRTUAL track (0..NUM+1).
  // `activeIdx` is the user-facing 0..NUM-1 derived from it.
  const [displayPos, setDisplayPos] = useState<number>(FIRST_REAL);
  const [transitionOn, setTransitionOn] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    startX: 0,
    pointerId: -1,
    active: false,
    suppressClick: false,
  });
  // Guards the snap-back so bubbled transitionend events from cards don't
  // re-trigger the wrap (or stomp on the in-flight setTransitionOn(true)).
  const snappingRef = useRef(false);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => ro.disconnect();
  }, []);

  const narrow = viewportWidth > 0 && viewportWidth < 820;
  const cardWidth = viewportWidth * (narrow ? CARD_RATIO_NARROW : CARD_RATIO);
  const centerOffset = (viewportWidth - cardWidth) / 2;
  const baseTranslateX = centerOffset - displayPos * (cardWidth + GAP);
  const trackTranslateX = baseTranslateX + (isDragging ? dragOffset : 0);

  // Derived 0..NUM-1 active index. Clones map to the real slide they mirror.
  const activeIdx = ((displayPos - 1) % NUM + NUM) % NUM;

  const next = useCallback(() => {
    // Clamp at RIGHT_CLONE so a rapid double-click doesn't shoot past it.
    setDisplayPos((p) => (p >= RIGHT_CLONE ? p : p + 1));
  }, []);

  const prev = useCallback(() => {
    setDisplayPos((p) => (p <= LEFT_CLONE ? p : p - 1));
  }, []);

  // After the snap-into-clone animation completes, jump (no transition) to
  // the equivalent real slide so the next gesture lands in valid territory.
  const onTrackTransitionEnd = (e: ReactTransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (snappingRef.current) return;
    if (displayPos !== LEFT_CLONE && displayPos !== RIGHT_CLONE) return;

    snappingRef.current = true;
    const realPos = displayPos === LEFT_CLONE ? LAST_REAL : FIRST_REAL;
    setTransitionOn(false);
    setDisplayPos(realPos);
    // Re-enable the transition after the snap render has had a chance to
    // paint. setTimeout is more reliable than nested rAF here — under React
    // 18+ batching the rAF callbacks were not consistently firing the final
    // setTransitionOn(true), so the carousel stayed in "instant" mode.
    snapTimerRef.current = setTimeout(() => {
      setTransitionOn(true);
      snappingRef.current = false;
      snapTimerRef.current = null;
    }, 60);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current.startX = e.clientX;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.active = true;
    dragRef.current.suppressClick = false;
    setIsDragging(true);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    setDragOffset(dx);
    if (Math.abs(dx) > CLICK_VS_DRAG_PX) {
      dragRef.current.suppressClick = true;
    }
  };

  const finishDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.active = false;
    setIsDragging(false);
    setDragOffset(0);
    const threshold = cardWidth * DRAG_THRESHOLD_RATIO;
    if (dx < -threshold) next();
    else if (dx > threshold) prev();
    (e.currentTarget as Element).releasePointerCapture?.(
      dragRef.current.pointerId,
    );
  };

  const onCardClick = (
    e: ReactMouseEvent<HTMLElement>,
    i: number,
  ) => {
    if (dragRef.current.suppressClick) {
      dragRef.current.suppressClick = false;
      e.preventDefault();
      return;
    }
    if ((e.target as HTMLElement).closest(".cs__read")) return;
    if (i !== displayPos) {
      e.preventDefault();
      setDisplayPos(i);
    }
  };

  const onReadClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (dragRef.current.suppressClick) {
      dragRef.current.suppressClick = false;
      e.preventDefault();
    }
  };

  return (
    <section className="cs" aria-label="Case studies">
      <header className="cs__header">
        <h2 className="cs__title">Case Studies</h2>
        <div className="cs__nav">
          <button
            type="button"
            className="cs__arrow"
            onClick={prev}
            aria-label="Previous case study"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            className="cs__arrow"
            onClick={next}
            aria-label="Next case study"
          >
            <ArrowRight />
          </button>
        </div>
      </header>

      <div
        ref={viewportRef}
        className="cs__viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label="Case studies"
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div
          className={`cs__track${
            !transitionOn || isDragging ? " cs__track--instant" : ""
          }`}
          style={{ transform: `translateX(${trackTranslateX}px)` }}
          onTransitionEnd={onTrackTransitionEnd}
        >
          {VIRTUAL.map((slide, i) => {
            const isActive = i === displayPos;
            const isClone = i === LEFT_CLONE || i === RIGHT_CLONE;
            const realPos = isClone
              ? (i === LEFT_CLONE ? NUM : 1) // 1-based real index a clone mirrors
              : i;
            return (
              <article
                key={i}
                className={`cs__card cs__card--${slide.theme}${
                  isActive ? " cs__card--active" : ""
                }`}
                style={{ width: `${cardWidth}px` }}
                role="group"
                aria-roledescription="slide"
                aria-label={isClone ? undefined : `${realPos} of ${NUM}`}
                aria-current={isActive && !isClone ? "true" : undefined}
                aria-hidden={isClone || undefined}
                onClick={(e) => onCardClick(e, i)}
              >
                <div className="cs__bg" aria-hidden="true" />
                <div className="cs__panel">
                  <div className="cs__stat">
                    <span className="cs__stat-num">{slide.stat}</span>
                    <span className="cs__stat-qual">{slide.qualifier}</span>
                  </div>
                  <div className="cs__attr">
                    <span className="cs__avatar" aria-hidden="true">
                      {slide.initials}
                    </span>
                    <div className="cs__attr-text">
                      <div className="cs__attr-name">{slide.name}</div>
                      <div className="cs__attr-title">
                        {slide.title} — {slide.company}
                      </div>
                    </div>
                  </div>
                  <p className="cs__quote">{slide.quote}</p>
                </div>

                <div className="cs__brand" aria-label="Pocketnest">
                  <span className="cs__brand-mark" aria-hidden="true">
                    <PocketnestMark />
                  </span>
                  <span className="cs__brand-name">pocketnest</span>
                </div>

                <a
                  className="cs__read"
                  href={READ_STORY_URL}
                  onClick={onReadClick}
                  tabIndex={isActive && !isClone ? 0 : -1}
                  aria-hidden={!isActive || isClone}
                >
                  <span>Read Story</span>
                  <span className="cs__read-chevron" aria-hidden="true">
                    ›
                  </span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 6l-6 6 6 6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 6l6 6-6 6" />
    </svg>
  );
}

function PocketnestMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 14a7 7 0 0 1 14 0v3a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-3z" />
      <path d="M12 7V3" />
      <path d="M12 7c2-1 4-1 5 0" />
    </svg>
  );
}
