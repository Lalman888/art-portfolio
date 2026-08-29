import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <h1 className={styles.h1}>
          <span className={styles.lineMask}>
            <span className={styles.line} style={{ animationDelay: "0.15s" }}>
              LALMAN
            </span>
          </span>
          <span className={styles.lineMask}>
            <span className={`${styles.line} ${styles.lineGold}`} style={{ animationDelay: "0.3s" }}>
              Thakur
            </span>
          </span>
          <span className={styles.lineMask}>
            <span className={styles.line} style={{ animationDelay: "0.45s" }}>
              ENGINEER
            </span>
          </span>
        </h1>
        <p className={styles.sub}>I build the whole thing, then keep it running.</p>
      </div>
      <div className={styles.scrollHint}>SCROLL</div>
    </section>
  );
}
