import { useEffect } from "react";
import CodeBlock from "../CodeBlock.jsx";
import { hero } from "../../lib/links.js";

const commands = [
  { label: "Install", code: hero.install },
  { label: "Launch a full stack app", code: hero.launch },
  { label: "Download the MCP", code: hero.mcp },
];

export default function GetStartedModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Get started"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg border border-black bg-white">
        <div className="flex items-center justify-between border-b border-black px-5 py-3">
          <p className="font-bold tracking-tight">Get started</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center border border-black hover:bg-black hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 p-5">
          {commands.map((c) => (
            <div key={c.label}>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-neutral-600">
                {c.label}
              </p>
              <CodeBlock code={c.code} filename="bash" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
