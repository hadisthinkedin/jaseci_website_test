import Hero from "@/components/hero/Hero";
import CodeCompare from "@/components/code-compare/CodeCompare";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "code", label: "One file vs four" },
];

export default function Home() {
  return (
    <>
      <a href="#home" className="skip-to-content">
        Skip to content
      </a>
      <main className="scroll-root">
        <section id="home" className="snap-section" aria-label="Home">
          <Hero />
        </section>
        <section id="code" className="snap-section" aria-label="Code comparison">
          <CodeCompare />
        </section>
        <nav className="scroll-nav" aria-label="Section navigation">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="scroll-nav__dot"
              aria-label={s.label}
            >
              <span className="sr-only">{s.label}</span>
            </a>
          ))}
        </nav>
      </main>
    </>
  );
}
