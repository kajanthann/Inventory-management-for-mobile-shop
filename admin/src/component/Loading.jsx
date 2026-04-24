import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

// Spider SVG
const Spider = ({ size = 28, color }) => (
  <svg viewBox="0 0 40 40" width={size} height={size}>
    <ellipse cx="20" cy="22" rx="6" ry="8" fill={color} />
    <circle cx="20" cy="13" r="5" fill={color} opacity={0.8} />
    <circle cx="18" cy="12" r="1.2" fill="#fff" />
    <circle cx="22" cy="12" r="1.2" fill="#fff" />
  </svg>
);

// Segmented Bar
const SegBar = ({ p, activeColor, bgColor }) => (
  <div style={{ display: "flex", gap: 3, marginTop: 20, width: 220 }}>
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: 3,
          borderRadius: 2,
          background: (p / 100) * 20 > i ? activeColor : bgColor,
          transition: "0.2s",
        }}
      />
    ))}
  </div>
);

const Loading = ({ onDone }) => {
  const { loading, theme } = useContext(AppContext);
  const [progress, setProgress] = useState(0);

  // 🎯 REAL PROGRESS CONTROL
  useEffect(() => {
    if (loading) {
      const id = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 2 : prev)); // stop at 90%
      }, 50);
      return () => clearInterval(id);
    } else {
      // API finished → complete to 100
      setProgress(100);

      setTimeout(() => {
        onDone && onDone();
      }, 500);
    }
  }, [loading]);

  // 🎨 THEME COLORS
  const isDark = theme === "dark";

  const colors = {
    bg: isDark ? "#050505" : "#f9fafb",
    text: isDark ? "#ffffff" : "#111827",
    subText: isDark ? "#6b7280" : "#6b7280",
    primary: "#b00000",
    inactive: isDark ? "#1a1a1a" : "#e5e7eb",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        transition: "background 0.3s",
      }}
    >
      {/* Spinner */}
      <div style={{ position: "relative", width: 100, height: 100 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1px solid ${colors.primary}55`,
              animation: `ping 1.8s ease-out ${i * 0.5}s infinite`,
            }}
          />
        ))}

        {/* Outer */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            animation: "spin 1.2s linear infinite",
          }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={colors.primary}
            strokeWidth="3"
            strokeDasharray="70 180"
          />
        </svg>

        {/* Inner */}
        <svg
          style={{
            position: "absolute",
            inset: 10,
            width: "80%",
            height: "80%",
            animation: "spinReverse 2s linear infinite",
          }}
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke={colors.primary}
            opacity={0.3}
            strokeWidth="2"
            strokeDasharray="40 140"
          />
        </svg>

        {/* Spider */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spider size={26} color={colors.primary} />
        </div>
      </div>

      {/* Branding */}
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>
          <span style={{ color: colors.text }}>SMART</span>
          <span style={{ color: colors.primary }}>SPIDER</span>
        </h1>

        <p style={{ fontSize: 11, color: colors.subText }}>
          INVENTORY SYSTEM
        </p>
      </div>

      {/* Progress */}
      <SegBar
        p={progress}
        activeColor={colors.primary}
        bgColor={colors.inactive}
      />

      <p
        style={{
          marginTop: 10,
          fontSize: 12,
          color: colors.primary,
          fontFamily: "monospace",
        }}
      >
        {Math.round(progress)}%
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes ping {
          0% { transform: scale(0.9); opacity: 0.6; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Loading;