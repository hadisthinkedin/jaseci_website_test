"use client";

import { type KeyboardEvent, useCallback, useMemo, useRef, useState } from "react";
import type { SupportedLang } from "@/lib/highlighter";

export type FileBundle = {
  name: string;
  lang: SupportedLang;
  glyph: string;
  breadcrumb: string[];
  raw: string;
  html: string;
};

type Props = {
  poly: FileBundle[];
  jac: FileBundle;
  defaultActive: string;
  repoUrl: string;
};

export default function CodeComparePanes({
  poly,
  jac,
  defaultActive,
  repoUrl,
}: Props) {
  const initialIdx = Math.max(
    0,
    poly.findIndex((f) => f.name === defaultActive),
  );
  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeFile = poly[activeIdx];

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % poly.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + poly.length) % poly.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = poly.length - 1;
    else return;
    e.preventDefault();
    setActiveIdx(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      className="cc"
      aria-label="Same app: a single Jac file vs a polyglot stack"
    >
      <span className="sr-only">
        The same mini-todo app: one Jac file on the left; four files across
        Python, Next.js and CSS on the right.
      </span>

      <a
        className="cc__repobar"
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="cc__repobar-label">View repo for yourself</span>
        <span className="cc__repobar-arrow" aria-hidden="true">→</span>
      </a>

      <div className="cc__framing">
        <span className="eyebrow">The polyglot tax</span>
        <p className="cc__framing-line">
          The same mini-todo app — AI categorization and all. One Jac file on
          the left. Four files across Python, Next.js, and CSS on the right.
        </p>
      </div>

      <div className="cc__panes">
        <JacPane file={jac} />
        <PolyPane
          files={poly}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
          handleKeyDown={handleKeyDown}
          tabRefs={tabRefs}
          activeFile={activeFile}
        />
      </div>
    </section>
  );
}

function PolyPane({
  files,
  activeIdx,
  setActiveIdx,
  handleKeyDown,
  tabRefs,
  activeFile,
}: {
  files: FileBundle[];
  activeIdx: number;
  setActiveIdx: (i: number) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLButtonElement>, idx: number) => void;
  tabRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  activeFile: FileBundle;
}) {
  return (
    <div className="cc__pane cc__pane--poly">
      <div className="cc__tabstrip">
        <span className="cc__traffic" aria-hidden="true">
          <span className="cc__traffic-dot" />
          <span className="cc__traffic-dot" />
          <span className="cc__traffic-dot" />
        </span>
        <div
          className="cc__tabs"
          role="tablist"
          aria-label="Polyglot project files"
        >
          {files.map((f, idx) => {
            const selected = idx === activeIdx;
            return (
              <button
                key={f.name}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                id={`cc-tab-${f.name}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`cc-panel-${f.name}`}
                tabIndex={selected ? 0 : -1}
                className="cc__tab"
                onClick={() => setActiveIdx(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                <span className="cc__tab-glyph" aria-hidden="true">
                  {f.glyph}
                </span>
                <span className="cc__tab-name">{f.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="cc__meta">
        <Breadcrumb segments={activeFile.breadcrumb} />
        <span className="cc__badge">4 files · Next.js + FastAPI</span>
      </div>

      {files.map((f, idx) => (
        <div
          key={f.name}
          id={`cc-panel-${f.name}`}
          role="tabpanel"
          aria-labelledby={`cc-tab-${f.name}`}
          aria-label={`${langLabel(f.lang)}: ${f.breadcrumb.join("/")}`}
          className="cc__code-area"
          hidden={idx !== activeIdx}
          dangerouslySetInnerHTML={{ __html: f.html }}
        />
      ))}
    </div>
  );
}

function JacPane({ file }: { file: FileBundle }) {
  return (
    <div className="cc__pane cc__pane--jac">
      <div className="cc__tabstrip">
        <span className="cc__traffic" aria-hidden="true">
          <span className="cc__traffic-dot" />
          <span className="cc__traffic-dot" />
          <span className="cc__traffic-dot" />
        </span>
        <div className="cc__tabs">
          <span
            className="cc__tab cc__tab--static"
            role="tab"
            aria-selected="true"
            aria-disabled="true"
          >
            <span className="cc__tab-glyph" aria-hidden="true">
              {file.glyph}
            </span>
            <span className="cc__tab-name">{file.name}</span>
          </span>
        </div>
      </div>

      <div className="cc__meta">
        <Breadcrumb segments={file.breadcrumb} />
        <span className="cc__badge">1 file · entire app</span>
      </div>

      <div
        className="cc__code-area"
        aria-label={`Jac: ${file.breadcrumb.join("/")}`}
        dangerouslySetInnerHTML={{ __html: file.html }}
      />
    </div>
  );
}

function Breadcrumb({ segments }: { segments: string[] }) {
  const parts = useMemo(
    () =>
      segments.map((s, i) => ({
        key: `${i}-${s}`,
        text: s,
        last: i === segments.length - 1,
      })),
    [segments],
  );
  return (
    <span className="cc__breadcrumb" aria-label="File path">
      {parts.map((p, i) => (
        <span key={p.key} className={p.last ? "cc__crumb cc__crumb--last" : "cc__crumb"}>
          {p.text}
          {!p.last && <span className="cc__crumb-sep" aria-hidden="true">›</span>}
        </span>
      ))}
    </span>
  );
}

function langLabel(lang: SupportedLang): string {
  switch (lang) {
    case "python": return "Python";
    case "tsx": return "TSX";
    case "css": return "CSS";
    case "jac": return "Jac";
  }
}
