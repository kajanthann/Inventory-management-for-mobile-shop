import React, { useContext } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "./component/SideBar";
import Login from "./component/Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Repair from "./pages/Repair";
import Sales from "./pages/Sales";
import { AppContext } from "./context/AppContext";
import Animation from "./pages/Animation";

const SpiderWeb = ({ opacity = 0.25, rotate = 0 }) => (
  <svg
    viewBox="0 0 500 500"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%", transform: `rotate(${rotate}deg)` }}
  >
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x2 = 250 + 260 * Math.cos(rad);
      const y2 = 250 + 260 * Math.sin(rad);
      return (
        <line key={i} x1="250" y1="250" x2={x2} y2={y2}
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

const seededRand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const generateSpiders = (count = 13) => {
  const rand = seededRand(42);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${5 + rand() * 85}%`,
    left: `${3 + rand() * 90}%`,
    size: 120 + rand() * 220,
    rotate: Math.floor(rand() * 360),
    opacity: 0.08 + rand() * 0.9,
  }));
};

const SPIDERS = generateSpiders(13);

// ── Layout with sidebar ──
const AppLayout = () => {
  const { theme } = useContext(AppContext);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#121212] text-gray-900 dark:text-white transition-colors duration-300">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 dark:bg-[#0f0f0f] p-6 overflow-auto relative transition-colors duration-300">

        {/* Spider web background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {SPIDERS.map(({ id, top, left, size, rotate, opacity }) => (
            <div
              key={id}
              style={{
                position: "absolute",
                top, left,
                width: `${size}px`,
                height: `${size}px`,
                transform: "translate(-50%, -50%)",
                // spiders are subtler in light mode
                opacity: theme === "dark" ? opacity : opacity * 0.5,
              }}
            >
              <SpiderWeb rotate={rotate} opacity={1} />
            </div>
          ))}

          {/* red glow blobs — subtler in light mode */}
          <div style={{
            position: "absolute", top: "10%", right: "15%",
            width: 250, height: 250, borderRadius: "50%",
            background: theme === "dark" ? "rgba(180,10,10,0.06)" : "rgba(180,10,10,0.03)",
            filter: "blur(55px)",
          }} />
          <div style={{
            position: "absolute", bottom: "15%", left: "20%",
            width: 180, height: 180, borderRadius: "50%",
            background: theme === "dark" ? "rgba(180,10,10,0.04)" : "rgba(180,10,10,0.02)",
            filter: "blur(45px)",
          }} />
        </div>

        {/* Page content */}
        <div className="relative z-10 mt-1">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales"     element={<Sales />} />
            <Route path="/repair"    element={<Repair />} />
            <Route path="/animation" element={<Animation />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

// ── Root App ──
const App = () => {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/"      element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*"     element={<AppLayout />} />
      </Routes>
    </div>
  );
};

export default App;