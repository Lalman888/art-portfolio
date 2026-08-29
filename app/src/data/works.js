// The three projects hung in the hall. Each entry drives:
//  - the framed panel in the 3D corridor (frameBg)
//  - the enlarged plate shown in the modal (modalBg)
//  - the HUD readout and the click-to-open detail panel
//
// z is the corridor depth (more negative = further from the viewer) and
// side is which wall the frame hangs on ("l" | "r"). Palettes stay inside
// the nocturne range (indigo → cobalt → chrome yellow) so three very
// different products still read as one room.
//
// `link` is nullable on purpose — see Debaito.

export const WORKS = [
  {
    title: "Who Is Jesus",
    plateTitle: "Who Is Jesus",
    role: "Full stack developer",
    year: 2025,
    stack: "Next.js · Python · LangChain · Pinecone · OpenAI",
    link: "https://www.whoisjesus.ai",
    summary:
      "A question-answering product built on scripture. The model was never the hard part, retrieval was. Verse-aware chunking, a reranking pass, and an eval set that catches drift before anyone else notices.",
    z: -1400,
    side: "l",
    frameBg:
      "radial-gradient(55% 38% at 24% 26%, #f0d17a 0%, rgba(240,209,122,0) 58%), radial-gradient(38% 26% at 68% 18%, #f6ecc9 0%, rgba(246,236,201,0) 62%), radial-gradient(95% 72% at 48% 64%, #2a5cae 0%, rgba(42,92,174,0) 72%), linear-gradient(#0b1533, #16336e 58%, #1a1408)",
    modalBg:
      "radial-gradient(45% 34% at 24% 28%, #f0d17a 0%, rgba(240,209,122,0) 58%), radial-gradient(30% 24% at 68% 20%, #f6ecc9 0%, rgba(246,236,201,0) 62%), radial-gradient(85% 70% at 48% 66%, #2a5cae 0%, rgba(42,92,174,0) 72%), linear-gradient(#0b1533, #16336e 58%, #1a1408)",
    palette: ["#0b1533", "#16336e", "#c9a227", "#f0d17a", "#f6ecc9"],
  },
  {
    title: "Worth Offer",
    plateTitle: "Worth Offer",
    role: "Full-stack",
    year: 2026,
    stack: "React · Node.js · Stripe",
    link: "https://www.worthoffer.com",
    summary:
      "A storefront where price is negotiated rather than fixed. Orders can sit open for days, so payments, stock and order state run on idempotent webhooks and a single source of truth.",
    z: -2800,
    side: "r",
    frameBg:
      "radial-gradient(52% 40% at 30% 68%, #6f5bc4 0%, rgba(111,91,196,0) 66%), radial-gradient(40% 28% at 72% 26%, #e4844a 0%, rgba(228,132,74,0) 70%), linear-gradient(#1a1033, #3b2a6b 62%, #d9b26a)",
    modalBg:
      "radial-gradient(44% 34% at 30% 70%, #6f5bc4 0%, rgba(111,91,196,0) 66%), radial-gradient(32% 24% at 72% 28%, #e4844a 0%, rgba(228,132,74,0) 70%), linear-gradient(#1a1033, #3b2a6b 62%, #d9b26a)",
    palette: ["#1a1033", "#3b2a6b", "#6f5bc4", "#d9b26a", "#e4844a"],
  },
  {
    title: "Debaito",
    plateTitle: "Debaito",
    role: "Lead developer",
    year: 2025,
    stack: "Node.js · PostgreSQL · React",
    // Intentionally null: the site is offline and must not be linked. The
    // modal renders a "case study" note in place of a live link.
    link: null,
    summary:
      "A multi-tenant job platform targeting the Japanese market, multi-tenant from the first commit. Tenancy lived in the schema rather than the application layer, which kept it honest as employers scaled.",
    z: -4200,
    side: "l",
    frameBg:
      "radial-gradient(48% 36% at 46% 34%, #e8d7c3 0%, rgba(232,215,195,0) 62%), radial-gradient(30% 24% at 74% 68%, #b8452f 0%, rgba(184,69,47,0) 72%), linear-gradient(#101828, #1f3f4a 56%, #4a7fa5)",
    modalBg:
      "radial-gradient(38% 32% at 46% 36%, #e8d7c3 0%, rgba(232,215,195,0) 62%), radial-gradient(24% 20% at 74% 68%, #b8452f 0%, rgba(184,69,47,0) 72%), linear-gradient(#101828, #1f3f4a 56%, #4a7fa5)",
    palette: ["#101828", "#1f3f4a", "#4a7fa5", "#e8d7c3", "#b8452f"],
  },
];

// Corridor depth the camera travels, in px. The last frame at z:-4200 is
// fully behind the viewer around 4600, so this leaves a short breath at the
// end of the hall without a long stretch of empty corridor. Kept beside the
// data it paces — adding a work means extending this and the section height
// in GalleryHall.module.css together.
export const GALLERY_DEPTH = 5200;
