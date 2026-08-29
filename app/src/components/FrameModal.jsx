import { useEffect, useRef } from "react";
import { WORKS } from "../data/works";
import styles from "./FrameModal.module.css";

/**
 * The artwork plate. Built on the native <dialog> so the focus trap, Escape
 * handling, and inertness of the page behind it all come from the platform
 * rather than hand-rolled effects.
 */
export default function FrameModal({ openIndex, onClose, fallbackRef }) {
  const dialogRef = useRef(null);
  const restoreRef = useRef(null);
  const isOpen = openIndex != null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Guarded both ways: showModal() on an open dialog throws, and React
    // StrictMode runs this effect twice on mount in development.
    if (isOpen && !dialog.open) {
      restoreRef.current = document.activeElement;
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    // Listened for natively rather than via React's onClose: `close` does
    // not bubble, so it never reaches React's delegated root listener.
    // This one handler covers every close path — Escape, the close button,
    // a backdrop click, and the programmatic close above.
    let restoreFrame = 0;
    const handleClose = () => {
      onClose();
      const target = restoreRef.current;
      restoreRef.current = null;
      // Deferred a frame: at `close` time the dialog is still in the top
      // layer, so the rest of the document is inert and a focus() call is
      // silently dropped. preventScroll matters too — the frame that opened
      // this sits inside the 3D corridor, and scrolling it into view would
      // yank the camera.
      restoreFrame = requestAnimationFrame(() => {
        target?.focus?.({ preventScroll: true });
        // The corridor keeps moving while the plate is open, so the frame
        // this came from may have glided past the camera and be hidden —
        // and hidden elements silently refuse focus. Falling back to the
        // hall keeps a keyboard user where they were instead of dropping
        // them at the top of the document.
        if (document.activeElement === document.body) {
          fallbackRef?.current?.focus?.({ preventScroll: true });
        }
      });
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      cancelAnimationFrame(restoreFrame);
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose, fallbackRef]);

  const work = isOpen ? WORKS[openIndex] : null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={work ? `${work.title} — ${work.role}, ${work.year}` : undefined}
      onClick={onClose}
    >
      {work && (
        // autoFocus + tabIndex -1 so showModal() lands here rather than on
        // the close button: programmatic focus does not trigger
        // :focus-visible, so the plate opens clean, and a keyboard user
        // still gets a ring the moment they Tab.
        <div className={styles.panel} tabIndex={-1} autoFocus>
          <div className={styles.art} style={{ background: work.modalBg }}>
            <div className={styles.artTexture} />
          </div>
          <div className={styles.info}>
            <div>
              <div className={styles.title}>{work.title}</div>
              <div className={styles.byline}>
                {work.role} · {work.year}
              </div>
            </div>
            <div className={styles.palette}>
              {work.palette.map((hex) => (
                <div key={hex} className={styles.swatch} style={{ background: hex }} />
              ))}
            </div>
          </div>

          <div className={styles.detail}>
            <p className={styles.summary}>{work.summary}</p>
            <div className={styles.meta}>
              <span className={styles.stack}>{work.stack}</span>
              {work.link ? (
                <a
                  className={styles.link}
                  href={work.link}
                  target="_blank"
                  rel="noreferrer"
                  // Without this the click bubbles to the dialog's
                  // close-on-click and the plate vanishes as the tab opens.
                  onClick={(e) => e.stopPropagation()}
                >
                  {work.link.replace(/^https?:\/\//, "")} ↗
                </a>
              ) : (
                <span className={styles.caseStudy}>Case study — not currently online</span>
              )}
            </div>
          </div>
          <button type="button" className={styles.closeHint} onClick={onClose}>
            Click anywhere to close
          </button>
        </div>
      )}
    </dialog>
  );
}
