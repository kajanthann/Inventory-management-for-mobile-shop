// import React, { useEffect, useState } from "react";

// const Animation = ({ onDone }) => {
//   const [progress, setProgress] = useState(0);
//   const [visible, setVisible] = useState(true);
//   const [activeBox, setActiveBox] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setTimeout(() => {
//             setVisible(false);
//             setTimeout(onDone, 400);
//           }, 300);
//           return 100;
//         }
//         return prev + 1.4;
//       });
//     }, 28);
//     return () => clearInterval(interval);
//   }, []);

//   // cycle active box 0–8 continuously
//   useEffect(() => {
//     const t = setInterval(() => {
//       setActiveBox((prev) => (prev + 1) % 9);
//     }, 180);
//     return () => clearInterval(t);
//   }, []);

//   const text = progress < 25 ? "Initializing..."
//     : progress < 50 ? "Loading inventory..."
//     : progress < 75 ? "Fetching data..."
//     : progress < 95 ? "Almost ready..."
//     : "Welcome!";

//   // wave pattern — each box has a delay based on position
//   const waveOrder = [0, 1, 2, 5, 8, 7, 6, 3, 4]; // clockwise spiral
//   const boxDelay = (i) => `${waveOrder.indexOf(i) * 0.08}s`;

//   // box state: active = bright red, near-active = dim red, rest = dark
//   const getBoxStyle = (i) => {
//     const dist = Math.min(
//       Math.abs(waveOrder.indexOf(i) - waveOrder.indexOf(activeBox)),
//       9 - Math.abs(waveOrder.indexOf(i) - waveOrder.indexOf(activeBox))
//     );
//     if (dist === 0) return { bg: "#b00000", shadow: "0 0 14px rgba(176,0,0,0.9)", scale: 1.08 };
//     if (dist === 1) return { bg: "rgba(176,0,0,0.45)", shadow: "0 0 6px rgba(176,0,0,0.4)", scale: 1.02 };
//     if (dist === 2) return { bg: "rgba(176,0,0,0.15)", shadow: "none", scale: 1 };
//     return { bg: "#111111", shadow: "none", scale: 1 };
//   };

//   // center box (index 4) always has spider icon
//   const SpiderIcon = () => (
//     <svg viewBox="0 0 40 40" width="26" height="26">
//       <ellipse cx="20" cy="23" rx="5.5" ry="7" fill="rgba(176,0,0,0.95)" />
//       <circle cx="20" cy="14" r="4.5" fill="rgba(150,5,5,0.95)" />
//       <circle cx="18" cy="13" r="1.1" fill="white" />
//       <circle cx="22" cy="13" r="1.1" fill="white" />
//       <path d="M15 19 Q9 16 5 13" stroke="rgba(176,0,0,0.9)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
//       <path d="M15 22 Q8 21 4 21" stroke="rgba(176,0,0,0.9)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
//       <path d="M15 25 Q9 26 5 29" stroke="rgba(176,0,0,0.9)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
//       <path d="M15 28 Q10 31 7 35" stroke="rgba(176,0,0,0.9)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
//       <path d="M25 19 Q31 16 35 13" stroke="rgba(176,0,0,0.9)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
//       <path d="M25 22 Q32 21 36 21" stroke="rgba(176,0,0,0.9)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
//       <path d="M25 25 Q31 26 35 29" stroke="rgba(176,0,0,0.9)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
//       <path d="M25 28 Q30 31 33 35" stroke="rgba(176,0,0,0.9)" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
//     </svg>
//   );

//   return (
//     <div style={{
//       position: "fixed", inset: 0, zIndex: 9999,
//       background: "#050505",
//       display: "flex", flexDirection: "column",
//       alignItems: "center", justifyContent: "center",
//       opacity: visible ? 1 : 0,
//       transition: "opacity 0.4s ease",
//     }}>

//       {/* 3×3 Box Grid */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(3, 1fr)",
//         gap: 8,
//         width: 132,
//         height: 132,
//         marginBottom: 36,
//       }}>
//         {Array.from({ length: 9 }).map((_, i) => {
//           const { bg, shadow, scale } = getBoxStyle(i);
//           const isCenter = i === 4;
//           return (
//             <div
//               key={i}
//               style={{
//                 borderRadius: 8,
//                 background: isCenter ? "rgba(176,0,0,0.12)" : bg,
//                 border: isCenter
//                   ? "1px solid rgba(176,0,0,0.35)"
//                   : `1px solid ${bg === "#111111" ? "#1a1a1a" : "rgba(176,0,0,0.3)"}`,
//                 boxShadow: isCenter
//                   ? "0 0 10px rgba(176,0,0,0.25)"
//                   : shadow,
//                 transform: `scale(${isCenter ? 1 : scale})`,
//                 transition: "all 0.18s ease",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 animation: `boxFloat ${0.8 + (i % 3) * 0.2}s ease-in-out ${boxDelay(i)} infinite alternate`,
//               }}
//             >
//               {isCenter && <SpiderIcon />}
//             </div>
//           );
//         })}
//       </div>

//       {/* Brand */}
//       <div style={{ textAlign: "center", marginBottom: 28 }}>
//         <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
//           <span style={{ color: "#ffffff" }}>SMART</span>
//           <span style={{ color: "#b00000" }}>SPIDER</span>
//         </h1>
//         <p style={{ fontSize: 10, color: "#374151", margin: "4px 0 0", letterSpacing: "0.12em" }}>
//           INVENTORY SYSTEM
//         </p>
//       </div>

//       {/* Segmented progress bar */}
//       <div style={{ width: 200, marginBottom: 10 }}>
//         <div style={{ display: "flex", gap: 3 }}>
//           {Array.from({ length: 20 }).map((_, i) => {
//             const filled = (progress / 100) * 20 > i;
//             return (
//               <div key={i} style={{
//                 flex: 1, height: 3, borderRadius: 2,
//                 background: filled ? "#b00000" : "#1a1a1a",
//                 transition: "background 0.15s ease",
//                 boxShadow: filled ? "0 0 4px rgba(176,0,0,0.5)" : "none",
//               }} />
//             );
//           })}
//         </div>
//       </div>

//       {/* Status + percent */}
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 200 }}>
//         <p style={{ fontSize: 11, color: "#4b5563", margin: 0, letterSpacing: "0.04em" }}>
//           {text}
//         </p>
//         <p style={{ fontSize: 11, color: "#b00000", margin: 0, fontWeight: 600, fontFamily: "monospace" }}>
//           {Math.round(progress)}%
//         </p>
//       </div>

//       <style>{`
//         @keyframes boxFloat {
//           from { transform: translateY(0px); }
//           to   { transform: translateY(-3px); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Animation;
import React, { useEffect, useState } from "react";

// ── Shared progress hook ─────────────────────────────────────────
const useProgress = (speed = 1.2) => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setP((v) => (v >= 100 ? 0 : v + speed)), 30);
    return () => clearInterval(id);
  }, []);
  return p;
};

// ── 1. Spinning Arc ──────────────────────────────────────────────
const Anim1 = () => {
  const p = useProgress();
  return (
    <Box label="Spinning Arc" n={1}>
      <div style={{ position: "relative", width: 80, height: 80 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1px solid rgba(176,0,0,0.35)",
            animation: `ping 1.8s ease-out ${i * 0.5}s infinite`,
          }} />
        ))}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "spin 1.1s linear infinite" }} viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#b00000" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="55 160" />
        </svg>
        <svg style={{ position: "absolute", inset: 6, width: "calc(100% - 12px)", height: "calc(100% - 12px)", animation: "spinReverse 1.8s linear infinite" }} viewBox="0 0 68 68">
          <circle cx="34" cy="34" r="28" fill="none" stroke="rgba(176,0,0,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="25 155" />
        </svg>
        <Spider size={22} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── 2. Dot Wave ──────────────────────────────────────────────────
const Anim2 = () => {
  const p = useProgress(0.9);
  return (
    <Box label="Dot Wave" n={2}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", height: 50 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%", background: "#b00000",
            animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            boxShadow: "0 0 6px rgba(176,0,0,0.5)",
          }} />
        ))}
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── 3. Web Spinner ───────────────────────────────────────────────
const Anim3 = () => {
  const p = useProgress(1.0);
  const spokes = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const rings = [15, 28, 41];
  return (
    <Box label="Web Spinner" n={3}>
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <svg style={{ width: "100%", height: "100%", animation: "spin 4s linear infinite" }} viewBox="0 0 100 100">
          {spokes.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return <line key={i} x1="50" y1="50" x2={50 + 46 * Math.cos(rad)} y2={50 + 46 * Math.sin(rad)} stroke="rgba(176,0,0,0.45)" strokeWidth="0.8" />;
          })}
          {rings.map((r, ri) => {
            const pts = spokes.map((a) => { const rd = (a * Math.PI) / 180; return `${50 + r * Math.cos(rd)},${50 + r * Math.sin(rd)}`; });
            return <polygon key={ri} points={pts.join(" ")} fill="none" stroke="rgba(176,0,0,0.35)" strokeWidth="0.8" />;
          })}
          <ellipse cx="50" cy="50" rx="5" ry="6" fill="rgba(176,0,0,0.85)" />
          <circle cx="50" cy="44" r="3.5" fill="rgba(140,5,5,0.85)" />
          <circle cx="48.5" cy="43" r="0.8" fill="white" />
          <circle cx="51.5" cy="43" r="0.8" fill="white" />
        </svg>
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── 4. Pulse Rings ───────────────────────────────────────────────
const Anim4 = () => {
  const p = useProgress(1.1);
  return (
    <Box label="Pulse Rings" n={4}>
      <div style={{ position: "relative", width: 80, height: 80 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: 16 + i * 18, height: 16 + i * 18,
            borderRadius: "50%",
            border: `${1.5 - i * 0.2}px solid rgba(176,0,0,${0.7 - i * 0.15})`,
            transform: "translate(-50%,-50%)",
            animation: `pulseRing 2s ease-in-out ${i * 0.3}s infinite`,
          }} />
        ))}
        <Spider size={20} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── 5. Bar Equalizer ─────────────────────────────────────────────
const Anim5 = () => {
  const p = useProgress(0.8);
  return (
    <Box label="Equalizer" n={5}>
      <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 50 }}>
        {[0.6, 1, 0.4, 0.8, 0.5, 0.9, 0.3, 0.7].map((h, i) => (
          <div key={i} style={{
            width: 7, borderRadius: "2px 2px 0 0",
            background: `rgba(176,0,0,${0.5 + h * 0.5})`,
            animation: `eqBar 1s ease-in-out ${i * 0.1}s infinite alternate`,
            boxShadow: "0 0 4px rgba(176,0,0,0.3)",
            animationDuration: `${0.6 + i * 0.1}s`,
          }} />
        ))}
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── 6. Orbit Dots ────────────────────────────────────────────────
const Anim6 = () => {
  const p = useProgress(1.3);
  return (
    <Box label="Orbit Dots" n={6}>
      <div style={{ position: "relative", width: 80, height: 80 }}>
        <Spider size={20} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 7, height: 7, borderRadius: "50%",
            background: "#b00000",
            boxShadow: "0 0 6px rgba(176,0,0,0.7)",
            animation: `orbit${i + 1} ${1.2 + i * 0.4}s linear infinite`,
            transformOrigin: "0 0",
          }} />
        ))}
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── 7. Typewriter ────────────────────────────────────────────────
const Anim7 = () => {
  const p = useProgress(0.7);
  const words = ["SMART", "SPIDER", "SYSTEM", "READY"];
  const [wIdx, setWIdx] = useState(0);
  const [chars, setChars] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setChars((c) => {
        if (c >= words[wIdx].length) {
          setTimeout(() => { setWIdx((w) => (w + 1) % words.length); setChars(0); }, 500);
          return c;
        }
        return c + 1;
      });
    }, 120);
    return () => clearInterval(id);
  }, [wIdx]);
  return (
    <Box label="Typewriter" n={7}>
      <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: "#b00000", letterSpacing: "0.1em" }}>
          {words[wIdx].slice(0, chars)}
          <span style={{ animation: "blink 0.8s step-end infinite", color: "#b00000" }}>|</span>
        </span>
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── 8. Hex Grid ──────────────────────────────────────────────────
const Anim8 = () => {
  const p = useProgress(1.0);
  const hexes = [
    [0, 0], [1, 0], [2, 0],
    [0.5, 1], [1.5, 1],
    [1, 2],
  ];
  return (
    <Box label="Hex Grid" n={8}>
      <div style={{ position: "relative", width: 80, height: 70 }}>
        {hexes.map(([col, row], i) => (
          <div key={i} style={{
            position: "absolute",
            left: col * 24 + 4,
            top: row * 22,
            width: 18, height: 18,
            background: "rgba(176,0,0,0.08)",
            border: "1px solid rgba(176,0,0,0.4)",
            borderRadius: 4,
            animation: `hexPulse 1.4s ease-in-out ${i * 0.18}s infinite`,
          }} />
        ))}
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── 9. Silk Thread Drop ──────────────────────────────────────────
const Anim9 = () => {
  const p = useProgress(1.2);
  const [dropY, setDropY] = useState(0);
  useEffect(() => {
    let y = 0; let dir = 1;
    const id = setInterval(() => {
      y += dir * 0.8;
      if (y >= 36 || y <= 0) dir *= -1;
      setDropY(y);
    }, 20);
    return () => clearInterval(id);
  }, []);
  return (
    <Box label="Silk Drop" n={9}>
      <div style={{ position: "relative", width: 60, height: 60 }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          {/* Thread */}
          <line x1="30" y1="0" x2="30" y2={dropY + 8} stroke="rgba(176,0,0,0.4)" strokeWidth="0.8" strokeDasharray="3,2" />
          {/* Spider body */}
          <g transform={`translate(30, ${dropY + 8})`}>
            <ellipse cx="0" cy="4" rx="5" ry="6" fill="rgba(176,0,0,0.85)" />
            <circle cx="0" cy="-3" r="4" fill="rgba(140,5,5,0.85)" />
            <circle cx="-1.5" cy="-3.5" r="0.9" fill="white" />
            <circle cx="1.5" cy="-3.5" r="0.9" fill="white" />
            {/* legs */}
            <path d="M-4 0 Q-12 -3 -16 -6" stroke="rgba(176,0,0,0.8)" strokeWidth="1" fill="none" />
            <path d="M-4 3 Q-12 3 -16 3" stroke="rgba(176,0,0,0.8)" strokeWidth="1" fill="none" />
            <path d="M4 0 Q12 -3 16 -6" stroke="rgba(176,0,0,0.8)" strokeWidth="1" fill="none" />
            <path d="M4 3 Q12 3 16 3" stroke="rgba(176,0,0,0.8)" strokeWidth="1" fill="none" />
          </g>
        </svg>
      </div>
      <SegBar p={p} />
    </Box>
  );
};

// ── Shared Spider SVG ────────────────────────────────────────────
const Spider = ({ size = 28, style = {} }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={style}>
    <ellipse cx="20" cy="22" rx="6" ry="8" fill="rgba(176,0,0,0.9)" />
    <circle cx="20" cy="13" r="5" fill="rgba(150,5,5,0.9)" />
    <circle cx="18" cy="12" r="1.2" fill="white" />
    <circle cx="22" cy="12" r="1.2" fill="white" />
    <path d="M15 18 Q9 15 5 12" stroke="rgba(176,0,0,0.85)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M15 21 Q8 20 4 20" stroke="rgba(176,0,0,0.85)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M15 24 Q9 25 5 28" stroke="rgba(176,0,0,0.85)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M25 18 Q31 15 35 12" stroke="rgba(176,0,0,0.85)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M25 21 Q32 20 36 20" stroke="rgba(176,0,0,0.85)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M25 24 Q31 25 35 28" stroke="rgba(176,0,0,0.85)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </svg>
);

// ── Shared segmented progress bar ───────────────────────────────
const SegBar = ({ p }) => (
  <div style={{ display: "flex", gap: 2, marginTop: 16, width: "100%" }}>
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} style={{
        flex: 1, height: 2.5, borderRadius: 2,
        background: (p / 100) * 12 > i ? "#b00000" : "#1a1a1a",
        transition: "background 0.1s",
        boxShadow: (p / 100) * 12 > i ? "0 0 4px rgba(176,0,0,0.5)" : "none",
      }} />
    ))}
  </div>
);

// ── Box wrapper ──────────────────────────────────────────────────
const Box = ({ children, label, n, onSelect }) => (
  <div
    onClick={() => onSelect?.(n)}
    style={{
      background: "rgba(17,17,17,0.8)",
      border: "1px solid #1f1f1f",
      borderRadius: 12,
      padding: "20px 16px 16px",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 0,
      cursor: "pointer",
      transition: "border-color 0.2s, transform 0.15s",
      position: "relative",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#b00000"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <span style={{
      position: "absolute", top: 8, left: 10,
      fontSize: 9, color: "#374151", fontFamily: "monospace",
    }}>#{n}</span>
    {children}
    <p style={{ fontSize: 10, color: "#4b5563", margin: "8px 0 0", letterSpacing: "0.06em", textAlign: "center" }}>{label}</p>
  </div>
);

// ── Main showcase ────────────────────────────────────────────────
const Animation = ({ onDone }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (n) => {
    setSelected(n);
    setTimeout(() => onDone?.(), 2000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#050505",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 20px",
      overflowY: "auto",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          <span style={{ color: "#fff" }}>SMART</span>
          <span style={{ color: "#b00000" }}>SPIDER</span>
        </h1>
        <p style={{ fontSize: 10, color: "#374151", margin: 0, letterSpacing: "0.1em" }}>
          CHOOSE YOUR LOADING STYLE
        </p>
      </div>

      {/* 3×3 Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 160px)",
        gap: 12,
      }}>
        <Anim1 />
        <Anim2 />
        <Anim3 />
        <Anim4 />
        <Anim5 />
        <Anim6 />
        <Anim7 />
        <Anim8 />
        <Anim9 />
      </div>

      {selected && (
        <p style={{ marginTop: 20, fontSize: 11, color: "#b00000", letterSpacing: "0.06em" }}>
          Animation #{selected} selected — loading...
        </p>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); } to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); } to { transform: rotate(0deg); }
        }
        @keyframes ping {
          0%   { transform: scale(0.85); opacity: 0.6; }
          70%  { transform: scale(1.5);  opacity: 0; }
          100% { transform: scale(1.5);  opacity: 0; }
        }
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0);    opacity: 0.4; }
          50%       { transform: translateY(-18px); opacity: 1; }
        }
        @keyframes pulseRing {
          0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.8; }
          50%       { transform: translate(-50%, -50%) scale(1.12); opacity: 0.4; }
        }
        @keyframes eqBar {
          from { height: 6px;  }
          to   { height: 38px; }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg)   translateX(28px); }
          to   { transform: rotate(360deg) translateX(28px); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(22px); }
          to   { transform: rotate(480deg) translateX(22px); }
        }
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(18px); }
          to   { transform: rotate(600deg) translateX(18px); }
        }
        @keyframes hexPulse {
          0%, 100% { background: rgba(176,0,0,0.06); border-color: rgba(176,0,0,0.25); }
          50%       { background: rgba(176,0,0,0.25); border-color: rgba(176,0,0,0.7);  }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Animation;
