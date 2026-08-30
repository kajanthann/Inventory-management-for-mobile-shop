import React, { useState, useContext } from "react";
import { FaTrash, FaTimes, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const ConfirmDeleteModal = ({ open, title, message, onConfirm, onCancel }) => {
  const { verifyAdminPassword } = useContext(AppContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

const handleConfirm = (e) => {
  e.preventDefault();

  if (!password.trim()) {
    setError("Please enter your password.");
    return;
  }

  if (!verifyAdminPassword(password)) {
    setError("Incorrect password.");
    return;
  }

  setPassword("");
  setError("");
  setShowPassword(false);
  onConfirm();
};

  const handleCancel = () => {
    setPassword("");
    setError("");
    setShowPassword(false);
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
      <div className="w-[380px] max-w-[95vw] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
        <div className="h-[3px] bg-[#b00000]" />

        <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaTrash className="text-[#b00000]" size={13} />
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
              {title || "Confirm Delete"}
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-5 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message ||
              "This action cannot be undone. Enter the admin password to confirm deletion."}
          </p>

          <div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                className="w-full pl-8 pr-9 py-2 rounded-lg text-sm border bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                tabIndex={-1}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 rounded-lg text-sm border border-gray-300 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;