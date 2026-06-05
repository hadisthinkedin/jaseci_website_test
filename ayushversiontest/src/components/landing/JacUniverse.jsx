import { useState } from "react";
import CodeBlock from "../CodeBlock.jsx";
import ImageBox from "../ImageBox.jsx";
import { hero, docs } from "../../lib/links.js";

const langCode = `import math;
import from random { uniform }

with entry {
  print(math.pi * uniform(0, 10));
}`;

const clientCode = `# backend + frontend, one file
walker:pub get_todos {
  can fetch with \`root entry {
    report [-->(\`?Todo)];
  }
}

cl {
  def:pub app() -> any {
    has todos: list = [];
    return <TodoList items={todos} />;
  }
}`;

const byllmCode = `import from byllm { Model }
glob llm = Model(model_name="gpt-4o");

# the signature IS the prompt
def summarize(text: str) -> str by llm();

with entry {
  print(summarize(article));
}`;

const scaleCode = `# on your laptop
jac start app.jac

# in the cloud, database + auth included
jac start app.jac --scale`;

const tools = [
  {
    key: "lang",
    name: "Jac Lang",
    tagline: "The language",
    blurb:
      "The language itself. It does the work of Python, JavaScript, and C, and keeps every package you already use.",
    code: langCode,
    lang: "jac",
    features: [
      "Compiles to real Python, JavaScript, and machine code",
      "Use any PyPI or npm package",
      "Model your data as a graph",
    ],
    cta: { label: "Read the handbook", url: docs.langFoundation },
  },
  {
    key: "client",
    name: "jac-client",
    tagline: "Full stack, one file",
    blurb:
      "Your whole web app in Jac. Frontend, state, and backend, all in one file, no API wiring.",
    code: clientCode,
    lang: "jac",
    features: [
      "Write React components right in Jac",
      "Call your backend like a normal function",
      "All of npm, plus instant reloads",
    ],
    cta: { label: "Learn jac-client", url: docs.jacClientSetup },
  },
  {
    key: "scale",
    name: "jac-scale",
    tagline: "Laptop to cloud",
    blurb: "Go from your laptop to the cloud without changing a line of code.",
    code: scaleCode,
    lang: "bash",
    features: [
      "A database and cache, set up for you",
      "Scales itself, with logins built in",
      "No Dockerfiles, no YAML",
    ],
    cta: { label: "See how it scales", url: docs.jacScale },
  },
  {
    key: "byllm",
    name: "byLLM",
    tagline: "AI, no prompts",
    blurb:
      "AI without the prompt wrangling. Your function signature is the prompt; byLLM writes the rest.",
    code: byllmCode,
    lang: "jac",
    features: [
      "No prompt engineering",
      "Declare what you want, not how to ask",
      "Works with any model",
    ],
    cta: { label: "Meet byLLM", url: docs.byllm },
  },
  {
    key: "coder",
    name: "JacCoder",
    tagline: "AI coding agent",
    blurb: "Describe what you want to build; JacCoder writes the Jac for you.",
    image: "JacCoder preview",
    features: [
      "Chat your way to a working app",
      "Understands the whole stack",
      "Runs in your browser",
    ],
    cta: { label: "Open JacCoder ↗", url: hero.jacCoder },
  },
  {
    key: "builder",
    name: "JacBuilder",
    tagline: "Visual studio",
    blurb: "Build and ship Jac apps from a visual studio, no setup required.",
    image: "JacBuilder preview",
    features: [
      "Drag-and-drop app builder",
      "Live preview as you go",
      "Deploy in a click",
    ],
    cta: { label: "Open JacBuilder ↗", url: hero.jacBuilder },
  },
];

function Panel({ tool }) {
  return (
    <div className="grid gap-10 p-6 md:grid-cols-2 md:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          {tool.tagline}
        </p>
        <h3 className="mt-2 text-3xl font-bold tracking-tight">{tool.name}</h3>
        <p className="mt-4 text-lg text-neutral-700">{tool.blurb}</p>

        <ul className="mt-6 space-y-2">
          {tool.features.map((f) => (
            <li key={f} className="flex gap-3 border-b border-neutral-200 pb-2 text-sm text-neutral-700">
              <span aria-hidden className="font-bold">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <a
          href={tool.cta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block border border-black bg-black px-5 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
        >
          {tool.cta.label}
        </a>
      </div>

      <div className="flex items-center">
        <div className="w-full">
          {tool.code ? (
            <CodeBlock code={tool.code} lang={tool.lang} />
          ) : (
            <ImageBox label={tool.image} aspect="video" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function JacUniverse() {
  const [active, setActive] = useState(0);
  const n = tools.length;
  const go = (d) => setActive((a) => (a + d + n) % n);

  return (
    <section className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          The Jac Universe
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          One language, a whole ecosystem. Pick a piece and see what it does.
        </p>

        {/* Name selector (dope-style) */}
        <div className="mt-10 flex flex-wrap gap-px border border-black bg-black">
          {tools.map((t, idx) => (
            <button
              key={t.key}
              onClick={() => setActive(idx)}
              className={`flex-1 whitespace-nowrap px-4 py-3 text-sm font-medium ${
                active === idx ? "bg-black text-white" : "bg-white hover:bg-neutral-100"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Fade carousel — one tool at a time */}
        <div className="relative border-x border-b border-black">
          {tools.map((t, idx) => (
            <div
              key={t.key}
              aria-hidden={idx !== active}
              className={`transition-opacity duration-300 ease-out ${
                idx === active
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-0 opacity-0"
              }`}
            >
              <Panel tool={t} />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={() => go(-1)}
            aria-label="Previous tool"
            className="flex h-10 w-10 items-center justify-center border border-black text-lg hover:bg-black hover:text-white"
          >
            ‹
          </button>
          <div className="flex gap-2.5">
            {tools.map((t, idx) => (
              <button
                key={t.key}
                aria-label={`Go to ${t.name}`}
                onClick={() => setActive(idx)}
                className={`h-2.5 w-2.5 rounded-full border border-black transition-colors ${
                  active === idx ? "bg-black" : "bg-white hover:bg-neutral-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next tool"
            className="flex h-10 w-10 items-center justify-center border border-black text-lg hover:bg-black hover:text-white"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
