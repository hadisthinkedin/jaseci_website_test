import { highlight, type SupportedLang } from "@/lib/highlighter";
import CodeComparePanes, { type FileBundle } from "./CodeComparePanes";

type FileSpec = {
  name: string;
  lang: SupportedLang;
  glyph: string;
  breadcrumb: string[];
  source: string;
};

const POLY_FILES: FileSpec[] = [
  {
    name: "globals.css",
    lang: "css",
    glyph: "css",
    breadcrumb: ["app", "globals.css"],
    source: `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; margin: 2rem; }
input { padding: 0.5rem; margin-right: 0.5rem; }
button { padding: 0.5rem 1rem; }
p { margin: 0.25rem 0; }
`,
  },
  {
    name: "layout.tsx",
    lang: "tsx",
    glyph: "tsx",
    breadcrumb: ["app", "layout.tsx"],
    source: `import "./globals.css";
import type { ReactNode } from "react";

export const metadata = { title: "Mini Todo" };

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
    glyph: "tsx",
    breadcrumb: ["app", "page.tsx"],
    source: `"use client";
import { useEffect, useState } from "react";

type Todo = { title: string; category: string; priority: number; done: boolean };
const API = "http://localhost:8000";

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(\`\${API}/todos\`)
      .then((r) => r.json())
      .then(setTodos)
      .catch(() => {});
  }, []);

  async function add() {
    if (!text.trim()) return;
    const res = await fetch(\`\${API}/todos\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: text.trim() }),
    });
    setTodos((t) => [...t, await res.json()]);
    setText("");
  }

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        placeholder="Add a todo..."
      />
      <button onClick={add}>Add</button>
      {todos.map((t, i) => (
        <p key={i}>[{t.priority}] {t.title} ({t.category})</p>
      ))}
    </div>
  );
}
`,
  },
  {
    name: "main.py",
    lang: "python",
    glyph: "py",
    breadcrumb: ["backend", "main.py"],
    source: `import os
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

todos: list[dict] = []

class TodoIn(BaseModel):
    title: str

class Todo(BaseModel):
    title: str
    category: str = "other"
    priority: int = 0
    done: bool = False

def priority_score(title: str) -> int:
    score = sum(20 for c in title if c == "!")
    if "urgent" in title:
        score += 50
    return min(score, 100)

def categorize(title: str) -> str:
    resp = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
        json={
            "model": "openai/gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "Reply with one of: work, personal, shopping, health, other."},
                {"role": "user", "content": title},
            ],
        },
        timeout=20,
    )
    if resp.status_code != 200:
        raise HTTPException(502, "LLM call failed")
    return resp.json()["choices"][0]["message"]["content"].strip().lower()

@app.get("/todos")
def get_todos() -> list[Todo]:
    return todos

@app.post("/todos")
def add_todo(body: TodoIn) -> Todo:
    try:
        category = categorize(body.title)
    except Exception:
        category = "other (setup AI key)"
    todo = Todo(title=body.title, category=category, priority=priority_score(body.title))
    todos.append(todo.model_dump())
    return todo
`,
  },
];

const JAC_FILE: FileSpec = {
  name: "main.jac",
  lang: "jac",
  glyph: "jac",
  breadcrumb: ["jac", "examples", "mini_todo", "main.jac"],
  source: `node Todo {
    has title: str,
        category: str = "other",
        priority: int = 0,
        done: bool = False;
}

enum Category: int { WORK, PERSONAL, SHOPPING, HEALTH, OTHER }

def categorize(title: str) -> Category by llm();

na def priority_score(title: str) -> int {
    score: int = 0;
    for c in title {
        if c == "!" {
            score = score + 20;
        }
    }
    if "urgent" in title {
        score = score + 50;
    }
    if score > 100 {
        score = 100;
    }
    return score;
}

def:pub add_todo(title: str) -> Todo {
    try {
        result = categorize(title);
        category = str(result).split(".")[-1].lower();
    } except Exception {
        category = "other (setup AI key)";
    }
    todo = Todo(title=title, category=category, priority=priority_score(title));
    root ++> todo;
    return todo;
}

def:pub get_todos -> list[Todo] {
    return [root-->][?:Todo];
}

cl def:pub app -> JsxElement {
    has todos: list[Todo] = [],
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

    return
        <div>
            <input
                value={text}
                onChange={lambda e: ChangeEvent { text = e.target.value; }}
                onKeyPress={lambda e: KeyboardEvent { if e.key == "Enter" { add(); }}}
                placeholder="Add a todo..."
            />
            <button onClick={lambda { add(); }}>Add</button>
            {for t in todos {
                <p key={jid(t)}>[{t.priority}]{t.title} ({t.category})</p>
            }}
        </div>;
}
`,
};

const REPO_URL =
  "https://github.com/Jaseci-Labs/jaseci/tree/main/jac/examples/mini_todo";

async function buildBundle(spec: FileSpec): Promise<FileBundle> {
  return {
    name: spec.name,
    lang: spec.lang,
    glyph: spec.glyph,
    breadcrumb: spec.breadcrumb,
    raw: spec.source,
    html: await highlight(spec.source, spec.lang),
  };
}

export default async function CodeCompare() {
  const [poly, jac] = await Promise.all([
    Promise.all(POLY_FILES.map(buildBundle)),
    buildBundle(JAC_FILE),
  ]);
  return (
    <CodeComparePanes
      poly={poly}
      jac={jac}
      defaultActive="main.py"
      repoUrl={REPO_URL}
    />
  );
}
