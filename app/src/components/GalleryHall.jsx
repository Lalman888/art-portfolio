import { WORKS } from "../data/works";
import styles from "./GalleryHall.module.css";

function Frame({ work, index, onOpen }) {
  return (
    // The <figure> is the element the scene loop transforms in Z; the button
    // inside is the real hit target, so the caption can stay a <figcaption>
    // sibling rather than being nested inside interactive content.
    <figure data-frame className={styles.frame}>
      <button
        type="button"
        className={styles.mat}
        onClick={() => onOpen(index)}
        aria-label={`${work.title}, ${work.role}, ${work.year} — open detail`}
      >
        <span className={styles.art} style={{ background: work.frameBg }}>
          <span className={styles.artTexture} />
        </span>
      </button>
      <figcaption className={styles.caption}>
        <span className={styles.captionTitle}>{work.plateTitle}</span>
        <span>{work.year}</span>
      </figcaption>
    </figure>
  );
}

export default function GalleryHall({ galleryRef, worldRef, progressRef, activeIndex, onOpenFrame }) {
  const active = WORKS[activeIndex];

  return (
    // tabIndex -1 so focus can be parked here when a closing plate has no
    // frame left to return to; script focus does not trigger :focus-visible,
    // so this stays invisible.
    <section id="work" ref={galleryRef} tabIndex={-1} className={styles.section} aria-label="Selected work">
      <div className={styles.stage}>
        {/* The corridor grid, drawn in 2D with the same projection the 3D
            world uses. It sits behind the frames rather than among them,
            which is all the depth ordering this scene needs. */}
        <canvas data-grid className={styles.grid} aria-hidden="true" />
        <div ref={worldRef} className={styles.world}>

          {WORKS.map((work, i) => (
            <Frame key={work.title} work={work} index={i} onOpen={onOpenFrame} />
          ))}
        </div>

        <div className={styles.hud} aria-live="polite">
          <div className={styles.hudEyebrow}>
            SELECTED WORK — {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(WORKS.length).padStart(2, "0")}
          </div>
          <div className={styles.hudTitle}>{active.title}</div>
          <div className={styles.hudArtist}>
            {active.role} · {active.year}
          </div>
        </div>
        <div className={styles.hint}>CLICK A PROJECT</div>
        <div className={styles.progress}>
          <div ref={progressRef} className={styles.progressBar} />
        </div>
      </div>
    </section>
  );
}
