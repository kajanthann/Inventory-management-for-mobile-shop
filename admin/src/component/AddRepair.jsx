import React, { useState } from "react";
import { FaTools } from "react-icons/fa";

const AddRepairModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    device: "",
    imei: "",
    phone: "",
    date: "",
    fault: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      {/* Modal box */}
      <div className="w-full max-w-lg bg-[#111] border border-[#1f1f1f] rounded-xl p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <FaTools className="text-red-600 text-lg" />
          <h2 className="text-lg font-semibold">Add Repair</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="device"
            placeholder="Device Name"
            onChange={handleChange}
            required
            className="input"
          />

          <input
            name="imei"
            placeholder="IMEI Number"
            onChange={handleChange}
            required
            className="input"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="input"
          />

          <input
            type="date"
            name="date"
            onChange={handleChange}
            required
            className="input"
          />

          <textarea
            name="fault"
            placeholder="Fault / Description"
            onChange={handleChange}
            required
            className="input h-20"
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>

      {/* Tailwind reusable input */}
      <style>{`
        .input {
          width: 100%;
          padding: 10px;
          background: #0a0a0a;
          border: 1px solid #1f1f1f;
          border-radius: 8px;
          font-size: 13px;
          color: white;
          outline: none;
        }
        .input:focus {
          border-color: #b00000;
        }
      `}</style>
    </div>
  );
};

export default AddRepairModal;