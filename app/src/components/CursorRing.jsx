import styles from "./CursorRing.module.css";

/**
 * The gold ring that trails the pointer. It starts hidden (opacity 0, parked
 * offscreen) and is faded/positioned/resized entirely from
 * useSceneAnimation's rAF loop via `elRef` — see that hook for the "why".
 */
export default function CursorRing({ elRef }) {
  return <div ref={elRef} className={styles.ring} aria-hidden="true" />;
}
