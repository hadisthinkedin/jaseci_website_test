import Hero from "@/components/hero/Hero";
import VisualPanel from "@/components/visual-panel/VisualPanel";
import CodeCompare from "@/components/code-compare/CodeCompare";
import Interop from "@/components/interop/Interop";
import ScaleShowcase from "@/components/scale-showcase/ScaleShowcase";
import StackShowcase from "@/components/stack-showcase/StackShowcase";
import CaseStudies from "@/components/case-studies/CaseStudies";
import Ecosystem from "@/components/ecosystem/Ecosystem";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "visual", label: "Visual" },
  { id: "code", label: "One file vs four" },
  { id: "interop", label: "Import from any ecosystem" },
  { id: "spotlight-1", label: "Spotlight 1" },
  { id: "spotlight-2", label: "Spotlight 2" },
  { id: "cases", label: "Case studies" },
  { id: "ecosystem", label: "Build with the Jac family" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <a href="#home" className="skip-to-content">
        Skip to content
      </a>
      <Navbar />
      <main className="scroll-root">
        <section id="home" className="snap-section" aria-label="Home">
          <Hero />
        </section>
        <section id="visual" className="snap-section" aria-label="Visual">
          <VisualPanel />
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
          id="spotlight-1"
          className="snap-section"
          aria-label="Zero to infinite scale"
        >
          <ScaleShowcase />
        </section>
        <section
          id="spotlight-2"
          className="snap-section"
          aria-label="One file for the whole stack"
        >
          <StackShowcase />
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
        <section
          id="contact"
          className="snap-section"
          aria-label="Contact and footer"
        >
          <Footer />
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
