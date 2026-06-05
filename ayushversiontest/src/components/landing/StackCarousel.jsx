import { docs } from "../../lib/links.js";

const slides = [
  {
    title: "Jac Lang",
    desc: "The language itself. It does the work of Python, JavaScript, and C, and keeps every package you already use.",
    linkText: "Read the handbook",
    link: docs.langFoundation,
  },
  {
    title: "jac-client",
    desc: "Your whole web app in Jac. Frontend, state, and backend, all in one file, no API wiring.",
    linkText: "Explore the client",
    link: docs.jacClientRef,
  },
  {
    title: "jac-scale",
    desc: "Go from your laptop to the cloud without changing a line. Database and logins handled for you.",
    linkText: "See how it scales",
    link: docs.jacScaleRef,
  },
  {
    title: "byLLM",
    desc: "The AI part. Tell it what you want; it handles the prompting.",
    linkText: "Meet byLLM",
    link: docs.byllm,
  },
];

export default function StackCarousel() {
  return (
    <section id="learn" className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          The Jaseci Stack
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          Four pieces. Use one, or use all of them together.
        </p>

        <div className="mt-12 grid gap-px border border-black bg-black sm:grid-cols-2 lg:grid-cols-4">
          {slides.map((s) => (
            <div
              key={s.title}
              className="flex flex-col bg-white p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center border border-black bg-neutral-100 text-[9px] uppercase tracking-widest text-neutral-400">
                Icon
              </div>
              <h3 className="text-lg font-bold tracking-tight">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm text-neutral-600">{s.desc}</p>
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium underline"
              >
                {s.linkText} ↗
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
