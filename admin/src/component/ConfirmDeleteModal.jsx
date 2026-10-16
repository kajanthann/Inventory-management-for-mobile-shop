import React, { useState, useContext } from "react";
import {
  FaTrash, FaEdit, FaTimes, FaLock, FaEye, FaEyeSlash,
} from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const toastStyle = {
  background: "#1a1a1a", color: "#fff",
  border: "1px solid #2a2a2a", borderRadius: "10px", fontSize: "13px",
};

const ConfirmDeleteModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  actionLabel = "Delete",
  variant     = "delete",
  loading     = false,
}) => {
  const { axiosInstance } = useContext(AppContext);

  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [verifying, setVerifying]       = useState(false);

  if (!open) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!password.trim()) { setError("Please enter your password."); return; }
    setError("");

    if (variant === "edit") {
      // ── Verify password via backend before opening edit form ──
      setVerifying(true);
      try {
        const { data } = await axiosInstance.post("/api/admin/delete-password/verify", {
          password,
        });
        if (data.success) {
          // password correct → let parent open edit form
          setPassword(""); setShowPassword(false);
          onConfirm();
        } else {
          setError("Incorrect password. Try again.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed.");
      } finally {
        setVerifying(false);
      }
    } else {
      // ── Delete: pass password to parent (backend verifies via middleware) ──
      onConfirm(password);
    }
  };

  const handleCancel = () => {
    setPassword(""); setError(""); setShowPassword(false);
    onCancel();
  };

  const isEdit      = variant === "edit";
  const accentColor = isEdit ? "#b8860b" : "#b00000";
  const buttonBg    = isEdit
    ? "bg-yellow-600 hover:bg-yellow-700"
    : "bg-[#b00000] hover:bg-[#8b0000]";

  const isLoading = loading || verifying;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="w-[380px] max-w-[95vw] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
        <div className="h-[3px]" style={{ background: accentColor }} />

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEdit
              ? <FaEdit style={{ color: accentColor }} size={13} />
              : <FaTrash style={{ color: accentColor }} size={13} />}
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
              {title || (isEdit ? "Confirm Edit" : "Confirm Delete")}
            </h2>
          </div>
          <button onClick={handleCancel}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-5 space-y-4">
          {/* Message */}
          <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>

          {/* Password input */}
          <div>
            <label className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1.5">
              ADMIN DELETE PASSWORD
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter admin delete password"
                className="w-full pl-8 pr-9 py-2 rounded-lg text-sm border bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition"
              />
              <button type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                tabIndex={-1}>
                {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button type="button" onClick={handleCancel}
              className="flex-1 py-2 rounded-lg text-sm border border-gray-300 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white transition ${buttonBg} disabled:opacity-50 flex items-center justify-center gap-2`}>
              {isLoading ? (
                <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {verifying ? "Verifying..." : "Processing..."}</>
              ) : actionLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;