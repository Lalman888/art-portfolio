# Lalman Thakur — portfolio

A single-page portfolio built from the "Atelier Nocturne" Claude Design canvas
(`../project/Atelier Nocturne.dc.html`): a nocturne-palette gallery you scroll
through, with the projects hung as framed works in a 3D corridor.

React + Vite, plain CSS Modules, no UI or animation libraries. All artwork is
generated from CSS gradients and a canvas particle field — there are no images
in the project.

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run lint     # oxlint
```

## Structure

| Path | What it is |
|---|---|
| `src/data/works.js` | The three projects, plus `GALLERY_DEPTH` for the corridor |
| `src/data/stack.js` | The four stack groups, five tools each |
| `src/lib/painter.js` | Flow-field particle painter shared by both canvases |
| `src/hooks/useSceneAnimation.js` | The single rAF loop driving all scroll/pointer motion |
| `src/components/` | One folder-flat component + CSS Module per section |

## Things worth knowing before you edit

- **The corridor is paced by two numbers that must change together**:
  `GALLERY_DEPTH` in `src/data/works.js` and the section `height` in
  `GalleryHall.module.css`. Adding a fourth project means extending both, and
  giving it a `z` roughly 1400px beyond the last one.
- **`link: null` is meaningful.** A project without a link renders a
  "case study" note instead. Debaito is set this way deliberately because the
  site is offline — do not add a URL for it.
- **The scene loop is imperative on purpose.** Per-frame transforms are written
  straight to DOM nodes; only the active project index is React state, because
  it changes a handful of times per scroll rather than sixty times a second.
- **Reduced motion is handled in two places**: CSS resolves the entrance
  animations instantly, and `createPainter({ animate: false })` renders the
  canvases as finished stills rather than leaving them blank.
