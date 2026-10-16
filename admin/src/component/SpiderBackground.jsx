import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const SpiderWeb = ({ opacity = 0.25, rotate = 0 }) => (
  <svg
    viewBox="0 0 500 500"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", transform: `rotate(${rotate}deg)` }}
  >
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      return (
        <line key={i} x1="250" y1="250"
          x2={250 + 260 * Math.cos(rad)}
          y2={250 + 260 * Math.sin(rad)}
          stroke={`rgba(180,10,10,${opacity})`} strokeWidth="0.9" />
      );
    })}
    {[40,80,120,160,200,240].map((r, ri) => {
      const points = [0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return `${250 + r * Math.cos(rad)},${250 + r * Math.sin(rad)}`;
      });
      return (
        <polygon key={ri} points={points.join(" ")} fill="none"
          stroke={`rgba(180,10,10,${opacity * 0.75})`} strokeWidth="0.9" />
      );
    })}
    <ellipse cx="250" cy="248" rx="10" ry="13" fill={`rgba(180,10,10,${opacity * 2})`} />
    <circle cx="250" cy="232" r="7" fill={`rgba(160,8,8,${opacity * 1.8})`} />
    <circle cx="247" cy="230" r="1.5" fill="rgba(255,255,255,0.75)" />
    <circle cx="253" cy="230" r="1.5" fill="rgba(255,255,255,0.75)" />
    <path d="M243 238 Q220 228 205 218" stroke={`rgba(180,10,10,${opacity*2})`} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M242 243 Q218 238 200 232" stroke={`rgba(180,10,10,${opacity*2})`} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M241 249 Q217 250 200 248" stroke={`rgba(180,10,10,${opacity*2})`} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M241 254 Q218 260 202 265" stroke={`rgba(180,10,10,${opacity*2})`} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M257 238 Q280 228 295 218" stroke={`rgba(180,10,10,${opacity*2})`} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M258 243 Q282 238 300 232" stroke={`rgba(180,10,10,${opacity*2})`} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M259 249 Q283 250 300 248" stroke={`rgba(180,10,10,${opacity*2})`} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M259 254 Q282 260 298 265" stroke={`rgba(180,10,10,${opacity*2})`} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <line x1="250" y1="0" x2="250" y2="225"
      stroke={`rgba(180,10,10,${opacity*0.8})`} strokeWidth="0.9" strokeDasharray="4,3" />
  </svg>
);

// ── Seeded random ──────────────────────────────────────────────────
const seededRand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// ── Grid-based placement — NO overlapping ─────────────────────────
// Divides the viewport into a cols×rows grid.
// Each spider is placed in one cell with a small random jitter
// so they stay evenly spread and never touch each other.
const generateSpiders = () => {
  const rand = seededRand(99);

  const COLS = 3;
  const ROWS = 3;

  // ── Predefined size tiers — mix of big, medium, small ─────────
  const SIZE_TIERS = [
    300,  // big
    160,  // small
    400,  // very big
    130,  // tiny
  ];

  const spiders = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx   = row * COLS + col;
      const cellW = 100 / COLS;
      const cellH = 100 / ROWS;

      const centerX = col * cellW + cellW / 2;
      const centerY = row * cellH + cellH / 2;

      const jitterX = (rand() - 0.5) * cellW * 0.4;
      const jitterY = (rand() - 0.5) * cellH * 0.4;

      spiders.push({
        id:      idx,
        left:    `${Math.min(Math.max(centerX + jitterX, 5), 93)}%`,
        top:     `${Math.min(Math.max(centerY + jitterY, 5), 93)}%`,
        size:    SIZE_TIERS[idx],          // ← each spider gets its own tier
        rotate:  Math.floor(rand() * 360),
        opacity: 0.60 + rand() * 0.12,    // 0.10 – 0.22 subtle
      });
    }
  }

  return spiders;
};

const SPIDERS = generateSpiders();

// ── Main Background Component ──────────────────────────────────────
const SpiderBackground = () => {
  const { theme } = useContext(AppContext);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-white dark:bg-[#0a0a0a]">

      {SPIDERS.map(({ id, top, left, size, rotate, opacity }) => (
        <div
          key={id}
          style={{
            position:  "absolute",
            top,
            left,
            width:     `${size}px`,
            height:    `${size}px`,
            transform: "translate(-50%, -50%)",
            opacity:   theme === "dark" ? opacity : opacity * 0.7,
          }}
        >
          <SpiderWeb rotate={rotate} opacity={1} />
        </div>
      ))}

      {/* Subtle glow blobs */}
      <div style={{
        position:     "absolute",
        top:          "10%",
        right:        "15%",
        width:        220,
        height:       220,
        borderRadius: "50%",
        background:   theme === "dark"
          ? "rgba(180,10,10,0.05)"
          : "rgba(180,10,10,0.02)",
        filter: "blur(55px)",
      }} />
      <div style={{
        position:     "absolute",
        bottom:       "15%",
        left:         "20%",
        width:        160,
        height:       160,
        borderRadius: "50%",
        background:   theme === "dark"
          ? "rgba(180,10,10,0.03)"
          : "rgba(180,10,10,0.015)",
        filter: "blur(45px)",
      }} />
    </div>
  );
};

export default SpiderBackground;