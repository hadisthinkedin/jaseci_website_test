"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./CodeCompare.module.css";

/* ───────────────────────────────────────────────
   CodeCompare — the receipt for "Jac is more efficient than Python and
   its abstractions": the same to-do app built twice, side by side. Left
   window: one Jac file (data model, API, persistence and the React-style
   UI — code shaped verbatim on the official day-planner tutorial and the
   jaseci README). Right window: the conventional stack — Vite/React
   frontend, Flask + flask-cors + SQLite backend — spread across every
   file it actually takes, one clickable tab per file (the tab row
   scrolls sideways: that's the point).

   Same window DNA as InteropTerminal: hairline chrome, hatched titlebar,
   square lights, mono, orange accent, sharp corners, no shadows.
   Highlighting is a tiny per-line tokenizer (comment / string / keyword /
   jsx-tag) over the site's restrained inks — rendered as React spans, so
   it server-renders and never flashes.
   ─────────────────────────────────────────────── */

type Lang = "jac" | "python" | "jsx" | "json" | "txt";

const JAC_FILE = `"""The entire app — data model, API, persistence, UI. One file."""

node Todo {
    has title: str,
        done: bool = False;
}

"""Add a todo and return it."""
def:pub add_todo(title: str) -> Todo {
    todo = root ++> Todo(title=title);
    return todo;
}

"""Get all todos."""
def:pub get_todos -> list[Todo] {
    return [root-->][?:Todo];
}

"""Toggle a todo's done status."""
def:pub toggle_todo(id: str) -> Todo | None {
    for todo in [root-->][?:Todo] {
        if jid(todo) == id {
            todo.done = not todo.done;
            return todo;
        }
    }
    return None;
}

"""Delete a todo."""
def:pub delete_todo(id: str) -> dict[str, str] {
    for todo in [root-->][?:Todo] {
        if jid(todo) == id {
            del todo;
            return {"deleted": id};
        }
    }
    return {};
}

# the frontend — same file, compiled to JavaScript
cl def:pub app -> JsxElement {
    has todos: list = [],
        text: str = "";

    async can with entry {
        todos = await get_todos();
    }

    async def add {
        if text.strip() {
            todo = await add_todo(text.strip());
            todos = todos + [todo];
            text = "";
        }
    }

    async def toggle(id: str) {
        updated = await toggle_todo(id);
        todos = [updated if jid(t) == id else t for t in todos];
    }

    async def remove(id: str) {
        await delete_todo(id);
        todos = [t for t in todos if jid(t) != id];
    }

    return
        <div class="app">
            <h1>Todos</h1>
            <input
                value={text}
                placeholder="What needs to be done?"
                onChange={lambda e: ChangeEvent {
                    text = e.target.value;
                }}
            />
            <button onClick={add}>Add</button>
            {[
                <div key={jid(t)} class="row">
                    <input
                        type="checkbox"
                        checked={t.done}
                        onChange={lambda { toggle(jid(t)); }}
                    />
                    <span>{t.title}</span>
                    <button onClick={lambda { remove(jid(t)); }}>
                        X
                    </button>
                </div> for t in todos
            ]}
        </div>;
}`;

const SERVER_PY = `import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# without this, the browser blocks every request from :5173
CORS(app, origins=["http://localhost:5173"])

def db():
    conn = sqlite3.connect("todos.db")
    conn.row_factory = sqlite3.Row
    return conn

with db() as conn:
    conn.execute(
        "CREATE TABLE IF NOT EXISTS todos ("
        " id INTEGER PRIMARY KEY AUTOINCREMENT,"
        " title TEXT NOT NULL,"
        " done INTEGER DEFAULT 0)"
    )

@app.route("/api/todos", methods=["GET"])
def get_todos():
    with db() as conn:
        rows = conn.execute("SELECT * FROM todos").fetchall()
    return jsonify([dict(r) for r in rows])

@app.route("/api/todos", methods=["POST"])
def add_todo():
    title = (request.get_json() or {}).get("title", "")
    if not title.strip():
        return jsonify({"error": "title required"}), 400
    with db() as conn:
        cur = conn.execute(
            "INSERT INTO todos (title) VALUES (?)",
            (title.strip(),),
        )
    return jsonify(
        {"id": cur.lastrowid, "title": title.strip(), "done": 0}
    ), 201

@app.route("/api/todos/<int:todo_id>", methods=["PATCH"])
def toggle_todo(todo_id):
    with db() as conn:
        conn.execute(
            "UPDATE todos SET done = NOT done WHERE id = ?",
            (todo_id,),
        )
        row = conn.execute(
            "SELECT * FROM todos WHERE id = ?", (todo_id,)
        ).fetchone()
    if row is None:
        return jsonify({"error": "not found"}), 404
    return jsonify(dict(row))

@app.route("/api/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    with db() as conn:
        conn.execute(
            "DELETE FROM todos WHERE id = ?", (todo_id,)
        )
    return jsonify({"deleted": todo_id})

if __name__ == "__main__":
    app.run(port=8000)`;

const APP_JSX = `import { useEffect, useState } from "react";
import {
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
} from "./api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError("Is the API running?"));
  }, []);

  async function add() {
    const title = text.trim();
    if (!title) return;
    const todo = await addTodo(title);
    setTodos((prev) => [...prev, todo]);
    setText("");
  }

  async function toggle(id) {
    const updated = await toggleTodo(id);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    );
  }

  async function remove(id) {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <h1>Todos</h1>
      <input
        value={text}
        placeholder="What needs to be done?"
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={add}>Add</button>
      {todos.map((t) => (
        <div key={t.id} className="row">
          <input
            type="checkbox"
            checked={!!t.done}
            onChange={() => toggle(t.id)}
          />
          <span>{t.title}</span>
          <button onClick={() => remove(t.id)}>X</button>
        </div>
      ))}
    </div>
  );
}`;

const API_JS = `// every call crosses ports 5173 → 8000, so CORS
// has to be configured on the Flask side first
const BASE = "http://localhost:8000/api";

async function request(path, options) {
  const res = await fetch(\`\${BASE}\${path}\`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(\`API \${res.status}\`);
  return res.json();
}

export const getTodos = () => request("/todos");

export const addTodo = (title) =>
  request("/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const toggleTodo = (id) =>
  request(\`/todos/\${id}\`, { method: "PATCH" });

export const deleteTodo = (id) =>
  request(\`/todos/\${id}\`, { method: "DELETE" });`;

const MAIN_JSX = `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

const PACKAGE_JSON = `{
  "name": "todo-frontend",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^6.4.1"
  }
}`;

const REQUIREMENTS = `flask==3.0.3
flask-cors==5.0.0`;

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Todos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

const VITE_CONFIG = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});`;

type CodeFile = { name: string; lang: Lang; code: string };

const STACK_FILES: CodeFile[] = [
  { name: "src/App.jsx", lang: "jsx", code: APP_JSX },
  { name: "src/api.js", lang: "jsx", code: API_JS },
  { name: "src/main.jsx", lang: "jsx", code: MAIN_JSX },
  { name: "server.py", lang: "python", code: SERVER_PY },
  { name: "index.html", lang: "jsx", code: INDEX_HTML },
  { name: "vite.config.js", lang: "jsx", code: VITE_CONFIG },
  { name: "package.json", lang: "json", code: PACKAGE_JSON },
  { name: "requirements.txt", lang: "txt", code: REQUIREMENTS },
];

const STACK_LINES = STACK_FILES.reduce(
  (n, f) => n + f.code.split("\n").length,
  0,
);
const JAC_LINES = JAC_FILE.split("\n").length;

/* ── tiny per-line tokenizer — comment / string / keyword / jsx tag ────── */

const KEYWORDS: Record<Lang, string> = {
  jac: "def:pub|def:priv|import|from|node|walker|has|can|with|entry|exit|cl|sv|glob|global|visit|report|del|return|if|else|elif|for|in|not|and|or|async|await|lambda|root|here|self|None|True|False",
  python:
    "import|from|def|return|if|else|elif|for|while|with|as|not|and|or|in|is|class|lambda|global|None|True|False",
  jsx: "import|from|export|default|function|return|if|else|const|let|var|async|await|new|throw|typeof|of|in|null|undefined|true|false",
  json: "true|false|null",
  txt: "",
};

const TOKEN_RE: Partial<Record<Lang, RegExp>> = {};
function tokenRe(lang: Lang): RegExp {
  if (!TOKEN_RE[lang]) {
    const kw = KEYWORDS[lang] ? `\\b(?:${KEYWORDS[lang]})\\b` : "(?!x)x";
    // group order = paint priority: comment, string, keyword, jsx tag.
    // tags match only `<Name` / `</Name` — a bare `>` stays plain so the
    // `=>`, `->` and `-->` arrows don't light up
    TOKEN_RE[lang] = new RegExp(
      `(#.*$|//.*$)|("""(?:[^"\\\\]|\\\\.)*"""|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)|(${kw})|(</?[A-Za-z][\\w.]*)`,
      "gm",
    );
  }
  return TOKEN_RE[lang]!;
}

function highlightLine(line: string, lang: Lang, key: number) {
  const re = tokenRe(lang);
  re.lastIndex = 0;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const cls = m[1] ? styles.com : m[2] ? styles.str : m[3] ? styles.kw : styles.tag;
    out.push(
      <span key={`${key}-${i++}`} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function CodePane({ code, lang }: { code: string; lang: Lang }) {
  return (
    <div className={styles.code}>
      {code.split("\n").map((l, i) => (
        <div className={styles.ln} key={i}>
          {l ? highlightLine(l, lang, i) : " "}
        </div>
      ))}
    </div>
  );
}

/* ── the two windows ───────────────────────────────────────────────────── */

export default function CodeCompare() {
  const [active, setActive] = useState(0);
  const file = STACK_FILES[active];

  // custom overlay scroll indicator for the stack's tab strip — the native
  // bar is hidden (it carves a lane below the tabs and leaves a white gap),
  // so a 3px thumb is drawn over the tabs' bottom edge instead. Rendered
  // only while the strip actually overflows.
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0, visible: false });
  const syncThumb = () => {
    const el = tabScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth + 1) {
      setThumb((t) => (t.visible ? { left: 0, width: 0, visible: false } : t));
      return;
    }
    setThumb({
      left: (scrollLeft / scrollWidth) * 100,
      width: (clientWidth / scrollWidth) * 100,
      visible: true,
    });
  };
  useEffect(() => {
    syncThumb();
    const el = tabScrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(syncThumb);
    ro.observe(el);
    // tab widths shift when the mono webfont lands
    document.fonts?.ready.then(syncThumb);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={styles.duel}>
      {/* LEFT — one Jac file */}
      <div className={styles.win}>
        <div className={styles.chrome}>
          <div className={styles.lights} aria-hidden="true">
            <i className={styles.light} />
            <i className={styles.light} />
            <i className={styles.light} />
          </div>
          <div className={styles.title}>todo — jac</div>
          <div className={`${styles.count} ${styles.countAccent}`}>1 file</div>
        </div>
        <div className={styles.tabRow}>
          <div className={`${styles.tab} ${styles.tabJac}`}>app.jac</div>
        </div>
        <CodePane code={JAC_FILE} lang="jac" />
        <div className={styles.status}>
          <span className={styles.cmd}>
            <span className={styles.dollar}>$</span> jac start app.jac
          </span>
          <span className={styles.note}>
            {JAC_LINES} lines · 1 process — ui, api, persistence
          </span>
        </div>
      </div>

      {/* the seam judgement */}
      <div className={styles.vs} aria-hidden="true">
        VS
      </div>

      {/* RIGHT — the conventional stack, one tab per file */}
      <div className={styles.win}>
        <div className={styles.chrome}>
          <div className={styles.lights} aria-hidden="true">
            <i className={styles.light} />
            <i className={styles.light} />
            <i className={styles.light} />
          </div>
          <div className={styles.title}>todo — react + flask + cors</div>
          <div className={styles.count}>{STACK_FILES.length} files</div>
        </div>
        <div className={styles.tabWrap}>
          <div
            ref={tabScrollRef}
            onScroll={syncThumb}
            className={styles.tabScroll}
            role="tablist"
            aria-label="Files in the React + Flask stack"
          >
            {STACK_FILES.map((f, i) => (
              <button
                key={f.name}
                type="button"
                role="tab"
                aria-selected={active === i}
                className={`${styles.tab} ${active === i ? styles.tabOn : ""}`}
                onClick={() => setActive(i)}
              >
                {f.name}
              </button>
            ))}
          </div>
          {/* the scroll position, drawn over the tabs' bottom edge */}
          {thumb.visible && (
            <span
              aria-hidden="true"
              className={styles.tabThumb}
              style={{ left: `${thumb.left}%`, width: `${thumb.width}%` }}
            />
          )}
        </div>
        <CodePane key={file.name} code={file.code} lang={file.lang} />
        <div className={styles.status}>
          <span className={styles.cmd}>
            <span className={styles.dollar}>$</span> python server.py{" "}
            <span className={styles.amp}>&amp;</span> npm run dev
          </span>
          <span className={styles.note}>
            {STACK_LINES} lines · 2 processes + CORS between them
          </span>
        </div>
      </div>
    </div>
  );
}
