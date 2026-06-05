import Reveal from "../components/Reveal.jsx";
import Hero from "../components/landing/Hero.jsx";
import Generations from "../components/landing/Generations.jsx";
import WhyJaseci from "../components/landing/WhyJaseci.jsx";
import Benchmarks from "../components/landing/Benchmarks.jsx";
import Comparison from "../components/landing/Comparison.jsx";
import JacUniverse from "../components/landing/JacUniverse.jsx";

// Each section fades + slides up as it scrolls into view (Apple-style).
// Hero is left un-wrapped so its typewriter runs immediately.
// The per-tool deep dives now live inside <JacUniverse /> (the carousel).
const sections = [WhyJaseci, Benchmarks, Comparison, JacUniverse];

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
