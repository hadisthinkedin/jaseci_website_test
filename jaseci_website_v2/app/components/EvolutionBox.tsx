import styles from "./EvolutionBox.module.css";

/* EvolutionBox — the "evolution → the leap" beat as a statement slab.
   A fixed-height hairline frame with the headline set large on the left
   (conviction-style) and deliberate empty canvas on the right. Hovering
   (or keyboard focus) slides an orange story drawer in from the right
   edge — the same horizontal-wipe DNA as the old step cards — covering
   the empty canvas without moving a single line of text or reflowing
   anything below. The drawer tells the story in two numbered beats and
   lands on the open naming question as the punchline. Pure CSS, so this
   stays a server component; at touch widths the story simply stacks
   below the statement, always open. */

export default function EvolutionBox({
  headline,
  story,
  punch,
}: {
  headline: string;
  story: string[];
  punch: string;
}) {
  return (
    <div className={styles.frame} tabIndex={0}>
      <div className={styles.statement}>
        <div className={styles.eyebrow}>The leap / Jac v2</div>
        <h3 className={styles.headline}>{headline}</h3>
      </div>

      {/* the orange drawer — width animates 0 → var(--storyW); its inner
          panel is pinned at full width to the right edge so the text is
          already laid out and simply gets revealed as the drawer opens */}
      <div className={styles.story} aria-hidden="true">
        <div className={styles.storyInner}>
          {story.map((text, i) => (
            <p className={styles.storyBeat} key={i}>
              <span className={styles.storyNum}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {text}
            </p>
          ))}
          <p className={styles.punch}>{punch}</p>
        </div>
      </div>

      {/* screen-reader copy of the drawer text (the drawer is aria-hidden
          because its clipped/animated presentation is visual-only) */}
      <div className={styles.srOnly}>
        {story.join(" ")} {punch}
      </div>

      <span className={styles.icon} aria-hidden="true" />
    </div>
  );
}
