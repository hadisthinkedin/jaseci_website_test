import { useState } from "react";
import ReplacesGrid from "./ReplacesGrid.jsx";
import GetStartedModal from "./GetStartedModal.jsx";
import { pillars } from "../../lib/pillars.js";
import useTypewriter from "../../hooks/useTypewriter.js";

const affiliations = [
  {
    name: "Nvidia",
    logo: "https://icons.duckduckgo.com/ip3/nvidia.com.ico",
    text: "Backed by Nvidia's Inception program for AI startups.",
  },
  {
    name: "University of Michigan",
    logo: "https://icons.duckduckgo.com/ip3/umich.edu.ico",
    text: "Born from research at the University of Michigan.",
  },
  {
    name: "NSF",
    logo: "https://icons.duckduckgo.com/ip3/nsf.gov.ico",
    text: "Funded by NSF to keep it open sourced and free.",
  },
];

export default function Hero() {
  const { text, index, motion } = useTypewriter(
    pillars.map((p) => p.title),
    { holdMs: 3200 }
  );
  const [open, setOpen] = useState(false);

  return (
    // Fills the first viewport (minus the sticky navbar).
    <section className="flex min-h-[calc(100svh-4rem)] flex-col border-b border-black">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-5xl font-bold leading-[0.98] tracking-tight md:text-7xl">
              One language.
              <br />
              {/* Reserve 2 lines so phrases wrapping mid-type don't shift layout. */}
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

            <div className="mt-8">
              <button
                onClick={() => setOpen(true)}
                className="border border-black bg-black px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-black"
              >
                Get started
              </button>
            </div>
          </div>

          {/* Replaces grid — iPad / desktop only */}
          <div className="hidden md:block">
            <ReplacesGrid />
          </div>
        </div>

        {/* Affiliations */}
        <div className="mt-10 grid gap-px border border-black bg-black md:grid-cols-3">
          {affiliations.map((a) => (
            <div key={a.name} className="flex gap-4 bg-white p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-black bg-white">
                <img
                  src={a.logo}
                  alt={a.name}
                  loading="lazy"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <p className="font-bold tracking-tight">{a.name}</p>
                <p className="mt-1 text-sm text-neutral-600">{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && <GetStartedModal onClose={() => setOpen(false)} />}
    </section>
  );
}
