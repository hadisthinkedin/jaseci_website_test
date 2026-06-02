const channels = [
  { name: "GitHub", desc: "Source code, issues, and contributions.", href: "#" },
  { name: "Discord", desc: "Chat with the community in real time.", href: "#" },
  { name: "LinkedIn", desc: "Follow company updates and news.", href: "#" },
  { name: "Newsletter", desc: "Get releases and highlights by email.", href: "#" },
];

export default function Community() {
  return (
    <>
      <section className="border-b border-black">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Community
          </h1>
          <p className="mt-6 max-w-prose text-lg text-neutral-700">
            Placeholder for community intro. Where to find us and how to get
            involved.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-px bg-black md:grid-cols-2">
          {channels.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="bg-white p-8 hover:bg-neutral-100"
            >
              <h2 className="text-xl font-bold tracking-tight">{c.name} →</h2>
              <p className="mt-2 text-sm text-neutral-700">{c.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
