import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.mark}>
        <span className={styles.markName}>Lalman Thakur</span>
        <span className={styles.markTag}>Full-stack engineer</span>
      </div>
      <nav className={styles.nav}>
        <a href="#work">Work</a>
        <a href="#stack">Stack</a>
        <a href="#studio">Studio</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
