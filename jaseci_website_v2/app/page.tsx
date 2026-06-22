import type { CSSProperties } from "react";
import styles from "./page.module.css";
import FallingImages from "./components/FallingImages";
import AbstractionTrend from "./components/AbstractionTrend";
import AbstractionTrendScroll from "./components/AbstractionTrendScroll";
import ProofGrid from "./components/ProofGrid";

// The frameworks to toss in the jar. These point at /public/jar/*.svg —
// currently placeholder marks. Drop each project's OFFICIAL logo SVG in at the
// same path (bump ?v= to force a refetch) and it auto-sizes to its real shape.
const JAR_IMAGES = [
  { src: "/jar/langchain.svg?v=5", alt: "LangChain" },
  { src: "/jar/langgraph.svg?v=2", alt: "LangGraph" },
  { src: "/jar/llamaindex.svg?v=2", alt: "LlamaIndex" },
  { src: "/jar/pydanticai.svg?v=1", alt: "Pydantic AI" },
  { src: "/jar/crewai.svg?v=2", alt: "CrewAI" },
  { src: "/jar/autogen.svg?v=2", alt: "AutoGen" },
  { src: "/jar/dspy.svg?v=2", alt: "DSPy" },
  { src: "/jar/haystack.svg?v=2", alt: "Haystack" },
];

// 12 ecosystem modules — 2 rows of 6. Jac-Scale and Jac-Client are
// expanded by default; every other box expands on hover.
type EcosystemModule = {
  name: string;
  stat: string;
  // small mark trailing the number (×, %, °, …). For 1L / 1G it's an
  // abbreviation the expanded word completes — see accentExpands.
  statAccent?: string;
  // the word that fades in after the number once the tile expands
  statWord?: string;
  // when true the accent letter gives way to statWord on expand, so the stat
  // reads "1 Language" rather than "1L Language"
  accentExpands?: boolean;
  desc: string;
  active?: boolean;
};

const ECOSYSTEM_MODULES: EcosystemModule[][] = [
  [
    {
      name: "Jac",
      stat: "1",
      statAccent: "L",
      statWord: "Language",
      accentExpands: true,
      desc: "The language. A superset of Python built from the ground up for agents, apps, and AI.",
    },
    {
      name: "byLLM",
      stat: "∞",
      statWord: "Reasoning",
      desc: "Makes the model a native type — reasoning becomes a function body the language fills in.",
    },
    {
      name: "Jac-Scale",
      stat: "10",
      statAccent: "×",
      statWord: "Faster",
      desc: "Faster deployment. Python could not — Jac-Scale did. Scale-out without rewriting a line.",
      active: true,
    },
    {
      name: "Jac-Cloud",
      stat: "0",
      statWord: "Config",
      desc: "Zero-config cloud runtime. Ship your graph straight to production as a live service.",
    },
    {
      name: "OSP",
      stat: "1",
      statAccent: "G",
      statWord: "Graph",
      accentExpands: true,
      desc: "Object-Spatial Programming. Memory and relationships are a first-class graph, not bolt-ons.",
    },
    {
      name: "Jac-Studio",
      stat: "360",
      statAccent: "°",
      statWord: "Visibility",
      desc: "Visual observability. Watch agents walk the graph and inspect every node in real time.",
    },
  ],
  [
    {
      name: "Jac-Client",
      stat: "0",
      statWord: "Middleware",
      desc: "No middleware. Python could not — Jac-Client did. Call your backend with zero glue code.",
      active: true,
    },
    {
      name: "Jac-Serve",
      stat: "1",
      statAccent: "ms",
      statWord: "Latency",
      desc: "Turns any walker into an endpoint instantly. APIs without the boilerplate or the framework.",
    },
    {
      name: "Jac-Test",
      stat: "100",
      statAccent: "%",
      statWord: "Coverage",
      desc: "Native testing for graphs and agents. Assert over walks, not mocks.",
    },
    {
      name: "Jac-LSP",
      stat: "<>",
      statWord: "Tooling",
      desc: "First-class editor tooling — autocomplete, types, and jump-to-def for Jac everywhere.",
    },
    {
      name: "Jac-Splice",
      stat: "N",
      statAccent: "+",
      statWord: "Machines",
      desc: "Distributes a single program across machines. One graph, many nodes, no orchestration tax.",
    },
    {
      name: "Jaseci-Hub",
      stat: "1k",
      statAccent: "+",
      statWord: "Packages",
      desc: "The package registry. Share and install JacPacks — reusable agents, walkers, and tools.",
    },
  ],
];

// The ecosystem skyline is hand-tuned, not generated: each column declares how
// many boxes stack in it (1–4) and how tall it stands (% of the row). Both are
// deliberately irregular — the box counts vary and the heights jump and dip
// rather than climbing evenly — so it reads as a skyline, not a clean staircase.
// Box counts sum to 12.
const ECOSYSTEM_LAYOUT = [
  { boxes: 1, h: 44 },
  { boxes: 2, h: 64 },
  { boxes: 1, h: 52 },
  { boxes: 4, h: 90 },
  { boxes: 1, h: 68 },
  { boxes: 3, h: 100 },
];
const ECOSYSTEM_COLUMNS = (() => {
  const flat = ECOSYSTEM_MODULES.flat();
  let idx = 0;
  return ECOSYSTEM_LAYOUT.map(({ boxes, h }) => {
    const modules = flat.slice(idx, idx + boxes);
    idx += boxes;
    return { h, modules };
  });
})();

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.brand}>JAC</div>
        <div className={styles.navLinks}>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#projects">Projects</a>
          <a href="#community">Community</a>
        </div>
      </nav>

      {/* ---------- HERO ---------- */}

      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroHeadline}>
              Jac: the language built to program  <br /> AI Applications.  <br />AI
              Agents.  <br />AI Workflows.{" "}  <br />
              <span className={styles.accent}>AI Everything.</span>
            </h1>
            <p className={styles.heroLede}>
              Jac is the solution to the last{" "}
              <span className={styles.accent}>50 years</span>{" "}
              of developer&rsquo;s hell.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <AbstractionTrend />
          </div>
        </div>
      </section>

      {/* ---------- JAR — the frameworks to toss ---------- */}

      <section className={`${styles.section} ${styles.jarSection}`}>
        <div className={styles.jarColumn}>
          <div className={styles.jar}>
            <div className={styles.jarLabel}>F*CK</div>
            <div className={styles.jarBody}>
              <FallingImages
                images={JAR_IMAGES}
                maxSize={126}
                trigger="scroll"
                gravity={1.1}
                mouseConstraintStiffness={0.18}
                backgroundColor="transparent"
              />
            </div>
          </div>
        </div>
        <div className={styles.jarCopy}>
          <h2 className={styles.h2}>Python, LangChain, they&rsquo;re all broken.</h2>
          <p className={styles.lead}>
            Python became the home of Machine Learning, not Artificial
            Intelligence. But companies pretend like it was born for it. They
            pancake libraries and frameworks on top, constantly abstracting over
            a language never designed to build agents. That&rsquo;s why no matter
            how hard companies try, these tools are always sh*tty. 
          </p>
          <p className={styles.lead}>
            Instead of abstraction, let&rsquo;s build a language that's aware of the advancements in the past year. So, instead of an
            OOP agent wrangling its own state, an OSP walker collapses everything
            into a single graph traversal, running 4.75x faster at runtime and
            built 3.2x faster by developers. Instead of a 500-word prompt,
            let&rsquo;s use byLLM in a single line (that&rsquo;s 
            developer-friendly :D ). Jac is the language built for pro-AI
            communities today.
          </p>
        </div>
      </section>

      {/* ---------- PROOF ---------- */}

      <ProofGrid />

      {/* ---------- THE ASK → SO I BUILT JASECI (one pinned trend) ---------- */}

      <section className={styles.section}>
        <div className={styles.askEcoLayout}>
          {/* LEFT — the trend, pinned, follows you down across the whole act */}
          <div className={styles.askVisual}>
            <AbstractionTrendScroll />
          </div>

          {/* RIGHT — copy scrolls past; the trend hits Jaseci at the turn */}
          <div className={styles.askEcoContent}>
            <h2 className={styles.h2}>Developers needed more.</h2>
            <p className={styles.body} data-jaseci-anchor>
              Jac was good at building an agentic AI, but developers weren&rsquo;t
              just building AI alone. Developers were building applications,
              including the data, the scale, and the deployment. This highlighted
              a large problem: Jac was too slow in production, and after a lengthy
              analysis, the problem was dependency on third-party tools to fill
              those potholes. We designed Jac to be that evolutionary leap; how do
              you turn a language into the next evolutionary step?
            </p>
          </div>
        </div>
      </section>

      {/* ---------- ECOSYSTEM — the full-width staircase ---------- */}

      <section className={`${styles.section} ${styles.ecoSection}`}>
        <div className={styles.ecoStage}>
          <h2 className={`${styles.h2} ${styles.stairHeader}`} id="ecosystem">
            We built the Jaseci Ecosystem.
          </h2>

          <div className={styles.bento} id="ecosystem-grid">
            {ECOSYSTEM_COLUMNS.map((col, c) => (
              <div
                className={styles.stairCol}
                key={c}
                style={{ "--h": col.h } as CSSProperties}
              >
                {col.modules.map((mod) => (
                  <div
                    key={mod.name}
                    className={`${styles.bentoBox} ${
                      mod.active ? styles.bentoBoxActive : ""
                    }`}
                  >
                    <div className={styles.bentoStat}>
                      {mod.stat}
                      {mod.statAccent ? (
                        <span
                          className={`${styles.accent} ${
                            mod.accentExpands ? styles.bentoAccentSwap : ""
                          }`}
                        >
                          {mod.statAccent}
                        </span>
                      ) : null}
                      {mod.statWord ? (
                        <span className={styles.bentoStatWord}>
                          {mod.statWord}
                        </span>
                      ) : null}
                    </div>
                    <div className={styles.bentoContent}>
                      <div className={styles.bentoName}>{mod.name}</div>
                      <p className={styles.bentoDesc}>{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <a href="#ecosystem-grid" className={styles.ecoCta}>
            See the full ecosystem →
          </a>
        </div>
      </section>

      {/* ---------- PROJECTS ---------- */}

      <section
        className={`${styles.section} ${styles.projectsSection}`}
        id="projects"
      >
        <div className={styles.projectsLayout}>
          {/* LEFT — the why */}
          <div className={styles.projectsIntro}>
            <h2 className={styles.h2}>
              Why did you start coding anyway?
            </h2>
            <p className={styles.body}>
              Let me give you a small history lesson: Dennis Ritchie, the
              creator of C, and this is his philosophy of why he built, in my
              opinion, the greatest language (don&rsquo;t kill me): people
              should spend their time coding something they believe is
              important, nothing else. He had that instinct to take away the
              boilerplate that stood between us and the human purpose to ideate
              and create. Let Jaseci remove the tooling bottleneck.
            </p>
          </div>

          {/* RIGHT — four clickable JacPacks + vertical banner */}
          <div className={styles.projectsShowcase}>
            <div className={styles.projectsCards}>
              <a
                className={styles.projectCard}
                href="https://github.com/jaseci-labs/jac-todo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.projectCardTop}>
                  <span className={styles.projectCardMeta}>Built in Jac</span>
                  <span className={styles.projectCardArrow} aria-hidden="true">
                    ↗
                  </span>
                </div>I 
                <div>
                  <div className={styles.projectCardTitle}>Todo App</div>
                  <p className={styles.projectCardDesc}>
                    A full-stack to-do app — auth, database, and live sync, the
                    whole thing in a single Jac file.
                  </p>
                </div>
              </a>

              <a
                className={`${styles.projectCard} ${styles.projectCardFps}`}
                href="https://github.com/jaseci-labs/jac-fps"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fps.gif"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={styles.fpsMedia}
                />
                <div className={styles.projectCardTop}>
                  <span className={styles.projectCardMeta}>
                    Built in a weekend
                  </span>
                  <span className={styles.projectCardArrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div>
                  <div className={styles.projectCardTitle}>FPS Game</div>
                  <p className={styles.projectCardDesc}>
                    A browser first-person shooter with enemy agents that adapt
                    to the way you play.
                  </p>
                </div>
              </a>

              <a
                className={styles.projectCard}
                href="https://github.com/jaseci-labs/jac-blackhole"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.projectCardTop}>
                  <span className={styles.projectCardMeta}>
                    Built in 4 Days
                  </span>
                  <span className={styles.projectCardArrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div>
                  <div className={styles.projectCardTitle}>
                    Black Hole Simulation
                  </div>
                  <p className={styles.projectCardDesc}>
                    A real-time gravitational-lensing black hole, ray-marched
                    live in the browser.
                  </p>
                </div>
              </a>

              <a
                className={styles.projectCard}
                href="https://github.com/jaseci-labs/jac-research-agent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.projectCardTop}>
                  <span className={styles.projectCardMeta}>Built solo</span>
                  <span className={styles.projectCardArrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div>
                  <div className={styles.projectCardTitle}>
                    Autonomous Research Agent
                  </div>
                  <p className={styles.projectCardDesc}>
                    A multi-agent researcher that reads the web, fact-checks
                    itself, and writes the report.
                  </p>
                </div>
              </a>
            </div>

            {/* FAR RIGHT — vertical "See more JacPacks" banner */}
            <a
              className={styles.jacpacksBanner}
              href="https://github.com/jaseci-labs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="See more JacPacks"
            >
              <div className={styles.jacpacksTrack} aria-hidden="true">
                <span className={styles.jacpacksPhrase}>
                  See more JacPacks →
                </span>
                <span className={styles.jacpacksPhrase}>
                  See more JacPacks →
                </span>
                <span className={styles.jacpacksPhrase}>
                  See more JacPacks →
                </span>
                <span className={styles.jacpacksPhrase}>
                  See more JacPacks →
                </span>
                <span className={styles.jacpacksPhrase}>
                  See more JacPacks →
                </span>
                <span className={styles.jacpacksPhrase}>
                  See more JacPacks →
                </span>
                <span className={styles.jacpacksPhrase}>
                  See more JacPacks →
                </span>
                <span className={styles.jacpacksPhrase}>
                  See more JacPacks →
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ---------- FINAL HOOK ---------- */}

      <section className={styles.finalSection} id="community">
        <h2>
          Stay with the old. Get <span className={styles.accent}>left behind</span>.
        </h2>
        <div>
          <a href="/community" className={styles.cta}>
            Join the Community
          </a>
          <a
            href="https://github.com/jaseci-labs"
            className={`${styles.cta} ${styles.ctaSecondary}`}
          >
            Contribute to OSS
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>© Jaseci</div>
        <div className={styles.navLinks}>
          <a href="/docs">Docs</a>
          <a href="https://github.com/jaseci-labs">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
