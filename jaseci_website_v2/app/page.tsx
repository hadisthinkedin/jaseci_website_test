import styles from "./page.module.css";
import FallingImages from "./components/FallingImages";
import AbstractionTrend from "./components/AbstractionTrend";
import AbstractionTrendScroll from "./components/AbstractionTrendScroll";
import ProofGrid from "./components/ProofGrid";

// The frameworks to toss in the jar — each rendered as a falling SVG badge.
const JAR_IMAGES = [
  { src: "/jar/langchain.svg", alt: "LangChain", width: 96, height: 96 },
  { src: "/jar/langgraph.svg", alt: "LangGraph", width: 96, height: 96 },
  { src: "/jar/llamaindex.svg", alt: "LlamaIndex", width: 96, height: 96 },
  { src: "/jar/crewai.svg", alt: "CrewAI", width: 96, height: 96 },
  { src: "/jar/autogen.svg", alt: "AutoGen", width: 96, height: 96 },
  { src: "/jar/dspy.svg", alt: "DSPy", width: 96, height: 96 },
  { src: "/jar/haystack.svg", alt: "Haystack", width: 96, height: 96 },
];

// 12 ecosystem modules — 2 rows of 6. Jac-Scale and Jac-Client are
// expanded by default; every other box expands on hover.
const ECOSYSTEM_MODULES = [
  [
    {
      name: "Jac",
      stat: "1",
      statAccent: "L",
      desc: "The language. A superset of Python built from the ground up for agents, apps, and AI.",
    },
    {
      name: "byLLM",
      stat: "∞",
      desc: "Makes the model a native type — reasoning becomes a function body the language fills in.",
    },
    {
      name: "Jac-Scale",
      stat: "10",
      statAccent: "×",
      desc: "Faster deployment. Python could not — Jac-Scale did. Scale-out without rewriting a line.",
      active: true,
    },
    {
      name: "Jac-Cloud",
      stat: "0",
      desc: "Zero-config cloud runtime. Ship your graph straight to production as a live service.",
    },
    {
      name: "OSP",
      stat: "1",
      statAccent: "G",
      desc: "Object-Spatial Programming. Memory and relationships are a first-class graph, not bolt-ons.",
    },
    {
      name: "Jac-Studio",
      stat: "360",
      statAccent: "°",
      desc: "Visual observability. Watch agents walk the graph and inspect every node in real time.",
    },
  ],
  [
    {
      name: "Jac-Client",
      stat: "0",
      desc: "No middleware. Python could not — Jac-Client did. Call your backend with zero glue code.",
      active: true,
    },
    {
      name: "Jac-Serve",
      stat: "1",
      statAccent: "ms",
      desc: "Turns any walker into an endpoint instantly. APIs without the boilerplate or the framework.",
    },
    {
      name: "Jac-Test",
      stat: "100",
      statAccent: "%",
      desc: "Native testing for graphs and agents. Assert over walks, not mocks.",
    },
    {
      name: "Jac-LSP",
      stat: "<>",
      desc: "First-class editor tooling — autocomplete, types, and jump-to-def for Jac everywhere.",
    },
    {
      name: "Jac-Splice",
      stat: "N",
      statAccent: "+",
      desc: "Distributes a single program across machines. One graph, many nodes, no orchestration tax.",
    },
    {
      name: "Jaseci-Hub",
      stat: "1k",
      statAccent: "+",
      desc: "The package registry. Share and install JacPacks — reusable agents, walkers, and tools.",
    },
  ],
];

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
              Jac is the solution to the last{" "}
              <span className={styles.accent}>50 years</span> of
              developer&rsquo;s hell.
            </h1>
            <p className={styles.heroLede}>
              The programming language that is built to program AI.
              Applications. Agents. Workflows. Everything AI.
            </p>
          </div>

          <div className={styles.heroVisual}>
            <AbstractionTrend />
          </div>
        </div>
      </section>

      {/* ---------- JAR — the frameworks to toss ---------- */}

      <section className={`${styles.section} ${styles.jarSection}`}>
        <div className={styles.jarIntro}>
          <div className={styles.eyebrow}>The old toolbox</div>
          <h2 className={styles.h2}>
            Everything you&rsquo;ve been forced to glue together.
          </h2>
        </div>
        <div className={styles.jarColumn}>
          <div className={styles.jar}>
            <div className={styles.jarLabel}>F*CK</div>
            <div className={styles.jarBody}>
              <FallingImages
                images={JAR_IMAGES}
                trigger="scroll"
                gravity={1.1}
                mouseConstraintStiffness={0.18}
                backgroundColor="transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WHY ---------- */}

      <section className={`${styles.section} ${styles.why}`}>
        <div className={styles.eyebrow}>The Conviction</div>
        <h2 className={styles.h2}>The old ways are broken.</h2>

        <p className={styles.lead}>
          The rest of the industry won&rsquo;t say it, so we will: Python was
          built for machine learning, not for agents — and every framework
          piled on top of it is just abstraction papering over a language never
          designed for this work. Which is exactly why it collapses into a
          debugging nightmare the moment you look closely.
        </p>
        <p className={styles.leadPunch}>
          We didn&rsquo;t paper over the seams. <span>We tore them out.</span>
        </p>

        <div className={styles.pillars}>
          <div className={styles.pillar}>
            <div className={styles.pillarTag}>byLLM</div>
            <h3 className={styles.pillarTitle}>
              We made the model a <span className={styles.accent}>native type</span>.
            </h3>
            <p className={styles.pillarBody}>
              An agent&rsquo;s reasoning becomes a function body the language
              fills in — not a prompt you assemble and pray over.
            </p>
          </div>
          <div className={styles.pillar}>
            <div className={styles.pillarTag}>Object-Spatial Programming</div>
            <h3 className={styles.pillarTitle}>
              We made the world a <span className={styles.accent}>graph</span>.
            </h3>
            <p className={styles.pillarBody}>
              An agent&rsquo;s memory, and the relationships it reasons across,
              are first-class — not bolted on.
            </p>
          </div>
        </div>

        <blockquote className={styles.conviction}>
          An agent isn&rsquo;t a model with extra steps. It&rsquo;s a new kind
          of program with its own shape — and a language built for that shape
          will always beat one talked into pretending.
        </blockquote>

        <p className={styles.carry}>
          And no, you don&rsquo;t start over with Python.{" "}
          <strong>We carry it forward with you.</strong>
        </p>
      </section>

      {/* ---------- PROOF ---------- */}

      <ProofGrid />

      {/* ---------- THE ASK → SO I BUILT JASECI (one pinned trend) ---------- */}

      <section className={styles.section}>
        <div className={styles.eyebrow}>The Ask</div>
        <div className={styles.askEcoLayout}>
          {/* LEFT — the trend, pinned, follows you down across the whole act */}
          <div className={styles.askVisual}>
            <AbstractionTrendScroll />
          </div>

          {/* RIGHT — copy scrolls past; the trend hits Jaseci at the turn */}
          <div className={styles.askEcoContent}>
            <p className={styles.body}>
              They came to me for one thing — agentic AI. And Jac was good at it.
              But an agent is just one corner of what they were really building:
              the app around it, the data beneath it, the scale, the deploy.
              They didn&rsquo;t want a tool for the workflow. They wanted all of
              it — and a language I&rsquo;d built only for agents was never going
              to be enough.
            </p>
            <p className={styles.body}>
              And there was a harder problem underneath. In production Jac was
              still slow, because for everything beyond the agent it leaned on
              other tools. Every dependency it reached for dragged on it — the
              language I&rsquo;d built was paying the price for what it
              couldn&rsquo;t do on its own.
            </p>
            <p className={styles.body}>
              So what was I supposed to do? Not hand developers a better tool
              among tools. I had to make Jac itself the leap — the same one the
              world made when it went from Assembly to C, where the new language
              doesn&rsquo;t sit on top of the old one, it becomes the ground
              everything is built on. How do you turn a language into the next
              evolutionary step?
            </p>

            <h2
              className={`${styles.h2} ${styles.askEcoHeading}`}
              id="ecosystem"
              data-jaseci-anchor
            >
              So I built Jaseci.
            </h2>
            <p className={styles.body}>
              An ecosystem that fixes the problems developers have been shouting
              about for years — without asking them to give up what they already
              know.
            </p>

            <div className={styles.bento}>
              {ECOSYSTEM_MODULES.flat().map((mod) => (
                <div key={mod.name} className={styles.bentoBox}>
                  <div className={styles.bentoStat}>
                    {mod.stat}
                    {mod.statAccent ? (
                      <span className={styles.accent}>{mod.statAccent}</span>
                    ) : null}
                  </div>
                  <div className={styles.bentoContent}>
                    <div className={styles.bentoName}>{mod.name}</div>
                    <p className={styles.bentoDesc}>{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className={`${styles.h2} ${styles.askEcoHeading}`}>
              Developers needed more.
            </h2>

            <a href="/ecosystem" className={styles.cta}>
              See the full ecosystem →
            </a>
          </div>
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
              Why did you start writing code in the first place?
            </h2>
            <p className={styles.body}>
              We never started programming to allocate variables or stitch
              middleware together — we started to drag an idea out of our heads
              and make it real. That&rsquo;s the philosophy Dennis Ritchie built
              C on, the one your story already invokes: spend your time doing
              something useful, not storing integers in registers. Every leap
              since — Assembly to C, C to Python, Python to Jac — has obeyed the
              same instinct, clearing away the boilerplate that stands between a
              developer and the thing they actually meant to make. We build
              because creation was always the point; the tooling was only ever
              supposed to get out of the way.
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
                  <span className={styles.projectCardMeta}>Built in 4 days</span>
                  <span className={styles.projectCardArrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
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
                    Built in 2 weeks
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
        <p>
          Join the community. Contribute to the OSS. Build the future before
          it gets built around you.
        </p>
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
