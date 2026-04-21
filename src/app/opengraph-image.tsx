import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Naman Tyagi — AI/ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow blob */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(168,85,247,0.06) 50%, transparent 70%)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "48px",
          }}
        >
          <span style={{ color: "#00d4ff", fontSize: "22px", fontWeight: 700 }}>&lt;</span>
          <span style={{ color: "#ededed", fontSize: "22px", fontWeight: 700 }}>NT</span>
          <span style={{ color: "#00d4ff", fontSize: "22px", fontWeight: 700 }}>/&gt;</span>
          <span
            style={{
              marginLeft: "16px",
              color: "#6b7280",
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            namantyagi.dev
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "88px",
            fontWeight: 900,
            color: "#ededed",
            lineHeight: 0.9,
            letterSpacing: "-3px",
            marginBottom: "24px",
          }}
        >
          Naman Tyagi
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#00d4ff",
            fontFamily: "monospace",
            marginBottom: "40px",
            textShadow: "0 0 30px rgba(0,212,255,0.5)",
          }}
        >
          AI/ML Engineer · Full-Stack · Cloud Architect
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {["MS CS @ NYU Tandon", "IEEE Published 2024", "Cambridge Scholars 2025", "6+ Internships"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,212,255,0.25)",
                  background: "rgba(0,212,255,0.06)",
                  color: "#9ca3af",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
