const ACCOUNT_JAC = `# account.jac: one file, two ecosystems
import numpy as np;  # PyPI (server)
import from "lodash-es" { capitalize }  # npm (client)

def average(balances: list[float]) -> float {
    return float(np.round(np.mean(balances), 2));  # PyPI: numpy
}

with entry {
    print(f"Average balance: \${average([42.0, 18.5, 63.25])}");
}

cl def:pub Summary -> JsxElement {
    has owner: str = "alice", avg: float = 0.0;
    async can with entry {
        avg = await average([42.0, 18.5, 63.25]);  # frontend to backend
    }
    return <p>{capitalize(owner)}'s avg: \${avg}</p>;  # npm: lodash-es
}`;

const TERMINAL = [
  { kind: "cmd", text: "jac run account.jac" },
  { kind: "out", text: "Average balance: $41.25" },
  { kind: "spacer" },
  { kind: "cmd", text: "jac start account.jac" },
  { kind: "check", text: "npm:  lodash-es bundled for the client" },
  { kind: "check", text: "pypi: numpy ready on the server" },
  { kind: "out", text: "Serving on http://localhost:8000" },
];

function Dots({ light }) {
  return (
    <span className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full border ${light ? "border-white/40" : "border-black"}`}
        />
      ))}
    </span>
  );
}

export default function Interop() {
  return (
    <section className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Interop
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Import from any ecosystem.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-neutral-700">
              Call any PyPI package and any npm package from the same file. No
              bindings, no wrappers, no interop layer. Server-side Python and
              client-side JavaScript, side by side in one Jac file.
            </p>
          </div>

          <div className="space-y-4">
            {/* Editor */}
            <div className="border border-black">
              <div className="flex items-center gap-3 border-b border-black bg-neutral-50 px-3 py-2">
                <Dots />
                <span className="font-mono text-xs text-neutral-600">account.jac</span>
              </div>
              <pre className="max-h-80 overflow-auto p-4 text-xs leading-relaxed">
                <code className="font-mono">{ACCOUNT_JAC}</code>
              </pre>
            </div>

            {/* Terminal */}
            <div className="border border-black bg-black text-white">
              <div className="flex items-center gap-3 border-b border-white/20 px-3 py-2">
                <Dots light />
                <span className="font-mono text-xs text-neutral-400">terminal</span>
              </div>
              <pre className="overflow-auto p-4 font-mono text-xs leading-relaxed">
                {TERMINAL.map((l, i) => {
                  if (l.kind === "spacer") return <div key={i}>&nbsp;</div>;
                  if (l.kind === "cmd")
                    return (
                      <div key={i}>
                        <span className="text-neutral-500">$ </span>
                        {l.text}
                      </div>
                    );
                  if (l.kind === "check")
                    return (
                      <div key={i}>
                        <span className="text-white">✓ </span>
                        <span className="text-neutral-300">{l.text}</span>
                      </div>
                    );
                  return (
                    <div key={i} className="text-neutral-300">
                      {l.text}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
