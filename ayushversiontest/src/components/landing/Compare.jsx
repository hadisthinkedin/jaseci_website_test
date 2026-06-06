import { useState } from "react";

const APP_TSX = `"use client";
import { useEffect, useState } from "react";
import { addTodo, deleteTodo, listTodos, toggleTodo, type Todo } from "@/lib/jac";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listTodos().then(setTodos).catch((e) => setError(String(e)));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || pending) return;
    setPending(true);
    try {
      const t = await addTodo(text.trim());
      setTodos((ts) => [t, ...ts]);
      setText("");
    } catch (err) {
      setError(String(err));
    } finally {
      setPending(false);
    }
  }

  async function toggle(jid: string) {
    const u = await toggleTodo(jid);
    setTodos((ts) => ts.map((t) => (t.jid === jid ? u : t)));
  }

  return (
    <main>
      <h1>Mini Todo</h1>
      <form onSubmit={submit}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>{/* ...list, toggle, delete... */}</ul>
    </main>
  );
}`;

const LIB_TS = `// Wraps the jac-client SDK so each :pub walker in main.jac becomes a
// typed function call. "jac codegen" reads main.jac at build time and
// emits the parameter / return types; at runtime every call POSTs to
// /walker/<name> with the user's session token attached automatically.
import { JacClient } from "jac-client";

export type Category = "WORK" | "PERSONAL" | "SHOPPING" | "HEALTH" | "OTHER";

export type Todo = {
  jid: string;
  title: string;
  category: Category;
  done: boolean;
};

const jac = new JacClient({
  url: process.env.NEXT_PUBLIC_JAC_URL ?? "http://localhost:8000",
});

export const listTodos = () => jac.call<Todo[]>("list_todos");
export const addTodo = (text: string) => jac.call<Todo>("add_todo", { text });
export const toggleTodo = (jid: string) =>
  jac.call<Todo>("toggle_todo", {}, { on: jid });
export const deleteTodo = (jid: string) =>
  jac.call<boolean>("delete_todo", { id: jid });`;

const GLOBALS_CSS = `* { box-sizing: border-box; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 2rem;
  background: #fafafa;
  color: #111;
}

main { max-width: 480px; margin-inline: auto; }
form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
input { flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #ddd; }
button { padding: 0.5rem 1rem; background: #111; color: white; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; align-items: center; gap: 0.5rem; }`;

const PACKAGE_JSON = `{
  "name": "mini-todo-client",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "codegen": "jac codegen --in ../backend/main.jac --out lib/jac.gen.ts"
  },
  "dependencies": {
    "jac-client": "^0.4.0",
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@types/react": "19.0.0",
    "typescript": "5.5.4"
  }
}`;

const MAIN_JAC = `# main.jac: the same mini-todo app as the four files on the left,
# only here the backend (walkers + AI) AND the UI share one file.
# No fetch, no client SDK, no codegen step, no schema duplication.

enum Category: int { WORK, PERSONAL, SHOPPING, HEALTH, OTHER }

node Todo {
    has title: str,
        category: Category = Category.OTHER,
        done: bool = False;
}

# The function signature IS the prompt. incl_info adds plain-English
# guidance, the same kind of system prompt you'd otherwise wire by hand.
def categorize(title: str) -> Category by llm(
    model="gpt-4o-mini",
    incl_info="Categorize short todo titles: WORK, SHOPPING, HEALTH, PERSONAL, or OTHER."
);

def:pub add_todo(title: str) -> Todo {
    try { category = categorize(title); }
    except Exception { category = Category.OTHER; }
    todo = Todo(title=title, category=category);
    root ++> todo;
    return todo;
}

def:pub list_todos -> list[Todo] {
    return [root-->][?:Todo];
}

# Co-located UI. add_todo(...) reaches the defs above directly:
# no fetch, no client SDK, no duplicated Todo type.
cl def:pub app -> JsxElement {
    has todos: list[Todo] = [], text: str = "";

    async can with entry { todos = await list_todos(); }

    async def submit(e: FormEvent) {
        e.preventDefault();
        todos = [await add_todo(text)] + todos;
        text = "";
    }

    return <main>
        <h1>Mini Todo</h1>
        <form onSubmit={submit}>
            <input value={text}
                onChange={lambda e: ChangeEvent { text = e.target.value; }} />
            <button type="submit">Add</button>
        </form>
        <ul>{for t in todos { <li>{t.title}</li> }}</ul>
    </main>;
}`;

const POLY = [
  { name: "App.tsx", code: APP_TSX },
  { name: "lib/jac.ts", code: LIB_TS },
  { name: "globals.css", code: GLOBALS_CSS },
  { name: "package.json", code: PACKAGE_JSON },
];

const REPO = "https://github.com/Jaseci-Labs/jaseci/tree/main/jac/examples/mini_todo";

function Dots({ light }) {
  return (
    <span className="flex shrink-0 gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full border ${light ? "border-white/40" : "border-black"}`}
        />
      ))}
    </span>
  );
}

export default function Compare() {
  const [idx, setIdx] = useState(0);

  return (
    <section className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
          Compare
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Same app. One file instead of a stack.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          On the left, the usual way: four files, three languages, an SDK, and a
          codegen step. On the right, the exact same app in a single Jac file.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Polyglot */}
          <div className="border border-black">
            <div className="flex items-center gap-2 overflow-x-auto border-b border-black bg-neutral-50 px-3 py-2">
              <Dots />
              {POLY.map((f, i) => (
                <button
                  key={f.name}
                  onClick={() => setIdx(i)}
                  className={`whitespace-nowrap border px-2 py-1 font-mono text-xs ${
                    idx === i
                      ? "border-black bg-black text-white"
                      : "border-transparent text-neutral-500 hover:text-black"
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <pre className="max-h-[26rem] overflow-auto p-4 text-xs leading-relaxed">
              <code className="font-mono">{POLY[idx].code}</code>
            </pre>
          </div>

          {/* Jac */}
          <div className="border border-black">
            <div className="flex items-center gap-3 border-b border-black bg-black px-3 py-2">
              <Dots light />
              <span className="font-mono text-xs text-white">main.jac</span>
              <span className="ml-auto text-xs font-medium text-neutral-400">
                1 file
              </span>
            </div>
            <pre className="max-h-[26rem] overflow-auto p-4 text-xs leading-relaxed">
              <code className="font-mono">{MAIN_JAC}</code>
            </pre>
          </div>
        </div>

        <a
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-between gap-4 border border-black px-4 py-3 text-sm font-medium hover:bg-black hover:text-white"
        >
          <span>One Jac file vs a stack of polyglot files. See the repo yourself.</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
