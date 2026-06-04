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
import KeyboardNav from "@/components/keyboard-nav/KeyboardNav";

export default function Home() {
  return (
    <>
      <a href="#home" className="skip-to-content">
        Skip to content
      </a>
      <KeyboardNav />
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
      </main>
    </>
  );
}
