"use client";

import { useState } from "react";
import styles from "./EvolutionCards.module.css";

/* ───────────────────────────────────────────────
   The evolution story as a horizontal row of step
   cards — the "developers needed Jaseci" beats laid
   out left → right (numbered 01→04). Each card shows
   only its main point; hovering (or focusing) it makes
   that card grow sideways while the other three shrink
   to make room, and the fuller answer wipes in to the
   right of the headline — a horizontal accordion at
   constant row height. Clicking a card's +/− freezes it
   open until clicked again (single-pin), like the
   manifesto accordion beside the block tower. Stark B&W
   with an orange-fill on open, matching the manifesto +
   project cards.
   ─────────────────────────────────────────────── */

export default function EvolutionCards({
  items,
}: {
  items: { headline: string; body: string }[];
}) {
  // click the +/− to "freeze" a card open — single-pin, like the manifesto
  // accordion beside the block tower: clicking another card moves the pin,
  // clicking the frozen one again releases it. Hover still previews as before.
  const [pinned, setPinned] = useState<number | null>(null);
  const toggle = (i: number) =>
    setPinned((prev) => (prev === i ? null : i));

  return (
    <ol className={styles.grid}>
      {items.map((item, i) => {
        const isPinned = pinned === i;
        return (
          <li className={styles.card} key={i} tabIndex={0} data-open={isPinned}>
            <button
              type="button"
              className={styles.icon}
              aria-label={`${isPinned ? "Collapse" : "Expand"} step ${i + 1}`}
              aria-expanded={isPinned}
              onClick={() => toggle(i)}
            />
            <span className={styles.step}>{String(i + 1).padStart(2, "0")}</span>
            {/* headline = main point (always shown); body wipes in to the right */}
            <div className={styles.inner}>
              <h3 className={styles.headline}>{item.headline}</h3>
              <div className={styles.bodyWrap}>
                <p className={styles.body}>{item.body}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
