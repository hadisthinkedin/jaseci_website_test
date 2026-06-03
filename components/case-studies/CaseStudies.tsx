"use client";

import {
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
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

const READ_STORY_URL = "#";
const CARD_RATIO = 0.8; // 80% of viewport width
const CARD_RATIO_NARROW = 0.9; // <820px
const GAP = 26;
const DRAG_THRESHOLD_RATIO = 0.18; // 18% of card width
const CLICK_VS_DRAG_PX = 5; // distance below which counts as a click

export default function CaseStudies() {
  const [activeIdx, setActiveIdx] = useState(0);
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

  // Track viewport width on mount + resize (also after fonts load).
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Re-measure after web fonts settle (their final metrics can shift layout).
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => ro.disconnect();
  }, []);

  const narrow = viewportWidth > 0 && viewportWidth < 820;
  const cardWidth = viewportWidth * (narrow ? CARD_RATIO_NARROW : CARD_RATIO);
  const centerOffset = (viewportWidth - cardWidth) / 2;
  const baseTranslateX =
    centerOffset - activeIdx * (cardWidth + GAP);
  const trackTranslateX = baseTranslateX + (isDragging ? dragOffset : 0);

  const go = useCallback((i: number) => {
    setActiveIdx((prev) => {
      const next = Math.max(0, Math.min(SLIDES.length - 1, i));
      return next === prev ? prev : next;
    });
  }, []);

  const prev = useCallback(() => go(activeIdx - 1), [activeIdx, go]);
  const next = useCallback(() => go(activeIdx + 1), [activeIdx, go]);

  const atFirst = activeIdx === 0;
  const atLast = activeIdx === SLIDES.length - 1;

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
    if (dx < -threshold && !atLast) {
      setActiveIdx((i) => Math.min(i + 1, SLIDES.length - 1));
    } else if (dx > threshold && !atFirst) {
      setActiveIdx((i) => Math.max(i - 1, 0));
    }
    (e.currentTarget as Element).releasePointerCapture?.(
      dragRef.current.pointerId,
    );
  };

  // Stop a click from advancing past the active slide if the user was dragging.
  const onCardClick = (
    e: ReactMouseEvent<HTMLElement>,
    i: number,
  ) => {
    if (dragRef.current.suppressClick) {
      dragRef.current.suppressClick = false;
      e.preventDefault();
      return;
    }
    // Read Story click — let it through, don't advance the carousel.
    if ((e.target as HTMLElement).closest(".cs__read")) return;
    if (i !== activeIdx) {
      e.preventDefault();
      go(i);
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
            disabled={atFirst}
            aria-label="Previous case study"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            className="cs__arrow"
            onClick={next}
            disabled={atLast}
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
          className="cs__track"
          style={{
            transform: `translateX(${trackTranslateX}px)`,
            transitionDuration: isDragging ? "0ms" : undefined,
          }}
        >
          {SLIDES.map((slide, i) => {
            const isActive = i === activeIdx;
            return (
              <article
                key={slide.theme}
                className={`cs__card cs__card--${slide.theme}${
                  isActive ? " cs__card--active" : ""
                }`}
                style={{ width: `${cardWidth}px` }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${SLIDES.length}`}
                aria-current={isActive ? "true" : undefined}
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
                  tabIndex={isActive ? 0 : -1}
                  aria-hidden={!isActive}
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
