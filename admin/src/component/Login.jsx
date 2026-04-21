import React, { useState } from "react";
import {
  FaUserCircle,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const SpiderWeb = () => (
  <svg
    viewBox="0 0 500 500"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%" }}
  >
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x2 = 250 + 260 * Math.cos(rad);
      const y2 = 250 + 260 * Math.sin(rad);
      return (
        <line key={i} x1="250" y1="250" x2={x2} y2={y2}
          stroke="rgba(180,10,10,0.55)" strokeWidth="0.9" />
      );
    })}

    {[40, 80, 120, 160, 200, 240].map((r, ri) => {
      const points = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return `${250 + r * Math.cos(rad)},${250 + r * Math.sin(rad)}`;
      });
      return (
        <polygon key={ri} points={points.join(" ")} fill="none"
          stroke="rgba(180,10,10,0.45)" strokeWidth="0.9" />
      );
    })}

    <ellipse cx="250" cy="248" rx="10" ry="13" fill="rgba(180,10,10,0.75)" />
    <circle cx="250" cy="232" r="7" fill="rgba(160,8,8,0.75)" />
    <circle cx="247" cy="230" r="1.5" fill="rgba(255,255,255,0.8)" />
    <circle cx="253" cy="230" r="1.5" fill="rgba(255,255,255,0.8)" />

    <path d="M243 238 Q220 228 205 218" stroke="rgba(180,10,10,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M242 243 Q218 238 200 232" stroke="rgba(180,10,10,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M241 249 Q217 250 200 248" stroke="rgba(180,10,10,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M241 254 Q218 260 202 265" stroke="rgba(180,10,10,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>

    <path d="M257 238 Q280 228 295 218" stroke="rgba(180,10,10,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M258 243 Q282 238 300 232" stroke="rgba(180,10,10,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M259 249 Q283 250 300 248" stroke="rgba(180,10,10,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M259 254 Q282 260 298 265" stroke="rgba(180,10,10,0.7)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>

    <line x1="250" y1="0" x2="250" y2="225"
      stroke="rgba(180,10,10,0.35)" strokeWidth="0.9" strokeDasharray="4,3" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans">

      {/* Spider web — center */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60 pointer-events-none">
        <div style={{ width: "700px", height: "700px" }}>
          <SpiderWeb />
        </div>
      </div>

      {/* Corner web — top left */}
      <div className="absolute top-0 left-0 opacity-50 pointer-events-none"
        style={{ width: "280px", height: "280px", transform: "rotate(135deg)" }}>
        <SpiderWeb />
      </div>

      {/* Corner web — bottom right */}
      <div className="absolute bottom-0 right-0 opacity-40 pointer-events-none"
        style={{ width: "240px", height: "240px", transform: "rotate(-45deg)" }}>
        <SpiderWeb />
      </div>

      {/* Deep red glow blobs */}
      <div className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(150,5,5,0.22) 0%, transparent 70%)", top: "-80px", left: "-80px" }} />
      <div className="absolute w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(130,5,5,0.15) 0%, transparent 70%)", bottom: "-50px", right: "-50px" }} />

      {/* Card */}
      <div className="relative w-[400px] bg-[#111111] border border-[#1f1f1f] rounded-xl shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 0 60px rgba(150,5,5,0.15), 0 30px 60px rgba(0,0,0,0.8)" }}>

        {/* Top red bar */}
        <div className="h-[3px]" style={{ background: "#b00000" }} />

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#1f1f1f] flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold leading-tight">
              <span className="text-white">Smart</span>
              <span style={{ color: "#b00000" }}>Spider</span>
            </h1>
            <p className="text-[11px] text-gray-600 tracking-wide">
              Inventory System
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#1f1f1f]"
            style={{ background: "rgba(150,5,5,0.12)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#b00000" }} />
            <span className="text-[10px] font-semibold tracking-wider" style={{ color: "#cc2222" }}>
              LIVE
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Admin info */}
          <div className="flex items-center gap-3 mb-6">
            <FaUserCircle className="text-4xl text-gray-400" />
            <div>
              <p className="text-white font-semibold text-sm">Admin</p>
              <p className="text-gray-600 text-xs">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-[11px] text-gray-600 font-semibold tracking-wider">
                EMAIL ADDRESS
              </label>
              <div className="relative mt-1">
                <FaEnvelope className="absolute left-3 top-3 text-gray-600 text-sm" />
                <input
                  type="email"
                  placeholder="admin@smartspider.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-white text-sm outline-none transition rounded-lg"
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1f1f1f",
                  }}
                  onFocus={e => e.target.style.borderColor = "#b00000"}
                  onBlur={e => e.target.style.borderColor = "#1f1f1f"}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] text-gray-600 font-semibold tracking-wider">
                PASSWORD
              </label>
              <div className="relative mt-1">
                <FaLock className="absolute left-3 top-3 text-gray-600 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-white text-sm outline-none transition rounded-lg"
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1f1f1f",
                  }}
                  onFocus={e => e.target.style.borderColor = "#b00000"}
                  onBlur={e => e.target.style.borderColor = "#1f1f1f"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input type="checkbox" style={{ accentColor: "#b00000" }} />
                Remember me
              </label>
              <a href="#" className="hover:underline" style={{ color: "#b00000" }}>
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition flex items-center justify-center gap-2"
              style={{ background: loading ? "#6b0000" : "#b00000" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#8b0000"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#b00000"; }}
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>

          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1f1f1f] px-6 py-3 flex justify-center text-[11px] text-gray-700">
          <p>© 2026 SmartSpider. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;