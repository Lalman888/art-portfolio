import styles from "./Contact.module.css";

const LINKS = [
  { label: "GitHub", href: "https://github.com/lalman888" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lalmanthakur" },
  { label: "Portfolio", href: "https://www.lalmanthakur.in" },
];

export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <h2 className={styles.heading}>
        Let&rsquo;s build
        <br />
        <span className={styles.headingGold}>something</span> that lasts
      </h2>
      <div className={styles.row}>
        <a href="mailto:lsinghchouhan074@gmail.com" className={styles.email}>
          lsinghchouhan074@gmail.com
        </a>
        <div className={styles.links}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
      <div className={styles.fine}>
        Delhi NCR, India · B.E. Computer Science, Chandigarh University, 2025
      </div>
    </section>
  );
}
