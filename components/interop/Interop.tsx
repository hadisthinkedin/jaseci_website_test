import { highlight } from "@/lib/highlighter";

const ACCOUNT_JAC = `# account.jac — one file, two ecosystems

import numpy as np;  # PyPI (server)
import from "lodash-es" { capitalize }  # npm (client)

def average(balances: list[float]) -> float {
    return float(np.round(np.mean(balances), 2));  # PyPI: numpy
}

with entry {
    print(f"Average balance: \${average([42.0, 18.5, 63.25])}");
}

cl def:pub Summary -> JsxElement {
    has owner: str = "alice",
        avg: float = 0.0;

    async can with entry {
        avg = await average([42.0, 18.5, 63.25]);  # frontend → backend
    }

    return <p>{capitalize(owner)}'s avg: \${avg}</p>;  # npm: lodash-es
}
`;

type TermLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "check"; text: string }
  | { kind: "spacer" };

const TERMINAL: TermLine[] = [
  { kind: "cmd", text: "jac run account.jac" },
  { kind: "out", text: "Average balance: $41.25" },
  { kind: "spacer" },
  { kind: "cmd", text: "jac start account.jac" },
  { kind: "check", text: "npm:  lodash-es bundled for the client" },
  { kind: "check", text: "pypi: numpy ready on the server" },
  { kind: "out", text: "Serving on http://localhost:8000" },
];

export default async function Interop() {
  const jacHtml = await highlight(ACCOUNT_JAC, "jac");

  return (
    <div className="interop">
      <div className="interop__windows">
        <article
          className="interop__window interop__window--editor"
          aria-label="Editor: account.jac"
        >
          <header className="interop__titlebar">
            <span className="interop__traffic" aria-hidden="true">
              <span className="interop__traffic-dot" />
              <span className="interop__traffic-dot" />
              <span className="interop__traffic-dot" />
            </span>
            <span className="interop__title">account.jac</span>
          </header>
          <div
            className="interop__editor-body"
            dangerouslySetInnerHTML={{ __html: jacHtml }}
          />
        </article>

        <article
          className="interop__window interop__window--terminal"
          aria-label="Terminal output"
        >
          <header className="interop__titlebar">
            <span className="interop__traffic" aria-hidden="true">
              <span className="interop__traffic-dot" />
              <span className="interop__traffic-dot" />
              <span className="interop__traffic-dot" />
            </span>
          </header>
          <pre className="interop__terminal-body" aria-label="Terminal output">
            {TERMINAL.map((line, i) => {
              if (line.kind === "spacer") {
                return <span key={i} className="interop__term-line interop__term-line--spacer" />;
              }
              if (line.kind === "cmd") {
                return (
                  <span key={i} className="interop__term-line interop__term-line--cmd">
                    <span className="interop__term-prompt" aria-hidden="true">$</span>
                    {line.text}
                  </span>
                );
              }
              if (line.kind === "check") {
                return (
                  <span key={i} className="interop__term-line interop__term-line--out">
                    <span className="interop__term-check" aria-hidden="true">✓</span>
                    {line.text}
                  </span>
                );
              }
              return (
                <span key={i} className="interop__term-line interop__term-line--out">
                  {line.text}
                </span>
              );
            })}
          </pre>
        </article>
      </div>

      <div className="interop__copy">
        <span className="eyebrow">Interop</span>
        <h2 className="interop__headline">Import from any ecosystem.</h2>
        <p className="interop__lede">
          Call any PyPI package and any npm package from the same file — no
          bindings, no wrappers, no interop layer. Server-side Python libraries
          and client-side JavaScript packages, side by side in one Jac file.
        </p>
      </div>
    </div>
  );
}
