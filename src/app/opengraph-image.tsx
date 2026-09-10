import { ImageResponse } from "next/og";

export const alt = "Naman Tyagi — AI/ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BACKGROUND = "#F6F5F0";
const FOREGROUND = "#171715";
const MUTED = "#6A6963";
const ACCENT = "#355C8A";
const ACCENT_SECONDARY = "#A54A42";
const BORDER = "#D8D6CF";
const SURFACE = "#ECEAE4";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: BACKGROUND,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "14px",
            fontFamily: "monospace",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: MUTED,
            marginBottom: "40px",
          }}
        >
          N / 2026 · BROOKLYN, NEW YORK
        </div>

        <div
          style={{
            fontSize: "84px",
            fontWeight: 600,
            color: FOREGROUND,
            lineHeight: 1,
            letterSpacing: "-2px",
            marginBottom: "20px",
          }}
        >
          Naman Tyagi
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "28px",
            fontWeight: 500,
            color: ACCENT,
            marginBottom: "48px",
          }}
        >
          AI/ML Engineer — AI infrastructure &amp; computer vision
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {["MS CS · NYU Tandon", "IEEE Published 2024", "Cambridge Scholars 2025", "6+ Internships"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  display: "flex",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  border: `1px solid ${BORDER}`,
                  background: SURFACE,
                  color: MUTED,
                  fontSize: "14px",
                  fontFamily: "monospace",
                  letterSpacing: "0.03em",
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "80px",
            right: "96px",
            fontSize: "14px",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            color: ACCENT_SECONDARY,
          }}
        >
          namantyagi.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
