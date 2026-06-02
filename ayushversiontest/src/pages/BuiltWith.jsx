const projects = Array.from({ length: 9 }, (_, i) => `Project ${i + 1}`);

export default function BuiltWith() {
  return (
    <>
      <section className="border-b border-black">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Built with Jaseci
          </h1>
          <p className="mt-6 max-w-prose text-lg text-neutral-700">
            Placeholder for a showcase of projects and companies building on
            Jaseci.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((p) => (
              <div key={p} className="border border-neutral-300">
                <div className="aspect-video w-full bg-neutral-100" />
                <div className="p-4">
                  <h2 className="font-bold tracking-tight">{p}</h2>
                  <p className="mt-1 text-sm text-neutral-600">
                    Short project description.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
