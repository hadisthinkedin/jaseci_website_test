import { useState } from "react";

// Minimal black/white code block with optional filename header and copy button.
export default function CodeBlock({ code, lang = "jac", filename, copy = true }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="border border-black bg-neutral-50">
      <div className="flex items-center justify-between border-b border-black px-4 py-2">
        <span className="font-mono text-xs text-neutral-600">
          {filename || lang}
        </span>
        {copy && (
          <button
            onClick={onCopy}
            className="border border-black px-2 py-0.5 text-xs font-medium hover:bg-black hover:text-white"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <pre className="max-h-[28rem] overflow-auto p-4 text-xs leading-relaxed md:text-sm">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
