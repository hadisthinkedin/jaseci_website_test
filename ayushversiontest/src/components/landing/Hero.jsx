import { useState } from "react";
import CodeBlock from "../CodeBlock.jsx";
import BenchmarkWidget from "./BenchmarkWidget.jsx";
import { hero } from "../../lib/links.js";
import { pillars } from "../../lib/pillars.js";
import useTypewriter from "../../hooks/useTypewriter.js";

const affiliations = [
  {
    name: "Nvidia",
    text: "Backed by Nvidia's Inception program for AI startups.",
  },
  {
    name: "University of Michigan",
    text: "Born from research at the University of Michigan.",
  },
  {
    name: "NSF",
    text: "Funded by the NSF to keep it open and free.",
  },
];

const commands = [
  { label: "Install", code: hero.install },
  { label: "Launch full stack app", code: hero.launch },
  { label: "Download the MCP", code: hero.mcp },
];

export default function Hero() {
  const { text, index, motion } = useTypewriter(pillars.map((p) => p.title));
  const [cmd, setCmd] = useState(0);

  return (
    // Fills the first viewport (minus the sticky navbar) so everything up to
    // the affiliations always sits on the first screen.
    <section className="flex min-h-[calc(100svh-4rem)] flex-col border-b border-black">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-5xl font-bold leading-[0.98] tracking-tight md:text-7xl">
              One language.
              <br />
              {/* Reserve 2 lines so longer phrases wrapping mid-type never
                  grow the headline and shift the layout. */}
              <span className="block min-h-[2.05em]">
                {text}
                {motion && (
                  <span className="animate-blink font-normal text-black" aria-hidden>
                    ▌
                  </span>
                )}
              </span>
            </h1>

            <p className="mt-6 min-h-[4rem] max-w-xl text-lg text-neutral-700">
              {pillars[index].sub}
            </p>

            {/* Command tabs — iPad / desktop only */}
            <div className="mt-8 hidden max-w-xl md:block">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-neutral-600">
                Get started in one command
              </p>
              <div className="flex flex-wrap gap-px border border-black bg-black">
                {commands.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => setCmd(i)}
                    className={`flex-1 whitespace-nowrap px-3 py-2 text-xs font-medium ${
                      cmd === i ? "bg-black text-white" : "bg-white hover:bg-neutral-100"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <CodeBlock code={commands[cmd].code} filename="bash" />
              </div>
            </div>
          </div>

          {/* Benchmark — iPad / desktop only */}
          <div className="hidden md:block">
            <BenchmarkWidget />
          </div>
        </div>

        {/* Affiliations */}
        <div className="mt-10 grid gap-px border border-black bg-black md:grid-cols-3">
          {affiliations.map((a) => (
            <div key={a.name} className="flex gap-4 bg-white p-6">
              <div className="h-12 w-12 shrink-0 border border-black bg-neutral-100" />
              <div>
                <p className="font-bold tracking-tight">{a.name}</p>
                <p className="mt-1 text-sm text-neutral-600">{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
