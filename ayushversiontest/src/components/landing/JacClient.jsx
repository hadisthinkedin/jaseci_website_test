import CodeBlock from "../CodeBlock.jsx";
import ImageBox from "../ImageBox.jsx";
import { docs } from "../../lib/links.js";

const todoApp = `# Full-stack Todo app in ONE file
node Todo {
    has text: str;
}

walker:pub create_todo {
    has text: str;
    can create with \`root entry {
        here ++> Todo(text=self.text);
    }
}

walker:pub get_todos {
    can fetch with \`root entry {
        report [-->(\`?Todo)];
    }
}

# Frontend React component in Jac
cl {
    def:pub app() -> any {
        has todos: list = [];
        has text: str = "";

        async def addTodo() -> None {
            create_todo(
                text=text
            ) spawn root;
            text = "";
            result = get_todos() spawn root;
            todos = result.reports[0];
        }

        return (
            <div>
                <h1>Todo List</h1>
                <input value={text}
                    onChange={
                      lambda e: any -> None {text = e.target.value;}
                    }
                />
                <button onClick={addTodo}>Add Todo</button>
                <ul>
                    {todos.map(lambda todo: any -> any {
                        return <li>{todo.text}</li>;
                    })}
                </ul>
            </div>
        );
    }
}
# Backend + Frontend in one file!`;

const benefits = [
  "Write React components right in Jac",
  "State just works, no useState boilerplate",
  "Call your backend like a normal function, no HTTP plumbing",
  "One set of types across front and back",
  "Instant reloads while you build",
  "All of npm: MUI, Tailwind, you name it",
];

const steps = [
  { title: "Write it", desc: "Backend, frontend, and AI, all in one .jac file" },
  { title: "Run it", desc: "jac start app.jac, and you've got a dev server" },
  { title: "Ship it", desc: "Add --scale. Same code, now in production" },
];

export default function JacClient() {
  return (
    <section id="jac-client" className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mb-4 flex items-center gap-2">
          <span className="border border-black bg-black px-2 py-0.5 text-xs font-bold uppercase text-white">
            New
          </span>
          <span className="font-mono text-sm text-neutral-600">jac-client</span>
        </div>

        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Your whole app. One file.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          Backend, frontend, and AI, all in Jac. Stop switching languages,
          stop wiring APIs. Here&apos;s a full Todo app, front to back, in a
          single file.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Full Stack Todo App (One File)
            </h3>
            <CodeBlock code={todoApp} lang="jac" />
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Rendered App</h3>
            <ImageBox label="Live Todo app preview" aspect="video" />

            <h3 className="mb-3 mt-8 text-lg font-semibold">What that gets you</h3>
            <ul className="space-y-2">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3 border-b border-neutral-200 pb-2 text-sm text-neutral-700">
                  <span aria-hidden className="font-bold">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-12 grid gap-px border border-black bg-black md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-white p-6">
              <p className="font-mono text-sm text-neutral-500">0{i + 1}</p>
              <p className="mt-2 font-bold tracking-tight">{s.title}</p>
              <p className="mt-1 text-sm text-neutral-600">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={docs.jacClientSetup}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black bg-black px-5 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
          >
            Learn jac-client ↗
          </a>
          <a
            href={docs.jacClientExamples}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black px-5 py-2 text-sm font-medium hover:bg-black hover:text-white"
          >
            View Examples ↗
          </a>
        </div>
      </div>
    </section>
  );
}
