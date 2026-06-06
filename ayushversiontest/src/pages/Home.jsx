import Reveal from "../components/Reveal.jsx";
import Hero from "../components/landing/Hero.jsx";
import Generations from "../components/landing/Generations.jsx";
import Comparison from "../components/landing/Comparison.jsx";
import Benchmarks from "../components/landing/Benchmarks.jsx";
import Interop from "../components/landing/Interop.jsx";
import Compare from "../components/landing/Compare.jsx";
import JacUniverse from "../components/landing/JacUniverse.jsx";
import CaseStudies from "../components/landing/CaseStudies.jsx";

// Each section fades + slides up as it scrolls into view (Apple-style).
// Hero / Generations own their scroll animation, so they're not wrapped.
const sections = [Comparison, Benchmarks, Interop, Compare, JacUniverse, CaseStudies];

export default function Home() {
  return (
    <>
      <Hero />
      <Generations />
      {sections.map((Section, i) => (
        <Reveal key={i}>
          <Section />
        </Reveal>
      ))}
    </>
  );
}
