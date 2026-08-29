// A small flow-field particle painter shared by the fixed sky canvas behind
// the whole page and the interactive impasto canvas in Studio 02. Particles
// drift along a noise-ish field and leave short additive strokes, which is
// what gives both canvases their "wet paint" look.
//
// This is plain canvas 2D — no framework ties — so it's usable from a
// useEffect with nothing more than a <canvas> element and an options bag.
// All coordinates passed to point()/burst() are canvas-local, not viewport.

const SKY = [
  "#16336e",
  "#2a5cae",
  "#4a7fc1",
  "#6f9dd6",
  "#cfe0f2",
  "#f2c14e",
  "#ffe6a3",
  "#0d2420",
];

const BACKDROP = "#05080f";

// A burst can push well past the seeded count, so the array is trimmed back
// to this multiple of `count`. Without it, every click permanently grows the
// simulation and the canvas degrades over a long session.
const MAX_PARTS_FACTOR = 3;

// Simulation ticks used to build the still image when animation is off.
const STILL_STEPS = 240;

export function createPainter(canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  const cfg = { count: 180, follow: false, speed: 1.1, fade: 0.016, animate: true, ...opts };
  const maxParts = Math.round(cfg.count * MAX_PARTS_FACTOR);

  let w = 0;
  let h = 0;
  let dpr = 1;
  const parts = [];
  let t = 0;
  let mx = -9999;
  let my = -9999;
  let alive = true;
  let raf = 0;

  function resize() {
    // Recomputed here, not captured once: dragging the window to a display
    // with a different pixel ratio otherwise leaves the canvas soft.
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, r.width);
    h = Math.max(1, r.height);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BACKDROP;
    ctx.fillRect(0, 0, w, h);
  }

  function spawn(x, y) {
    return {
      x,
      y,
      px: x,
      py: y,
      life: 60 + Math.random() * 200,
      c: SKY[(Math.random() * SKY.length) | 0],
      wd: 1.1 + Math.random() * 3.2,
    };
  }

  function seed(n) {
    for (let i = 0; i < n; i++) parts.push(spawn(Math.random() * w, Math.random() * h));
  }

  function field(x, y) {
    return (
      Math.sin(x * 0.0024 + t) * 1.7 +
      Math.cos(y * 0.0028 - t * 0.7) * 1.7 +
      Math.sin((x + y) * 0.0011 + t * 0.3) * 2.1
    );
  }

  function step() {
    t += 0.0022;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(5,8,15,${cfg.fade})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      let a = field(p.x, p.y);
      if (cfg.follow && mx > -9000) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 320) a = Math.atan2(dy, dx) + Math.sin(d * 0.03 + t * 8) * 1.1;
      }
      p.px = p.x;
      p.py = p.y;
      p.x += Math.cos(a) * cfg.speed * 2.2;
      p.y += Math.sin(a) * cfg.speed * 2.2;
      p.life -= 1;

      ctx.strokeStyle = p.c;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = p.wd;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      if (p.life < 0 || p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
        parts[i] =
          cfg.follow && mx > -9000
            ? spawn(mx + (Math.random() - 0.5) * 220, my + (Math.random() - 0.5) * 220)
            : spawn(Math.random() * w, Math.random() * h);
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame() {
    if (!alive) return;
    step();
    raf = requestAnimationFrame(frame);
  }

  resize();
  seed(cfg.count);

  if (cfg.animate) {
    frame();
  } else {
    // Reduced-motion: run the simulation to a finished still image, so the
    // canvas reads as a painting rather than an empty black panel.
    for (let i = 0; i < STILL_STEPS; i++) step();
  }

  return {
    resize,
    point(x, y) {
      mx = x;
      my = y;
    },
    burst(x, y, n) {
      for (let i = 0; i < n; i++) {
        parts.push(spawn(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60));
      }
      // Drop the oldest particles rather than letting the array grow without
      // bound across repeated clicks.
      if (parts.length > maxParts) parts.splice(0, parts.length - maxParts);
    },
    stop() {
      alive = false;
      cancelAnimationFrame(raf);
    },
  };
}
