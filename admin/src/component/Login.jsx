import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle, FaLock, FaEnvelope,
  FaEye, FaEyeSlash, FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext"; // adjust path if needed

// ── Spider Web SVG ──────────────────────────────────────────────
const SpiderWeb = () => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      return <line key={i} x1="250" y1="250" x2={250 + 260 * Math.cos(rad)} y2={250 + 260 * Math.sin(rad)} stroke="rgba(180,10,10,0.55)" strokeWidth="0.9" />;
    })}
    {[40,80,120,160,200,240].map((r, ri) => {
      const points = [0,30,60,90,120,150,180,210,240,270,300,330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return `${250 + r * Math.cos(rad)},${250 + r * Math.sin(rad)}`;
      });
      return <polygon key={ri} points={points.join(" ")} fill="none" stroke="rgba(180,10,10,0.45)" strokeWidth="0.9" />;
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
    <line x1="250" y1="0" x2="250" y2="225" stroke="rgba(180,10,10,0.35)" strokeWidth="0.9" strokeDasharray="4,3" />
  </svg>
);

// ── Shared background decoration ────────────────────────────────
const Bg = () => (
  <>
    <div className="absolute inset-0 flex items-center justify-center opacity-60 pointer-events-none">
      <div style={{ width: "700px", height: "700px" }}><SpiderWeb /></div>
    </div>
    <div className="absolute top-0 left-0 opacity-50 pointer-events-none" style={{ width: "280px", height: "280px", transform: "rotate(135deg)" }}>
      <SpiderWeb />
    </div>
    <div className="absolute bottom-0 right-0 opacity-40 pointer-events-none" style={{ width: "240px", height: "240px", transform: "rotate(-45deg)" }}>
      <SpiderWeb />
    </div>
    <div className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle, rgba(150,5,5,0.22) 0%, transparent 70%)", top: "-80px", left: "-80px" }} />
    <div className="absolute w-[260px] h-[260px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle, rgba(130,5,5,0.15) 0%, transparent 70%)", bottom: "-50px", right: "-50px" }} />
  </>
);

// ── Shared styles ────────────────────────────────────────────────
const cardStyle = {
  boxShadow: "0 0 60px rgba(150,5,5,0.15), 0 30px 60px rgba(0,0,0,0.8)",
};
const inputStyle = {
  background: "#0a0a0a",
  border: "1px solid #1f1f1f",
};

// ── Toast helpers ────────────────────────────────────────────────
const toastStyle = {
  background: "#1a1a1a",
  color: "#fff",
  border: "1px solid #2a2a2a",
  borderRadius: "10px",
  fontSize: "13px",
};

const successToast = (msg) =>
  toast.success(msg, {
    style: { ...toastStyle, borderLeft: "3px solid #22c55e" },
    iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" },
  });

const errorToast = (msg) =>
  toast.error(msg, {
    style: { ...toastStyle, borderLeft: "3px solid #b00000" },
    iconTheme: { primary: "#b00000", secondary: "#1a1a1a" },
  });

const infoToast = (msg) =>
  toast(msg, {
    icon: "📨",
    style: { ...toastStyle, borderLeft: "3px solid #3b82f6" },
  });

// ════════════════════════════════════════════════════════════════
const Login = () => {
  const { setAtoken, axiosInstance } = useContext(AppContext);
  const navigate = useNavigate();

  // Step 1
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);

  // Step 2
  const [step, setStep]               = useState("login"); // "login" | "otp"
  const [otp, setOtp]                 = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError]       = useState("");
  const [otpLoading, setOtpLoading]   = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend]     = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (step !== "otp") return;
    setResendTimer(30);
    setCanResend(false);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // ── Step 1: send credentials → request OTP ──────────────────
  const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password) return;

  setLoading(true);

  const toastId = toast.loading("Sending OTP...", { style: toastStyle });

  try {
    const { data } = await axiosInstance.post("/api/admin/login", {
      email,
      password,
    });

    toast.dismiss(toastId);
    infoToast(data.message || "OTP sent successfully");

    setStep("otp");
  } catch (err) {
    toast.dismiss(toastId);
    errorToast(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  // ── OTP input helpers ────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5)
      inputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // ── Step 2: verify OTP ───────────────────────────────────────
  const handleVerifyOtp = async (e) => {
  e.preventDefault();

  const entered = otp.join("");

  if (entered.length < 6) {
    setOtpError("Please enter all 6 digits.");
    return;
  }

  setOtpLoading(true);

  const toastId = toast.loading("Verifying OTP...", {
    style: toastStyle,
  });

  try {
    const { data } = await axiosInstance.post(
      "/api/admin/verify-otp",
      {
        email,
        otp: entered,
      }
    );

    toast.dismiss(toastId);
    successToast("Login successful");

    // ✅ save token
    setAtoken(data.token);
    localStorage.setItem("aToken", data.token);

    navigate("/dashboard");
  } catch (err) {
    toast.dismiss(toastId);

    const msg = err.response?.data?.message || "Invalid OTP";
    errorToast(msg);

    setOtpError(msg);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  } finally {
    setOtpLoading(false);
  }
};

  // ── Resend OTP ───────────────────────────────────────────────
const handleResend = async () => {
  if (!canResend) return;

  const toastId = toast.loading("Resending OTP...", {
    style: toastStyle,
  });

  try {
    const { data } = await axiosInstance.post("/api/admin/login", {
      email,
      password,
    });

    toast.dismiss(toastId);
    infoToast(data.message || "OTP resent");
  } catch (err) {
    toast.dismiss(toastId);
    errorToast("Failed to resend OTP");
  }

  setResendTimer(30);
  setCanResend(false);
};

  // ── Shared card header ───────────────────────────────────────
  const CardHeader = () => (
    <div className="px-6 py-5 border-b border-[#1f1f1f] flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold leading-tight">
          <span className="text-white">Smart</span>
          <span className="text-[#b00000]">Spider</span>
        </h1>
        <p className="text-[11px] text-gray-600 tracking-wide">Inventory System</p>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#1f1f1f]"
        style={{ background: "rgba(150,5,5,0.12)" }}>
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#b00000" }} />
        <span className="text-[10px] font-semibold tracking-wider" style={{ color: "#cc2222" }}>LIVE</span>
      </div>
    </div>
  );

  const CardFooter = () => (
    <div className="border-t border-[#1f1f1f] px-6 py-3 flex justify-center text-[11px] text-gray-700">
      <p>© 2026 SmartSpider. All rights reserved.</p>
    </div>
  );

  // ════════════════════════════
  // STEP 1 — Login form
  // ════════════════════════════
  if (step === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
        <Bg />
        <div className="relative w-[400px] bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden" style={cardStyle}>
          <div className="h-[3px]" style={{ background: "#b00000" }} />
          <CardHeader />

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaUserCircle className="text-4xl text-gray-400" />
              <div>
                <p className="text-white font-semibold text-sm">Admin</p>
                <p className="text-gray-600 text-xs">Sign in to your account</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-[11px] text-gray-600 font-semibold tracking-wider">
                  EMAIL ADDRESS
                </label>
                <div className="relative mt-1">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-600 text-sm" />
                  <input
                    type="email" required
                    placeholder="admin@smartspider.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-white text-sm outline-none transition rounded-lg"
                    style={inputStyle}
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
                    type={showPassword ? "text" : "password"} required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-white text-sm outline-none transition rounded-lg"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#b00000"}
                    onBlur={e => e.target.style.borderColor = "#1f1f1f"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-600">
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

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition flex items-center justify-center gap-2"
                style={{ background: loading ? "#6b0000" : "#b00000" }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#8b0000"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#b00000"; }}
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : "Continue →"}
              </button>
            </form>
          </div>
          <CardFooter />
        </div>
      </div>
    );
  }

  // ════════════════════════════
  // STEP 2 — OTP verification
  // ════════════════════════════
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      <Bg />
      <div className="relative w-[400px] bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden" style={cardStyle}>
        <div className="h-[3px]" style={{ background: "#b00000" }} />
        <CardHeader />

        <div className="p-6">
          {/* Icon + info */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: "rgba(176,0,0,0.12)", border: "1px solid rgba(176,0,0,0.25)" }}>
              <FaShieldAlt style={{ color: "#b00000", fontSize: "22px" }} />
            </div>
            <p className="text-white font-semibold text-sm">Two-Factor Verification</p>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">
              A 6-digit OTP was sent to<br />
              <span style={{ color: "#b00000" }}>{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* OTP boxes */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="text-center text-xl font-bold text-white outline-none rounded-lg transition"
                  style={{
                    width: "48px",
                    height: "56px",
                    background: digit ? "rgba(176,0,0,0.1)" : "#0a0a0a",
                    border: `2px solid ${digit ? "#b00000" : otpError ? "#7f0000" : "#1f1f1f"}`,
                    caretColor: "#b00000",
                  }}
                  onFocus={e => e.target.style.borderColor = "#b00000"}
                  onBlur={e => {
                    if (!otp[index]) e.target.style.borderColor = otpError ? "#7f0000" : "#1f1f1f";
                  }}
                />
              ))}
            </div>

            {/* Error */}
            {otpError && (
              <p className="text-center text-xs" style={{ color: "#ef4444" }}>{otpError}</p>
            )}

            {/* Verify */}
            <button
              type="submit" disabled={otpLoading}
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition flex items-center justify-center gap-2"
              style={{ background: otpLoading ? "#6b0000" : "#b00000" }}
              onMouseEnter={e => { if (!otpLoading) e.currentTarget.style.background = "#8b0000"; }}
              onMouseLeave={e => { if (!otpLoading) e.currentTarget.style.background = "#b00000"; }}
            >
              {otpLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : "Verify & Sign In"}
            </button>

            {/* Resend + back */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => { setStep("login"); setOtp(["","","","","",""]); setOtpError(""); }}
                className="text-gray-600 hover:text-gray-400 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className="transition"
                style={{ color: canResend ? "#b00000" : "#444", cursor: canResend ? "pointer" : "default" }}
              >
                {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </form>
        </div>
        <CardFooter />
      </div>
    </div>
  );
};

export default Login;