import styles from "./EvolutionBox.module.css";

/* EvolutionBox — the "evolution → the leap" beat as a single chapter frame.
   Closed, it shows a mono eyebrow + the headline inside a hairline frame
   (ProofGrid family, not the orange-slab family). Hovering (or keyboard
   focus) reveals the story as three hairline-divided beats — 01 THE PROBLEM /
   02 THE FIX / 03 THE QUESTION — with the final open question set in accent
   orange as the cliffhanger. Pure-CSS reveal, so this stays a server
   component; on touch widths the beats are simply always open. */

export default function EvolutionBox({
  headline,
  beats,
}: {
  headline: string;
  beats: { tag: string; text: string }[];
}) {
  return (
    <div className={styles.box} tabIndex={0}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <div className={styles.eyebrow}>The leap / Jac v2</div>
          <h3 className={styles.headline}>{headline}</h3>
        </div>
        <span className={styles.icon} aria-hidden="true" />
      </div>
      <div className={styles.bodyWrap}>
        <div className={styles.bodyInner}>
          <div className={styles.beats}>
            {beats.map((b, i) => (
              <div className={styles.beat} key={b.tag}>
                <div className={styles.beatTag}>
                  <span className={styles.beatNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {b.tag}
                </div>
                <p className={styles.beatText}>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
