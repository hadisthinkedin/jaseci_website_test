import Carousel from "../Carousel.jsx";
import { docs } from "../../lib/links.js";

// lower = better. Bar heights are sized against the bigger of the two values.
const benches = [
  {
    unit: "Lines of code",
    task: "Pull structured data out of an image",
    jac: 18,
    trad: 80,
    jacLabel: "18 lines",
    tradLabel: "80 lines",
    win: "4.4× less",
  },
  {
    unit: "Time to build",
    task: "Ship the same feature, start to finish",
    jac: 1,
    trad: 3.2,
    jacLabel: "1×",
    tradLabel: "3.2×",
    win: "3.2× faster",
  },
  {
    unit: "Glue code",
    task: "Wire the frontend to the backend",
    jac: 0,
    trad: 40,
    jacLabel: "none",
    tradLabel: "~40 lines",
    win: "all gone",
  },
];

function VBar({ name, label, h, winner }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`mb-2 font-mono text-sm font-bold ${
          winner ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {label}
      </span>
      <div className="flex h-48 w-16 items-end border border-black bg-white">
        <div
          className={`w-full ${winner ? "bg-emerald-500" : "bg-red-500"}`}
          style={{ height: `${h}%` }}
        />
      </div>
      <span
        className={`mt-2 text-sm font-bold ${
          winner ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {name}
      </span>
    </div>
  );
}

function BenchSlide({ unit, task, jac, trad, jacLabel, tradLabel, win }) {
  const max = Math.max(jac, trad);
  const h = (v) => (max === 0 ? 0 : Math.max((v / max) * 100, v === 0 ? 3 : 8));
  return (
    <div className="mx-auto max-w-md px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">{unit}</p>
      <p className="mt-2 text-lg font-bold tracking-tight">{task}</p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-emerald-600">{win}</p>
      <div className="mt-8 flex items-end justify-center gap-12">
        <VBar name="Jac" label={jacLabel} h={h(jac)} winner />
        <VBar name="The old way" label={tradLabel} h={h(trad)} />
      </div>
    </div>
  );
}

export default function Benchmarks() {
  return (
    <section className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
          The receipts
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Less code. Less time.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          Same app, way less typing, shipped faster. These aren&apos;t our
          numbers, they&apos;re from a peer reviewed study.
        </p>

        <div className="mt-12 border border-black py-12">
          <div className="mb-8 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500">
            Jac vs. the old way · shorter is better
          </div>
          <Carousel slides={benches.map((b) => <BenchSlide key={b.task} {...b} />)} interval={3000} />
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          From the MTP paper, OOPSLA 2025 (the language research behind Jac).{" "}
          <a href={docs.reference} target="_blank" rel="noopener noreferrer" className="underline">
            Read it ↗
          </a>
        </p>
      </div>
    </section>
  );
}
