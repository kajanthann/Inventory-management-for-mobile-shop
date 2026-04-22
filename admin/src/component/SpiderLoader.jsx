import React, { useEffect, useState } from "react";

const SpiderLoader = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=spinning web, 1=spider drops, 2=done

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onDone(), 400);
          return 100;
        }
        return prev + 1.2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress > 40) setPhase(1);
    if (progress > 85) setPhase(2);
  }, [progress]);

  // web ring radii
  const rings = [40, 80, 120, 160, 200, 240];
  const spokes = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  // how many rings to draw based on progress
  const ringsToShow = Math.ceil((progress / 100) * rings.length);
  const spokesToShow = Math.ceil((progress / 100) * spokes.length);

  // spider drop — from top to center as progress goes 40→100
  const spiderY = phase >= 1
    ? Math.min(250, 20 + ((progress - 40) / 60) * 230)
    : 20;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#050505",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        transition: "opacity 0.4s ease",
        opacity: progress >= 100 ? 0 : 1,
      }}
    >
      {/* Outer glow */}
      <div style={{
        position: "absolute",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(176,0,0,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Web SVG */}
      <svg
        viewBox="0 0 500 500"
        style={{ width: 340, height: 340, position: "relative", zIndex: 1 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Spokes — draw progressively */}
        {spokes.slice(0, spokesToShow).map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 250 + 260 * Math.cos(rad);
          const y2 = 250 + 260 * Math.sin(rad);
          return (
            <line
              key={i} x1="250" y1="250" x2={x2} y2={y2}
              stroke="rgba(180,10,10,0.5)" strokeWidth="0.9"
              style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}
            />
          );
        })}

        {/* Rings — draw progressively */}
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
              stroke="rgba(180,10,10,0.35)"
              strokeWidth="0.9"
              style={{ animation: `fadeIn 0.4s ease ${ri * 0.08}s both` }}
            />
          );
        })}

        {/* Silk thread from top */}
        {phase >= 1 && (
          <line
            x1="250" y1="0" x2="250" y2={spiderY}
            stroke="rgba(180,10,10,0.3)" strokeWidth="0.9"
            strokeDasharray="4,3"
          />
        )}

        {/* Spider dropping */}
        {phase >= 1 && (
          <g transform={`translate(250, ${spiderY})`} filter="url(#glow)">
            {/* Body */}
            <ellipse cx="0" cy="5" rx="10" ry="13" fill="rgba(180,10,10,0.85)" />
            {/* Head */}
            <circle cx="0" cy="-9" r="7" fill="rgba(160,8,8,0.85)" />
            {/* Eyes */}
            <circle cx="-3" cy="-10" r="1.5" fill="rgba(255,255,255,0.9)" />
            <circle cx="3" cy="-10" r="1.5" fill="rgba(255,255,255,0.9)" />
            {/* Legs left */}
            <path d="M-7 -2 Q-24 -10 -36 -18" stroke="rgba(180,10,10,0.9)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M-8 3 Q-26 0 -38 2" stroke="rgba(180,10,10,0.9)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M-8 8 Q-25 12 -36 18" stroke="rgba(180,10,10,0.9)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M-7 13 Q-22 20 -32 28" stroke="rgba(180,10,10,0.9)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            {/* Legs right */}
            <path d="M7 -2 Q24 -10 36 -18" stroke="rgba(180,10,10,0.9)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M8 3 Q26 0 38 2" stroke="rgba(180,10,10,0.9)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M8 8 Q25 12 36 18" stroke="rgba(180,10,10,0.9)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            <path d="M7 13 Q22 20 32 28" stroke="rgba(180,10,10,0.9)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          </g>
        )}
      </svg>

      {/* Brand */}
      <div style={{ textAlign: "center", marginTop: 16, position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
          <span style={{ color: "#ffffff" }}>SMART</span>
          <span style={{ color: "#b00000" }}>SPIDER</span>
        </h1>
        <p style={{ fontSize: 11, color: "#374151", marginTop: 4, letterSpacing: "0.1em" }}>
          INVENTORY SYSTEM
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        marginTop: 28, width: 240,
        height: 2, background: "#1a1a1a",
        borderRadius: 2, overflow: "hidden",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #6b0000, #b00000)",
          borderRadius: 2,
          transition: "width 0.03s linear",
          boxShadow: "0 0 8px rgba(176,0,0,0.6)",
        }} />
      </div>

      {/* Loading text */}
      <p style={{
        marginTop: 12, fontSize: 11,
        color: "#374151", letterSpacing: "0.08em",
        position: "relative", zIndex: 1,
      }}>
        {progress < 30 ? "Spinning the web..."
          : progress < 60 ? "Dropping in..."
          : progress < 90 ? "Setting the trap..."
          : "Ready to catch..."}
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SpiderLoader;