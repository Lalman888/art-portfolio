import { useCallback, useMemo, useRef, useState } from "react";
import styles from "./App.module.css";
import { useSceneAnimation } from "./hooks/useSceneAnimation";
import CursorRing from "./components/CursorRing";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GalleryHall from "./components/GalleryHall";
import StackChords from "./components/StackChords";
import PaintStudio from "./components/PaintStudio";
import Contact from "./components/Contact";
import FrameModal from "./components/FrameModal";

// These three were exposed as designer-tunable props in the original
// Claude Design canvas (accent pigment, swirl density, floor grid). There's
// no props panel in a shipped app, so they're fixed here at their defaults.
const ACCENT = "#f2c14e";
const SWIRL_DENSITY = 260;
const FLOOR_GRID = true;

export default function App() {
  const rootRef = useRef(null);
  const swirlRef = useRef(null);
  const brushRef = useRef(null);
  const cursorRef = useRef(null);
  const worldRef = useRef(null);
  const galleryRef = useRef(null);
  const progressRef = useRef(null);

  // Which canvas the corridor camera is currently nearest, named in the HUD.
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  // The scene effect tears down and rebuilds both canvases when its deps
  // change, so the ref bundle has to keep a stable identity across renders.
  // Every value in it is a ref object, which is why [] is honest here.
  const sceneRefs = useMemo(
    () => ({ rootRef, swirlRef, brushRef, cursorRef, worldRef, galleryRef, progressRef }),
    [],
  );

  useSceneAnimation(sceneRefs, {
    accent: ACCENT,
    swirlDensity: SWIRL_DENSITY,
    floorGrid: FLOOR_GRID,
    onActiveChange: setActiveIndex,
  });

  const closeFrame = useCallback(() => setOpenIndex(null), []);

  return (
    <div ref={rootRef} className={styles.root}>
      <canvas ref={swirlRef} className={styles.swirl} aria-hidden="true" />
      <div className={styles.vignette} />
      <CursorRing elRef={cursorRef} />
      <Header />

      <main>
        <Hero />

        <GalleryHall
          galleryRef={galleryRef}
          worldRef={worldRef}
          progressRef={progressRef}
          activeIndex={activeIndex}
          onOpenFrame={setOpenIndex}
        />

        <StackChords />

        <PaintStudio brushRef={brushRef} />

        <Contact />
      </main>

      <FrameModal openIndex={openIndex} onClose={closeFrame} fallbackRef={galleryRef} />
    </div>
  );
}
