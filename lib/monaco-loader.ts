"use client";

const MONACO_VERSION = "0.52.2";
const MONACO_BASE = `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs`;

let monacoPromise: Promise<unknown> | null = null;

export function loadMonaco(): Promise<unknown> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Monaco can only load in the browser"));
  }
  if (monacoPromise) return monacoPromise;

  const w = window as unknown as {
    monaco?: unknown;
    require?: {
      config: (opts: { paths: Record<string, string> }) => void;
      (deps: string[], cb: () => void): void;
    };
  };

  if (w.monaco) {
    monacoPromise = Promise.resolve(w.monaco);
    return monacoPromise;
  }

  monacoPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${MONACO_BASE}/loader.js`;
    script.async = true;
    script.onload = () => {
      if (!w.require) {
        reject(new Error("Monaco AMD loader did not initialize window.require"));
        return;
      }
      w.require.config({ paths: { vs: MONACO_BASE } });
      w.require(["vs/editor/editor.main"], () => {
        resolve(w.monaco);
      });
    };
    script.onerror = () => reject(new Error("Failed to load Monaco loader.js from CDN"));
    document.head.appendChild(script);
  });

  return monacoPromise;
}
