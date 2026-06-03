import Hero from "@/components/hero/Hero";
import CodeCompare from "@/components/code-compare/CodeCompare";
import Interop from "@/components/interop/Interop";
import CaseStudies from "@/components/case-studies/CaseStudies";
import Ecosystem from "@/components/ecosystem/Ecosystem";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import FeatureSpotlight from "@/components/feature-spotlight/FeatureSpotlight";

const SECTIONS = [
  { id: "home", label: "Home" },
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
          <FeatureSpotlight
            headingMain="Zero to infinite scale."
            headingMuted="The same jac file runs locally with hot reload, or auto-deploys to a Kubernetes cluster — Redis, MongoDB, secrets, volumes provisioned for you. No Dockerfile, no manifests, no DevOps."
            ctaLabel="Read the deploy guide"
            ctaHref="https://github.com/jaseci-labs/jaseci"
          />
        </section>
        <section
          id="spotlight-2"
          className="snap-section"
          aria-label="One file for the whole stack"
        >
          <FeatureSpotlight
            reversed
            headingMain="One file for the whole stack."
            headingMuted="React-style UI, walker calls that skip HTTP, and full npm access — all in Jac. Types check across the seam, state auto-manages, hot reload included."
            ctaLabel="See littleX"
            ctaHref="https://github.com/jaseci-labs/littleX"
          />
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
