import { social } from "../lib/links.js";

const channels = [
  { name: "GitHub", desc: "Source code, issues, and contributions.", href: social.github },
  { name: "Discord", desc: "Chat with the community in real time.", href: social.discord },
  { name: "LinkedIn", desc: "Follow company updates and news.", href: social.linkedin },
  { name: "X / Twitter", desc: "Announcements and highlights.", href: social.x },
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
            Come build with us. Here&apos;s where everyone hangs out.
          </p>
        </div>
      </section>

      <section className="border-b border-black">
        <div className="mx-auto grid max-w-6xl gap-px bg-black md:grid-cols-2">
          {channels.map((c) => (
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-8 hover:bg-neutral-100"
            >
              <h2 className="text-xl font-bold tracking-tight">{c.name} ↗</h2>
              <p className="mt-2 text-sm text-neutral-700">{c.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight">Get in touch</h2>
          <p className="mt-3 text-neutral-700">
            Email us at{" "}
            <a href={`mailto:${social.email}`} className="underline">
              {social.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
