import CodeBlock from "../CodeBlock.jsx";

const targets = [
  { title: "Python", sub: "every PyPI package" },
  { title: "JavaScript", sub: "every npm package" },
  { title: "Machine code", sub: "native speed" },
];

const pythonExample = `import math; #import python libraries
import from random { uniform } #import specific functions

with entry{
  value =  math.pi * uniform(0, 10);
  print(value);
}`;

const jsExample = `cl import from '@mui/material' { Button, TextField }

cl {
  def app() -> any {
    has count: int = 0;  # Auto becomes useState!

    return (
      <div>
        <TextField label="Count" value={count} />
        <Button onClick={lambda -> None { count += 1; }}>
          Increment
        </Button>
      </div>
    );
  }
}`;

export default function JacSuperset() {
  return (
    <section id="jac-superset" className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Write it once. Run it everywhere.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          You write Jac once. It turns into real Python, real JavaScript, and
          real machine code, so every library you already use just works.
        </p>

        {/* Compile diagram */}
        <div className="mt-12 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          <div className="border border-black p-4 text-center md:w-48">
            <p className="font-mono font-bold">your code.jac</p>
            <p className="text-xs text-neutral-600">write it once</p>
          </div>
          <div className="text-center text-2xl font-bold text-neutral-400">→</div>
          <div className="border border-black bg-black p-4 text-center text-white md:w-48">
            <p className="font-bold">Jac translates it</p>
          </div>
          <div className="text-center text-2xl font-bold text-neutral-400">→</div>
          <div className="grid flex-1 gap-px border border-black bg-black sm:grid-cols-3">
            {targets.map((t) => (
              <div key={t.title} className="bg-white p-4 text-center">
                <p className="text-sm font-bold tracking-tight">{t.title}</p>
                <p className="mt-1 text-xs text-neutral-600">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Code examples */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Grab any Python package
            </h3>
            <CodeBlock code={pythonExample} lang="jac" />
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Grab any npm package: React, MUI, whatever
            </h3>
            <CodeBlock code={jsExample} lang="jac" />
          </div>
        </div>

        {/* Callout */}
        <div className="mt-12 border border-black p-8">
          <h3 className="text-xl font-bold tracking-tight">
            Nothing you already use gets left behind
          </h3>
          <p className="mt-3 max-w-3xl text-neutral-700">
            Because Jac becomes plain Python, JavaScript, and machine code, every
            package and library you rely on today keeps working. No rewrites, no
            bridges, no &quot;sorry, that&apos;s not supported yet.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
