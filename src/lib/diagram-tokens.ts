// SVG presentation attributes (fill/stroke) can't read CSS custom properties,
// so raw hex diagrams keep their own copy of the palette. This is the single
// place that copy lives — keep it in sync with the :root tokens in
// src/app/globals.css by hand if the palette ever changes.
export const ACCENT = "#355C8A";
export const ACCENT_SECONDARY = "#A54A42";
export const SURFACE = "#ECEAE4";
export const BORDER_STRONG = "#C4C1B6";
export const MUTED = "#6A6963";
export const FOREGROUND = "#171715";
