import CodeComparePanes, {
  type FileBundle,
  type SupportedLang,
} from "./CodeComparePanes";

type FileSpec = FileBundle;

const POLY_FILES: FileSpec[] = [
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
    name: "layout.tsx",
    lang: "tsx",
    source: `import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Mini Todo",
  description: "Polyglot todo example",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  },
  {
    name: "page.tsx",
    lang: "tsx",
    source: `"use client";
import { useEffect, useState } from "react";
import {
  addTodo,
  deleteTodo,
  listTodos,
  updateTodo,
  type Todo,
} from "@/lib/api";

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTodos().then(setTodos).catch((e) => setError(String(e)));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || pending) return;
    setPending(true);
    try {
      const created = await addTodo(text.trim());
      setTodos((t) => [created, ...t]);
      setText("");
    } catch (err) {
      setError(String(err));
    } finally {
      setPending(false);
    }
  }

  async function toggle(id: number, done: boolean) {
    const updated = await updateTodo(id, done);
    setTodos((t) => t.map((x) => (x.id === id ? updated : x)));
  }

  async function remove(id: number) {
    await deleteTodo(id);
    setTodos((t) => t.filter((x) => x.id !== id));
  }

  return (
    <main>
      <h1>Mini Todo</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a todo..."
          disabled={pending}
        />
        <button type="submit" disabled={pending || !text.trim()}>
          Add
        </button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={(e) => toggle(t.id, e.target.checked)}
            />
            <span className={t.done ? "done" : ""}>
              {t.title} <em>({t.category})</em>
            </span>
            <button onClick={() => remove(t.id)} aria-label="Delete">×</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
  },
  {
    name: "api.ts",
    lang: "ts",
    source: `export type Todo = {
  id: number;
  title: string;
  category: string;
  done: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(\`\${API_BASE}\${path}\`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(\`\${res.status} \${res.statusText}: \${detail}\`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export function listTodos(): Promise<Todo[]> {
  return request<Todo[]>("/todos");
}

export function addTodo(title: string): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function updateTodo(id: number, done: boolean): Promise<Todo> {
  return request<Todo>(\`/todos/\${id}\`, {
    method: "PATCH",
    body: JSON.stringify({ done }),
  });
}

export function deleteTodo(id: number): Promise<void> {
  return request<void>(\`/todos/\${id}\`, { method: "DELETE" });
}
`,
  },
  {
    name: "package.json",
    lang: "json",
    source: `{
  "name": "mini-todo-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@types/node": "20.16.0",
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "typescript": "5.5.4"
  }
}
`,
  },
  {
    name: "main.py",
    lang: "python",
    source: `import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .database import Database
from .llm import categorize
from .models import Todo, TodoCreate, TodoUpdate

db = Database(os.getenv("DATABASE_URL", "sqlite:///./todos.db"))


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await db.connect()
    await db.create_tables()
    yield
    await db.disconnect()


app = FastAPI(lifespan=lifespan, title="Mini Todo API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/todos", response_model=list[Todo])
async def list_todos() -> list[Todo]:
    return await db.list_todos()


@app.post("/todos", response_model=Todo, status_code=201)
async def add_todo(body: TodoCreate) -> Todo:
    try:
        category = categorize(body.title)
    except Exception:
        category = "other"
    return await db.insert_todo(body.title, category)


@app.patch("/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, body: TodoUpdate) -> Todo:
    todo = await db.update_todo(todo_id, body.done)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.delete("/todos/{todo_id}", status_code=204)
async def delete_todo(todo_id: int) -> None:
    deleted = await db.delete_todo(todo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")
`,
  },
  {
    name: "models.py",
    lang: "python",
    source: `from pydantic import BaseModel, ConfigDict, Field


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)


class TodoUpdate(BaseModel):
    done: bool


class Todo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    category: str = "other"
    done: bool = False
`,
  },
  {
    name: "database.py",
    lang: "python",
    source: `from typing import Optional

import aiosqlite

from .models import Todo


class Database:
    def __init__(self, url: str) -> None:
        self.path = (
            url.replace("sqlite:///", "")
            if url.startswith("sqlite:///")
            else url
        )
        self.conn: Optional[aiosqlite.Connection] = None

    async def connect(self) -> None:
        self.conn = await aiosqlite.connect(self.path)
        self.conn.row_factory = aiosqlite.Row

    async def disconnect(self) -> None:
        if self.conn:
            await self.conn.close()

    async def create_tables(self) -> None:
        assert self.conn
        await self.conn.execute(
            """
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT 'other',
                done INTEGER NOT NULL DEFAULT 0
            )
            """
        )
        await self.conn.commit()

    async def list_todos(self) -> list[Todo]:
        assert self.conn
        cur = await self.conn.execute(
            "SELECT id, title, category, done FROM todos ORDER BY id DESC"
        )
        rows = await cur.fetchall()
        return [
            Todo(
                id=r["id"],
                title=r["title"],
                category=r["category"],
                done=bool(r["done"]),
            )
            for r in rows
        ]

    async def insert_todo(self, title: str, category: str) -> Todo:
        assert self.conn
        cur = await self.conn.execute(
            "INSERT INTO todos (title, category) VALUES (?, ?)",
            (title, category),
        )
        await self.conn.commit()
        return Todo(
            id=cur.lastrowid or 0,
            title=title,
            category=category,
            done=False,
        )

    async def update_todo(self, todo_id: int, done: bool) -> Optional[Todo]:
        assert self.conn
        await self.conn.execute(
            "UPDATE todos SET done = ? WHERE id = ?",
            (1 if done else 0, todo_id),
        )
        await self.conn.commit()
        cur = await self.conn.execute(
            "SELECT id, title, category, done FROM todos WHERE id = ?",
            (todo_id,),
        )
        row = await cur.fetchone()
        if not row:
            return None
        return Todo(
            id=row["id"],
            title=row["title"],
            category=row["category"],
            done=bool(row["done"]),
        )

    async def delete_todo(self, todo_id: int) -> bool:
        assert self.conn
        cur = await self.conn.execute(
            "DELETE FROM todos WHERE id = ?", (todo_id,)
        )
        await self.conn.commit()
        return (cur.rowcount or 0) > 0
`,
  },
  {
    name: "llm.py",
    lang: "python",
    source: `import os
from typing import Optional

from openai import OpenAI

_client: Optional[OpenAI] = None

ALLOWED = {"work", "personal", "shopping", "health", "other"}

SYSTEM_PROMPT = (
    "You categorize short todo titles for a personal task app. "
    "Reply with EXACTLY one lowercase word, no punctuation, drawn from "
    "this set: work, personal, shopping, health, other. "
    "Pick 'work' for anything job/career/study related; 'shopping' for "
    "purchases or grocery items; 'health' for exercise, meals, or "
    "medical; 'personal' for errands, family, or social; 'other' if "
    "nothing else fits."
)


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set")
        _client = OpenAI(api_key=api_key)
    return _client


def categorize(title: str) -> str:
    client = _get_client()
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        max_tokens=4,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": title},
        ],
    )
    content = (resp.choices[0].message.content or "").strip().lower()
    return content if content in ALLOWED else "other"
`,
  },
  {
    name: "requirements.txt",
    lang: "plaintext",
    source: `fastapi==0.115.0
uvicorn[standard]==0.32.0
pydantic==2.9.2
aiosqlite==0.20.0
openai==1.51.0
python-dotenv==1.0.1
`,
  },
  {
    name: ".env.example",
    lang: "plaintext",
    source: `OPENAI_API_KEY=sk-...
DATABASE_URL=sqlite:///./todos.db
FRONTEND_ORIGIN=http://localhost:3000
`,
  },
];

const JAC_FILE: FileSpec = {
  name: "main.jac",
  lang: "jac",
  source: `# main.jac — same mini-todo app as the 11 files on the left:
# CRUD persistence in a graph, AI categorization, a client UI.
# No fetch, no REST, no CORS, no schema duplication.

enum Category: int { WORK, PERSONAL, SHOPPING, HEALTH, OTHER }

node Todo {
    has title: str,
        category: Category = Category.OTHER,
        done: bool = False;
}

# The function signature IS the prompt. The model is told what to do by
# the type system. \`incl_info\` adds the same plain-English guidance the
# polyglot version puts in main.py's SYSTEM_PROMPT.
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

# Client component. \`await add_todo(...)\` goes straight to the def above —
# no fetch, no JSON serialization, no duplicated Todo type.
cl def:pub app -> JsxElement {
    has todos: list[Todo] = [],
        text: str = "",
        pending: bool = False,
        error: str = "";

    async can with entry {
        todos = await list_todos();
    }

    async def add {
        if not text.strip() or pending { return; }
        pending = True;
        try {
            todo = await add_todo(text.strip());
            todos = [todo] + todos;
            text = "";
        } except Exception as e {
            error = str(e);
        }
        pending = False;
    }

    async def toggle(id: int, done: bool) {
        updated = await update_todo(id, done);
        todos = [updated if t.id == id else t for t in todos];
    }

    async def remove(id: int) {
        await delete_todo(id);
        todos = [t for t in todos if t.id != id];
    }

    return
        <main>
            <h1>Mini Todo</h1>
            {if error { <p class="error">{error}</p> }}
            <form onSubmit={lambda e: FormEvent {
                e.preventDefault();
                add();
            }}>
                <input
                    type="text"
                    value={text}
                    onChange={lambda e: ChangeEvent { text = e.target.value; }}
                    placeholder="Add a todo..."
                    disabled={pending}
                />
                <button type="submit" disabled={pending or not text.strip()}>
                    Add
                </button>
            </form>
            <ul>
                {for t in todos {
                    <li key={jid(t)}>
                        <input
                            type="checkbox"
                            checked={t.done}
                            onChange={lambda e: ChangeEvent { toggle(jid(t), e.target.checked); }}
                        />
                        <span class={t.done ? "done" : ""}>
                            {t.title} <em>({str(t.category).split(".")[-1].lower()})</em>
                        </span>
                        <button onClick={lambda { remove(jid(t)); }} aria-label="Delete">×</button>
                    </li>
                }}
            </ul>
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
      defaultActive="main.py"
      repoUrl={REPO_URL}
    />
  );
}
