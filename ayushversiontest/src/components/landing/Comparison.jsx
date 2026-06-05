const cols = ["Jac", "Python", "JavaScript", "C / Rust"];

const rows = [
  { f: "Call an AI without writing a prompt", v: [true, false, false, false] },
  { f: "Backend and frontend in one file", v: [true, false, false, false] },
  { f: "Use any Python package", v: [true, true, false, false] },
  { f: "Use any npm package", v: [true, false, true, false] },
  { f: "Call native C libraries", v: [true, false, false, true] },
  { f: "Model your data as a graph", v: [true, false, false, false] },
  { f: "Ship to the cloud with no config", v: [true, false, false, false] },
  { f: "One language for the whole thing", v: [true, false, false, false] },
];

function Cell({ on, highlight }) {
  return (
    <td
      className={`border border-black px-4 py-3 text-center ${
        highlight ? "bg-black text-white" : ""
      }`}
    >
      {on ? (
        <span className="font-bold">✓</span>
      ) : (
        <span className={highlight ? "text-neutral-500" : "text-neutral-300"}>✕</span>
      )}
    </td>
  );
}

export default function Comparison() {
  return (
    <section className="border-b border-black">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          One language that replaces three
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-neutral-700">
          Everything you&apos;d reach for Python, JavaScript, or C to do, plus
          the AI and graph stuff they can&apos;t.
        </p>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-black px-4 py-3 text-left font-bold">
                  Capability
                </th>
                {cols.map((c, i) => (
                  <th
                    key={c}
                    className={`border border-black px-4 py-3 text-center font-bold ${
                      i === 0 ? "bg-black text-white" : ""
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.f}>
                  <td className="border border-black px-4 py-3 font-medium">
                    {r.f}
                  </td>
                  {r.v.map((on, i) => (
                    <Cell key={i} on={on} highlight={i === 0} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
