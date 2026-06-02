import { Link } from "react-router-dom";

const features = [
  { title: "Jac Superset", body: "A superset of Python for building AI-native programs." },
  { title: "Jac Client", body: "Full-stack client tooling for Jac applications." },
  { title: "Jac Scale", body: "Scale and deploy Jac programs to the cloud." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-black">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-600">
            Jaseci
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Build AI-native software with Jac.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-700">
            The programming model and runtime for the next generation of
            intelligent applications.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#get-started"
              className="border border-black bg-black px-5 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
            >
              Get started
            </a>
            <Link
              to="/built-with-jaseci"
              className="border border-black px-5 py-2 text-sm font-medium hover:bg-black hover:text-white"
            >
              See what's built
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-black">
        <div className="mx-auto grid max-w-6xl gap-px bg-black md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-8">
              <h2 className="text-xl font-bold tracking-tight">{f.title}</h2>
              <p className="mt-3 text-sm text-neutral-700">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Get started */}
      <section id="get-started">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-3xl font-bold tracking-tight">Get started</h2>
          <p className="mt-4 max-w-xl text-neutral-700">
            Placeholder for getting-started steps, install commands, and code
            samples.
          </p>
          <div className="mt-8 h-48 border border-neutral-300 bg-neutral-100" />
        </div>
      </section>
    </>
  );
}
