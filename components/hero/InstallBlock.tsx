"use client";

import {
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from "react";

type CodeBlockData = {
  /** Command text — exactly what gets copied (no $ prompt). */
  command: string;
  /** When true, render a faint $ before each line (shell convention). */
  prompt: boolean;
};

type ContentItem =
  | { kind: "block"; block: CodeBlockData }
  | { kind: "label"; text: string }
  | { kind: "note"; text: string };

type TabConfig = {
  id: string;
  label: string;
  content: ContentItem[];
};

const TABS: TabConfig[] = [
  {
    id: "unix",
    label: "Linux & macOS",
    content: [
      {
        kind: "block",
        block: {
          command:
            "curl -fsSL https://raw.githubusercontent.com/jaseci-labs/jaseci/main/scripts/install.sh | bash",
          prompt: true,
        },
      },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    content: [
      {
        kind: "block",
        block: { command: "pip install jaseci", prompt: true },
      },
    ],
  },
  {
    id: "jac-mcp",
    label: "jac-mcp",
    content: [
      {
        kind: "block",
        block: { command: "pip install jac-mcp", prompt: true },
      },
    ],
  },
];

const INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/jaseci-labs/jaseci/main/scripts/install.sh";

export default function InstallBlock() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const announce = useCallback((msg: string) => {
    setAnnouncement(msg);
    window.setTimeout(() => setAnnouncement(""), 1500);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    setActiveIdx(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="install">
      <h2 className="install__heading">Install with one command</h2>

      <div
        className="install__tablist"
        role="tablist"
        aria-label="Install method"
      >
        {TABS.map((tab, idx) => {
          const selected = idx === activeIdx;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              id={`install-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`install-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className="install__tab"
              onClick={() => setActiveIdx(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {tab.label}
            </button>
          );
        })}
        <a
          className="install__viewlink"
          href={INSTALL_SCRIPT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View install script
        </a>
      </div>

      {TABS.map((tab, idx) => (
        <div
          key={tab.id}
          id={`install-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`install-tab-${tab.id}`}
          hidden={idx !== activeIdx}
        >
          {tab.content.map((item, i) => {
            if (item.kind === "note")
              return (
                <p key={i} className="install__note">
                  {item.text}
                </p>
              );
            if (item.kind === "label")
              return (
                <div key={i} className="install__steplabel">
                  {item.text}
                </div>
              );
            return <CodeBlock key={i} block={item.block} onCopy={announce} />;
          })}
        </div>
      ))}

      {/* Polite live region for "Copied" announcements (visible to AT only) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
  );
}

function CodeBlock({
  block,
  onCopy,
}: {
  block: CodeBlockData;
  onCopy: (msg: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const lines = block.command.split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.command);
      setCopied(true);
      onCopy("Copied");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail in insecure contexts or denied permissions;
      // surface failure to AT, leave button state unchanged.
      onCopy("Copy failed");
    }
  };

  return (
    <div className="codeblock">
      <code>
        {lines.map((line, i) => (
          <span key={i} className="codeblock__line">
            {block.prompt && (
              <span className="codeblock__prompt" aria-hidden="true">
                $
              </span>
            )}
            {line}
          </span>
        ))}
      </code>
      <button
        type="button"
        className="codeblock__copy"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy command"}
      >
        {copied ? <CheckIcon /> : <ClipboardIcon />}
      </button>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
