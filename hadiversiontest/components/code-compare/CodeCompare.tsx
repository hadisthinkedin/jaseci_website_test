import CodeComparePanes, {
  type FileBundle,
  type SupportedLang,
} from "./CodeComparePanes";

type FileSpec = FileBundle;

const POLY_FILES: FileSpec[] = [
  {
    name: "App.tsx",
    lang: "tsx",
    source: `"use client";
import { useEffect, useState } from "react";
import {
  addTodo,
  deleteTodo,
  listTodos,
  toggleTodo,
  type Todo,
} from "@/lib/jac";

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

  async function remove(jid: string) {
    await deleteTodo(jid);
    setTodos((ts) => ts.filter((t) => t.jid !== jid));
  }

  return (
    <main>
      <h1>Mini Todo</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submit}>
        <input
          value={text}
          disabled={pending}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit" disabled={pending || !text.trim()}>
          Add
        </button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.jid}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggle(t.jid)}
            />
            <span className={t.done ? "done" : ""}>
              {t.title} <em>({t.category.toLowerCase()})</em>
            </span>
            <button onClick={() => remove(t.jid)} aria-label="Delete">
              ×
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
  },
  {
    name: "lib/jac.ts",
    lang: "ts",
    source: `// Wraps the jac-client SDK so each :pub walker / def in main.jac
// becomes a typed function call from this React app. \`jac codegen\`
// reads main.jac at build time and emits the parameter / return types;
// at runtime every call POSTs to /walker/<name> on the Jac server with
// the user's session token attached automatically.
import { JacClient } from "jac-client";

export type Category =
  | "WORK"
  | "PERSONAL"
  | "SHOPPING"
  | "HEALTH"
  | "OTHER";

export type Todo = {
  jid: string;
  title: string;
  category: Category;
  done: boolean;
};

const jac = new JacClient({
  url: process.env.NEXT_PUBLIC_JAC_URL ?? "http://localhost:8000",
  // Token persistence + refresh are handled by the SDK; pass a custom
  // \`storage\` adapter if you need something other than localStorage.
});

export const listTodos = () => jac.call<Todo[]>("list_todos");

export const addTodo = (text: string) =>
  jac.call<Todo>("add_todo", { text });

// \`on\` targets the walker at a specific node by jid — equivalent to
// \`toggle_todo() spawn jid\` in Jac.
export const toggleTodo = (jid: string) =>
  jac.call<Todo>("toggle_todo", {}, { on: jid });

export const deleteTodo = (jid: string) =>
  jac.call<boolean>("delete_todo", { id: jid });
`,
  },
  {
    name: "globals.css",
    lang: "css",
    source: `* { box-sizing: border-box; }

body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  margin: 0;
  padding: 2rem;
  background: #fafafa;
  color: #111;
}

main { max-width: 480px; margin-inline: auto; }
h1 { margin: 0 0 1rem; font-size: 1.5rem; }

form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
input { flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 4px; }
button { padding: 0.5rem 1rem; border: 1px solid #111; background: #111; color: white; border-radius: 4px; cursor: pointer; }
button:disabled { opacity: 0.5; cursor: not-allowed; }

ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
li .done { text-decoration: line-through; opacity: 0.6; }
li em { color: #888; font-style: normal; font-size: 0.85rem; }
li button { margin-left: auto; padding: 0 0.5rem; background: transparent; color: #c00; border: 0; font-size: 1.2rem; }
.error { color: #c00; }
`,
  },
  {
    name: "package.json",
    lang: "json",
    source: `{
  "name": "mini-todo-client",
  "version": "0.1.0",
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
}
`,
  },
];


const JAC_FILE: FileSpec = {
  name: "main.jac",
  lang: "jac",
  source: `# main.jac — same mini-todo app as the four-file client on the left,
# only here the backend (walkers + AI) AND the UI share a single file.
# No fetch, no client SDK, no codegen step, no schema duplication.

enum Category: int { WORK, PERSONAL, SHOPPING, HEALTH, OTHER }

node Todo {
    has title: str,
        category: Category = Category.OTHER,
        done: bool = False;
}

# The function signature IS the prompt. The model is told what to do by
# the type system. \`incl_info\` adds plain-English guidance — the same
# kind of SYSTEM_PROMPT you'd otherwise wire into a separate LLM call.
def categorize(title: str) -> Category by llm(
    model="gpt-4o-mini",
    temperature=0.0,
    incl_info=(
        "You categorize short todo titles for a personal task app. "
        "Pick WORK for job/career/study; SHOPPING for purchases or "
        "groceries; HEALTH for exercise, meals, or medical; PERSONAL "
        "for errands, family, or social; OTHER if nothing else fits."
    ),
);

def:pub add_todo(title: str) -> Todo {
    try {
        category = categorize(title);
    } except Exception {
        category = Category.OTHER;
    }
    todo = Todo(title=title, category=category);
    root ++> todo;
    return todo;
}

def:pub list_todos -> list[Todo] {
    return [root-->][?:Todo];
}

def:pub update_todo(id: int, done: bool) -> Todo {
    todo = jid(id)[?:Todo];
    todo.done = done;
    return todo;
}

def:pub delete_todo(id: int) -> bool {
    todo = jid(id)[?:Todo];
    if not todo {
        return False;
    }
    root del--> todo;
    return True;
}

# Co-located UI. \`add_todo(...)\` etc. reach the defs above directly —
# no fetch, no client SDK, no duplicated Todo type.
cl def:pub app -> JsxElement {
    has todos: list[Todo] = [], text: str = "", pending: bool = False, error: str = "";

    async can with entry { todos = await list_todos(); }

    async def submit(e: FormEvent) {
        e.preventDefault();
        if not text.strip() or pending { return; }
        pending = True;
        try { todos = [await add_todo(text.strip())] + todos; text = ""; }
        except Exception as ex { error = str(ex); }
        pending = False;
    }

    async def toggle(id: str) {
        u = await update_todo(id, not [t for t in todos if jid(t) == id][0].done);
        todos = [u if jid(t) == id else t for t in todos];
    }

    async def remove(id: str) {
        await delete_todo(id);
        todos = [t for t in todos if jid(t) != id];
    }

    return <main>
        <h1>Mini Todo</h1>
        {if error { <p class="error">{error}</p> }}
        <form onSubmit={submit}>
            <input value={text} disabled={pending}
                onChange={lambda e: ChangeEvent { text = e.target.value; }}
                placeholder="Add a todo..." />
            <button type="submit" disabled={pending or not text.strip()}>Add</button>
        </form>
        <ul>{for t in todos {
            <li key={jid(t)}>
                <input type="checkbox" checked={t.done}
                    onChange={lambda { toggle(jid(t)); }} />
                <span class={t.done ? "done" : ""}>
                    {t.title} <em>({str(t.category).split(".")[-1].lower()})</em>
                </span>
                <button onClick={lambda { remove(jid(t)); }} aria-label="Delete">×</button>
            </li>
        }}</ul>
    </main>;
}
`,
};

const REPO_URL =
  "https://github.com/Jaseci-Labs/jaseci/tree/main/jac/examples/mini_todo";

export default function CodeCompare() {
  const poly: FileBundle[] = POLY_FILES.map((f) => ({ ...f }));
  const jac: FileBundle = { ...JAC_FILE };
  return (
    <CodeComparePanes
      poly={poly}
      jac={jac}
      defaultActive="App.tsx"
      repoUrl={REPO_URL}
    />
  );
}
