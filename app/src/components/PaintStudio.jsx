import styles from "./PaintStudio.module.css";

export default function PaintStudio({ brushRef }) {
  return (
    <section id="studio" className={styles.section} aria-label="Studio">
      <div className={styles.stage}>
        <canvas ref={brushRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.overlay}>
          <div className={styles.copy}>
            <div className={styles.headline}>move your hand</div>
            <div className={styles.sub}>the pigment follows · press to flood</div>
          </div>
        </div>
        <div className={styles.label}>STUDIO 02 — IMPASTO FIELD</div>
      </div>
    </section>
  );
}
