import styles from "./EvolutionBox.module.css";

/* One hover/focus-expanding box — the single "evolution → the leap" beat that
   replaced the row of four step cards. The headline (the problem) is always
   shown; hovering (or focusing) reveals the body, which builds to the open
   question about what to name the all-in-one Jac stack. Pure-CSS reveal, so
   this stays a server component. */

export default function EvolutionBox({
  headline,
  body,
}: {
  headline: string;
  body: string;
}) {
  return (
    <div className={styles.box} tabIndex={0}>
      <div className={styles.head}>
        <h3 className={styles.headline}>{headline}</h3>
        <span className={styles.icon} aria-hidden="true" />
      </div>
      <div className={styles.bodyWrap}>
        <div className={styles.bodyInner}>
          <p className={styles.body}>{body}</p>
        </div>
      </div>
    </div>
  );
}
