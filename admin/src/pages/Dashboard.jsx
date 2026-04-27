import React, { useState, useEffect, useContext } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  FaBox, FaExclamationTriangle, FaShoppingCart, FaTools,
  FaChartLine, FaDollarSign, FaFire, FaClock, FaArrowUp,
  FaSync, FaWrench,
} from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const Rs  = (v) => `Rs ${Number(v || 0).toLocaleString()}`;
const cardCls = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";

const CAT_COLORS = ["#b00000","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#06b6d4","#f43f5e","#84cc16"];
const PAY_COLORS = { Cash: "#b00000", Card: "#3b82f6", "Bank Transfer": "#22c55e", Online: "#f59e0b" };

const tooltipStyle = {
  background: "#111", border: "1px solid #1f1f1f",
  borderRadius: 8, padding: "8px 12px",
};

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 12, color: p.color, margin: "2px 0", fontWeight: 600 }}>
          {p.name}: {currency ? Rs(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const statusColor = (s) => {
  switch(s) {
    case "completed": return "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20";
    case "pending":   return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    case "cancelled": return "text-red-500 bg-red-500/10 border-red-500/20";
    case "returned":  return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    default:          return "text-gray-500 bg-gray-500/10 border-gray-500/20";
  }
};

// ── Period toggle button ──────────────────────────────────────────
const PeriodBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-lg text-xs font-medium transition border ${
      active
        ? "bg-[#b00000] border-[#b00000] text-white"
        : "border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    }`}
  >
    {children}
  </button>
);

const Dashboard = () => {
  const { axiosInstance } = useContext(AppContext);

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState("monthly"); // daily | weekly | monthly | yearly
  const [kpiPeriod, setKpiPeriod] = useState("today"); // today | week | month | year | allTime

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data: res } = await axiosInstance.get("/api/admin/dashboard");
      if (res.success) setData(res);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  // ── Chart data based on period toggle ────────────────────────
  const chartData = data?.charts?.[period] || [];
  const chartKey  = { daily: "day", weekly: "week", monthly: "month", yearly: "year" }[period];

  // ── KPI values ────────────────────────────────────────────────
  const kpi     = data?.kpi?.[kpiPeriod] || { revenue: 0, profit: 0, sales: 0 };
  const kpiLabel = { today: "Today", week: "This Week", month: "This Month", year: "This Year", allTime: "All Time" }[kpiPeriod];

  // ── Skeleton ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_,i) => <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-[#1a1a1a]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 h-64 rounded-xl bg-gray-200 dark:bg-[#1a1a1a]" />
          <div className="h-64 rounded-xl bg-gray-200 dark:bg-[#1a1a1a]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_,i) => <div key={i} className="h-52 rounded-xl bg-gray-200 dark:bg-[#1a1a1a]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 dark:text-white space-y-4 sm:space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Live overview — SmartSpider POS</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition w-fit"
        >
          <FaSync size={10} /> Refresh
        </button>
      </div>

      {/* ── KPI Period Toggle ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400 dark:text-gray-500 mr-1">Show:</span>
        {["today","week","month","year","allTime"].map(p => (
          <PeriodBtn key={p} active={kpiPeriod === p} onClick={() => setKpiPeriod(p)}>
            {{ today:"Today", week:"This Week", month:"This Month", year:"This Year", allTime:"All Time" }[p]}
          </PeriodBtn>
        ))}
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: <FaDollarSign />, label: `${kpiLabel} Revenue`,  value: Rs(kpi.revenue), sub: `${kpi.sales} sales`,            color: "#22c55e", border: "border-green-500/20"  },
          { icon: <FaFire />,       label: `${kpiLabel} Profit`,   value: Rs(kpi.profit),  sub: "net earnings",                  color: "#b00000", border: "border-red-500/20"    },
          { icon: <FaBox />,        label: "Inventory Value",      value: Rs(data?.inventoryValue), sub: `${data?.totalProducts || 0} products`, color: "#f59e0b", border: "border-yellow-500/20" },
          { icon: <FaTools />,      label: "Pending Repairs",      value: data?.repairStats?.pending || 0, sub: `${data?.repairStats?.total || 0} total jobs`, color: "#3b82f6", border: "border-blue-500/20" },
        ].map((s, i) => (
          <div key={i} className={`border ${s.border} rounded-xl p-3 sm:p-4 backdrop-blur-sm bg-white/80 dark:bg-[rgba(17,17,17,0.6)]`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider leading-tight" style={{ color: s.color }}>
                {s.label}
              </span>
              <span style={{ color: s.color, opacity: 0.5, fontSize: 13 }}>{s.icon}</span>
            </div>
            <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{s.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <FaArrowUp size={9} className="text-green-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-500 truncate">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue & Profit Chart ── */}
      <div className={`${cardCls} p-3 sm:p-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Revenue & Profit</div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              { {daily:"Last 14 days", weekly:"Last 8 weeks", monthly:"Last 12 months", yearly:"Last 5 years"}[period] }
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["daily","weekly","monthly","yearly"].map(p => (
              <PeriodBtn key={p} active={period === p} onClick={() => setPeriod(p)}>
                {{daily:"Daily", weekly:"Weekly", monthly:"Monthly", yearly:"Yearly"}[p]}
              </PeriodBtn>
            ))}
          </div>
        </div>

        {chartData.every(d => d.revenue === 0) ? (
          <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
            No sales data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#b00000" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#b00000" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey={chartKey} tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip currency />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#b00000" strokeWidth={2} fill="url(#gRev)" dot={false} activeDot={{ r: 4, fill: "#b00000" }} />
              <Area type="monotone" dataKey="profit"  name="Profit"  stroke="#22c55e" strokeWidth={2} fill="url(#gPro)" dot={false} activeDot={{ r: 4, fill: "#22c55e" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Row: Payment Pie + Category Pie + Top Sellers ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Payment Methods */}
        <div className={`${cardCls} p-3 sm:p-4`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Payment Methods</div>
          <div className="text-[10px] text-gray-500 mb-3">All-time distribution</div>
          {(data?.paymentChart || []).length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-400 text-xs">No data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={data.paymentChart} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                    {data.paymentChart.map((entry, i) => (
                      <Cell key={i} fill={PAY_COLORS[entry.name] || CAT_COLORS[i]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n, p) => [`${v} sales`, p.payload.name]} contentStyle={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:8, fontSize:12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                {data.paymentChart.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PAY_COLORS[d.name] || CAT_COLORS[i] }} />
                    <span className="text-[10px] text-gray-500 truncate">{d.name}</span>
                    <span className="text-[10px] font-semibold text-gray-900 dark:text-white ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Inventory by Category */}
        <div className={`${cardCls} p-3 sm:p-4`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Inventory by Category</div>
          <div className="text-[10px] text-gray-500 mb-3">Value distribution</div>
          {(data?.categoryChart || []).length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-400 text-xs">No data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={data.categoryChart} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                    {data.categoryChart.map((_, i) => (
                      <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => Rs(v)} contentStyle={{ background:"#111", border:"1px solid #1f1f1f", borderRadius:8, fontSize:12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2 max-h-[80px] overflow-y-auto pr-1">
                {data.categoryChart.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                    <span className="text-[10px] text-gray-500 flex-1 truncate">{d.name}</span>
                    <span className="text-[10px] font-semibold text-gray-900 dark:text-white">{Rs(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Sellers */}
        <div className={`${cardCls} p-3 sm:p-4 sm:col-span-2 lg:col-span-1`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <FaFire size={12} className="text-[#b00000]" /> Top Selling Products
          </div>
          <div className="text-[10px] text-gray-500 mb-3">By units sold (all time)</div>
          {(data?.topSellers || []).length === 0 ? (
            <div className="h-32 flex items-center justify-center text-gray-400 text-xs">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={data.topSellers.map(s => ({ ...s, name: s.name.length > 14 ? s.name.slice(0,14)+"…" : s.name }))} layout="vertical" margin={{ top:0, right:10, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                <XAxis type="number" tick={{ fill:"#6b7280", fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill:"#6b7280", fontSize:10 }} axisLine={false} tickLine={false} width={95} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="qty" name="Units Sold" radius={[0,4,4,0]}>
                  {(data.topSellers || []).map((_,i) => (
                    <Cell key={i} fill={i === 0 ? "#b00000" : i === 1 ? "#8b0000" : "#4a0000"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Row: Repair Trend + Recent Sales + Low Stock ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Repair Trend */}
        <div className={`${cardCls} p-3 sm:p-4`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <FaWrench size={11} className="text-[#b00000]" /> Repair Jobs — 6 Months
          </div>
          <div className="text-[10px] text-gray-500 mb-3">Pending / Done / Returned</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data?.repairChart || []} margin={{ top:5, right:5, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="month" tick={{ fill:"#6b7280", fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:"#6b7280", fontSize:10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pending"  name="Pending"   fill="#b00000" radius={[3,3,0,0]} />
              <Bar dataKey="done"     name="Done"      fill="#22c55e" radius={[3,3,0,0]} />
              <Bar dataKey="returned" name="Returned"  fill="#3b82f6" radius={[3,3,0,0]} />
              <Legend wrapperStyle={{ fontSize:10, color:"#6b7280", paddingTop:8 }} />
            </BarChart>
          </ResponsiveContainer>

          {/* Repair stat pills */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label:"Pending",  value: data?.repairStats?.pending  || 0, color:"text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
              { label:"Done",     value: data?.repairStats?.done     || 0, color:"text-green-500 bg-green-500/10 border-green-500/20"   },
              { label:"Returned", value: data?.repairStats?.returned || 0, color:"text-blue-500 bg-blue-500/10 border-blue-500/20"      },
            ].map(s => (
              <div key={s.label} className={`text-center px-2 py-1.5 rounded-lg border text-[10px] font-medium ${s.color}`}>
                <div className="text-base font-bold">{s.value}</div>
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaShoppingCart size={12} className="text-[#b00000]" /> Recent Sales
            </div>
            <span className="text-[10px] text-gray-400">{data?.kpi?.allTime?.sales || 0} total</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
            {(data?.recentSales || []).length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-xs">No sales yet</div>
            ) : (data.recentSales).map(s => (
              <div key={s._id} className="px-3 sm:px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                <div className="min-w-0 flex-1 mr-2">
                  <div className="text-[11px] font-mono font-bold text-[#b00000] dark:text-[#e05050]">{s.invoiceNo}</div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {s.customer?.name || "Walk-in"} · {s.date}
                  </div>
                  <div className="text-[10px] text-gray-400">{s.itemCount} item{s.itemCount !== 1 ? "s" : ""}</div>
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <div className="text-xs font-bold text-green-600 dark:text-green-400">{Rs(s.grandTotal)}</div>
                  <div className={`text-[9px] px-1.5 py-0.5 rounded-full border inline-block ${statusColor(s.status)}`}>
                    {s.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock + Pending Repairs */}
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">

          {/* Low Stock */}
          <div className="rounded-xl border border-yellow-500/20 overflow-hidden bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm">
            <div className="px-3 sm:px-4 py-2.5 border-b border-yellow-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-yellow-500">
                <FaExclamationTriangle size={11} /> Low Stock
              </div>
              <span className="text-[10px] text-yellow-500/60">{(data?.lowStock || []).length} items</span>
            </div>
            <div className="p-2 space-y-1.5 max-h-[160px] overflow-y-auto">
              {(data?.lowStock || []).length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-3">All stock levels OK ✓</p>
              ) : (data.lowStock).map((p) => (
                <div key={p._id} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-yellow-500/10 bg-yellow-500/[0.04]">
                  <div className="min-w-0 flex-1 mr-2">
                    <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{p.name}</div>
                    <div className="text-[10px] text-gray-500">{p.category}</div>
                  </div>
                  <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded border ${
                    p.qty === 0
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }`}>
                    {p.qty === 0 ? "Out" : `Qty: ${p.qty}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Repairs */}
          <div className={`${cardCls} overflow-hidden`}>
            <div className="px-3 sm:px-4 py-2.5 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FaTools size={11} className="text-[#b00000]" /> Pending Repairs
              </div>
              <span className="text-[10px] text-gray-400">{data?.repairStats?.pending || 0} jobs</span>
            </div>
            <div className="p-2 space-y-1.5 max-h-[160px] overflow-y-auto">
              {(data?.pendingRepairs || []).length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-3">No pending repairs ✓</p>
              ) : (data.pendingRepairs).map((r) => (
                <div key={r._id} className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[rgba(10,10,10,0.5)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900 dark:text-white truncate mr-2">{r.brand} {r.model}</span>
                    <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1">
                      <FaClock size={7} /> Pending
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate mt-0.5">{r.faultDescription}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-600">{r.tel1} · {r.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;