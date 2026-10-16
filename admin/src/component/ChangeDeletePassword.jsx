import React, { useState, useRef, useEffect, useContext } from "react";
import {
  FaLock, FaEye, FaEyeSlash, FaShieldAlt,
  FaKey, FaCheck, FaEnvelope,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const toastStyle = { background: "#1a1a1a", color: "#fff", border: "1px solid #2a2a2a", borderRadius: "10px", fontSize: "13px" };
const successToast = (m) => toast.success(m, { style: { ...toastStyle, borderLeft: "3px solid #22c55e" }, iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" } });
const errorToast   = (m) => toast.error(m,   { style: { ...toastStyle, borderLeft: "3px solid #b00000" }, iconTheme: { primary: "#b00000",  secondary: "#1a1a1a" } });

const inputCls = "w-full px-3 py-2.5 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600";
const cardCls  = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";

const ChangeDeletePassword = () => {
  const { axiosInstance } = useContext(AppContext);

  // ── Step: "form" | "otp" | "success" ────────────────────────
  const [step, setStep]               = useState("form");
  const [loading, setLoading]         = useState(false);
  const [otpLoading, setOtpLoading]   = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend]     = useState(false);

  // ── Form state ───────────────────────────────────────────────
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);

  // ── OTP state ────────────────────────────────────────────────
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const inputRefs               = useRef([]);

  // ── Countdown ────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "otp") return;
    setResendTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // ── Password strength ────────────────────────────────────────
  const strength = (() => {
    if (!newPassword) return null;
    let score = 0;
    if (newPassword.length >= 8)          score++;
    if (/[A-Z]/.test(newPassword))        score++;
    if (/[0-9]/.test(newPassword))        score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    if (score <= 1) return { label: "Weak",   color: "bg-red-500",    width: "w-1/4" };
    if (score === 2) return { label: "Fair",   color: "bg-amber-500",  width: "w-2/4" };
    if (score === 3) return { label: "Good",   color: "bg-blue-500",   width: "w-3/4" };
    return              { label: "Strong", color: "bg-green-500",  width: "w-full" };
  })();

  // ── Step 1: request OTP ──────────────────────────────────────
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return errorToast("Passwords do not match");
    if (newPassword.length < 6)          return errorToast("Password must be at least 6 characters");

    setLoading(true);
    const tid = toast.loading("Sending OTP to your email...", { style: toastStyle });
    try {
      const { data } = await axiosInstance.post("/api/admin/delete-password/request-otp");
      toast.dismiss(tid);
      if (data.success) {
        toast("OTP sent! Check your email 📨", { icon: "📨", style: { ...toastStyle, borderLeft: "3px solid #3b82f6" } });
        setStep("otp");
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else errorToast(data.message);
    } catch (err) {
      toast.dismiss(tid);
      errorToast(err.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
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
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); inputRefs.current[5]?.focus(); }
    e.preventDefault();
  };

  // ── Step 2: verify OTP + change password ────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const entered = otp.join("");
    if (entered.length < 6) { setOtpError("Please enter all 6 digits"); return; }

    setOtpLoading(true);
    const tid = toast.loading("Verifying OTP...", { style: toastStyle });
    try {
      const { data } = await axiosInstance.post("/api/admin/delete-password/change", {
        otp:             entered,
        newPassword,
        confirmPassword,
      });
      toast.dismiss(tid);
      if (data.success) {
        successToast("Delete password changed successfully!");
        setStep("success");
      } else {
        errorToast(data.message);
        setOtpError(data.message);
        if (data.message.includes("expired")) {
          setOtp(["", "", "", "", "", ""]);
          setStep("form");
        }
      }
    } catch (err) {
      toast.dismiss(tid);
      const msg = err.response?.data?.message || "Failed to change password";
      errorToast(msg);
      setOtpError(msg);
    } finally { setOtpLoading(false); }
  };

  // ── Resend OTP ───────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return;
    const tid = toast.loading("Resending OTP...", { style: toastStyle });
    try {
      const { data } = await axiosInstance.post("/api/admin/delete-password/request-otp");
      toast.dismiss(tid);
      if (data.success) toast("OTP resent! Check your email 📨", { icon: "📨", style: { ...toastStyle, borderLeft: "3px solid #3b82f6" } });
      else errorToast(data.message);
    } catch { toast.dismiss(tid); errorToast("Failed to resend OTP"); }
    setResendTimer(60); setCanResend(false); setOtp(["", "", "", "", "", ""]); setOtpError("");
  };

  // ════════════════════════════════════
  // STEP: SUCCESS
  // ════════════════════════════════════
  if (step === "success") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className={`${cardCls} w-full max-w-[400px] p-8 text-center`}>
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-green-500" size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Password Changed!</h2>
          <p className="text-sm text-gray-400 mb-6">Your admin delete password has been updated successfully.</p>
          <button onClick={() => { setStep("form"); setNewPassword(""); setConfirmPassword(""); setOtp(["","","","","",""]); setOtpError(""); }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition">
            Change Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto space-y-4">

      {/* Header */}
      <div className={`${cardCls} p-5`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(176,0,0,0.1)", border: "1px solid rgba(176,0,0,0.2)" }}>
            <FaKey style={{ color: "#b00000" }} size={16} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">Change Delete Password</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {step === "form" ? "Set a new admin delete password. An OTP will be sent to your email for verification." : "Enter the 6-digit OTP sent to your email."}
            </p>
          </div>
        </div>
      </div>

      {/* ════ STEP 1: Form ════ */}
      {step === "form" && (
        <div className={`${cardCls} p-5`}>
          <form onSubmit={handleRequestOtp} className="space-y-4">

            {/* New password */}
            <div>
              <label className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1.5">
                NEW DELETE PASSWORD *
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type={showNew ? "text" : "password"}
                  required
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={`${inputCls} pl-9 pr-9`}
                />
                <button type="button" onClick={() => setShowNew(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">
                  {showNew ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 block ${
                    strength.label === "Weak"   ? "text-red-500"   :
                    strength.label === "Fair"   ? "text-amber-500" :
                    strength.label === "Good"   ? "text-blue-500"  : "text-green-500"
                  }`}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1.5">
                CONFIRM PASSWORD *
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`${inputCls} pl-9 pr-9 ${
                    confirmPassword && newPassword !== confirmPassword
                      ? "border-red-500/50 focus:border-red-500"
                      : confirmPassword && newPassword === confirmPassword
                      ? "border-green-500/50 focus:border-green-500"
                      : ""
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition">
                  {showConfirm ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><FaCheck size={9} /> Passwords match</p>
              )}
            </div>

            {/* Info box */}
            <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15">
              <FaEnvelope className="text-blue-500 mt-0.5 flex-shrink-0" size={12} />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                An OTP will be sent to <strong>your admin email</strong> to confirm this change.
              </p>
            </div>

            <button type="submit" disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP...</> : "Send OTP →"}
            </button>
          </form>
        </div>
      )}

      {/* ════ STEP 2: OTP Verification ════ */}
      {step === "otp" && (
        <div className={`${cardCls} p-5`}>
          <form onSubmit={handleChangePassword} className="space-y-5">

            {/* Shield icon */}
            <div className="flex flex-col items-center text-center pb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ background: "rgba(176,0,0,0.1)", border: "1px solid rgba(176,0,0,0.2)" }}>
                <FaShieldAlt style={{ color: "#b00000" }} size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Verify Your Identity</p>
              <p className="text-xs text-gray-400 mt-1">Enter the 6-digit code sent to your admin email</p>
            </div>

            {/* OTP boxes */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="text-center text-xl font-bold text-gray-900 dark:text-white outline-none rounded-lg transition"
                  style={{
                    width: "48px", height: "56px",
                    background:   digit ? "rgba(176,0,0,0.08)" : "var(--input-bg, #f3f4f6)",
                    border:       `2px solid ${digit ? "#b00000" : otpError ? "#ef4444" : "#d1d5db"}`,
                    caretColor:   "#b00000",
                  }}
                  onFocus={e => e.target.style.borderColor = "#b00000"}
                  onBlur={e => { if (!otp[index]) e.target.style.borderColor = otpError ? "#ef4444" : "#d1d5db"; }}
                />
              ))}
            </div>

            {otpError && <p className="text-center text-xs text-red-500">{otpError}</p>}

            <button type="submit" disabled={otpLoading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition disabled:opacity-40 flex items-center justify-center gap-2">
              {otpLoading ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</> : "Confirm Change"}
            </button>

            {/* Resend + Back */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button type="button"
                onClick={() => { setStep("form"); setOtp(["","","","","",""]); setOtpError(""); }}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                ← Back
              </button>
              <button type="button" onClick={handleResend} disabled={!canResend}
                style={{ color: canResend ? "#b00000" : "#9ca3af", cursor: canResend ? "pointer" : "default" }}>
                {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChangeDeletePassword;