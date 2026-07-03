import type { CSSProperties } from "react";
import styles from "./page.module.css";
import NavDetach from "./components/NavDetach";
import FallingImages from "./components/FallingImages";
import AbstractionTrend from "./components/AbstractionTrend";
import Typewriter from "./components/Typewriter";
import InstallBox from "./components/InstallBox";
import ManifestoAccordion from "./components/ManifestoAccordion";
import LineageBloom from "./components/LineageBloom";
import EvolutionBox from "./components/EvolutionBox";
import ProofGrid from "./components/ProofGrid";
import BlockTower from "./components/BlockTower";
import BlackHole from "./components/BlackHole";
import NeuralNetwork from "./components/NeuralNetwork";

// The frameworks to toss in the bin — each drops in as an orange hexagon that
// flips to the logo (forced white-on-black) on hover. SVGs live at
// /public/jar/*.svg; drop each project's official mark in at the same path
// (bump ?v= to force a refetch).
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

// 12 ecosystem modules — 2 rows of 6. jac-client and jac-scale ship expanded
// (the same skyline slots as before); every other box expands on hover.
// Every stat line shows its word at rest ("0 Prompts", "1 Command", …) since
// the bare numbers repeat across tiles.
type EcosystemModule = {
  name: string;
  stat: string;
  // small mark trailing the number (×, %, °, …). For 1L / 1G it's an
  // abbreviation the expanded word completes — see accentExpands.
  statAccent?: string;
  // the word that fades in after the number once the tile expands
  statWord?: string;
  // when true statWord shows in the resting state, not just on expand — for
  // stats whose bare accent reads as cryptic on its own (1L → "1 Language",
  // N+ → "N+ Machines")
  statWordStatic?: boolean;
  // when true the accent letter gives way to statWord on expand, so the stat
  // reads "1 Language" rather than "1L Language"
  accentExpands?: boolean;
  // which half of the stat line gets the orange accent: by default the leading
  // number is orange; when true the completing word is orange instead (number
  // goes black). Scattered across tiles so the accent reads as random.
  accentWord?: boolean;
  desc: string;
  // the install command / syntax token shown in mono under the description
  // ("pip install byllm", "jac nacompile", "@schedule", …)
  pip?: string;
  active?: boolean;
};

const ECOSYSTEM_MODULES: EcosystemModule[][] = [
  [
    {
      name: "byLLM",
      stat: "0",
      statWord: "Prompts",
      statWordStatic: true,
      desc: "No prompt engineering. Python could not — byLLM did. Write a function signature and the compiler writes the prompt for you.",
      pip: "pip install byllm",
    },
    {
      name: "jac-super",
      stat: "1",
      statWord: "Command",
      statWordStatic: true,
      accentWord: true,
      desc: "Better developer experience. Python could not — jac-super did. Rich-formatted CLI output with themes, panels, and spinners.",
      pip: "pip install jac-super",
    },
    {
      name: "jac-client",
      stat: "0",
      statWord: "Middleware",
      statWordStatic: true,
      accentWord: true,
      desc: "No middleware. Python could not — jac-client did. Call your backend from React-style components with zero glue code.",
      pip: "pip install jac-client",
      active: true,
    },
    {
      name: "jac-shadcn",
      stat: "0",
      statWord: "CSS",
      statWordStatic: true,
      desc: "Pre-built UI. Python could not — jac-shadcn did. Drop in beautiful, customizable components without leaving Jac.",
      pip: "pip install jac-shadcn",
    },
    {
      name: "jac-mcp",
      stat: "0",
      statWord: "Docs",
      statWordStatic: true,
      accentWord: true,
      desc: "AI-assisted coding. Python could not — jac-mcp did. Give any AI coding assistant deep knowledge of Jac through the Model Context Protocol.",
      pip: "pip install jac-mcp",
    },
    {
      name: "jac-scale",
      stat: "0",
      statWord: "Config",
      statWordStatic: true,
      desc: "Faster deployment. Python could not — jac-scale did. Scale to Kubernetes without writing a single YAML file.",
      pip: "pip install jac-scale",
      active: true,
    },
  ],
  [
    {
      name: "OSP",
      stat: "0",
      statWord: "SQL",
      statWordStatic: true,
      accentWord: true,
      desc: "Built into jaclang. No graph library. Python could not — OSP did. Model your entire domain as nodes, edges, and walkers that traverse them — no Neo4j, no NetworkX.",
    },
    {
      name: "Codespaces",
      stat: "3",
      statWord: "Targets",
      statWordStatic: true,
      desc: "Built into jaclang. One language, three targets. Python could not — Codespaces did. Compile to Python bytecode, JavaScript, and native machine code from the same file.",
      pip: "to sv: / to cl: / to na:",
    },
    {
      name: "Native Compilation",
      stat: "C",
      statAccent: "-level",
      statWord: "Fast",
      statWordStatic: true,
      desc: "Built into jaclang. Bare-metal speed. Python could not — native compilation did. Compile Jac to LLVM machine code — no Python runtime, no external compiler, no external linker.",
      pip: "jac nacompile",
    },
    {
      name: "Built-in Auth",
      stat: "0",
      statWord: "Auth Code",
      statWordStatic: true,
      accentWord: true,
      desc: "Built into jac-scale. Per-user isolation. Python could not — Jac's auth runtime did. Each user gets their own root graph with zero auth middleware code.",
      pip: "jacLogin / jacSignup / :priv",
    },
    {
      name: "WebSockets & Webhooks",
      stat: "1",
      statWord: "Decorator",
      statWordStatic: true,
      desc: "Built into jac-scale. Real-time communication. Python could not — jac-scale did. Turn any walker into a WebSocket or webhook endpoint with a single decorator — HMAC verification, API keys, and connection management included.",
    },
    {
      name: "Scheduled Tasks",
      stat: "1",
      statWord: "Line",
      statWordStatic: true,
      accentWord: true,
      desc: "Built into jac-scale[scheduler]. Background jobs. Python could not — @schedule did. Cron jobs and interval tasks as a decorator on any walker or function — no Celery, no task queue, no separate worker process.",
      pip: "@schedule",
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
  { boxes: 4, h: 94 },
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

// One skyline column: the bordered stat/name/desc boxes for its modules. Shared
// by the left columns and the two that ride on top of the CTA.
function EcoColumn({
  col,
}: {
  col: { h: number; modules: EcosystemModule[] };
}) {
  return (
    <div className={styles.stairCol} style={{ "--h": col.h } as CSSProperties}>
      {col.modules.map((mod) => (
        <div
          key={mod.name}
          className={`${styles.bentoBox} ${
            mod.active ? styles.bentoBoxActive : ""
          }`}
        >
          <div className={styles.bentoStat}>
            {/* accent lands on the number by default, or on the word when
                accentWord is set — scattered per tile so it reads as random */}
            <span className={mod.accentWord ? undefined : styles.accent}>
              {mod.stat}
            </span>
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
              <span
                className={`${styles.bentoStatWord} ${
                  mod.statWordStatic ? styles.bentoStatWordStatic : ""
                } ${mod.accentWord ? styles.accent : ""}`}
              >
                {mod.statWord}
              </span>
            ) : null}
          </div>
          <div className={styles.bentoContent}>
            <div className={styles.bentoName}>{mod.name}</div>
            <p className={styles.bentoDesc}>{mod.desc}</p>
            {mod.pip ? <div className={styles.bentoPip}>{mod.pip}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

// "Developers needed more." — the evolution story as a statement slab:
// headline set large on the frame, the full story paragraph slides in
// as an orange drawer on hover
const LEAP_COPY = {
  headline:
    "Though devs used Jac, their application was still too slow because they depended on a third-party stack.",
  body: "Jac was just as fast as C by itself, but when teamed up with React for the frontend, and then CORS for the middleware, and then Vercel for deployment, things slowed down. So, in Jac v2, we decided to have those dependencies built into Jac. Now, when building your AI application, all you need is Jac. But what should we call this individual stack in layman’s terms? What should the solution to multiple problems be dubbed as?",
};

export default function Home() {
  return (
    <div className={styles.page}>
      <NavDetach />
      <div className={styles.navDock}>
        <nav className={styles.nav}>
          <div className={styles.brand}>
            <img className={styles.brandMark} src="/jaseci-logo.png" alt="Jaseci" />
            JAC
          </div>
          <div className={styles.navLinks}>
            <a href="#ecosystem">Ecosystem</a>
            <a href="#projects">Projects</a>
            <a href="#community">Community</a>
          </div>
          {/* registration-mark corners — fade in when the nav detaches */}
          <span aria-hidden className={`${styles.corner} ${styles.cornerTL}`} />
          <span aria-hidden className={`${styles.corner} ${styles.cornerTR}`} />
          <span aria-hidden className={`${styles.corner} ${styles.cornerBL}`} />
          <span aria-hidden className={`${styles.corner} ${styles.cornerBR}`} />
        </nav>
      </div>

      {/* ---------- HERO ---------- */}

      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroHeadline}>
              Jac, the language <br />
              built for{" "}
              <Typewriter
                words={["AI Applications.", "AI Agents.", "AI Workflows.", "everything."]}
              />
            </h1>
            <p className={styles.heroLede}>
              Instead of building your AI applications with python, langchain
              and abstraction slop, use a language that is built exactly for AI
              development. Forget boilerplate traditions like overcomplicated
              prompts, unnecessary middleware, and lengthy deployments.
              Let&rsquo;s bring back the coding joy by making Jac aware of the
              complexity, and remove it.
            </p>
            <InstallBox />
          </div>

          <div className={styles.heroVisual}>
            <AbstractionTrend />
          </div>
        </div>
      </section>

      {/* ---------- THE F*CK BIN — toss the broken frameworks in the trash ---------- */}

      <section className={`${styles.section} ${styles.jarSection}`}>
        <div className={styles.jarColumn}>
          <div className={styles.jar}>
            <div className={styles.jarLabel}>F*CK</div>
            <div className={styles.jarBody}>
              <FallingImages
                images={JAR_IMAGES}
                variant="hex"
                maxSize={110}
                trigger="scroll"
                gravity={1.1}
                mouseConstraintStiffness={0.18}
                backgroundColor="transparent"
              />
            </div>
          </div>
        </div>
        <div className={styles.jarCopy}>
          <h2 className={styles.h2}>Jac is more efficient than Python and its abstractions.</h2>
          <ManifestoAccordion />
        </div>
      </section>

      {/* ---------- THE STACK — abstractions piled on Python ---------- */}

      <section
        className={`${styles.section} ${styles.jarSection} ${styles.stackSection}`}
      >
        <div className={styles.jarColumn}>
          <BlockTower />
        </div>
        <div className={styles.jarCopy}>
          <h2 className={styles.h2}>Jac is more efficient than Python and its abstractions.</h2>
          <ManifestoAccordion variant="tower" />
        </div>
      </section>

      {/* ---------- PROOF ---------- */}

      <ProofGrid />

      {/* ---------- THE ASK → SO I BUILT JASECI ---------- */}

      <section className={styles.section}>
        <div className={styles.askEcoLayout}>
          {/* TOP — the copy + the evolution beat as a single hover-expanding box */}
          <div className={styles.askEcoContent}>
            <h2 className={styles.h2}>
              Developers needed <s className={styles.strikeMore}>more</s>{" "}
              <span className={styles.accent}>interoperts</span>.
            </h2>
            <EvolutionBox headline={LEAP_COPY.headline} body={LEAP_COPY.body} />
          </div>

          {/* BOTTOM — Jac → Jaseci, blooming into the ecosystem tree */}
          <div className={styles.askVisual}>
            <LineageBloom />
          </div>
        </div>
      </section>

      {/* ---------- ECOSYSTEM — the full-width staircase ---------- */}

      <section className={`${styles.section} ${styles.ecoSection}`}>
        <div className={styles.ecoStage}>
          <h2 className={`${styles.h2} ${styles.stairHeader}`} id="ecosystem">
            We built Jaseci.
            <br />
            An Ecosystem.
          </h2>

          <div className={styles.bento} id="ecosystem-grid">
            {ECOSYSTEM_COLUMNS.slice(0, -2).map((col, c) => (
              <EcoColumn col={col} key={c} />
            ))}

            {/* the two rightmost columns ride on top of the CTA so it expands
                and shrinks with the accordion too */}
            <div className={styles.ctaGroup}>
              <div className={styles.ctaGroupTop}>
                {ECOSYSTEM_COLUMNS.slice(-2).map((col, c) => (
                  <EcoColumn col={col} key={c} />
                ))}
              </div>
              <a href="#ecosystem-grid" className={styles.ecoCta}>
                See the full ecosystem →
              </a>
            </div>
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
            <h2 className={`${styles.h2} ${styles.whyHeading}`}>
              Why did you
              <br />
              start coding?
            </h2>
            <p className={styles.body}>
              Dennis Ritchie&rsquo;s philosophy of why he built the C was the
              idea that people should spend their time coding something
              innovative, nothing else. His instinct was to take away the
              boilerplate, like registers, that stood between us and human
              ideation. We want to replicate that same philosophy over 50 years
              ago, and take away that boilerplate and give devs more time.
            </p>
          </div>

          {/* RIGHT — four clickable JacPacks + vertical banner */}
          <div className={styles.projectsShowcase}>
            <div className={styles.projectsCards}>
              <a
                className={`${styles.projectCard} ${styles.projectCardTodo}`}
                href="https://github.com/jaseci-labs/jac-todo"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/todo.gif"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={styles.todoMedia}
                />
                <div className={styles.projectCardTop}>
                  <span className={styles.projectCardMeta}>Built in Jac</span>
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
                className={`${styles.projectCard} ${styles.projectCardBlackhole}`}
                href="https://github.com/jaseci-labs/jac-blackhole"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* live three.js black hole — fills the card, fades in on hover
                    and back out on leave; falls back to /blackhole.gif without
                    WebGL2 */}
                <BlackHole className={styles.blackholeCanvas} />
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
                className={`${styles.projectCard} ${styles.projectCardNetwork}`}
                href="https://github.com/jaseci-labs/jac-research-agent"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* live three.js neural network — fills the card, fades in on
                    hover and back out on leave; falls back to /network.gif
                    without WebGL2 */}
                <NeuralNetwork className={styles.networkCanvas} />
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
          Stay with the old.
          <br />
          <span className={styles.accent}>Get left behind.</span>
        </h2>
        <div>
          <a href="/community" className={styles.cta}>
            <span className={styles.ctaLabel}>Join the Community</span>
            {/* Discord mark — hidden until the button is hovered, then slides in */}
            <svg
              className={styles.ctaIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.198.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
          </a>
          <a
            href="https://github.com/jaseci-labs"
            className={`${styles.cta} ${styles.ctaSecondary}`}
          >
            <span className={styles.ctaLabel}>Contribute to OSS</span>
            {/* GitHub mark — hidden until the button is hovered, then slides in */}
            <svg
              className={styles.ctaIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
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
