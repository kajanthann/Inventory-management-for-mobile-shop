import React, { useState, useEffect, useContext } from "react";
import {
  FaFileAlt, FaShoppingCart, FaTools, FaEnvelope,
  FaTrash, FaEye, FaSync, FaPlus, FaTimes,
  FaChartBar, FaCheck, FaClock,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import ConfirmDeleteModal from "../component/ConfirmDeleteModal";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Helpers ───────────────────────────────────────────────────────
const Rs = (v) => `Rs ${Number(v || 0).toLocaleString()}`;
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const PIE_COLORS = ["#3b82f6","#22c55e","#f59e0b","#ec4899","#8b5cf6","#10b981"];

const toastStyle = { background: "#1a1a1a", color: "#fff", border: "1px solid #2a2a2a", borderRadius: "10px", fontSize: "13px" };
const successToast = (m) => toast.success(m, { style: { ...toastStyle, borderLeft: "3px solid #22c55e" }, iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" } });
const errorToast   = (m) => toast.error(m,   { style: { ...toastStyle, borderLeft: "3px solid #b00000" }, iconTheme: { primary: "#b00000", secondary: "#1a1a1a" } });

const cardCls  = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";
const inputCls = "px-3 py-2 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white";

// ── Stat card ─────────────────────────────────────────────────────
const Stat = ({ label, value, color, border }) => (
  <div className={`border ${border} rounded-xl p-3 sm:p-4 bg-white/80 dark:bg-[rgba(17,17,17,0.6)]`}>
    <div className={`text-[10px] font-semibold uppercase tracking-wider ${color} mb-1`}>{label}</div>
    <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
  </div>
);

// ════════════════════════════════════════════════════════════════
// ── SALES REPORT DETAIL ──────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
const SalesReportDetail = ({ report }) => {
  const paymentData = Object.entries(report.paymentBreakdown || {})
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total Sales"    value={report.totalSales}            color="text-blue-500 dark:text-blue-400"    border="border-blue-500/20"   />
        <Stat label="Total Revenue"  value={Rs(report.totalRevenue)}      color="text-green-500 dark:text-green-400"  border="border-green-500/20"  />
        <Stat label="Total Profit"   value={Rs(report.totalProfit)}       color="text-emerald-500 dark:text-emerald-400" border="border-emerald-500/20" />
        <Stat label="Total Discount" value={Rs(report.totalDiscount)}     color="text-amber-500 dark:text-amber-400"  border="border-amber-500/20"  />
      </div>

      {/* Extra income + paid + change */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Extra Income"   value={Rs(report.totalExtraIncome)}  color="text-purple-500 dark:text-purple-400" border="border-purple-500/20" />
        <Stat label="Amount Paid"    value={Rs(report.totalAmountPaid)}   color="text-cyan-500 dark:text-cyan-400"     border="border-cyan-500/20"   />
        <Stat label="Change Given"   value={Rs(report.totalChange)}       color="text-rose-500 dark:text-rose-400"     border="border-rose-500/20"   />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily revenue chart */}
        {report.dailySales?.length > 0 && (
          <div className={`${cardCls} p-4`}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Daily Revenue</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={report.dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false}
                  tickFormatter={d => d.slice(8)} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #1e2d45", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="revenue" fill="#b00000" radius={[3,3,0,0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Payment pie */}
        {paymentData.length > 0 && (
          <div className={`${cardCls} p-4`}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment Methods</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {paymentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #1e2d45", borderRadius: 8, fontSize: 11 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Products */}
      {report.topProducts?.length > 0 && (
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Top Selling Products
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#1f1f1f]">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-center">Qty Sold</th>
                <th className="px-4 py-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {report.topProducts.map((p, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-[#1a1a1a]">
                  <td className="px-4 py-2.5 text-gray-900 dark:text-white font-medium text-xs">{p.name}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400">{p.qty}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs font-mono font-bold text-green-600 dark:text-green-400">{Rs(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// ── REPAIR REPORT DETAIL ─────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
const RepairReportDetail = ({ report }) => {
  const warrantyData = [
    { name: "Warranty",     value: report.warrantyBreakdown?.warranty    || 0 },
    { name: "Non-Warranty", value: report.warrantyBreakdown?.nonWarranty || 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total Jobs"     value={report.totalRepairs}           color="text-blue-500 dark:text-blue-400"    border="border-blue-500/20"   />
        <Stat label="Completed"      value={report.totalDone}              color="text-green-500 dark:text-green-400"  border="border-green-500/20"  />
        <Stat label="Pending"        value={report.totalPending}           color="text-amber-500 dark:text-amber-400"  border="border-amber-500/20"  />
        <Stat label="Repair Income"  value={Rs(report.totalRepairIncome)}  color="text-emerald-500 dark:text-emerald-400" border="border-emerald-500/20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Warranty pie */}
        {warrantyData.length > 0 && (
          <div className={`${cardCls} p-4`}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Warranty Breakdown</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={warrantyData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #1e2d45", borderRadius: 8, fontSize: 11 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Status breakdown */}
        <div className={`${cardCls} p-4`}>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Job Status</div>
          {[
            { label: "Completed", value: report.totalDone,     color: "bg-green-500",  text: "text-green-600 dark:text-green-400"  },
            { label: "Pending",   value: report.totalPending,  color: "bg-amber-500",  text: "text-amber-500"   },
            { label: "Returned",  value: report.totalReturned, color: "bg-purple-500", text: "text-purple-500"  },
          ].map(({ label, value, color, text }) => (
            <div key={label} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{label}</span>
                <span className={`font-bold ${text}`}>{value}</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`}
                  style={{ width: `${report.totalRepairs > 0 ? (value/report.totalRepairs)*100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand breakdown */}
      {report.brandBreakdown?.length > 0 && (
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Top Brands Repaired
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#1f1f1f]">
                <th className="px-4 py-2 text-left">Brand</th>
                <th className="px-4 py-2 text-right">Jobs</th>
              </tr>
            </thead>
            <tbody>
              {report.brandBreakdown.slice(0, 7).map((b, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-[#1a1a1a]">
                  <td className="px-4 py-2.5 text-gray-900 dark:text-white font-medium text-xs">{b.brand || "Unknown"}</td>
                  <td className="px-4 py-2.5 text-right text-xs font-bold" style={{ color: "#b00000" }}>{b.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// ── MAIN REPORTS PAGE ────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
const Reports = () => {
  const { axiosInstance } = useContext(AppContext);

  const [reports, setReports]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [viewReport, setViewReport]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [generating, setGenerating]   = useState(false);
  const [sending, setSending]         = useState(null);
  const [typeFilter, setTypeFilter]   = useState("");
  const [yearFilter, setYearFilter]   = useState(String(new Date().getFullYear()));

  // Generate modal state
  const [genModal, setGenModal]   = useState(false);
  const [genType, setGenType]     = useState("sales");
  const [genMonth, setGenMonth]   = useState(String(new Date().getMonth() + 1));
  const [genYear, setGenYear]     = useState(String(new Date().getFullYear()));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  // ── Fetch ──────────────────────────────────────────────────────
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter) params.append("type", typeFilter);
      if (yearFilter) params.append("year", yearFilter);
      const { data } = await axiosInstance.get(`/api/reports/all?${params}`);
      if (data.success) setReports(data.reports);
      else errorToast(data.message);
    } catch { errorToast("Failed to load reports"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, [typeFilter, yearFilter]);

  // ── Generate ───────────────────────────────────────────────────
  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    const tid = toast.loading("Generating report...", { style: toastStyle });
    try {
      const { data } = await axiosInstance.post("/api/reports/generate", {
        type:  genType,
        month: Number(genMonth),
        year:  Number(genYear),
      });
      toast.dismiss(tid);
      if (data.success) {
        successToast("Report generated!");
        setGenModal(false);
        fetchReports();
      } else errorToast(data.message);
    } catch (err) {
      toast.dismiss(tid);
      errorToast(err.response?.data?.message || "Generation failed");
    } finally { setGenerating(false); }
  };

  // ── Send email ─────────────────────────────────────────────────
  const handleSendEmail = async (id) => {
    setSending(id);
    const tid = toast.loading("Sending email...", { style: toastStyle });
    try {
      const { data } = await axiosInstance.post(`/api/reports/${id}/send-email`);
      toast.dismiss(tid);
      if (data.success) {
        successToast("Report emailed to admin!");
        setReports(prev => prev.map(r => r._id === id ? { ...r, emailSent: true } : r));
      } else errorToast(data.message);
    } catch { toast.dismiss(tid); errorToast("Failed to send email"); }
    finally { setSending(null); }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id, password) => {
    setDeleteLoading(true);
    try {
      const { data } = await axiosInstance.delete(`/api/reports/${id}`, {
        data: { deletePassword: password },
      });
      if (data.success) {
        successToast("Report deleted");
        setReports(prev => prev.filter(r => r._id !== id));
        setDeleteTarget(null);
      } else errorToast(data.message);
    } catch (err) {
      errorToast(err.response?.data?.message || "Delete failed");
    } finally { setDeleteLoading(false); }
  };

  // ── Skeleton ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-[#1a1a1a]" />)}
        </div>
        <div className="h-10 rounded-lg bg-gray-200 dark:bg-[#1a1a1a]" />
        {[1,2,3].map(i => <div key={i} className="h-16 rounded-lg bg-gray-100 dark:bg-[#111]" />)}
      </div>
    );
  }

  const salesReports  = reports.filter(r => r.type === "sales").length;
  const repairReports = reports.filter(r => r.type === "repair").length;
  const emailedCount  = reports.filter(r => r.emailSent).length;

  return (
    <div className="text-gray-900 dark:text-white space-y-5">

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total Reports"  value={reports.length}  color="text-blue-500 dark:text-blue-400"    border="border-blue-500/20"   />
        <Stat label="Sales Reports"  value={salesReports}    color="text-green-500 dark:text-green-400"  border="border-green-500/20"  />
        <Stat label="Repair Reports" value={repairReports}   color="text-amber-500 dark:text-amber-400"  border="border-amber-500/20"  />
        <Stat label="Emails Sent"    value={emailedCount}    color="text-purple-500 dark:text-purple-400" border="border-purple-500/20" />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={inputCls}>
            <option value="">All Types</option>
            <option value="sales">Sales</option>
            <option value="repair">Repair</option>
          </select>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className={inputCls}>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={fetchReports}
            className="p-2 rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            title="Refresh">
            <FaSync size={12} />
          </button>
        </div>
        <button onClick={() => setGenModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition">
          <FaPlus size={11} /> Generate Report
        </button>
      </div>

      {/* ── Reports List ── */}
      <div className={`${cardCls} overflow-hidden`}>
        <div className="px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <FaChartBar style={{ color: "#b00000" }} size={13} /> Monthly Reports
          </div>
          <span className="text-xs text-gray-400">{reports.length} records</span>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <FaFileAlt size={28} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm">No reports found. Generate your first report.</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
            {reports.map(r => (
              <div key={r._id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  r.type === "sales"
                    ? "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20"
                    : "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20"
                }`}>
                  {r.type === "sales"
                    ? <FaShoppingCart className="text-green-500" size={13} />
                    : <FaTools className="text-blue-500 dark:text-blue-400" size={13} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{r.monthLabel}</div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                    <span className="capitalize">{r.type} report</span>
                    <span>·</span>
                    <span>Generated {new Date(r.generatedAt).toLocaleDateString()}</span>
                    {r.emailSent && (
                      <>
                        <span>·</span>
                        <span className="text-green-500 flex items-center gap-1"><FaCheck size={8} /> Emailed</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Key metric */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  {r.type === "sales" ? (
                    <>
                      <div className="text-xs font-mono font-bold text-green-600 dark:text-green-400">{Rs(r.totalRevenue)}</div>
                      <div className="text-[10px] text-gray-400">{r.totalSales} sales</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{Rs(r.totalRepairIncome)}</div>
                      <div className="text-[10px] text-gray-400">{r.totalRepairs} jobs</div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => setViewReport(r)}
                    className="p-1.5 rounded border border-blue-200 dark:border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                    title="View Report">
                    <FaEye size={11} />
                  </button>
                  <button
                    onClick={() => handleSendEmail(r._id)}
                    disabled={sending === r._id}
                    className="p-1.5 rounded border border-green-200 dark:border-green-500/20 text-green-500 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition disabled:opacity-40"
                    title="Send Email">
                    {sending === r._id
                      ? <div className="w-3 h-3 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                      : <FaEnvelope size={11} />}
                  </button>
                  <button onClick={() => setDeleteTarget(r)}
                    className="p-1.5 rounded border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    title="Delete">
                    <FaTrash size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ════ GENERATE MODAL ════ */}
      {genModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[400px] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#111111]">
            <div className="h-[3px]" style={{ background: "#b00000" }} />
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Generate Report</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manually generate a monthly report</p>
              </div>
              <button onClick={() => setGenModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition"><FaTimes /></button>
            </div>
            <form onSubmit={handleGenerate} className="p-5 space-y-4">
              <div>
                <label className="text-[11px] text-gray-400 font-semibold tracking-wider block mb-1.5">REPORT TYPE</label>
                <div className="grid grid-cols-2 gap-2">
                  {["sales","repair"].map(t => (
                    <button key={t} type="button" onClick={() => setGenType(t)}
                      className={`py-2 rounded-lg text-sm font-medium border transition capitalize ${
                        genType === t
                          ? "border-[#b00000] text-[#b00000] bg-[#b00000]/10"
                          : "border-gray-300 dark:border-[#1f1f1f] text-gray-500 bg-gray-50 dark:bg-[#0a0a0a]"
                      }`}>
                      {t === "sales" ? <><FaShoppingCart className="inline mr-1" size={11} />Sales</> : <><FaTools className="inline mr-1" size={11} />Repair</>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold tracking-wider block mb-1.5">MONTH</label>
                  <select value={genMonth} onChange={e => setGenMonth(e.target.value)} className={`${inputCls} w-full`}>
                    {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 font-semibold tracking-wider block mb-1.5">YEAR</label>
                  <select value={genYear} onChange={e => setGenYear(e.target.value)} className={`${inputCls} w-full`}>
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setGenModal(false)}
                  className="flex-1 py-2 rounded-lg text-sm border border-gray-300 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  Cancel
                </button>
                <button type="submit" disabled={generating}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {generating ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ VIEW REPORT MODAL ════ */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-[700px] my-4 rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#0f0f0f]">
            <div className="h-[3px]" style={{ background: "#b00000" }} />
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between sticky top-0 bg-white dark:bg-[#0f0f0f] z-10">
              <div className="flex items-center gap-3">
                {viewReport.type === "sales"
                  ? <FaShoppingCart style={{ color: "#22c55e" }} size={14} />
                  : <FaTools style={{ color: "#3b82f6" }} size={14} />}
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-sm">{viewReport.monthLabel}</h2>
                  <p className="text-[10px] text-gray-400 capitalize">{viewReport.type} report · Generated {new Date(viewReport.generatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {viewReport.emailSent && (
                  <span className="text-[10px] text-green-500 flex items-center gap-1 border border-green-500/20 bg-green-500/5 px-2 py-1 rounded-full">
                    <FaCheck size={8} /> Emailed
                  </span>
                )}
                <button
                  onClick={() => { handleSendEmail(viewReport._id); }}
                  disabled={sending === viewReport._id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-500/30 text-green-500 hover:bg-green-500/10 transition disabled:opacity-40">
                  <FaEnvelope size={10} /> Send Email
                </button>
                <button onClick={() => setViewReport(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition ml-1"><FaTimes /></button>
              </div>
            </div>
            <div className="p-5 overflow-y-auto max-h-[80vh]">
              {viewReport.type === "sales"
                ? <SalesReportDetail  report={viewReport} />
                : <RepairReportDetail report={viewReport} />}
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE MODAL ════ */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Report"
        message={deleteTarget ? `Delete ${deleteTarget.monthLabel} ${deleteTarget.type} report? This cannot be undone.` : ""}
        variant="delete"
        actionLabel="Delete"
        loading={deleteLoading}
        onConfirm={(password) => handleDelete(deleteTarget._id, password)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Reports;