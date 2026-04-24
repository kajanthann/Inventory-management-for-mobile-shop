import React, { useEffect, useState } from "react";

/* ─────────────────────────────
   SEGMENTED PROGRESS BAR
───────────────────────────── */
const SegBar = ({ p, activeColor = "#b00000", bgColor = "#1a1a1a" }) => (
  <div
    style={{
      display: "flex",
      gap: 3,
      marginTop: 18,
      width: 240,
    }}
  >
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: 3,
          borderRadius: 2,
          background: (p / 100) * 20 > i ? activeColor : bgColor,
          transition: "0.2s",
          boxShadow:
            (p / 100) * 20 > i ? `0 0 6px ${activeColor}80` : "none",
        }}
      />
    ))}
  </div>
);

/* ─────────────────────────────
   MAIN LOADER
───────────────────────────── */
const SpiderLoader = ({ onDone, theme = "dark" }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#050505" : "#f5f5f5",
    text: isDark ? "#ffffff" : "#111111",
    subText: isDark ? "#374151" : "#555555",
    accent: "#b00000",
    barBg: isDark ? "#1a1a1a" : "#e5e5e5",
  };

  /* ── progress simulation ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onDone?.(), 400);
          return 100;
        }
        return prev + 1.2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  /* ── phase control ── */
  useEffect(() => {
    if (progress > 40) setPhase(1);
    if (progress > 85) setPhase(2);
  }, [progress]);

  /* ── web config ── */
  const rings = [40, 80, 120, 160, 200, 240];
  const spokes = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  const ringsToShow = Math.ceil((progress / 100) * rings.length);
  const spokesToShow = Math.ceil((progress / 100) * spokes.length);

  const spiderY =
    phase >= 1 ? Math.min(250, 20 + ((progress - 40) / 60) * 230) : 20;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.4s ease",
        opacity: progress >= 100 ? 0 : 1,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(176,0,0,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(176,0,0,0.05) 0%, transparent 70%)",
        }}
      />

      {/* WEB SVG */}
      <svg
        viewBox="0 0 500 500"
        style={{ width: 340, height: 340, position: "relative" }}
      >
        {/* Spokes */}
        {spokes.slice(0, spokesToShow).map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 250 + 260 * Math.cos(rad);
          const y2 = 250 + 260 * Math.sin(rad);

          return (
            <line
              key={i}
              x1="250"
              y1="250"
              x2={x2}
              y2={y2}
              stroke="rgba(176,0,0,0.5)"
              strokeWidth="0.9"
            />
          );
        })}

        {/* Rings */}
        {rings.slice(0, ringsToShow).map((r, ri) => {
          const points = spokes.map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return `${250 + r * Math.cos(rad)},${250 + r * Math.sin(rad)}`;
          });

          return (
            <polygon
              key={ri}
              points={points.join(" ")}
              fill="none"
              stroke="rgba(176,0,0,0.35)"
              strokeWidth="0.9"
            />
          );
        })}

        {/* Thread */}
        {phase >= 1 && (
          <line
            x1="250"
            y1="0"
            x2="250"
            y2={spiderY}
            stroke="rgba(176,0,0,0.3)"
            strokeWidth="1"
            strokeDasharray="4,3"
          />
        )}

        {/* Spider */}
        {phase >= 1 && (
          <g transform={`translate(250, ${spiderY})`}>
            <ellipse
              cx="0"
              cy="5"
              rx="10"
              ry="13"
              fill="rgba(176,0,0,0.85)"
            />
            <circle cx="0" cy="-9" r="7" fill="rgba(160,8,8,0.85)" />
            <circle cx="-3" cy="-10" r="1.5" fill="white" />
            <circle cx="3" cy="-10" r="1.5" fill="white" />
          </g>
        )}
      </svg>

      {/* Brand */}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
          <span style={{ color: colors.text }}>SMART</span>
          <span style={{ color: colors.accent }}>SPIDER</span>
        </h1>
        <p style={{ fontSize: 11, color: colors.subText }}>
          INVENTORY SYSTEM
        </p>
      </div>

      {/* Progress Bar (segmented) */}
      <SegBar
        p={progress}
        activeColor={colors.accent}
        bgColor={colors.barBg}
      />

      {/* Percent */}
      <p
        style={{
          marginTop: 10,
          fontSize: 12,
          color: colors.accent,
          fontFamily: "monospace",
        }}
      >
        {Math.round(progress)}%
      </p>

      {/* Text */}
      <p style={{ fontSize: 11, color: colors.subText, marginTop: 6 }}>
        {progress < 30
          ? "Spinning the web..."
          : progress < 60
          ? "Dropping in..."
          : progress < 90
          ? "Setting trap..."
          : "Ready to catch..."}
      </p>
    </div>
  );
};

export default SpiderLoader;