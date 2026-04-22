import React, { useState } from "react";
import {
  FaTools, FaPlus, FaTrash, FaCheck,
  FaSearch, FaTimes, FaEye, FaClock, FaDollarSign,
} from "react-icons/fa";

const initialRepairs = [
  { id: 1, device: "iPhone 11", imei: "352789101234567", phone: "0771234567", date: "2026-04-20", fault: "Screen damage", status: "pending", price: null },
  { id: 2, device: "Samsung S22", imei: "490123456789012", phone: "0751234567", date: "2026-04-20", fault: "Battery swollen", status: "pending", price: null },
  { id: 3, device: "iPhone 13", imei: "867512034912345", phone: "0741234567", date: "2026-04-24", fault: "Back glass broken", status: "done", price: 15000 },
  { id: 4, device: "Redmi Note 12", imei: "123098765432109", phone: "0731234567", date: "2026-04-29", fault: "Charging port issue", status: "pending", price: null },
];

const emptyForm = { device: "", imei: "", phone: "", fault: "" };

const inputCls = "w-full px-3 py-2 rounded-lg text-sm border bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition placeholder-gray-300 dark:placeholder-gray-700";
const labelCls = "text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1";

const Repair = () => {
  const [repairs, setRepairs] = useState(initialRepairs);
  const [open, setOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [priceModal, setPriceModal] = useState(null);
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

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    if (!priceInput) return;
    setRepairs(repairs.map((r) => r.id === priceModal.id ? { ...r, status: "done", price: Number(priceInput) } : r));
    setPriceModal(null);
    setPriceInput("");
  };

  return (
    <div className="text-gray-900 dark:text-white space-y-5">

      {/* Stats */}
      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Jobs", value: repairs.length, color: "text-blue-500 dark:text-blue-400", border: "border-blue-300 dark:border-blue-500/20" },
          { label: "Pending", value: pending, color: "text-yellow-500 dark:text-yellow-400", border: "border-yellow-300 dark:border-yellow-500/20" },
          { label: "Completed", value: done, color: "text-green-600 dark:text-green-400", border: "border-green-300 dark:border-green-500/20" },
        ].map((s, i) => (
          <div key={i} className={`flex items-center justify-between sm:block border ${s.border} rounded-xl p-4 backdrop-blur-sm bg-white/80 dark:bg-[rgba(17,17,17,0.6)]`}>
            <div className={`text-xs font-semibold uppercase tracking-wider ${s.color} mb-2`}>{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
            <input type="text" placeholder="Filter by phone..." value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition placeholder-gray-400 dark:placeholder-gray-600"
            />
          </div>
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 outline-none focus:border-[#b00000] transition"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 outline-none focus:border-[#b00000] transition"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
          {(filterPhone || filterDate || filterStatus) && (
            <button onClick={() => { setFilterPhone(""); setFilterDate(""); setFilterStatus(""); }}
              className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition">
              <FaTimes size={12} />
            </button>
          )}
        </div>
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition bg-[#b00000] hover:bg-[#8b0000]">
          <FaPlus size={11} /> Add Repair
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <FaTools style={{ color: "#b00000" }} size={13} /> Repair Jobs
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-[#1f1f1f]">
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
                <tr><td colSpan="7" className="text-center py-12 text-gray-400 dark:text-gray-600">No repairs found</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{r.device}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.imei}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.phone}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.date}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[180px] truncate">{r.fault}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 w-fit ${
                      r.status === "done"
                        ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20"
                        : "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20"
                    }`}>
                      {r.status === "done" ? <FaCheck size={9} /> : <FaClock size={9} />}
                      {r.status === "done" ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {r.status === "done" ? (
                        <button onClick={() => setViewItem(r)}
                          className="p-1.5 rounded border border-blue-200 dark:border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition">
                          <FaEye size={11} />
                        </button>
                      ) : (
                        <button onClick={() => { setPriceModal(r); setPriceInput(""); }}
                          className="p-1.5 rounded border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition">
                          <FaCheck size={11} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
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

      {/* Add Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[440px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Add Repair Job</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Date will be set to today automatically</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"><FaTimes /></button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-3">
              <div>
                <label className={labelCls}>DEVICE *</label>
                <input required placeholder="e.g. iPhone 13" value={form.device}
                  onChange={(e) => setForm({ ...form, device: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>IMEI *</label>
                <input required placeholder="15-digit IMEI" maxLength={15} value={form.imei}
                  onChange={(e) => setForm({ ...form, imei: e.target.value })} className={`${inputCls} font-mono`} />
              </div>
              <div>
                <label className={labelCls}>PHONE *</label>
                <input required placeholder="07XXXXXXXX" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>FAULT / DESCRIPTION *</label>
                <textarea required rows="3" placeholder="Describe the issue..." value={form.fault}
                  onChange={(e) => setForm({ ...form, fault: e.target.value })}
                  className={`${inputCls} resize-none`} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-lg text-sm border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
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

      {/* Price Modal */}
      {priceModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[380px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="h-[3px]" style={{ background: "#b00000" }} />
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Complete Repair</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{priceModal.device} · {priceModal.phone}</p>
              </div>
              <button onClick={() => setPriceModal(null)} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"><FaTimes /></button>
            </div>
            <div className="px-5 pt-4 pb-2 space-y-1">
              {[["Device", priceModal.device], ["IMEI", priceModal.imei], ["Fault", priceModal.fault], ["Date", priceModal.date]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-[#1a1a1a]">
                  <span className="text-gray-400 dark:text-gray-500">{k}</span>
                  <span className="text-gray-900 dark:text-white font-medium font-mono">{v}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handlePriceSubmit} className="px-5 pb-5 pt-3 space-y-4">
              <div>
                <label className={labelCls}>REPAIR CHARGE (Rs) *</label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
                  <input required type="number" placeholder="Enter repair price" value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className={`${inputCls} pl-8`} autoFocus />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setPriceModal(null)}
                  className="flex-1 py-2 rounded-lg text-sm border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition"
                  style={{ background: "#b00000" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#8b0000"}
                  onMouseLeave={e => e.currentTarget.style.background = "#b00000"}>
                  <FaCheck size={11} /> Mark as Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[400px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="h-[3px] bg-green-500" />
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{viewItem.device}</h2>
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">IMEI: {viewItem.imei}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 flex items-center gap-1">
                  <FaCheck size={8} /> Completed
                </span>
                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"><FaTimes /></button>
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
                <div key={k} className="flex justify-between items-start text-sm py-2.5 border-b border-gray-100 dark:border-[#1a1a1a]">
                  <span className="text-gray-400 dark:text-gray-500">{k}</span>
                  <span className={`font-medium text-right max-w-[220px] ${
                    k === "Status" ? "text-green-600 dark:text-green-400" :
                    k === "Repair Charge" ? "text-green-600 dark:text-green-400 font-bold" :
                    "text-gray-900 dark:text-white"
                  }`}>{v}</span>
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