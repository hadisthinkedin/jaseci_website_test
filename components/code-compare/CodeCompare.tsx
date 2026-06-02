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
    source: `:root {
  --accent: #ee5a24;
}
.app {
  padding: 1.5rem;
  color: var(--accent);
}
`,
  },
  {
    name: "layout.tsx",
    lang: "tsx",
    glyph: "tsx",
    breadcrumb: ["app", "layout.tsx"],
    source: `import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

type Todo = { id: number; title: string; done: boolean };

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    fetch("/api/todos").then((r) => r.json()).then(setTodos);
  }, []);
  return <ul>{todos.map((t) => <li key={t.id}>{t.title}</li>)}</ul>;
}
`,
  },
  {
    name: "main.py",
    lang: "python",
    glyph: "py",
    breadcrumb: ["backend", "main.py"],
    source: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

class Todo(BaseModel):
    id: int
    title: str
    done: bool = False

todos: list[Todo] = []

@app.get("/api/todos")
def list_todos() -> list[Todo]:
    return todos
`,
  },
];

const JAC_FILE: FileSpec = {
  name: "main.jac",
  lang: "jac",
  glyph: "jac",
  breadcrumb: ["jac", "examples", "mini_todo", "main.jac"],
  source: `node Todo {
    has title: str;
    has done: bool = False;
}

walker list_todos {
    can with entry {
        report [root-->][?:Todo];
    }
}

def:pub summarize(items: list[Todo]) -> str by llm();

with entry {
    print(summarize([root-->][?:Todo]));
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
