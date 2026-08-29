import { useEffect } from "react";
import { createPainter } from "../lib/painter";
import { WORKS, GALLERY_DEPTH } from "../data/works";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Drives every piece of scroll/pointer-reactive motion on the page from a
 * single requestAnimationFrame loop: the sky + impasto canvases, the custom
 * cursor ring, the Hall 01 dolly-through-a-corridor camera, the scroll
 * progress bar, the colour-chord tilt, and the swirl's fade as you leave
 * the hero.
 *
 * It's written imperatively against refs (not React state) on purpose —
 * this runs every frame, and routing per-frame transforms through setState
 * would mean a full render pass per frame. The one thing that *is* lifted
 * to React is the active work index, which changes ~8 times over the whole
 * hall and drives real text content.
 *
 * The animated elements are found by querying `[data-frame]`, `[data-tilt]`
 * and `[data-plane]` inside the root, which keeps the components free of
 * ref-array plumbing. Frames are assumed to be in WORKS order — they are
 * rendered from that same array.
 *
 * @param {object} refs - stable DOM refs owned by App
 * @param {object} options - accent, swirlDensity, floorGrid, onActiveChange
 */
export function useSceneAnimation(refs, options) {
  const { accent, swirlDensity, floorGrid, onActiveChange } = options;

  useEffect(() => {
    // Ref objects are stable for the page's life, so reading them off the
    // (freshly allocated) argument object here is safe.
    const { rootRef, swirlRef, brushRef, cursorRef, worldRef, galleryRef, progressRef } = refs;

    const root = rootRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia(REDUCED_MOTION).matches;

    document.documentElement.style.setProperty("--gold", accent);

    const swirl = swirlRef.current;
    const brushCanvas = brushRef.current;
    const world = worldRef.current;
    const gallery = galleryRef.current;
    const cursor = cursorRef.current;
    const progress = progressRef.current;

    const density = Math.round(swirlDensity);
    const sky = createPainter(swirl, { count: density, fade: 0.014, speed: 1.0, animate: !reduced });
    const brush = createPainter(brushCanvas, {
      count: Math.round(density * 0.55),
      follow: true,
      fade: 0.03,
      speed: 1.35,
      animate: !reduced,
    });

    root.querySelectorAll("[data-plane]").forEach((el) => {
      el.style.opacity = floorGrid ? "" : "0";
    });

    const frames = Array.from(root.querySelectorAll("[data-frame]"));
    const tilts = Array.from(root.querySelectorAll("[data-tilt]"));
    const tiltRects = new Array(tilts.length);

    let pmx = 0.5;
    let pmy = 0.5;
    let cx = -200;
    let cy = -200;
    let tcx = -200;
    let tcy = -200;
    let active = -1;
    let big = false;
    let seen = false;
    // Last frame's rect for the impasto canvas, so pointer coordinates can
    // be mapped into canvas space without a layout read per mouse event.
    let brushRect = null;
    let brushVisible = false;

    const onPointerMove = (e) => {
      pmx = e.clientX / window.innerWidth;
      pmy = e.clientY / window.innerHeight;

      if (brushVisible && brushRect) {
        brush.point(e.clientX - brushRect.left, e.clientY - brushRect.top);
      }

      // The trailing ring is a mouse affordance; on touch the finger is
      // already the cursor, and a ring left behind after a tap reads as a
      // rendering glitch.
      if (e.pointerType !== "mouse") return;
      if (!seen) {
        seen = true;
        cx = e.clientX;
        cy = e.clientY;
        cursor.style.opacity = "1";
      }
      tcx = e.clientX;
      tcy = e.clientY;

      const over = !!e.target.closest?.("[data-frame], a");
      if (over !== big) {
        big = over;
        cursor.dataset.over = String(over);
      }
    };

    const onPointerDown = (e) => {
      // Only flood the impasto field when it is actually on screen —
      // otherwise clicking a gallery frame dumps pigment into a canvas the
      // viewer cannot see.
      if (!brushVisible || !brushRect) return;
      brush.burst(e.clientX - brushRect.left, e.clientY - brushRect.top, 90);
    };

    const onResize = () => {
      sky.resize();
      brush.resize();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", onResize);

    const vh = () => window.innerHeight;
    let camZ = 0;
    let raf = 0;

    const loop = () => {
      const viewH = vh();

      // --- reads: every layout query happens up front, so the writes below
      // cannot force a reflow between them ---
      const galleryRect = gallery.getBoundingClientRect();
      const galleryHeight = gallery.offsetHeight;
      brushRect = brushCanvas.getBoundingClientRect();
      brushVisible = brushRect.top < viewH && brushRect.bottom > 0;
      for (let j = 0; j < tilts.length; j++) tiltRects[j] = tilts[j].getBoundingClientRect();

      // --- writes ---
      const prog = Math.min(1, Math.max(0, -galleryRect.top / (galleryHeight - viewH)));
      camZ += (prog * GALLERY_DEPTH - camZ) * 0.09;

      const yaw = (pmx - 0.5) * 7;
      const pitch = (pmy - 0.5) * -4;
      world.style.transform =
        `translate3d(${(pmx - 0.5) * -60}px,${(pmy - 0.5) * -34}px,${camZ}px) ` +
        `rotateY(${yaw}deg) rotateX(${pitch}deg)`;

      let bestI = 0;
      let bestD = Infinity;
      for (let i = 0; i < frames.length; i++) {
        const { z, side } = WORKS[i];
        const dir = side === "l" ? -1 : 1;
        const d = -(z + camZ);
        const near = Math.abs(d - 700);
        if (near < bestD) {
          bestD = near;
          bestI = i;
        }
        let op = 1;
        if (d < 320) op = Math.max(0, (d - 60) / 260);
        if (d > 4200) op = Math.max(0, 1 - (d - 4200) / 2600);

        const f = frames[i];
        f.style.opacity = op.toFixed(3);
        f.style.visibility = op <= 0.01 ? "hidden" : "visible";
        f.style.transform =
          `translate3d(${dir * 560}px,${Math.sin(z * 0.0007) * 26}px,${z}px) ` +
          `rotateY(${dir * -54}deg)`;
      }
      if (active !== bestI) {
        active = bestI;
        onActiveChange(bestI);
      }

      progress.style.height = (prog * 220).toFixed(1) + "px";

      const skyOut = Math.min(1, Math.max(0, -galleryRect.top / (viewH * 0.7)));
      swirl.style.opacity = (1 - skyOut * 0.88).toFixed(3);

      for (let j = 0; j < tilts.length; j++) {
        const r = tiltRects[j];
        const c = (r.top + r.height / 2 - viewH / 2) / viewH;
        const k = Math.max(-1, Math.min(1, c));
        tilts[j].style.transform = `rotateX(${(k * -16).toFixed(2)}deg) translateZ(${(-Math.abs(k) * 90).toFixed(1)}px)`;
        tilts[j].style.opacity = (1 - Math.abs(k) * 0.55).toFixed(3);
      }

      cx += (tcx - cx) * 0.18;
      cy += (tcy - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      sky.stop();
      brush.stop();
    };
  }, [accent, swirlDensity, floorGrid, onActiveChange, refs]);
}
