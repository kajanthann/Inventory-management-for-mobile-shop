import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import {
  FaFileAlt, FaEye, FaTrash, FaSync, FaPlus, FaTimes, FaCheck,
  FaEnvelope, FaDownload, FaShoppingCart, FaTools, FaCalendarAlt, FaBolt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import ConfirmDeleteModal from "../component/ConfirmDeleteModal";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

// ── Helpers ───────────────────────────────────────────────────────
const ACCENT = "#b00000";
const Rs = (v) => `Rs ${Number(v || 0).toLocaleString()}`;
const PIE_COLORS = ["#b00000", "#e0603f", "#f59e0b", "#c98a6b", "#8b5cf6", "#10b981"];

const toastStyle = { background: "#1a1a1a", color: "#fff", border: "1px solid #2a2a2a", borderRadius: "10px", fontSize: "13px" };
const successToast = (m) => toast.success(m, { style: { ...toastStyle, borderLeft: "3px solid #22c55e" }, iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" } });
const errorToast   = (m) => toast.error(m,   { style: { ...toastStyle, borderLeft: "3px solid #b00000" }, iconTheme: { primary: "#b00000", secondary: "#1a1a1a" } });

const panelCls = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#141414]";
const inputCls = "px-3 py-2 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white";

// Tracks Tailwind "dark" class so charts / PDF follow the theme
const useIsDark = () => {
  const get = () => document.documentElement.classList.contains("dark");
  const [dark, setDark] = useState(get);
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(get()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

// ── Small UI blocks ───────────────────────────────────────────────
const Stat = ({ label, value, color, border }) => (
  <div className={`border ${border} rounded-xl p-3 sm:p-4 bg-white dark:bg-[rgba(17,17,17,0.6)]`}>
    <div className={`text-[10px] font-semibold uppercase tracking-wider ${color} mb-1`}>{label}</div>
    <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
  </div>
);

const Panel = ({ title, children, className = "" }) => (
  <div className={`${panelCls} p-4 ${className}`}>
    {title && <div className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-3 text-center">{title}</div>}
    {children}
  </div>
);

const Kpi = ({ label, value, sub }) => (
  <div className={`${panelCls} p-4 text-center`}>
    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</div>
    <div className="mt-2 rounded-lg py-3 px-2 text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white bg-[#b00000]/10 break-words">
      {value}
    </div>
    {sub && <div className="mt-2 text-[11px] font-semibold text-[#b00000] dark:text-red-400 truncate">{sub}</div>}
  </div>
);

const Empty = ({ text }) => (
  <div className="h-[180px] flex items-center justify-center text-xs text-gray-400">{text}</div>
);

// ════════════════════════════════════════════════════════════════
// ── MONTHLY DASHBOARD (sales + repair in one) ────────────────────
// ════════════════════════════════════════════════════════════════
const MonthlyDashboard = ({ group, isDark }) => {
  const s = group.sales  || {};
  const r = group.repair || {};

  const axis = isDark ? "#9ca3af" : "#6b7280";
  const grid = isDark ? "#262626" : "#e5e7eb";
  const tip  = {
    contentStyle: {
      background: isDark ? "#111" : "#fff",
      border: `1px solid ${grid}`,
      borderRadius: 8,
      fontSize: 11,
      color: isDark ? "#fff" : "#111",
    },
  };

  const topProducts = s.topProducts || [];
  const bestProduct = [...topProducts].sort((a, b) => b.revenue - a.revenue)[0];
  const dailySales  = s.dailySales  || [];

  const paymentData = Object.entries(s.paymentBreakdown || {})
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  const repairStatus = [
    { name: "Completed", value: r.totalDone     || 0 },
    { name: "Pending",   value: r.totalPending  || 0 },
    { name: "Returned",  value: r.totalReturned || 0 },
  ];
  const warrantyData = [
    { name: "Warranty",     value: r.warrantyBreakdown?.warranty    || 0 },
    { name: "Non-Warranty", value: r.warrantyBreakdown?.nonWarranty || 0 },
  ].filter((d) => d.value > 0);
  const brands = (r.brandBreakdown || []).slice(0, 6);
  const maxBrand = Math.max(1, ...brands.map((b) => b.count));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ background: ACCENT }}>Month</span>
          <span className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#141414] text-gray-900 dark:text-white">
            {group.monthLabel}
          </span>
        </div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400">
          SmartSpider · Sales &amp; Repair Report
        </div>
      </div>

      {/* ───── SALES ───── */}
      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100">
        <FaShoppingCart style={{ color: ACCENT }} size={13} /> Sales Overview
      </div>

      {!group.sales ? (
        <div className={`${panelCls} p-6 text-center text-xs text-gray-400`}>Sales report not generated for this month.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-4">
            {/* Left KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <Kpi label="Total Sale"  value={Rs(s.totalRevenue)} sub={`${s.totalSales || 0} orders`} />
              <Kpi label="Highest Sale for Month" value={bestProduct ? Rs(bestProduct.revenue) : "—"} sub={bestProduct?.name} />
              <Kpi label="Total Profit" value={Rs(s.totalProfit)} />
              <Kpi label="Discount Given" value={Rs(s.totalDiscount)} />
            </div>

            {/* Right charts */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Panel title="Total Sale by Payment Method">
                  {paymentData.length === 0 ? <Empty text="No data" /> : (
                    <ResponsiveContainer width="100%" height={190}>
                      <PieChart>
                        <Pie data={paymentData} cx="50%" cy="45%" innerRadius={40} outerRadius={68} paddingAngle={3}
                          dataKey="value" stroke="none" isAnimationActive={false}
                          label={({ value }) => value} labelLine={false}>
                          {paymentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip {...tip} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: axis }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Panel>

                <Panel title="Extra Income · Paid · Change">
                  <div className="space-y-3 pt-2">
                    {[
                      { l: "Extra Income", v: s.totalExtraIncome, c: "#8b5cf6" },
                      { l: "Amount Paid",  v: s.totalAmountPaid,  c: "#06b6d4" },
                      { l: "Change Given", v: s.totalChange,      c: "#f43f5e" },
                    ].map((x) => (
                      <div key={x.l} className="flex items-center justify-between rounded-lg px-3 py-3 border border-gray-200 dark:border-[#1f1f1f]">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="w-2 h-2 rounded-full" style={{ background: x.c }} /> {x.l}
                        </div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{Rs(x.v)}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              <Panel title="Total Sale by Product">
                {topProducts.length === 0 ? <Empty text="No data" /> : (
                  <ResponsiveContainer width="100%" height={Math.max(150, topProducts.length * 34)}>
                    <BarChart data={topProducts} layout="vertical" margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                      <XAxis type="number" tick={{ fill: axis, fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" width={110} tick={{ fill: axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip {...tip} formatter={(v) => Rs(v)} />
                      <Bar dataKey="revenue" fill={ACCENT} radius={[0, 4, 4, 0]} name="Revenue" isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Panel>
            </div>
          </div>

          {/* Daily trend */}
          <Panel title="Daily Sales Trend">
            {dailySales.length === 0 ? <Empty text="No sales this month" /> : (
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={dailySales} margin={{ left: 0, right: 10 }}>
                  <defs>
                    <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={ACCENT} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: axis, fontSize: 9 }} axisLine={false} tickLine={false}
                    tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fill: axis, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} formatter={(v) => Rs(v)} />
                  <Area type="monotone" dataKey="revenue" stroke={ACCENT} strokeWidth={2} fill="url(#dailyFill)"
                    name="Revenue" isAnimationActive={false} dot={{ r: 2, fill: ACCENT }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Panel>

          {/* Daily table */}
          {dailySales.length > 0 && (
            <div className={`${panelCls} overflow-hidden`}>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-white" style={{ background: ACCENT }}>
                    <th className="px-4 py-2.5 text-left font-semibold">Date</th>
                    <th className="px-4 py-2.5 text-center font-semibold">Orders</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Total Sale</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Avg / Order</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySales.map((d, i) => (
                    <tr key={d.date} className={`border-t border-gray-100 dark:border-[#1f1f1f] ${i % 2 ? "bg-gray-50 dark:bg-white/[0.02]" : ""}`}>
                      <td className="px-4 py-2 text-gray-900 dark:text-white font-medium">{d.date}</td>
                      <td className="px-4 py-2 text-center text-gray-600 dark:text-gray-300">{d.sales}</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-gray-900 dark:text-white">{Rs(d.revenue)}</td>
                      <td className="px-4 py-2 text-right font-mono text-gray-500 dark:text-gray-400">
                        {Rs(d.sales ? Math.round(d.revenue / d.sales) : 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ───── REPAIR ───── */}
      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100 pt-2">
        <FaTools style={{ color: ACCENT }} size={13} /> Repair Overview
      </div>

      {!group.repair ? (
        <div className={`${panelCls} p-6 text-center text-xs text-gray-400`}>Repair report not generated for this month.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi label="Total Jobs"    value={r.totalRepairs || 0} />
            <Kpi label="Completed"     value={r.totalDone || 0} />
            <Kpi label="Pending"       value={r.totalPending || 0} sub={`${r.totalReturned || 0} returned`} />
            <Kpi label="Repair Income" value={Rs(r.totalRepairIncome)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Panel title="Repairs by Status">
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={repairStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: axis, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} name="Jobs">
                    <Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#8b5cf6" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Warranty Breakdown">
              {warrantyData.length === 0 ? <Empty text="No data" /> : (
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie data={warrantyData} cx="50%" cy="45%" innerRadius={40} outerRadius={68} paddingAngle={3}
                      dataKey="value" stroke="none" isAnimationActive={false}>
                      <Cell fill="#3b82f6" /><Cell fill={ACCENT} />
                    </Pie>
                    <Tooltip {...tip} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: axis }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <Panel title="Top Brands Repaired">
              {brands.length === 0 ? <Empty text="No data" /> : (
                <div className="space-y-3 pt-1">
                  {brands.map((b) => (
                    <div key={b.brand}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-gray-600 dark:text-gray-300 truncate">{b.brand || "Unknown"}</span>
                        <span className="font-bold" style={{ color: ACCENT }}>{b.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(b.count / maxBrand) * 100}%`, background: ACCENT }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </>
      )}

      {/* Footer total */}
      <div className="rounded-xl px-5 py-4 flex items-center justify-between text-white" style={{ background: ACCENT }}>
        <span className="text-xs font-semibold uppercase tracking-wider">Combined Income (Sales + Repairs)</span>
        <span className="text-lg font-extrabold">{Rs((s.totalRevenue || 0) + (r.totalRepairIncome || 0))}</span>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
// ── MAIN REPORTS PAGE ────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
const Reports = () => {
  const { axiosInstance } = useContext(AppContext);
  const isDark = useIsDark();
  const pdfRef = useRef(null);

  const now = new Date();
  const currentYear  = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [reports, setReports]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [yearFilter, setYearFilter] = useState(String(currentYear));
  const [viewKey, setViewKey]       = useState(null);
  const [generating, setGenerating] = useState(false);
  const [pdfBusy, setPdfBusy]       = useState(null); // "download" | "email" | null
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  // ── Fetch ──────────────────────────────────────────────────────
  const fetchReports = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data } = await axiosInstance.get(`/api/reports/all?year=${yearFilter}`);
      if (data.success) setReports(data.reports);
      else errorToast(data.message);
    } catch { errorToast("Failed to load reports"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchReports(); }, [yearFilter]);

  // ── Group sales + repair into one record per month ─────────────
  const months = useMemo(() => {
    const map = {};
    reports.forEach((r) => {
      const key = `${r.year}-${r.month}`;
      if (!map[key]) map[key] = { key, month: r.month, year: r.year, monthLabel: r.monthLabel, sales: null, repair: null };
      map[key][r.type] = r;
    });
    return Object.values(map).sort((a, b) => b.year - a.year || b.month - a.month);
  }, [reports]);

  const viewGroup = months.find((m) => m.key === viewKey) || null;

  // ── Generate (sales + repair together) ─────────────────────────
  const generateMonth = async (month, year) => {
    setGenerating(true);
    const tid = toast.loading("Generating report...", { style: toastStyle });
    try {
      await Promise.all(
        ["sales", "repair"].map((type) =>
          axiosInstance.post("/api/reports/generate", { type, month, year })
        )
      );
      toast.dismiss(tid);
      successToast("Report generated!");
      if (String(year) !== yearFilter) setYearFilter(String(year));
      else await fetchReports(true);
    } catch (err) {
      toast.dismiss(tid);
      errorToast(err.response?.data?.message || "Generation failed");
    } finally { setGenerating(false); }
  };

  // ── PDF builder (captures exactly what you see) ────────────────
  const buildPdf = async () => {
    const el = pdfRef.current;
    if (!el) throw new Error("Nothing to export");
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: isDark ? "#0f0f0f" : "#ffffff",
      windowWidth: el.scrollWidth,
    });
    const w = canvas.width / 2;
    const h = canvas.height / 2;
    const pdf = new jsPDF({ orientation: w > h ? "l" : "p", unit: "px", format: [w, h], hotfixes: ["px_scaling"] });
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, w, h);
    return pdf;
  };

  const handleDownloadPdf = async () => {
    if (!viewGroup) return;
    setPdfBusy("download");
    try {
      const pdf = await buildPdf();
      pdf.save(`SmartSpider-${viewGroup.monthLabel.replace(/\s+/g, "-")}-Report.pdf`);
      successToast("PDF downloaded");
    } catch { errorToast("PDF generation failed"); }
    finally { setPdfBusy(null); }
  };

  const handleEmailPdf = async () => {
    if (!viewGroup) return;
    setPdfBusy("email");
    const tid = toast.loading("Sending PDF...", { style: toastStyle });
    try {
      const pdf = await buildPdf();
      const pdfBase64 = pdf.output("datauristring").split(",")[1];
      const { data } = await axiosInstance.post(`/api/reports/${(viewGroup.sales || viewGroup.repair)._id}/send-pdf`, {
        monthLabel: viewGroup.monthLabel,
        pdfBase64,
      });
      toast.dismiss(tid);
      if (data.success) {
        successToast("PDF emailed to admin!");
        setReports((prev) => prev.map((r) =>
          r.month === viewGroup.month && r.year === viewGroup.year ? { ...r, emailSent: true } : r));
      } else errorToast(data.message);
    } catch (err) {
      toast.dismiss(tid);
      errorToast(err.response?.data?.message || "Failed to send email");
    } finally { setPdfBusy(null); }
  };

  // ── Delete (both sales + repair of that month) ─────────────────
  const handleDelete = async (group, password) => {
  setDeleteLoading(true);
  try {
    const ids = [group.sales?._id, group.repair?._id].filter(Boolean);
    await Promise.all(ids.map((id) =>
      axiosInstance.delete(`/api/reports/${id}`, {
        headers: { "x-admin-password": password },
      })));
    successToast("Report deleted");
    setReports((prev) => prev.filter((r) => !ids.includes(r._id)));
    setDeleteTarget(null);
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err.response?.data?.message || "Delete failed" };
  } finally { setDeleteLoading(false); }
};

  // ── Skeleton ───────────────────────────────────────────────────
  if (loading && reports.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-[#1a1a1a]" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-xl bg-gray-100 dark:bg-[#111]" />)}
        </div>
      </div>
    );
  }

  const totalRevenue = months.reduce((s, m) => s + (m.sales?.totalRevenue || 0), 0);
  const totalRepair  = months.reduce((s, m) => s + (m.repair?.totalRepairIncome || 0), 0);
  const totalProfit  = months.reduce((s, m) => s + (m.sales?.totalProfit || 0), 0);
  const currentExists = months.some((m) => m.month === currentMonth && m.year === currentYear);

  return (
    <div className="text-gray-900 dark:text-white space-y-5">

      {/* ── Year summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label={`Months (${yearFilter})`} value={months.length}   color="text-blue-500 dark:text-blue-400"       border="border-blue-500/20" />
        <Stat label="Sales Revenue"  value={Rs(totalRevenue)}         color="text-green-500 dark:text-green-400"     border="border-green-500/20" />
        <Stat label="Total Profit"   value={Rs(totalProfit)}          color="text-emerald-500 dark:text-emerald-400" border="border-emerald-500/20" />
        <Stat label="Repair Income"  value={Rs(totalRepair)}          color="text-amber-500 dark:text-amber-400"     border="border-amber-500/20" />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className={inputCls}>
            {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={() => fetchReports()}
            className="p-2 rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            title="Refresh">
            <FaSync size={12} />
          </button>
        </div>
        <button onClick={() => generateMonth(currentMonth, currentYear)} disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition disabled:opacity-50">
          {generating
            ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : currentExists ? <FaSync size={11} /> : <FaPlus size={11} />}
          {currentExists ? "Refresh This Month" : "Generate This Month"}
        </button>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-gray-400">
        <FaBolt className="text-amber-500" size={10} />
        Reports are auto-generated on the last day of every month. Use the button for the current month anytime.
      </div>

      {/* ── Month cards ── */}
      {months.length === 0 ? (
        <div className={`${panelCls} text-center py-16 text-gray-400 dark:text-gray-600`}>
          <FaFileAlt size={28} className="mx-auto mb-3 opacity-30" />
          <div className="text-sm">No reports for {yearFilter}. Generate this month's report.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {months.map((m) => {
            const isCurrent = m.month === currentMonth && m.year === currentYear;
            const emailed   = m.sales?.emailSent || m.repair?.emailSent;
            return (
              <div key={m.key}
                className={`${panelCls} overflow-hidden hover:border-[#b00000]/60 transition group`}>
                <div className="h-[3px]" style={{ background: ACCENT }} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#b00000]/10">
                        <FaCalendarAlt style={{ color: ACCENT }} size={14} />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{m.monthLabel}</div>
                        <div className="text-[10px] text-gray-400">
                          {isCurrent ? "In progress" : "Completed month"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {isCurrent && <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">LIVE</span>}
                      {emailed && <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1"><FaCheck size={7} /> Sent</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-lg p-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-[#1f1f1f]">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1"><FaShoppingCart size={9} /> Sales</div>
                      <div className="text-xs font-bold font-mono text-green-600 dark:text-green-400">{Rs(m.sales?.totalRevenue)}</div>
                      <div className="text-[10px] text-gray-400">{m.sales?.totalSales || 0} orders</div>
                    </div>
                    <div className="rounded-lg p-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-[#1f1f1f]">
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1"><FaTools size={9} /> Repairs</div>
                      <div className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">{Rs(m.repair?.totalRepairIncome)}</div>
                      <div className="text-[10px] text-gray-400">{m.repair?.totalRepairs || 0} jobs</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setViewKey(m.key)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-white bg-[#b00000] hover:bg-[#8b0000] transition">
                      <FaEye size={11} /> View Report
                    </button>
                    <button onClick={() => setDeleteTarget(m)}
                      className="px-3 rounded-lg border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                      title="Delete">
                      <FaTrash size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════ VIEW MODAL ════ */}
      {viewGroup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="w-full max-w-[1050px] max-h-[94vh] flex flex-col rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden bg-white dark:bg-[#0f0f0f]">
            <div className="h-[3px] flex-shrink-0" style={{ background: ACCENT }} />

            {/* Modal header */}
            <div className="px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
              <div>
                <h2 className="font-bold text-sm">{viewGroup.monthLabel} — Full Report</h2>
                <p className="text-[10px] text-gray-400">
                  Generated {new Date((viewGroup.sales || viewGroup.repair).generatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => generateMonth(viewGroup.month, viewGroup.year)} disabled={generating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-300 dark:border-[#1f1f1f] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-40">
                  <FaSync size={10} className={generating ? "animate-spin" : ""} /> Regenerate
                </button>
                <button onClick={handleDownloadPdf} disabled={!!pdfBusy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 transition disabled:opacity-40">
                  {pdfBusy === "download"
                    ? <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    : <FaDownload size={10} />} Download PDF
                </button>
                <button onClick={handleEmailPdf} disabled={!!pdfBusy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-500/30 text-green-500 hover:bg-green-500/10 transition disabled:opacity-40">
                  {pdfBusy === "email"
                    ? <div className="w-3 h-3 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                    : <FaEnvelope size={10} />} Email PDF
                </button>
                <button onClick={() => setViewKey(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition ml-1">
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Dashboard (this block is what becomes the PDF) */}
            <div className="overflow-y-auto flex-1">
              <div ref={pdfRef} className="p-4 sm:p-6 bg-gray-50 dark:bg-[#0f0f0f]">
                <MonthlyDashboard group={viewGroup} isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE MODAL ════ */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete Report"
        message={deleteTarget ? `Delete ${deleteTarget.monthLabel} sales & repair report? This cannot be undone.` : ""}
        variant="delete"
        actionLabel="Delete"
        loading={deleteLoading}
        onConfirm={(password) => handleDelete(deleteTarget, password)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Reports;