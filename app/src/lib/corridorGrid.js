// The corridor's floor and ceiling grid.
//
// These used to be two DOM elements 2600x14000px each, rotated flat with
// rotateX(90deg) inside the preserve-3d world. That is 36 megapixels per
// layer for the browser to rasterize and perspective-map every frame, and it
// cost roughly 90% of the section's frame budget.
//
// Drawing the same grid as ~55 lines on one viewport-sized canvas costs a
// rounding error by comparison, and it reproduces the look exactly because
// the projection below mirrors what the CSS was doing: the same 1150px
// perspective, the same 50%/48% origin, and the same world transform
// (translate, then yaw, then pitch) applied to each point.

const PERSPECTIVE = 1150; // matches .stage { perspective }
const ORIGIN_Y = 0.48; // matches .stage { perspective-origin: 50% 48% }

const HALF_WIDTH = 1000; // corridor half-width in world px
const DEPTH = 6000; // how far ahead the grid is drawn

const FLOOR_Y = 430;
const FLOOR_STEP = 140; // spacing of the transverse floor lines
const FLOOR_LATERAL = 200; // spacing of the lines running down the corridor

const CEILING_Y = -450;
const CEILING_STEP = 300;

export function createCorridorGrid(canvas) {
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, r.width);
    h = Math.max(1, r.height);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Projects a world-space point through the same transform chain the CSS
  // applies to #world: translate3d(tx,ty,camZ) rotateY(yaw) rotateX(pitch).
  // Returns null when the point falls behind the camera.
  function project(x, y, z, cam) {
    const { sinP, cosP, sinY, cosY, tx, ty, camZ, ox, oy } = cam;

    // rotateX(pitch)
    const y1 = y * cosP - z * sinP;
    const z1 = y * sinP + z * cosP;
    // rotateY(yaw)
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;
    // translate
    const X = x2 + tx;
    const Y = y1 + ty;
    const Z = z2 + camZ;

    const denom = PERSPECTIVE - Z;
    if (denom <= 1) return null;
    const s = PERSPECTIVE / denom;
    return { x: ox + X * s, y: oy + Y * s };
  }

  function line(a, b, alpha, colour) {
    if (!a || !b || alpha <= 0.002) return;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  // Grid lines dim toward the far end so the finite grid has no hard edge.
  function fade(d) {
    return Math.max(0, Math.min(1, 1 - d / DEPTH));
  }

  function plane(cam, planeY, step, colour, baseAlpha, lateral) {
    // Transverse lines sit at fixed world z, so they stream toward the viewer
    // on their own as camZ advances — no per-frame offset needed.
    const first = Math.ceil(cam.camZ / step);
    const last = Math.floor((cam.camZ + DEPTH) / step);
    for (let k = first; k <= last; k++) {
      const z = -step * k;
      const d = step * k - cam.camZ;
      const a = project(-HALF_WIDTH, planeY, z, cam);
      const b = project(HALF_WIDTH, planeY, z, cam);
      line(a, b, baseAlpha * fade(d), colour);
    }

    if (!lateral) return;
    // Lines running down the corridor, drawn per grid cell so each segment
    // can carry its own distance fade.
    for (let x = -HALF_WIDTH; x <= HALF_WIDTH; x += lateral) {
      for (let k = first; k < last; k++) {
        const d = step * k - cam.camZ;
        const a = project(x, planeY, -step * k, cam);
        const b = project(x, planeY, -step * (k + 1), cam);
        line(a, b, baseAlpha * 0.55 * fade(d), colour);
      }
    }
  }

  function draw(camZ, pmx, pmy) {
    // Fully repainted each frame, so no clear is needed.

    const pitch = (pmy - 0.5) * -4 * (Math.PI / 180);
    const yaw = (pmx - 0.5) * 7 * (Math.PI / 180);
    const cam = {
      sinP: Math.sin(pitch),
      cosP: Math.cos(pitch),
      sinY: Math.sin(yaw),
      cosY: Math.cos(yaw),
      tx: (pmx - 0.5) * -60,
      ty: (pmy - 0.5) * -34,
      camZ,
      ox: w / 2,
      oy: h * ORIGIN_Y,
    };

    // The original floor and ceiling planes were opaque, which is what made
    // the hall feel enclosed and kept the sky canvas from showing through it.
    // Painting the ground and roof here restores that: ceiling tone above the
    // horizon, floor tone below, both keyed to the plane gradients they
    // replace.
    const horizon = Math.max(0, Math.min(h, cam.oy));
    ctx.globalAlpha = 1;

    if (horizon > 0) {
      const roof = ctx.createLinearGradient(0, 0, 0, horizon);
      roof.addColorStop(0, "#080e20");
      roof.addColorStop(1, "#05080f");
      ctx.fillStyle = roof;
      ctx.fillRect(0, 0, w, horizon);
    }
    if (horizon < h) {
      const ground = ctx.createLinearGradient(0, horizon, 0, h);
      ground.addColorStop(0, "#05080f");
      ground.addColorStop(1, "#0a1230");
      ctx.fillStyle = ground;
      ctx.fillRect(0, horizon, w, h - horizon);
    }

    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
    plane(cam, CEILING_Y, CEILING_STEP, "#f2c14e", 0.07, 0);
    plane(cam, FLOOR_Y, FLOOR_STEP, "#6f9dd6", 0.16, FLOOR_LATERAL);
    ctx.globalAlpha = 1;
  }

  resize();
  return { resize, draw };
}
