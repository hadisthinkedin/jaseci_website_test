import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.brand}>JAC</div>
        <div className={styles.navLinks}>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#projects">Projects</a>
          <a href="#cases">Case Studies</a>
          <a href="#community">Community</a>
        </div>
      </nav>

      {/* =====================================================
            ACT I — BEGINNING: Who is Jac
         ===================================================== */}

      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.eyebrow}>Act I — Who is Jac</div>
        <h1>The next evolutionary step.</h1>
        <p>
          Jac is the modern hero of programming — the language built for the
          era of AI agents, not retrofitted to it.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.eyebrow}>Why I am who I am</div>
        <h2 className={styles.h2}>The old ways are broken.</h2>
        <p className={styles.body}>
          LangChain. Wrappers. Layers of abstraction stacked on top of Python
          until they collapse under the weight of debugging, maintenance, and
          brittle glue code.
        </p>
        <p className={styles.body}>
          I was designed differently. From the ground up. Built on{" "}
          <strong>byLLM</strong> and <strong>OSP</strong> — a foundation, not
          a patch.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.eyebrow}>Proof</div>
        <h2 className={styles.h2}>Backed by the names you already trust.</h2>
        <p className={styles.body}>
          And already running inside enterprises shipping production
          workloads.
        </p>
        <div className={styles.proofGrid}>
          <div className={styles.proofCell}>NSF</div>
          <div className={styles.proofCell}>University of Michigan</div>
          <div className={styles.proofCell}>NVIDIA</div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.eyebrow}>The Traditionalist</div>
        <h2 className={styles.h2}>Then I met someone who would not move.</h2>
        <p className={styles.body}>
          A traditionalist. They knew Python. They had built a career on it,
          and they were not going to throw that knowledge away for a new
          language — no matter how good it was.
        </p>
        <p className={styles.body}>
          I respected that. So I made a decision: become more than a
          language. Become the same leap that C was from Assembly.
        </p>
      </section>

      {/* =====================================================
            ACT II — MIDDLE: Becoming the Ecosystem
         ===================================================== */}

      <section className={styles.section} id="ecosystem">
        <div className={styles.eyebrow}>Act II — Becoming an Ecosystem</div>
        <h2 className={styles.h2}>So I became Jaseci.</h2>
        <p className={styles.body}>
          An ecosystem that fixes the problems developers have been shouting
          about for years — without asking them to give up what they already
          know.
        </p>
        <div className={styles.ecosystemGrid}>
          <div className={styles.ecosystemCell}>
            <div className={styles.ecosystemNumber}>10×</div>
            <div className={styles.ecosystemLabel}>Faster Deployment</div>
            <p className={styles.ecosystemBody}>
              Python could not. <strong>Jac-Scale</strong> did.
            </p>
          </div>
          <div className={styles.ecosystemCell}>
            <div className={styles.ecosystemNumber}>0</div>
            <div className={styles.ecosystemLabel}>Middleware</div>
            <p className={styles.ecosystemBody}>
              Python could not. <strong>Jac-Client</strong> did.
            </p>
          </div>
        </div>
        <a href="/ecosystem" className={styles.cta}>
          See the full ecosystem →
        </a>
      </section>

      {/* =====================================================
            ACT III — END: Why You Started + Final Hook
         ===================================================== */}

      <section className={styles.section} id="projects">
        <div className={styles.eyebrow}>Act III — Why You Started</div>
        <h2 className={styles.h2}>
          Why did you start writing code in the first place?
        </h2>
        <p className={styles.body}>
          To build the things only you could see. We just make the distance
          between idea and shipped shorter.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Project X</div>
            <div className={styles.cardMeta}>Built in 4 days</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Project Y</div>
            <div className={styles.cardMeta}>Built in 2 weeks</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Project Z</div>
            <div className={styles.cardMeta}>Built solo</div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="cases">
        <div className={styles.eyebrow}>Case Studies</div>
        <h2 className={styles.h2}>Teams already shipping with Jac.</h2>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Case Study 01</div>
            <div className={styles.cardMeta}>Coming soon</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Case Study 02</div>
            <div className={styles.cardMeta}>Coming soon</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardTitle}>Case Study 03</div>
            <div className={styles.cardMeta}>Coming soon</div>
          </div>
        </div>
      </section>

      <section className={styles.finalSection} id="community">
        <div className={styles.eyebrow}>The Final Hook</div>
        <h2>Stay with the old. Get left behind.</h2>
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
