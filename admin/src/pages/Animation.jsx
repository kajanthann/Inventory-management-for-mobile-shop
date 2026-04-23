import React, { useEffect, useState } from "react";

const useProgress = (speed = 1.2) => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setP((v) => (v >= 100 ? 0 : v + speed)), 30);
    return () => clearInterval(id);
  }, []);
  return p;
};

const Spider = ({ cx = 36, cy = 36, r1 = 5, r2 = 3.5 }) => (
  <>
    <ellipse cx={cx} cy={cy + r1 * 0.8} rx={r1 * 0.75} ry={r1} fill="#b00000" />
    <circle cx={cx} cy={cy - r2 * 0.5} r={r2} fill="#8b0000" />
    <circle cx={cx - 1.5} cy={cy - r2 * 0.8} r={1} fill="white" />
    <circle cx={cx + 1.5} cy={cy - r2 * 0.8} r={1} fill="white" />
    <path d={`M${cx - r1 * 0.8} ${cy} Q${cx - 14} ${cy - 4} ${cx - 20} ${cy - 8}`} stroke="#b00000" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <path d={`M${cx - r1 * 0.8} ${cy + 3} Q${cx - 14} ${cy + 3} ${cx - 20} ${cy + 3}`} stroke="#b00000" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <path d={`M${cx - r1 * 0.8} ${cy + 6} Q${cx - 14} ${cy + 9} ${cx - 20} ${cy + 13}`} stroke="#b00000" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <path d={`M${cx + r1 * 0.8} ${cy} Q${cx + 14} ${cy - 4} ${cx + 20} ${cy - 8}`} stroke="#b00000" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <path d={`M${cx + r1 * 0.8} ${cy + 3} Q${cx + 14} ${cy + 3} ${cx + 20} ${cy + 3}`} stroke="#b00000" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    <path d={`M${cx + r1 * 0.8} ${cy + 6} Q${cx + 14} ${cy + 9} ${cx + 20} ${cy + 13}`} stroke="#b00000" strokeWidth="1.1" fill="none" strokeLinecap="round" />
  </>
);

const Box = ({ children, label, n }) => (
  <div style={{
    background: "rgba(17,17,17,0.7)",
    border: "1px solid #1f1f1f",
    borderRadius: 12,
    padding: "14px 10px 10px",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 8,
    cursor: "pointer",
    transition: "border-color 0.2s, transform 0.15s",
    position: "relative",
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#b00000"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f1f1f"; e.currentTarget.style.transform = "translateY(0)"; }}
  >
    <span style={{ position: "absolute", top: 7, left: 9, fontSize: 9, color: "#374151", fontFamily: "monospace" }}>#{String(n).padStart(2, "0")}</span>
    <div style={{ width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>{children}</div>
    <p style={{ fontSize: 10, color: "#4b5563", margin: 0, letterSpacing: "0.06em", textAlign: "center" }}>{label}</p>
  </div>
);

// 1. Spinning Web
const A1 = () => (
  <Box label="Spinning Web" n={1}>
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ animation: "spin 6s linear infinite" }}>
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <line key={i} x1="36" y1="36" x2={36 + 32 * Math.cos(r)} y2={36 + 32 * Math.sin(r)} stroke="#b00000" strokeWidth=".8" opacity=".6" />;
      })}
      {[10, 18, 26].map((r, i) => {
        const pts = [0, 60, 120, 180, 240, 300].map((a) => { const rd = (a * Math.PI) / 180; return `${36 + r * Math.cos(rd)},${36 + r * Math.sin(rd)}`; });
        return <polygon key={i} points={pts.join(" ")} fill="none" stroke="#b00000" strokeWidth=".7" opacity={0.6 - i * 0.15} />;
      })}
      <Spider cx={36} cy={37} r1={5} r2={3.5} />
    </svg>
  </Box>
);

// 2. Silk Drop
const A2 = () => (
  <Box label="Silk Drop" n={2}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      <line x1="36" y1="0" x2="36" y2="36" stroke="#b00000" strokeWidth=".9" strokeDasharray="3,2" opacity=".35" />
      <g style={{ transformOrigin: "36px 0px", animation: "drop 2.4s ease-in-out infinite" }}>
        <ellipse cx="36" cy="40" rx="5" ry="6.5" fill="#b00000" />
        <circle cx="36" cy="31.5" r="4" fill="#8b0000" />
        <circle cx="34.2" cy="30.5" r="1.1" fill="white" />
        <circle cx="37.8" cy="30.5" r="1.1" fill="white" />
        {[[-1, 35, -7, -5], [-1, 38, -8, 0], [-1, 41, -7, 5], [-1, 44, -8, 10],
          [1, 35, 7, -5], [1, 38, 8, 0], [1, 41, 7, 5], [1, 44, 8, 10]].map(([s, y, qx, qy], i) => (
          <path key={i} d={`M${36 + s * 4} ${y} Q${36 + s * 12} ${y + qy} ${36 + s * 18} ${y + qy}`} stroke="#b00000" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  </Box>
);

// 3. Pulse Radar
const A3 = () => (
  <Box label="Pulse Radar" n={3}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      {[0, 0.6, 1.2].map((delay, i) => (
        <circle key={i} cx="36" cy="36" fill="none" stroke="#b00000" strokeWidth={1.5 - i * 0.3}>
          <animate attributeName="r" values="4;34" dur="1.8s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${0.9 - i * 0.2};0`} dur="1.8s" begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <Spider cx={36} cy={37} r1={4} r2={3} />
    </svg>
  </Box>
);

// 4. Orbit Spiders
const A4 = () => (
  <Box label="Orbit Spiders" n={4}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="22" fill="none" stroke="#b00000" strokeWidth=".5" opacity=".25" />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#b00000" strokeWidth=".5" opacity=".2" />
      <circle cx="36" cy="36" r="5" fill="#b00000" opacity=".8" />
      <g style={{ transformOrigin: "36px 36px", animation: "spin 2s linear infinite" }}>
        <circle cx="58" cy="36" r="4" fill="#b00000" />
        <circle cx="56.5" cy="35" r="1" fill="white" />
        <circle cx="59.5" cy="35" r="1" fill="white" />
      </g>
      <g style={{ transformOrigin: "36px 36px", animation: "spinR 3s linear infinite" }}>
        <circle cx="21" cy="36" r="3" fill="#8b0000" opacity=".8" />
      </g>
      <g style={{ transformOrigin: "36px 36px", animation: "spin 4s linear infinite" }}>
        <circle cx="36" cy="14" r="2.5" fill="#b00000" opacity=".6" />
      </g>
    </svg>
  </Box>
);

// 5. Leg Wave
const A5 = () => (
  <Box label="Leg Wave" n={5}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      <ellipse cx="36" cy="40" rx="6" ry="7.5" fill="#b00000" />
      <circle cx="36" cy="30" r="5" fill="#8b0000" />
      <circle cx="34" cy="29" r="1.3" fill="white" />
      <circle cx="38" cy="29" r="1.3" fill="white" />
      {[[31, 36, "22 30 16 25", "0s"], [31, 39, "21 38 15 38", "0.1s"], [31, 42, "22 46 16 51", "0.2s"], [31, 45, "23 51 18 57", "0.3s"]].map(([x, y, q, d], i) => (
        <path key={i} d={`M${x} ${y} Q${q}`} stroke="#b00000" strokeWidth="1.3" fill="none" strokeLinecap="round"
          style={{ transformOrigin: `${x}px ${y}px`, animation: `legWave 0.5s ease-in-out ${d} infinite alternate` }} />
      ))}
      {[[41, 36, "50 30 56 25", "0.05s"], [41, 39, "51 38 57 38", "0.15s"], [41, 42, "50 46 56 51", "0.25s"], [41, 45, "49 51 54 57", "0.35s"]].map(([x, y, q, d], i) => (
        <path key={i} d={`M${x} ${y} Q${q}`} stroke="#b00000" strokeWidth="1.3" fill="none" strokeLinecap="round"
          style={{ transformOrigin: `${x}px ${y}px`, animation: `legWave 0.5s ease-in-out ${d} infinite alternate-reverse` }} />
      ))}
    </svg>
  </Box>
);

// 6. Web Weave
const A6 = () => (
  <Box label="Web Weave" n={6}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      {[[36, 2, 36, 70], [2, 36, 70, 36], [8, 8, 64, 64], [64, 8, 8, 64]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b00000" strokeWidth=".7" opacity=".3" />
      ))}
      {[["36,8 64,22 64,50 36,64 8,50 8,22", 200, 0], ["36,18 56,28 56,44 36,54 16,44 16,28", 160, 0.4], ["36,26 50,32 50,40 36,46 22,40 22,32", 100, 0.8]].map(([pts, dash, delay], i) => (
        <polygon key={i} points={pts} fill="none" stroke="#b00000" strokeWidth="1" strokeDasharray={dash} opacity={0.7 - i * 0.15}>
          <animate attributeName="stroke-dashoffset" values={`${dash};0;${dash}`} dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
        </polygon>
      ))}
      <circle cx="36" cy="36" r="4" fill="#b00000" />
    </svg>
  </Box>
);

// 7. Crawling
const A7 = () => (
  <Box label="Crawl" n={7}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      {[36, 20, 52].map((y, i) => <line key={i} x1="4" y1={y} x2="68" y2={y} stroke="#b00000" strokeWidth=".6" opacity=".2" />)}
      <line x1="36" y1="4" x2="36" y2="68" stroke="#b00000" strokeWidth=".6" opacity=".2" />
      <g style={{ animation: "crawl 2s ease-in-out infinite alternate" }}>
        <Spider cx={36} cy={37} r1={5.5} r2={4} />
      </g>
    </svg>
  </Box>
);

// 8. Dual Arc Spinner
const A8 = () => (
  <Box label="Arc Spinner" n={8}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r="30" fill="none" stroke="#b00000" strokeWidth="2" strokeDasharray="60 130" strokeLinecap="round" style={{ animation: "spin 1.2s linear infinite" }} />
      <circle cx="36" cy="36" r="22" fill="none" stroke="#b00000" strokeWidth="1.5" strokeDasharray="40 100" strokeLinecap="round" opacity=".6" style={{ animation: "spinR 1.8s linear infinite" }} />
      <circle cx="36" cy="36" r="14" fill="none" stroke="#b00000" strokeWidth="1" strokeDasharray="25 64" strokeLinecap="round" opacity=".4" style={{ animation: "spin 2.4s linear infinite" }} />
      <Spider cx={36} cy={37} r1={4} r2={3} />
    </svg>
  </Box>
);

// 9. Dot Trail
const A9 = () => (
  <Box label="Dot Trail" n={9}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      <g style={{ transformOrigin: "36px 36px", animation: "spin 1.6s linear infinite" }}>
        {[[62, 36, 5, 1], [56, 20, 4, .7], [44, 10, 3, .5], [36, 6, 2.5, .35], [22, 8, 2, .2], [12, 18, 1.5, .1]].map(([x, y, r, o], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#b00000" opacity={o} />
        ))}
      </g>
      <Spider cx={36} cy={37} r1={4.5} r2={3.5} />
    </svg>
  </Box>
);

// 10. Web Builder
const A10 = () => (
  <Box label="Web Builder" n={10}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      {[[36, 4, 36, 68], [4, 36, 68, 36], [10, 10, 62, 62], [62, 10, 10, 62]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b00000" strokeWidth=".7" opacity=".3" />
      ))}
      {[[28, 176, 0], [20, 126, 0.3], [12, 76, 0.6]].map(([r, dash, delay], i) => (
        <circle key={i} cx="36" cy="36" r={r} fill="none" stroke="#b00000" strokeWidth={1.1 - i * 0.1} strokeDasharray={dash} strokeLinecap="round" opacity={0.7 - i * 0.15}>
          <animate attributeName="stroke-dashoffset" values={`${dash};0`} dur="1.4s" begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <circle cx="36" cy="36" r="4.5" fill="#b00000" />
    </svg>
  </Box>
);

// 11. Pendulum Swing
const A11 = () => (
  <Box label="Pendulum Swing" n={11}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      <line x1="36" y1="0" x2="36" y2="10" stroke="#b00000" strokeWidth=".9" opacity=".5" />
      <g style={{ transformOrigin: "36px 10px", animation: "swing 1.8s ease-in-out infinite" }}>
        <line x1="36" y1="10" x2="36" y2="30" stroke="#b00000" strokeWidth=".9" strokeDasharray="3,2" opacity=".4" />
        <Spider cx={36} cy={40} r1={5.5} r2={4} />
      </g>
    </svg>
  </Box>
);

// 12. Heartbeat Web
const A12 = () => (
  <Box label="Heartbeat Web" n={12}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <line key={i} x1="36" y1="36" x2={36 + 32 * Math.cos(r)} y2={36 + 32 * Math.sin(r)} stroke="#b00000" strokeWidth=".8" opacity=".4" />;
      })}
      {[["36,10 60,23 60,49 36,62 12,49 12,23", .5], ["36,18 54,27 54,45 36,54 18,45 18,27", .4], ["36,25 48,31 48,41 36,47 24,41 24,31", .3]].map(([pts, o], i) => (
        <polygon key={i} points={pts} fill="none" stroke="#b00000" strokeWidth=".9" opacity={o} />
      ))}
      <circle cx="36" cy="36" r="5" fill="#b00000">
        <animate attributeName="r" values="5;8;5" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="36" cy="36" r="2" fill="white" />
    </svg>
  </Box>
);

// 13. Morph Body
const A13 = () => (
  <Box label="Morph Body" n={13}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      <ellipse cx="36" cy="40" rx="6" ry="8" fill="#b00000">
        <animate attributeName="rx" values="6;9;6" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="ry" values="8;5;8" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      <circle cx="36" cy="30" r="5" fill="#8b0000">
        <animate attributeName="r" values="5;6.5;5" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="34.2" cy="29" r="1.2" fill="white" />
      <circle cx="37.8" cy="29" r="1.2" fill="white" />
      {[[31, 35, "22 29 16 24"], [31, 38, "21 37 15 37"], [31, 41, "22 45 16 49"], [31, 44, "23 50 18 55"]].map(([x, y, q], i) => (
        <path key={i} d={`M${x} ${y} Q${q}`} stroke="#b00000" strokeWidth="1.2" fill="none" strokeLinecap="round"
          style={{ transformOrigin: `${x}px ${y}px`, animation: `legWave 0.6s ease-in-out ${i * 0.1}s infinite alternate` }} />
      ))}
      {[[41, 35, "50 29 56 24"], [41, 38, "51 37 57 37"], [41, 41, "50 45 56 49"], [41, 44, "49 50 54 55"]].map(([x, y, q], i) => (
        <path key={i} d={`M${x} ${y} Q${q}`} stroke="#b00000" strokeWidth="1.2" fill="none" strokeLinecap="round"
          style={{ transformOrigin: `${x}px ${y}px`, animation: `legWave 0.6s ease-in-out ${i * 0.1}s infinite alternate-reverse` }} />
      ))}
    </svg>
  </Box>
);

// 14. Shockwave
const A14 = () => (
  <Box label="Shockwave" n={14}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      {[0, 0.5, 1, 1.5].map((delay, i) => (
        <circle key={i} cx="36" cy="36" fill="none" stroke="#b00000" strokeWidth={1.5 - i * 0.2}>
          <animate attributeName="r" values="0;34" dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${0.9 - i * 0.2};0`} dur="2s" begin={`${delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <Spider cx={36} cy={37} r1={4.5} r2={3.5} />
    </svg>
  </Box>
);

// 15. Bouncing
const A15 = () => (
  <Box label="Bouncing" n={15}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      <line x1="36" y1="0" x2="36" y2="14" stroke="#b00000" strokeWidth=".8" strokeDasharray="3,2" opacity=".35" />
      <ellipse cx="36" cy="66" rx="10" ry="2.5" fill="#b00000" opacity=".15">
        <animate attributeName="rx" values="10;5;10" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".2;.05;.2" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      <g style={{ animation: "bob 1.2s ease-in-out infinite" }}>
        <line x1="36" y1="0" x2="36" y2="22" stroke="#b00000" strokeWidth=".8" strokeDasharray="3,2" opacity=".3" />
        <Spider cx={36} cy={33} r1={5.5} r2={4} />
      </g>
    </svg>
  </Box>
);

// 16. Eye Blink
const A16 = () => (
  <Box label="Eye Blink" n={16}>
    <svg width="72" height="72" viewBox="0 0 72 72">
      {[[36, 4, 36, 68], [4, 36, 68, 36], [10, 10, 62, 62], [62, 10, 10, 62]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b00000" strokeWidth=".5" opacity=".18" />
      ))}
      <circle cx="36" cy="36" r="24" fill="none" stroke="#b00000" strokeWidth=".6" opacity=".2" />
      <ellipse cx="36" cy="41" rx="10" ry="12" fill="#b00000" />
      <circle cx="36" cy="26" r="8" fill="#8b0000" />
      <circle cx="32" cy="25" r="2.8" fill="white" />
      <circle cx="40" cy="25" r="2.8" fill="white" />
      <ellipse cx="32" cy="25" rx="1.4" ry="1.4" fill="#1a0000">
        <animate attributeName="ry" values="1.4;0.1;1.4" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="40" cy="25" rx="1.4" ry="1.4" fill="#1a0000">
        <animate attributeName="ry" values="1.4;0.1;1.4" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {[[27, 36, "18 31 12 26"], [27, 40, "17 39 11 39"], [27, 44, "18 48 12 52"],
        [45, 36, "54 31 60 26"], [45, 40, "55 39 61 39"], [45, 44, "54 48 60 52"]].map(([x, y, q], i) => (
        <path key={i} d={`M${x} ${y} Q${q}`} stroke="#b00000" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ))}
    </svg>
  </Box>
);

const Animation = ({ onDone }) => {
  const [selected, setSelected] = useState(null);

  const pick = (n) => { setSelected(n); setTimeout(() => onDone?.(), 2500); };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#050505",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "20px", overflowY: "auto",
    }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          <span style={{ color: "#fff" }}>SMART</span><span style={{ color: "#b00000" }}>SPIDER</span>
        </h1>
        <p style={{ fontSize: 10, color: "#4b5563", margin: 0, letterSpacing: "0.1em" }}>CHOOSE LOADING ANIMATION</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 148px)", gap: 10 }}>
        {[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,A14,A15,A16].map((Comp, i) => (
          <div key={i} onClick={() => pick(i + 1)}><Comp /></div>
        ))}
      </div>

      {selected && (
        <p style={{ marginTop: 16, fontSize: 11, color: "#b00000", letterSpacing: "0.06em" }}>
          Animation #{String(selected).padStart(2,"0")} selected — loading...
        </p>
      )}

      <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes spinR { from{transform:rotate(360deg)} to{transform:rotate(0)} }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes crawl { 0%{transform:translateX(-28px)} 100%{transform:translateX(28px)} }
        @keyframes swing { 0%,100%{transform:rotate(-25deg)} 50%{transform:rotate(25deg)} }
        @keyframes legWave { 0%{transform:rotate(0deg)} 100%{transform:rotate(18deg)} }
        @keyframes drop { 0%,100%{transform:translateY(0)} 45%,55%{transform:translateY(30px)} }
      `}</style>
    </div>
  );
};

export default Animation;