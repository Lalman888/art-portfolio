import { STACK } from "../data/stack";
import styles from "./StackChords.module.css";

function ChordRow({ row, index }) {
  return (
    <div data-tilt className={styles.row}>
      <span className={styles.rowIndex}>{String(index + 1).padStart(2, "0")}</span>
      <div className={styles.rowTitle}>{row.group}</div>
      <div className={styles.bands}>
        {row.bands.map((b) => (
          <div
            key={b.name}
            className={`${styles.band} ${b.on === "light" ? styles.bandLight : styles.bandDark}`}
            style={{ background: b.hex }}
          >
            <span className={styles.bandLabel}>{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StackChords() {
  return (
    <section id="stack" className={styles.section} aria-label="Stack">
      <div className={styles.head}>
        <h2 className={styles.heading}>
          The
          <br />
          <span className={styles.headingGold}>stack</span>
        </h2>
        <p className={styles.dek}>Four groups, five tools each. What I reach for first.</p>
      </div>

      <div className={styles.list}>
        {STACK.map((row, i) => (
          <ChordRow key={row.group} row={row} index={i} />
        ))}
      </div>
    </section>
  );
}
