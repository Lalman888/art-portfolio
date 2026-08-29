// The stack, arranged as four chords of five.
//
// This section inherits the "colour chord" mechanic from the design — a row
// of five bands that expand under the pointer — because each of the four
// groups happens to hold exactly five tools. Where the original revealed a
// hex code on hover, these carry the tool's name and stay legible at rest;
// a stack you have to hover to read is not a stack anyone reads.
//
// `on` picks the label colour a band needs: "light" text on a dark tint,
// "dark" text on a light one.

function band(name, hex, on) {
  return { name, hex, on };
}

export const STACK = [
  {
    group: "Languages & frameworks",
    bands: [
      band("Python", "#0b1533", "light"),
      band("Node.js", "#16336e", "light"),
      band("TypeScript", "#2a5cae", "light"),
      band("React", "#4a7fc1", "light"),
      band("React Native", "#6f9dd6", "dark"),
    ],
  },
  {
    group: "Infrastructure",
    bands: [
      band("AWS", "#101822", "light"),
      band("GCP", "#1f3f4a", "light"),
      band("Docker", "#2f5f6e", "light"),
      band("CI/CD", "#4a7f95", "light"),
      band("PostgreSQL", "#8fa8c9", "dark"),
    ],
  },
  {
    group: "AI systems",
    bands: [
      band("LangChain", "#1a1408", "light"),
      band("OpenAI", "#4a3a10", "light"),
      band("Pinecone", "#8a6b1f", "light"),
      band("RAG pipelines", "#c9971e", "dark"),
      band("Evals", "#f0d17a", "dark"),
    ],
  },
  {
    group: "Integrations",
    bands: [
      band("Stripe", "#2a1410", "light"),
      band("Twilio", "#5c2a1f", "light"),
      band("ShipStation", "#8b3a2f", "light"),
      band("Webhooks", "#c4552e", "light"),
      band("REST & GraphQL", "#e4844a", "dark"),
    ],
  },
];
