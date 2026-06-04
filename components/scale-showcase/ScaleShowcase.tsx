import { highlight } from "@/lib/highlighter";
import LearnMoreLink from "@/components/ui/LearnMoreLink";

const APP_JAC = `# app.jac — same file, laptop or cluster
node Note {
    has text: str,
        owner: str;
}
def:pub add_note(owner: str, text: str) -> Note {
    note = Note(owner=owner, text=text);
    root ++> note;
    return note;
}
def:pub list_notes(owner: str) -> list[Note] {
    return [n for n in [root-->][?:Note] if n.owner == owner];
}
def:pub mark_done(id: int) -> bool {
    note = jid(id)[?:Note];
    if not note { return False; }
    root del--> note;
    return True;
}
with entry {
    print("ready");
}
`;

type TermLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "check"; text: string }
  | { kind: "arrow"; text: string }
  | { kind: "spacer" };

const TERMINAL: TermLine[] = [
  { kind: "cmd", text: "jac serve app.jac --target k8s" },
  { kind: "out", text: "ready" },
  { kind: "check", text: "deployment + load balancer" },
  { kind: "check", text: "mongodb statefulset" },
  { kind: "check", text: "redis statefulset" },
  { kind: "check", text: "configmaps + secrets" },
  { kind: "check", text: "persistent volumes attached" },
  { kind: "check", text: "jwt auth wired in" },
  { kind: "check", text: "openapi docs generated" },
  { kind: "arrow", text: "https://app.cluster.dev" },
];

export default async function ScaleShowcase() {
  const jacHtml = await highlight(APP_JAC, "jac");

  return (
    <div className="interop">
      <div className="interop__windows">
        <article
          className="interop__window interop__window--editor"
          aria-label="Editor: app.jac"
        >
          <header className="interop__titlebar">
            <span className="interop__traffic" aria-hidden="true">
              <span className="interop__traffic-dot" />
              <span className="interop__traffic-dot" />
              <span className="interop__traffic-dot" />
            </span>
            <span className="interop__title">app.jac</span>
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
        <span className="eyebrow">Scale</span>
        <h2 className="interop__headline">Zero to infinite scale.</h2>
        <p className="interop__lede">
          The same jac file runs locally with hot reload, or auto-deploys to a
          Kubernetes cluster — Redis, MongoDB, secrets, volumes provisioned for
          you. No Dockerfile, no manifests, no DevOps.
        </p>
        <LearnMoreLink href="https://docs.jaseci.org/tutorials/production/kubernetes/">
          Learn more
        </LearnMoreLink>
      </div>
    </div>
  );
}
