import Hero from "@/components/hero/Hero";
import CodeCompare from "@/components/code-compare/CodeCompare";
import Interop from "@/components/interop/Interop";
import CaseStudies from "@/components/case-studies/CaseStudies";
import Ecosystem from "@/components/ecosystem/Ecosystem";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "code", label: "One file vs four" },
  { id: "interop", label: "Import from any ecosystem" },
  { id: "cases", label: "Case studies" },
  { id: "ecosystem", label: "Build with the Jac family" },
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
        <section
          id="interop"
          className="snap-section"
          aria-label="Import from any ecosystem"
        >
          <Interop />
        </section>
        <section
          id="cases"
          className="snap-section"
          aria-label="Case studies"
        >
          <CaseStudies />
        </section>
        <section
          id="ecosystem"
          className="snap-section"
          aria-label="Build with the Jac framework family"
        >
          <Ecosystem />
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
