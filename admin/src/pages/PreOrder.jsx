import React, { useState, useEffect, useContext } from "react";
import {
  FaPlus, FaTimes, FaSearch, FaFilter, FaEye,
  FaCheckCircle, FaMoneyBillWave, FaTrash,
  FaClock, FaTruck, FaCheck,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import ConfirmDeleteModal from "../component/ConfirmDeleteModal";
import { useConfirmToast } from "../hooks/useConfirmToast";

// ── Helpers ───────────────────────────────────────────────────────
const Rs  = (v) => `Rs ${Number(v || 0).toLocaleString()}`;
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB") : "—";

const toastStyle = {
  background: "#1a1a1a", color: "#fff",
  border: "1px solid #2a2a2a", borderRadius: "10px", fontSize: "13px",
};
const successToast = (m) => toast.success(m, { style: { ...toastStyle, borderLeft: "3px solid #22c55e" }, iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" } });
const errorToast   = (m) => toast.error(m,   { style: { ...toastStyle, borderLeft: "3px solid #b00000" }, iconTheme: { primary: "#b00000", secondary: "#1a1a1a" } });
const loadToast    = (m) => toast.loading(m, { style: toastStyle });

const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600";
const labelCls = "text-[10px] text-gray-400 dark:text-gray-500 font-semibold tracking-wider block mb-1";
const cardCls  = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";

const emptyForm = {
  customerName: "", phone: "", productName: "",
  model: "", price: "", advancePayment: "", notes: "",
};

// ── Status badge ──────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending:   { label: "Pending",    icon: <FaClock size={9} />,     cls: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20" },
    delivered: { label: "Delivered",  icon: <FaTruck size={9} />,     cls: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20" },
    completed: { label: "Completed",  icon: <FaCheck size={9} />,     cls: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`px-2 py-1 text-xs rounded-full font-semibold flex items-center gap-1 w-fit border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
};

// ════════════════════════════════════════════════════════════════
const PreOrder = () => {
  const { axiosInstance } = useContext(AppContext);
  const confirmToast = useConfirmToast();
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [open, setOpen]               = useState(false);
  const [viewItem, setViewItem]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [form, setForm]               = useState(emptyForm);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter]   = useState("");

  // ── Fetch ────────────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/api/preorders/all");
      if (data.success) setOrders(data.orders);
      else errorToast(data.message);
    } catch { errorToast("Failed to load pre-orders"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── Derived stats ────────────────────────────────────────────
  const totalOrders   = orders.length;
  const pending       = orders.filter(o => o.status === "pending").length;
  const delivered     = orders.filter(o => o.status === "delivered").length;
  const completed     = orders.filter(o => o.status === "completed").length;
  const totalAdvance  = orders.reduce((s, o) => s + (o.advancePayment || 0), 0);
  const totalBalance  = orders.reduce((s, o) => s + (o.balancePayment || 0), 0);

  // ── Filter ───────────────────────────────────────────────────
  const filtered = orders.filter(o => {
    const matchSearch =
      search === "" ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search) ||
      o.productName?.toLowerCase().includes(search.toLowerCase()) ||
      o.model?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "" || o.status === statusFilter;
    const matchDate   = dateFilter === "" ||
      new Date(o.date).toLocaleDateString("en-CA") === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  // ── Add order ────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const tid = loadToast("Adding pre-order...");
    try {
      const price   = Number(form.price);
      const advance = Number(form.advancePayment);
      if (advance > price) {
        toast.dismiss(tid);
        errorToast("Advance payment cannot exceed total price");
        setSubmitting(false);
        return;
      }
      const { data } = await axiosInstance.post("/api/preorders/add", {
        ...form,
        price,
        advancePayment: advance,
        balancePayment: price - advance,
      });
      toast.dismiss(tid);
      if (data.success) {
        successToast("Pre-order added!");
        setOrders(prev => [data.order, ...prev]);
        setForm(emptyForm);
        setOpen(false);
      } else errorToast(data.message);
    } catch (err) {
      toast.dismiss(tid);
      errorToast(err.response?.data?.message || "Failed to add");
    } finally { setSubmitting(false); }
  };

// ── Order Delivered — with confirm ───────────────────────────────
const handleDeliver = (id) => {
  confirmToast("Mark this order as Delivered?", async () => {
    const tid = loadToast("Updating...");
    try {
      const { data } = await axiosInstance.patch(`/api/preorders/${id}/deliver`);
      toast.dismiss(tid);
      if (data.success) {
        successToast("Marked as Delivered!");
        setOrders(prev => prev.map(o => o._id === id ? data.order : o));
        setViewItem(null); // close view modal if open
      } else errorToast(data.message);
    } catch { toast.dismiss(tid); errorToast("Failed to update"); }
  });
};

// ── Full Payment — with confirm ───────────────────────────────────
const handleFullPayment = (id) => {
  confirmToast("Confirm full payment received? Balance will be cleared.", async () => {
    const tid = loadToast("Processing...");
    try {
      const { data } = await axiosInstance.patch(`/api/preorders/${id}/fullpayment`);
      toast.dismiss(tid);
      if (data.success) {
        successToast("Full payment received! Order completed.");
        setOrders(prev => prev.map(o => o._id === id ? data.order : o));
        setViewItem(null); // close view modal if open
      } else errorToast(data.message);
    } catch { toast.dismiss(tid); errorToast("Failed to update"); }
  });
};

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (id, password) => {
    setDeleteLoading(true);
    try {
      const { data } = await axiosInstance.delete(`/api/preorders/${id}`, {
        data: { deletePassword: password },
      });
      if (data.success) {
        successToast("Pre-order deleted");
        setOrders(prev => prev.filter(o => o._id !== id));
        setDeleteTarget(null);
      } else errorToast(data.message);
    } catch (err) {
      errorToast(err.response?.data?.message || "Delete failed");
    } finally { setDeleteLoading(false); }
  };

  // ── Skeleton ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-[#1a1a1a]" />)}
        </div>
        <div className="h-10 rounded-lg bg-gray-200 dark:bg-[#1a1a1a]" />
        {[1,2,3,4].map(i => <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-[#111]" />)}
      </div>
    );
  }

  return (
    <div className="text-gray-900 dark:text-white space-y-5">

      
{/* ── Combined Stats & Revenue Summary ── */}
<div className="rounded-xl border border-[#b00000]/20 bg-white/80 dark:bg-[rgba(17,17,17,0.6)] overflow-hidden">

  {/* Order Stats */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4">
    {[
      {
        label: "Total Orders",
        value: totalOrders,
        color: "text-blue-500 dark:text-blue-400",
        border: "border-blue-500/20",
      },
      {
        label: "Pending",
        value: pending,
        color: "text-yellow-500 dark:text-yellow-400",
        border: "border-yellow-500/20",
      },
      {
        label: "Delivered",
        value: delivered,
        color: "text-blue-400 dark:text-blue-300",
        border: "border-blue-400/20",
      },
      {
        label: "Completed",
        value: completed,
        color: "text-green-500 dark:text-green-400",
        border: "border-green-500/20",
      },
    ].map((s, i) => (
      <div
        key={i}
        className={`border ${s.border} rounded-xl p-3 sm:p-4`}
      >
        <div
          className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${s.color} mb-1`}
        >
          {s.label}
        </div>
        <div className="text-xl sm:text-2xl font-bold">
          {s.value}
        </div>
      </div>
    ))}
  </div>

  {/* Divider */}
  <div className="border-t border-[#b00000]/15" />


  
{/* ── Revenue Summary ── */}
<div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#b00000]/20 p-4">
  <div className="py-3 sm:py-0 sm:pr-4">
    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
      Total Advance Collected
    </div>
    <div className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">
      {Rs(totalAdvance)}
    </div>
  </div>

  <div className="py-3 sm:py-0 sm:px-4">
    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
      Total Balance Pending
    </div>
    <div className="text-lg font-bold text-amber-500 font-mono">
      {Rs(totalBalance)}
    </div>
  </div>

  <div className="py-3 sm:py-0 sm:pl-4">
    <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
      Total Order Value
    </div>
    <div className="text-lg font-bold font-mono" style={{ color: "#b00000" }}>
      {Rs(totalAdvance + totalBalance)}
    </div>
  </div>
</div>


</div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between flex-wrap">
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input placeholder="Name / phone / product..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-900 dark:text-white outline-none focus:border-[#b00000] transition placeholder-gray-400 dark:placeholder-gray-600 w-52" />
          </div>
          {/* Status filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 outline-none focus:border-[#b00000] transition">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {/* Date filter */}
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border bg-white dark:bg-[rgba(10,10,10,0.7)] border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 outline-none focus:border-[#b00000] transition" />
          {(search || statusFilter || dateFilter) && (
            <button onClick={() => { setSearch(""); setStatusFilter(""); setDateFilter(""); }}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition self-center">
              <FaTimes size={12} />
            </button>
          )}
        </div>
        <button onClick={() => { setForm(emptyForm); setOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition">
          <FaPlus size={11} /> New Pre-Order
        </button>
      </div>

      {/* ── Table ── */}
      <div className={`${cardCls} overflow-hidden`}>
        <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pre-Orders</span>
          <span className="text-xs text-gray-400">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "900px" }}>
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#1f1f1f]">
                {["Customer","Product / Model","Order Date","Price","Advance","Balance","Status","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-16 text-gray-400 dark:text-gray-600">
                  <FaTruck size={28} className="mx-auto mb-3 opacity-30" />
                  No pre-orders found
                </td></tr>
              ) : filtered.map(o => (
                <tr key={o._id} className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900 dark:text-white text-xs">{o.customerName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{o.phone}</div>
                  </td>
                  {/* Product */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white text-xs">{o.productName}</div>
                    <div className="text-[10px] text-gray-400">{o.model}</div>
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-gray-400">{fmt(o.date)}</td>
                  {/* Price */}
                  <td className="px-4 py-3 text-xs font-mono font-bold text-gray-900 dark:text-white">{Rs(o.price)}</td>
                  {/* Advance */}
                  <td className="px-4 py-3 text-xs font-mono text-green-600 dark:text-green-400">{Rs(o.advancePayment)}</td>
                  {/* Balance */}
                  <td className="px-4 py-3">
                    <span className={`text-xs font-mono font-semibold ${o.balancePayment > 0 ? "text-amber-500" : "text-green-500 dark:text-green-400"}`}>
                      {o.balancePayment > 0 ? Rs(o.balancePayment) : "✓ Paid"}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {/* View */}
                      <button onClick={() => setViewItem(o)}
                        className="p-1.5 rounded border border-blue-200 dark:border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition" title="View">
                        <FaEye size={11} />
                      </button>
                      {/* Order Delivered — only for pending */}
                      {o.status === "pending" && (
                        <button onClick={() => handleDeliver(o._id)}
                          className="p-1.5 rounded border border-blue-300 dark:border-blue-400/30 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-400/10 transition" title="Mark as Delivered">
                          <FaTruck size={11} />
                        </button>
                      )}
                      {/* Full Payment — for pending or delivered with balance */}
                      {o.status !== "completed" && o.balancePayment > 0 && (
                        <button onClick={() => handleFullPayment(o._id)}
                          className="p-1.5 rounded border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition" title="Mark Full Payment Received">
                          <FaMoneyBillWave size={11} />
                        </button>
                      )}
                      {/* Delete */}
                      <button onClick={() => setDeleteTarget(o)}
                        className="p-1.5 rounded border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Delete">
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

      {/* ════ ADD MODAL ════ */}
      {open && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-[520px] my-4 rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="h-[3px]" style={{ background: "#b00000" }} />
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">New Pre-Order</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in customer and product details</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              {/* Customer info */}
              <div>
                <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-100 dark:border-[#1a1a1a] pb-1">CUSTOMER INFORMATION</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>CUSTOMER NAME *</label>
                    <input required placeholder="Full name" value={form.customerName}
                      onChange={e => setForm({...form, customerName: e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>PHONE NUMBER *</label>
                    <input required placeholder="07XXXXXXXX" value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})} className={inputCls} />
                  </div>
                </div>
              </div>
              {/* Product info */}
              <div>
                <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-100 dark:border-[#1a1a1a] pb-1">PRODUCT INFORMATION</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>PRODUCT NAME *</label>
                    <input required placeholder="e.g. iPhone 15 Pro" value={form.productName}
                      onChange={e => setForm({...form, productName: e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>MODEL</label>
                    <input placeholder="e.g. A3293, 256GB Black" value={form.model}
                      onChange={e => setForm({...form, model: e.target.value})} className={inputCls} />
                  </div>
                </div>
              </div>
              {/* Payment info */}
              <div>
                <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-3 border-b border-gray-100 dark:border-[#1a1a1a] pb-1">PAYMENT INFORMATION</div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={labelCls}>TOTAL PRICE (Rs) *</label>
                    <input required type="number" min="0" placeholder="0" value={form.price}
                      onChange={e => setForm({...form, price: e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>ADVANCE PAYMENT (Rs) *</label>
                    <input required type="number" min="0" placeholder="0" value={form.advancePayment}
                      onChange={e => setForm({...form, advancePayment: e.target.value})} className={inputCls} />
                  </div>
                </div>
                {/* Balance preview */}
                {form.price && form.advancePayment && (
                  <div className={`flex justify-between items-center text-sm px-3 py-2 rounded-lg border ${
                    Number(form.advancePayment) > Number(form.price)
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-amber-500/20 bg-amber-500/5"
                  }`}>
                    <span className="text-gray-500 text-xs">Balance Payment</span>
                    <span className={`font-bold font-mono text-sm ${Number(form.advancePayment) > Number(form.price) ? "text-red-500" : "text-amber-500"}`}>
                      {Number(form.advancePayment) > Number(form.price) ? "⚠ Advance exceeds price" : Rs(Number(form.price) - Number(form.advancePayment))}
                    </span>
                  </div>
                )}
              </div>
              {/* Notes */}
              <div>
                <label className={labelCls}>NOTES (Optional)</label>
                <textarea rows="2" placeholder="Any special requirements..." value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  className={`${inputCls} resize-none`} />
              </div>
              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-lg text-sm border border-gray-300 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : "Save Pre-Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ VIEW MODAL ════ */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[440px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="h-[3px]" style={{ background: "#b00000" }} />
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">{viewItem.customerName}</h2>
                <p className="text-[10px] font-mono text-gray-400 mt-0.5">{viewItem.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={viewItem.status} />
                <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition ml-1"><FaTimes /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {/* Product */}
              <div>
                <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">PRODUCT</div>
                <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] overflow-hidden">
                  {[["Product Name", viewItem.productName], ["Model", viewItem.model || "—"], ["Order Date", fmt(viewItem.date)]].map(([k,v]) => (
                    <div key={k} className="flex justify-between text-sm px-3 py-2 border-b border-gray-100 dark:border-[#1a1a1a] last:border-0">
                      <span className="text-gray-400 dark:text-gray-500">{k}</span>
                      <span className="text-gray-900 dark:text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Payment */}
              <div>
                <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">PAYMENT</div>
                <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] overflow-hidden">
                  {[
                    ["Total Price",    { val: Rs(viewItem.price),          cls: "font-bold text-gray-900 dark:text-white font-mono" }],
                    ["Advance Paid",   { val: Rs(viewItem.advancePayment), cls: "text-green-600 dark:text-green-400 font-mono" }],
                    ["Balance Due",    { val: viewItem.balancePayment > 0 ? Rs(viewItem.balancePayment) : "✓ Fully Paid", cls: viewItem.balancePayment > 0 ? "text-amber-500 font-mono font-semibold" : "text-green-500 dark:text-green-400 font-semibold" }],
                  ].map(([k, { val, cls }]) => (
                    <div key={k} className="flex justify-between text-sm px-3 py-2 border-b border-gray-100 dark:border-[#1a1a1a] last:border-0">
                      <span className="text-gray-400 dark:text-gray-500">{k}</span>
                      <span className={cls}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Notes */}
              {viewItem.notes && (
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-2">NOTES</div>
                  <div className="rounded-lg border border-gray-100 dark:border-[#1a1a1a] px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{viewItem.notes}</div>
                </div>
              )}
              {/* Action buttons inside view */}
              <div className="flex gap-2 pt-1">
                {viewItem.status === "pending" && (
                  <button onClick={() => { handleDeliver(viewItem._id); setViewItem(null); }}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <FaTruck size={11} /> Mark Delivered
                  </button>
                )}
                {viewItem.status !== "completed" && viewItem.balancePayment > 0 && (
                  <button onClick={() => { handleFullPayment(viewItem._id); setViewItem(null); }}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition flex items-center justify-center gap-2">
                    <FaMoneyBillWave size={11} /> Full Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE MODAL ════ */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Pre-Order"
        message={deleteTarget ? `Delete pre-order for "${deleteTarget.customerName}" (${deleteTarget.productName})? This cannot be undone.` : ""}
        variant="delete"
        actionLabel="Delete"
        loading={deleteLoading}
        onConfirm={(password) => handleDelete(deleteTarget._id, password)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default PreOrder;