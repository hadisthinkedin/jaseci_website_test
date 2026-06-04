import { highlight } from "@/lib/highlighter";
import LearnMoreLink from "@/components/ui/LearnMoreLink";

const MAIN_JAC = `# main.jac — full-stack todo, one file
node Todo { has text: str, done: bool = False; }   # graph node, persisted
walker:pub add_todo {                              # auto-exposed as a POST route
    has text: str;
    can with \`root entry { here ++> Todo(text=self.text); }
}
walker:pub toggle_todo {
    can with Todo entry { here.done = not here.done; }
}
walker:pub get_todos {
    can with \`root entry { report [-->(\`?Todo)]; }
}
# Below this block runs in the browser
cl {
    import lodash;                                 # npm package, bundled at build
    def:pub app() -> JsxElement {
        has todos: list = [],                      # has  →  useState
            text: str = "";
        async def refresh() -> None {
            result = get_todos() spawn root;       # direct walker call, no fetch
            todos = lodash.sortBy(result.reports[0], "text");
        }
        async def add() -> None {
            add_todo(text=text) spawn root;
            text = "";
            await refresh();
        }
        return <div>
            <input value={text}
                onChange={lambda e: any -> None { text = e.target.value; }}
                placeholder="What needs doing?" />
            <button onClick={add}>Add</button>
            <ul>{todos.map(lambda t: any -> any {
                return <li onClick={lambda { toggle_todo() spawn t; }}>
                    {t.done ? "✓ " : "· "}{t.text}
                </li>;
            })}</ul>
        </div>;
    }
}
`;

type TermLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "check"; text: string }
  | { kind: "arrow"; text: string }
  | { kind: "spacer" };

const TERMINAL: TermLine[] = [
  { kind: "cmd", text: "jac start --dev" },
  { kind: "check", text: "vite dev server :8000" },
  { kind: "check", text: "api server :8001" },
  { kind: "check", text: "walker rpc generated — no http boilerplate" },
  { kind: "check", text: "types: client ↔ server checked" },
  { kind: "arrow", text: "http://localhost:8000/cl/app" },
  { kind: "spacer" },
  { kind: "out", text: "[hmr] main.jac changed → reload in 84ms" },
];

export default async function StackShowcase() {
  const jacHtml = await highlight(MAIN_JAC, "jac");

  return (
    <div className="interop">
      <div className="interop__windows">
        <article
          className="interop__window interop__window--editor"
          aria-label="Editor: main.jac"
        >
          <header className="interop__titlebar">
            <span className="interop__traffic" aria-hidden="true">
              <span className="interop__traffic-dot" />
              <span className="interop__traffic-dot" />
              <span className="interop__traffic-dot" />
            </span>
            <span className="interop__title">main.jac</span>
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
                return (
                  <span
                    key={i}
                    className="interop__term-line interop__term-line--spacer"
                  />
                );
              }
              if (line.kind === "cmd") {
                return (
                  <span
                    key={i}
                    className="interop__term-line interop__term-line--cmd"
                  >
                    <span className="interop__term-prompt" aria-hidden="true">
                      $
                    </span>
                    {line.text}
                  </span>
                );
              }
              if (line.kind === "check") {
                return (
                  <span
                    key={i}
                    className="interop__term-line interop__term-line--out"
                  >
                    <span className="interop__term-check" aria-hidden="true">
                      ✓
                    </span>
                    {line.text}
                  </span>
                );
              }
              if (line.kind === "arrow") {
                return (
                  <span
                    key={i}
                    className="interop__term-line interop__term-line--out"
                  >
                    <span className="interop__term-check" aria-hidden="true">
                      →
                    </span>
                    {line.text}
                  </span>
                );
              }
              return (
                <span
                  key={i}
                  className="interop__term-line interop__term-line--out"
                >
                  {line.text}
                </span>
              );
            })}
          </pre>
        </article>
      </div>

      <div className="interop__copy">
        <span className="eyebrow">Full-stack</span>
        <h2 className="interop__headline">One file for the whole stack.</h2>
        <p className="interop__lede">
          React-style UI, walker calls that skip HTTP, and full npm access —
          all in Jac. Types check across the seam, state auto-manages, hot
          reload included.
        </p>
        <LearnMoreLink href="https://docs.jaseci.org/tutorials/client/">
          Learn more
        </LearnMoreLink>
      </div>
    </div>
  );
}
