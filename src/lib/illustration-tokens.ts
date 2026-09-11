// Per-project illustration accents — "additional subdued colors within
// project imagery," per the design spec. Never promoted to a global CSS
// var, never used outside that project's own cover/illustration.
export const PRISM_ACCENT = "#355C8A"; // reuses the main accent — Prism is the flagship
export const MEDICAL_ACCENT = "#5C7A5E"; // muted sage — clinical/biological association
export const FACULTY_ACCENT = "#A67C3D"; // muted ochre — paperwork/workflow warmth
export const AIRSPACE_ACCENT = "#5B7089"; // muted slate-blue — sky/instrumentation, distinct from the primary accent

// Cover surfaces — each project's homepage/case-study card background.
// Two are dark (Prism, Airspace) and need light content on top; two are
// light (Medical, Faculty Ops) and keep dark content. `on`/`onMuted` are
// the readable foreground pair for that specific surface, not global tokens.
export const COVERS = {
  prism: {
    surface: "#0F2A47", // deep ink-blue
    on: "#F3F6FA",
    onMuted: "#9BB3CC",
    line: "#3A5878",
  },
  medical: {
    surface: "#E4ECE0", // pale sage
    on: "#2B3B2A",
    onMuted: "#5C7A5E",
    line: "#A9C0A3",
  },
  faculty: {
    surface: "#EFE3C8", // warm parchment
    on: "#3A2F1D",
    onMuted: "#8A6F45",
    line: "#C9B383",
  },
  airspace: {
    surface: "#33475A", // cool blue-grey
    on: "#EDF2F5",
    onMuted: "#9FB2C0",
    line: "#4F6A80",
  },
} as const;
