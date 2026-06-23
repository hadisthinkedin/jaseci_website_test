"use client";

import { useState } from "react";
import styles from "./InstallBox.module.css";

/* ───────────────────────────────────────────────
   InstallBox — the hero's "get started" panel, modelled on bun.sh's install
   box: two OS tabs sitting on an accent-bordered terminal block with a copy
   button. Rebuilt in CSS Modules on the site's locked palette (white surface,
   orange --accent). Both tabs run the same pip install — it's identical across
   platforms — but the two-tab layout mirrors the reference; give each its own
   `command` to differentiate.
   ─────────────────────────────────────────────── */

const TABS = [
  { id: "posix", label: "Linux & macOS", command: "pip install jaclang" },
  { id: "windows", label: "Windows", command: "pip install jaclang" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function InstallBox() {
  const [active, setActive] = useState<TabId>("posix");
  const [copied, setCopied] = useState(false);

  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked (insecure context / denied) — leave state untouched */
    }
  };

  return (
    <div className={styles.box}>
      <div className={styles.tabRow}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Install command by platform"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              className={`${styles.tab} ${
                active === t.id ? styles.tabActive : ""
              }`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <a className={styles.source} href="/docs">
          View install docs
        </a>
      </div>

      <div className={styles.codeBlock}>
        <pre className={styles.pre}>
          <code className={styles.code}>{current.command}</code>
        </pre>
        <button
          type="button"
          className={`${styles.copy} ${copied ? styles.copyDone : ""}`}
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy install command"}
        >
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
