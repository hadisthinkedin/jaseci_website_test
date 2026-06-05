import { useState } from "react";
import CodeBlock from "../CodeBlock.jsx";
import ImageBox from "../ImageBox.jsx";
import { docs } from "../../lib/links.js";

const modes = [
  {
    title: "On your laptop",
    command: "jac start app.jac",
    desc: "Runs locally and reloads as you save.",
    features: ["Local database, no setup", "Fast to iterate", "Instant reloads"],
    output: "# Running at http://localhost:8000",
  },
  {
    title: "In production",
    command: "jac start app.jac --scale",
    desc: "Same command, now in the cloud.",
    features: ["Caching, set up for you", "A real database, set up for you", "Load balancing"],
    output: "# Live in the cloud at http://localhost:30001",
  },
  {
    title: "Versioned releases",
    command: "jac start app.jac --scale --build",
    desc: "Production, with a Docker image per release.",
    features: ["Builds a Docker image", "Tracks versions", "Ready for CI/CD"],
    output: "# Image built and shipped to the cloud",
  },
];

const created = [
  { title: "A cloud deployment", desc: "Load balanced, with health checks" },
  { title: "Caching", desc: "Set up and wired in for you" },
  { title: "A database", desc: "Ready to store your data" },
  { title: "Config & secrets", desc: "Kept safe, kept separate" },
  { title: "Storage that sticks", desc: "Your data survives restarts" },
];

const infra = [
  { title: "Scales itself", desc: "Handles more traffic without you touching anything" },
  { title: "Keeps your data", desc: "A database and a cache, ready to go" },
  { title: "Logins, handled", desc: "Auth and single sign on, built in" },
  { title: "API docs, written for you", desc: "Generated automatically from your code" },
];

export default function JacScale() {
  const [active, setActive] = useState(1);
  const mode = modes[active];

  return (
    <section id="jac-scale" className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="mb-4 flex items-center gap-2">
          <span className="border border-black bg-black px-2 py-0.5 text-xs font-bold uppercase text-white">
            New
          </span>
          <span className="font-mono text-sm text-neutral-600">jac-scale</span>
        </div>

        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          From laptop to production. Same code.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          No Docker, no Kubernetes YAML, no DevOps rabbit hole. The code that
          runs on your machine ships to production with one flag.
        </p>

        {/* Tabs */}
        <div className="mt-12 flex flex-wrap gap-px border border-black bg-black">
          {modes.map((m, i) => (
            <button
              key={m.title}
              onClick={() => setActive(i)}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                active === i ? "bg-black text-white" : "bg-white hover:bg-neutral-100"
              }`}
            >
              {m.title}
            </button>
          ))}
        </div>

        {/* Active mode */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <CodeBlock code={`${mode.command}\n${mode.output}`} filename="terminal" copy={false} />
            <p className="mt-3 text-sm text-neutral-700">{mode.desc}</p>
          </div>
          <ul className="space-y-2">
            {mode.features.map((f) => (
              <li key={f} className="flex gap-3 border-b border-neutral-200 pb-2 text-sm text-neutral-700">
                <span aria-hidden className="font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture diagram */}
        <div className="mt-10">
          <ImageBox label="Deployment architecture diagram" aspect="wide" />
        </div>

        {/* What gets created */}
        <h3 className="mt-16 text-xl font-bold tracking-tight">
          What you get for free
        </h3>
        <div className="mt-6 grid gap-px border border-black bg-black sm:grid-cols-2 lg:grid-cols-5">
          {created.map((c) => (
            <div key={c.title} className="bg-white p-5">
              <p className="text-sm font-bold tracking-tight">{c.title}</p>
              <p className="mt-1 text-xs text-neutral-600">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Infra features */}
        <div className="mt-6 grid gap-px border border-black bg-black sm:grid-cols-2 lg:grid-cols-4">
          {infra.map((c) => (
            <div key={c.title} className="bg-white p-5">
              <p className="text-sm font-bold tracking-tight">{c.title}</p>
              <p className="mt-1 text-xs text-neutral-600">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom message + CTA */}
        <div className="mt-12 border border-black p-8">
          <h3 className="text-xl font-bold tracking-tight">No DevOps. Seriously.</h3>
          <p className="mt-3 max-w-3xl text-neutral-700">
            No Dockerfiles to write, no cloud configs to babysit, no weekend lost
            to setup. The code that runs on your laptop goes to production with
            one extra word.
          </p>
          <a
            href={docs.jacScale}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block border border-black bg-black px-5 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
          >
            Learn jac-scale ↗
          </a>
        </div>
      </div>
    </section>
  );
}
