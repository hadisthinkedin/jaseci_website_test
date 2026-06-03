"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { loadMonaco } from "@/lib/monaco-loader";
import { defineJaseciTheme, registerJacLanguage } from "@/lib/jac-monarch";

export type SupportedLang = "python" | "tsx" | "css" | "jac";

export type FileBundle = {
  name: string;
  lang: SupportedLang;
  glyph: string;
  breadcrumb: string[];
  source: string;
};

type Props = {
  poly: FileBundle[];
  jac: FileBundle;
  defaultActive: string;
  repoUrl: string;
};

const MONACO_LANG: Record<SupportedLang, string> = {
  python: "python",
  tsx: "typescript",
  css: "css",
  jac: "jac",
};

const EDITOR_OPTIONS = {
  theme: "jaseci-dark",
  readOnly: true,
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontFamily: '"Cascadia Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace',
  fontSize: 13,
  lineHeight: 20,
  renderLineHighlight: "none" as const,
  lineNumbers: "on" as const,
  glyphMargin: false,
  folding: false,
  contextmenu: false,
  wordWrap: "off" as const,
  scrollbar: {
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
  padding: { top: 12, bottom: 12 },
  domReadOnly: true,
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
  const editorHostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const modelsRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    let cancelled = false;
    loadMonaco().then((monaco: any) => {
      if (cancelled || !editorHostRef.current) return;
      registerJacLanguage(monaco);
      defineJaseciTheme(monaco);

      for (const f of files) {
        modelsRef.current.set(
          f.name,
          monaco.editor.createModel(f.source, MONACO_LANG[f.lang]),
        );
      }

      editorRef.current = monaco.editor.create(editorHostRef.current, {
        model: modelsRef.current.get(files[activeIdx].name),
        ...EDITOR_OPTIONS,
      });
    });
    return () => {
      cancelled = true;
      editorRef.current?.dispose();
      for (const m of modelsRef.current.values()) m.dispose();
      modelsRef.current.clear();
    };
    // Mount once; later renders update via the activeIdx effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const model = modelsRef.current.get(files[activeIdx].name);
    if (editorRef.current && model) {
      editorRef.current.setModel(model);
    }
  }, [activeIdx, files]);

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
                aria-controls="cc-poly-editor"
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

      <div
        id="cc-poly-editor"
        ref={editorHostRef}
        className="cc__editor"
        aria-label={`Editor: ${activeFile.breadcrumb.join("/")}`}
      />
    </div>
  );
}

function JacPane({ file }: { file: FileBundle }) {
  const editorHostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadMonaco().then((monaco: any) => {
      if (cancelled || !editorHostRef.current) return;
      registerJacLanguage(monaco);
      defineJaseciTheme(monaco);

      modelRef.current = monaco.editor.createModel(
        file.source,
        MONACO_LANG[file.lang],
      );

      editorRef.current = monaco.editor.create(editorHostRef.current, {
        model: modelRef.current,
        ...EDITOR_OPTIONS,
      });
    });
    return () => {
      cancelled = true;
      editorRef.current?.dispose();
      modelRef.current?.dispose();
    };
  }, [file.source, file.lang]);

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
        ref={editorHostRef}
        className="cc__editor"
        aria-label={`Editor: ${file.breadcrumb.join("/")}`}
      />
    </div>
  );
}

function Breadcrumb({ segments }: { segments: string[] }) {
  return (
    <span className="cc__breadcrumb" aria-label="File path">
      {segments.map((s, i) => {
        const last = i === segments.length - 1;
        return (
          <span
            key={`${i}-${s}`}
            className={last ? "cc__crumb cc__crumb--last" : "cc__crumb"}
          >
            {s}
            {!last && (
              <span className="cc__crumb-sep" aria-hidden="true">›</span>
            )}
          </span>
        );
      })}
    </span>
  );
}
