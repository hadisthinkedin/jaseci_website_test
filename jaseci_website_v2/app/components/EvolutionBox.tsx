"use client";

import { useState } from "react";
import styles from "./EvolutionBox.module.css";

/* EvolutionBox — the "evolution → the leap" beat as a statement slab.
   A fixed-height hairline frame with the headline set large on the left
   and empty canvas on the right. Hovering (or keyboard focus) slides an
   orange story drawer in from the right edge — the same horizontal-wipe
   DNA as the old step cards. Clicking the +/− button freezes the drawer
   open (data-open) until clicked again, matching the step cards and the
   manifesto boxes. Touch widths stack the story below, always open. */

export default function EvolutionBox({
  headline,
  body,
}: {
  headline: string;
  body: string;
}) {
  // click the +/− to freeze the drawer open, like the evolution step cards
  // and the manifesto accordion; hover still previews when not frozen
  const [frozen, setFrozen] = useState(false);

  return (
    <div className={styles.frame} tabIndex={0} data-open={frozen}>
      <div className={styles.statement}>
        <h3 className={styles.headline}>{headline}</h3>
      </div>

      {/* the orange drawer — width animates 0 → var(--storyW); its inner
          panel is pinned at full width to the right edge so the text is
          already laid out and simply gets revealed as the drawer opens */}
      <div className={styles.story} aria-hidden="true">
        <div className={styles.storyInner}>
          <p className={styles.storyText}>{body}</p>
        </div>
      </div>

      {/* screen-reader copy of the drawer text (the drawer is aria-hidden
          because its clipped/animated presentation is visual-only) */}
      <div className={styles.srOnly}>{body}</div>

      <button
        type="button"
        className={styles.icon}
        aria-label={frozen ? "Collapse the story" : "Expand the story"}
        aria-expanded={frozen}
        onClick={() => setFrozen((v) => !v)}
      />
    </div>
  );
}
