import React, { useState } from "react";
import {
  FaTools, FaPlus, FaTrash, FaCheck,
  FaSearch, FaTimes, FaEye, FaClock,
  FaDollarSign,
} from "react-icons/fa";

const initialRepairs = [
  { id: 1, device: "iPhone 11", imei: "352789101234567", phone: "0771234567", date: "2026-04-20", fault: "Screen damage", status: "pending", price: null },
  { id: 2, device: "Samsung S22", imei: "490123456789012", phone: "0751234567", date: "2026-04-20", fault: "Battery swollen", status: "pending", price: null },
  { id: 3, device: "iPhone 13", imei: "867512034912345", phone: "0741234567", date: "2026-04-24", fault: "Back glass broken", status: "done", price: 15000 },
  { id: 4, device: "Redmi Note 12", imei: "123098765432109", phone: "0731234567", date: "2026-04-29", fault: "Charging port issue", status: "pending", price: null },
];

const emptyForm = { device: "", imei: "", phone: "", fault: "" };

const Repair = () => {
  const [repairs, setRepairs] = useState(initialRepairs);
  const [open, setOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [priceModal, setPriceModal] = useState(null); // repair object
  const [priceInput, setPriceInput] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [filterPhone, setFilterPhone] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = repairs.filter((r) =>
    (filterPhone === "" || r.phone.includes(filterPhone)) &&
    (filterDate === "" || r.date === filterDate) &&
    (filterStatus === "" || r.status === filterStatus)
  );

  const pending = repairs.filter((r) => r.status === "pending").length;
  const done = repairs.filter((r) => r.status === "done").length;

  const handleAdd = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    setRepairs([{ ...form, id: Date.now(), date: today, status: "pending", price: null }, ...repairs]);
    setForm(emptyForm);
    setOpen(false);
  };

  const handleDelete = (id) => setRepairs(repairs.filter((r) => r.id !== id));

  // open price form
  const openPriceModal = (r) => {
    setPriceModal(r);
    setPriceInput("");
  };

  // submit price → mark done
  const handlePriceSubmit = (e) => {
    e.preventDefault();
    if (!priceInput) return;
    setRepairs(repairs.map((r) =>
      r.id === priceModal.id
        ? { ...r, status: "done", price: Number(priceInput) }
        : r
    ));
    setPriceModal(null);
    setPriceInput("");
  };

  return (
    <div className="text-white space-y-5">

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Jobs", value: repairs.length, color: "text-blue-400", border: "border-blue-500/20" },
          { label: "Pending", value: pending, color: "text-yellow-400", border: "border-yellow-500/20" },
          { label: "Completed", value: done, color: "text-green-400", border: "border-green-500/20" },
        ].map((s, i) => (
          <div key={i} className={`border ${s.border} rounded-xl p-4 backdrop-blur-sm`} style={{ background: "rgba(17,17,17,0.6)" }}>
            <div className={`text-xs font-semibold uppercase tracking-wider ${s.color} mb-2`}>{s.label}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              type="text"
              placeholder="Filter by phone..."
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
              style={{ background: "rgba(10,10,10,0.7)" }}
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-gray-400 outline-none focus:border-[#b00000] transition"
            style={{ background: "rgba(10,10,10,0.7)" }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-gray-400 outline-none focus:border-[#b00000] transition"
            style={{ background: "rgba(10,10,10,0.7)" }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          {(filterPhone || filterDate || filterStatus) && (
            <button
              onClick={() => { setFilterPhone(""); setFilterDate(""); setFilterStatus(""); }}
              className="text-gray-500 hover:text-white transition"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
          style={{ background: "#b00000" }}
          onMouseEnter={e => e.currentTarget.style.background = "#8b0000"}
          onMouseLeave={e => e.currentTarget.style.background = "#b00000"}
        >
          <FaPlus size={11} /> Add Repair
        </button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-[#1f1f1f] overflow-hidden" style={{ background: "rgba(17,17,17,0.6)", backdropFilter: "blur(8px)" }}>
        <div className="px-4 py-3 border-b border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <FaTools className="text-[#b00000]" size={13} /> Repair Jobs
          </div>
          <span className="text-xs text-gray-500">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-gray-500 uppercase tracking-wider border-b border-[#1f1f1f]">
                <th className="px-4 py-3 text-left">Device</th>
                <th className="px-4 py-3 text-left">IMEI</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Fault</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 text-gray-600">No repairs found</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-t border-[#1a1a1a] hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 font-medium text-white">{r.device}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.imei}</td>
                  <td className="px-4 py-3 text-gray-300">{r.phone}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.date}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-[180px] truncate">{r.fault}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 w-fit ${
                      r.status === "done"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                      {r.status === "done" ? <FaCheck size={9} /> : <FaClock size={9} />}
                      {r.status === "done" ? "Completed" : "Pending"}
                    </span>
                  </td>

                  {/* ── Actions: only Delete + Check/Eye ── */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">

                      {/* Check → opens price form | Eye → opens detail view */}
                      {r.status === "done" ? (
                        <button
                          onClick={() => setViewItem(r)}
                          className="p-1.5 rounded border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition"
                          title="View details"
                        >
                          <FaEye size={11} />
                        </button>
                      ) : (
                        <button
                          onClick={() => openPriceModal(r)}
                          className="p-1.5 rounded border border-green-500/20 text-green-400 hover:bg-green-500/10 transition"
                          title="Mark as done"
                        >
                          <FaCheck size={11} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition"
                        title="Delete"
                      >
                        <FaTrash size={11} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Modal ── */}
      {open && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[440px] rounded-xl border border-[#1f1f1f] overflow-hidden" style={{ background: "#111111" }}>
            <div className="px-5 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">Add Repair Job</h2>
                <p className="text-xs text-gray-500 mt-0.5">Date will be set to today automatically</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition"><FaTimes /></button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-3">
              <div>
                <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">DEVICE *</label>
                <input required placeholder="e.g. iPhone 13" value={form.device}
                  onChange={(e) => setForm({ ...form, device: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
                  style={{ background: "#0a0a0a" }} />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">IMEI *</label>
                <input required placeholder="15-digit IMEI" maxLength={15} value={form.imei}
                  onChange={(e) => setForm({ ...form, imei: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition font-mono"
                  style={{ background: "#0a0a0a" }} />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">PHONE *</label>
                <input required placeholder="07XXXXXXXX" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
                  style={{ background: "#0a0a0a" }} />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">FAULT / DESCRIPTION *</label>
                <textarea required rows="3" placeholder="Describe the issue..." value={form.fault}
                  onChange={(e) => setForm({ ...form, fault: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition resize-none"
                  style={{ background: "#0a0a0a" }} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-lg text-sm border border-[#1f1f1f] text-gray-400 hover:text-white transition">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition"
                  style={{ background: "#b00000" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#8b0000"}
                  onMouseLeave={e => e.currentTarget.style.background = "#b00000"}>
                  Save Repair
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Price Modal (shown when Check is clicked) ── */}
      {priceModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[380px] rounded-xl border border-[#1f1f1f] overflow-hidden" style={{ background: "#111111" }}>

            {/* Top red bar */}
            <div className="h-[3px]" style={{ background: "#b00000" }} />

            <div className="px-5 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">Complete Repair</h2>
                <p className="text-xs text-gray-500 mt-0.5">{priceModal.device} · {priceModal.phone}</p>
              </div>
              <button onClick={() => setPriceModal(null)} className="text-gray-500 hover:text-white transition">
                <FaTimes />
              </button>
            </div>

            {/* Repair summary */}
            <div className="px-5 pt-4 pb-2 space-y-2">
              {[
                ["Device", priceModal.device],
                ["IMEI", priceModal.imei],
                ["Fault", priceModal.fault],
                ["Date", priceModal.date],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-1 border-b border-[#1a1a1a]">
                  <span className="text-gray-500">{k}</span>
                  <span className="text-white font-medium font-mono">{v}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handlePriceSubmit} className="px-5 pb-5 pt-3 space-y-4">
              <div>
                <label className="text-[11px] text-gray-500 font-semibold tracking-wider block mb-1">
                  REPAIR CHARGE (Rs) *
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                  <input
                    required
                    type="number"
                    placeholder="Enter repair price"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-lg text-sm border border-[#1f1f1f] text-white outline-none focus:border-[#b00000] transition"
                    style={{ background: "#0a0a0a" }}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPriceModal(null)}
                  className="flex-1 py-2 rounded-lg text-sm border border-[#1f1f1f] text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition"
                  style={{ background: "#b00000" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#8b0000"}
                  onMouseLeave={e => e.currentTarget.style.background = "#b00000"}
                >
                  <FaCheck size={11} /> Mark as Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Modal (shown when Eye is clicked) ── */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[400px] rounded-xl border border-[#1f1f1f] overflow-hidden" style={{ background: "#111111" }}>

            <div className="h-[3px]" style={{ background: "#22c55e" }} />

            <div className="px-5 py-4 border-b border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">{viewItem.device}</h2>
                <p className="text-xs font-mono text-gray-500 mt-0.5">IMEI: {viewItem.imei}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                  <FaCheck size={8} /> Completed
                </span>
                <button onClick={() => setViewItem(null)} className="text-gray-500 hover:text-white transition">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-1">
              {[
                ["Phone", viewItem.phone],
                ["Date", viewItem.date],
                ["Fault", viewItem.fault],
                ["Repair Charge", `Rs ${Number(viewItem.price).toLocaleString()}`],
                ["Status", "Completed"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-start text-sm py-2.5 border-b border-[#1a1a1a]">
                  <span className="text-gray-500">{k}</span>
                  <span className={`font-medium text-right max-w-[220px] ${
                    k === "Status" ? "text-green-400" :
                    k === "Repair Charge" ? "text-green-400 font-bold" :
                    "text-white"
                  }`}>
                    {v}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Repair;