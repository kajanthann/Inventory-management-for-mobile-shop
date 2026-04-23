import React, { useState } from "react";
import {
  FaTools, FaPlus, FaTrash, FaCheck,
  FaSearch, FaTimes, FaEye, FaClock, FaDollarSign,
} from "react-icons/fa";

const initialRepairs = [
  {
    id: 1,
    collectionNo: "DC-001",
    name: "Nimal Perera",
    tel1: "0771234567",
    tel2: "0112345678",
    brand: "Apple",
    model: "iPhone 11",
    imei: "352789101234567",
    purchaseDate: "2025-01-15",
    warranty: "non-warranty",
    faultDescription: "Screen damage, touch not working",
    handover: { charger: true, cable: false, backCover: false, warrantyCard: false, other: "" },
    date: "2026-04-20",
    status: "pending",
    price: null,
  },
  {
    id: 2,
    collectionNo: "DC-002",
    name: "Kamala Silva",
    tel1: "0751234567",
    tel2: "",
    brand: "Samsung",
    model: "Galaxy S22",
    imei: "490123456789012",
    purchaseDate: "2024-08-10",
    warranty: "warranty",
    faultDescription: "Battery swollen, device overheating",
    handover: { charger: true, cable: true, backCover: false, warrantyCard: true, other: "Box" },
    date: "2026-04-20",
    status: "pending",
    price: null,
  },
  {
    id: 3,
    collectionNo: "DC-003",
    name: "Sunil Fernando",
    tel1: "0741234567",
    tel2: "0761234567",
    brand: "Apple",
    model: "iPhone 13",
    imei: "867512034912345",
    purchaseDate: "2023-12-01",
    warranty: "non-warranty",
    faultDescription: "Back glass broken",
    handover: { charger: false, cable: false, backCover: false, warrantyCard: false, other: "" },
    date: "2026-04-24",
    status: "done",
    price: 15000,
  },
];

const emptyForm = {
  collectionNo: "",
  name: "", tel1: "", tel2: "",
  brand: "", model: "", imei: "", purchaseDate: "", warranty: "non-warranty",
  faultDescription: "",
  handover: { charger: false, cable: false, backCover: false, warrantyCard: false, other: "" },
};

const inputCls = "w-full px-3 py-1.5 rounded-lg text-sm border bg-gray-50 dark:bg-[#0a0a0a] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition placeholder-gray-300 dark:placeholder-gray-700";
const labelCls = "text-[10px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1";

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
    (filterPhone === "" || r.tel1.includes(filterPhone) || r.name.toLowerCase().includes(filterPhone.toLowerCase())) &&
    (filterDate === "" || r.date === filterDate) &&
    (filterStatus === "" || r.status === filterStatus)
  );

  const pending = repairs.filter((r) => r.status === "pending").length;
  const done = repairs.filter((r) => r.status === "done").length;

  const nextCollectionNo = () => {
    const nums = repairs.map(r => parseInt(r.collectionNo?.replace("DC-", "") || "0")).filter(Boolean);
    const next = nums.length ? Math.max(...nums) + 1 : 1;
    return `DC-${String(next).padStart(3, "0")}`;
  };

  const handleOpenAdd = () => {
    setForm({ ...emptyForm, collectionNo: nextCollectionNo() });
    setOpen(true);
  };

  const setHandover = (key, val) =>
    setForm(f => ({ ...f, handover: { ...f.handover, [key]: val } }));

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
    setRepairs(repairs.map((r) =>
      r.id === priceModal.id ? { ...r, status: "done", price: Number(priceInput) } : r
    ));
    setPriceModal(null);
    setPriceInput("");
  };

  const HandoverTag = ({ label, checked }) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
      checked
        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
        : "bg-gray-100 dark:bg-white/[0.03] text-gray-400 dark:text-gray-600 border-gray-200 dark:border-[#1f1f1f] line-through"
    }`}>{label}</span>
  );

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
            <input type="text" placeholder="Name or phone..." value={filterPhone}
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
        <button onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition bg-[#b00000] hover:bg-[#8b0000]">
          <FaPlus size={11} /> New DC Form
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <FaTools style={{ color: "#b00000" }} size={13} /> Repair Jobs — DC Forms
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-[#1f1f1f]">
                <th className="px-4 py-3 text-left">DC No</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Device</th>
                <th className="px-4 py-3 text-left">IMEI / SN</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Warranty</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-12 text-gray-400 dark:text-gray-600">No repairs found</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-[#b00000]">{r.collectionNo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{r.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{r.tel1}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{r.brand} {r.model}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[160px]">{r.faultDescription}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{r.imei}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      r.warranty === "warranty"
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                        : "bg-gray-100 dark:bg-white/[0.03] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-[#1f1f1f]"
                    }`}>
                      {r.warranty === "warranty" ? "WARRANTY" : "NON-WARRANTY"}
                    </span>
                  </td>
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
                      <button onClick={() => setViewItem(r)}
                        className="p-1.5 rounded border border-blue-200 dark:border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition">
                        <FaEye size={11} />
                      </button>
                      {r.status === "pending" && (
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

      {/* ── ADD MODAL — wide landscape layout ─────────────── */}
      {open && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[780px] max-w-[96vw] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="h-[3px]" style={{ background: "#b00000" }} />

            {/* Header */}
            <div className="px-5 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between bg-gray-50 dark:bg-[#0d0d0d]">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-900 dark:text-white tracking-wide text-sm">DEFECTIVE DEVICE COLLECTION FORM</h2>
                <span className="text-[10px] font-mono font-bold text-[#b00000] bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2 py-0.5 rounded">
                  {form.collectionNo}
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-5">
              {/* ── Row 1: Customer (left) + Device (right) ── */}
              <div className="grid grid-cols-2 gap-5 mb-4">

                {/* LEFT — Customer Information */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#1a1a1a] pb-1 mb-2">
                    CUSTOMER INFORMATION
                  </div>
                  <div>
                    <label className={labelCls}>NAME *</label>
                    <input required placeholder="Customer full name" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>TEL NO 1 *</label>
                      <input required placeholder="07XXXXXXXX" value={form.tel1}
                        onChange={e => setForm(f => ({ ...f, tel1: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>TEL NO 2</label>
                      <input placeholder="Optional" value={form.tel2}
                        onChange={e => setForm(f => ({ ...f, tel2: e.target.value }))} className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* RIGHT — Device Information */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#1a1a1a] pb-1 mb-2">
                    DEVICE INFORMATION
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>BRAND *</label>
                      <input required placeholder="e.g. Apple" value={form.brand}
                        onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>MODEL *</label>
                      <input required placeholder="e.g. iPhone 13" value={form.model}
                        onChange={e => setForm(f => ({ ...f, model: e.target.value }))} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>IMEI / SN *</label>
                    <input required placeholder="15-digit IMEI or serial number" maxLength={20} value={form.imei}
                      onChange={e => setForm(f => ({ ...f, imei: e.target.value }))} className={`${inputCls} font-mono`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>PURCHASE DATE</label>
                      <input type="date" value={form.purchaseDate}
                        onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>WARRANTY</label>
                      <div className="flex gap-4 mt-2">
                        {["warranty", "non-warranty"].map(opt => (
                          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name="warranty" value={opt}
                              checked={form.warranty === opt}
                              onChange={() => setForm(f => ({ ...f, warranty: opt }))}
                              className="accent-[#b00000]" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                              {opt === "warranty" ? "Warranty" : "Non Warranty"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Row 2: Fault (left) + Handover (right) ── */}
              <div className="grid grid-cols-2 gap-5 mb-4">

                {/* LEFT — Faulty Information */}
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#1a1a1a] pb-1 mb-2">
                    FAULTY INFORMATION
                  </div>
                  <label className={labelCls}>FAULTY DESCRIPTION *</label>
                  <textarea required rows="4" placeholder="Describe the issue in detail..."
                    value={form.faultDescription}
                    onChange={e => setForm(f => ({ ...f, faultDescription: e.target.value }))}
                    className={`${inputCls} resize-none`} />
                </div>

                {/* RIGHT — Handover Items */}
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-[#1a1a1a] pb-1 mb-2">
                    HANDOVER ITEMS
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-3">
                    {[
                      { key: "charger", label: "Charger" },
                      { key: "cable", label: "Cable" },
                      { key: "backCover", label: "Back Cover" },
                      { key: "warrantyCard", label: "Warranty Card" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={form.handover[key]}
                          onChange={e => setHandover(key, e.target.checked)}
                          className="accent-[#b00000] w-3.5 h-3.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className={labelCls}>OTHER</label>
                    <input placeholder="Any other items..." value={form.handover.other}
                      onChange={e => setHandover("other", e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-1 border-t border-gray-100 dark:border-[#1a1a1a]">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-lg text-sm border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mt-4">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition mt-4"
                  style={{ background: "#b00000" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#8b0000"}
                  onMouseLeave={e => e.currentTarget.style.background = "#b00000"}>
                  Save DC Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRICE / COMPLETE MODAL ──────────────────────────── */}
      {priceModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[380px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="h-[3px]" style={{ background: "#b00000" }} />
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Complete Repair</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{priceModal.collectionNo} · {priceModal.brand} {priceModal.model}</p>
              </div>
              <button onClick={() => setPriceModal(null)} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"><FaTimes /></button>
            </div>
            <div className="px-5 pt-4 pb-2 space-y-1">
              {[
                ["Customer", priceModal.name],
                ["Tel", priceModal.tel1],
                ["IMEI / SN", priceModal.imei],
                ["Fault", priceModal.faultDescription],
                ["Warranty", priceModal.warranty === "warranty" ? "Warranty" : "Non Warranty"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-[#1a1a1a]">
                  <span className="text-gray-400 dark:text-gray-500">{k}</span>
                  <span className="text-gray-900 dark:text-white font-medium font-mono text-right max-w-[220px] truncate">{v}</span>
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

      {/* ── VIEW MODAL ──────────────────────────────────────── */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-[600px] max-w-[96vw] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className={`h-[3px] ${viewItem.status === "done" ? "bg-green-500" : "bg-yellow-400"}`} />
            <div className="px-5 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between bg-gray-50 dark:bg-[#0d0d0d]">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-gray-900 dark:text-white tracking-wide text-sm">DC FORM DETAILS</h2>
                <span className="text-[10px] font-mono font-bold text-[#b00000] bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2 py-0.5 rounded">
                  {viewItem.collectionNo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold border flex items-center gap-1 ${
                  viewItem.status === "done"
                    ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20"
                    : "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
                }`}>
                  {viewItem.status === "done" ? <FaCheck size={8} /> : <FaClock size={8} />}
                  {viewItem.status === "done" ? "COMPLETED" : "PENDING"}
                </span>
                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition"><FaTimes /></button>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-5">
              {/* Left col */}
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">CUSTOMER INFORMATION</div>
                  <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] overflow-hidden">
                    {[["Name", viewItem.name], ["Tel No 1", viewItem.tel1], ["Tel No 2", viewItem.tel2 || "—"]].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm px-3 py-2 border-b border-gray-100 dark:border-[#1a1a1a] last:border-0">
                        <span className="text-gray-400 dark:text-gray-500">{k}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">FAULTY INFORMATION</div>
                  <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] p-3">
                    <p className="text-sm text-gray-900 dark:text-white">{viewItem.faultDescription}</p>
                  </div>
                </div>
                {viewItem.status === "done" && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-green-700 dark:text-green-400 font-semibold">Repair Charge</span>
                    <span className="text-lg font-bold text-green-700 dark:text-green-400 font-mono">Rs {Number(viewItem.price).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Right col */}
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">DEVICE INFORMATION</div>
                  <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] overflow-hidden">
                    {[
                      ["Brand", viewItem.brand],
                      ["Model", viewItem.model],
                      ["IMEI / SN", viewItem.imei],
                      ["Purchase Date", viewItem.purchaseDate || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm px-3 py-2 border-b border-gray-100 dark:border-[#1a1a1a] last:border-0">
                        <span className="text-gray-400 dark:text-gray-500">{k}</span>
                        <span className="text-gray-900 dark:text-white font-medium font-mono text-right">{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-sm px-3 py-2">
                      <span className="text-gray-400 dark:text-gray-500">Warranty</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        viewItem.warranty === "warranty"
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                          : "bg-gray-100 dark:bg-white/[0.03] text-gray-500 border-gray-200 dark:border-[#1f1f1f]"
                      }`}>{viewItem.warranty === "warranty" ? "WARRANTY" : "NON WARRANTY"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">HANDOVER ITEMS</div>
                  <div className="flex flex-wrap gap-2">
                    <HandoverTag label="Charger" checked={viewItem.handover?.charger} />
                    <HandoverTag label="Cable" checked={viewItem.handover?.cable} />
                    <HandoverTag label="Back Cover" checked={viewItem.handover?.backCover} />
                    <HandoverTag label="Warranty Card" checked={viewItem.handover?.warrantyCard} />
                    {viewItem.handover?.other && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20">
                        Other: {viewItem.handover.other}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repair;