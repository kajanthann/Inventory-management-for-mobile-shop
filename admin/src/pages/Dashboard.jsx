import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  FaBox, FaExclamationTriangle, FaShoppingCart, FaTools,
  FaChartLine, FaDollarSign, FaFire, FaClock, FaArrowUp,
} from "react-icons/fa";

const PRODUCTS = [
  { id: 1, name: "iPhone 13",          category: "Smartphones", qty: 4,  cost: 200000, price: 250000 },
  { id: 2, name: "Samsung S24",        category: "Smartphones", qty: 12, cost: 180000, price: 220000 },
  { id: 3, name: "iPhone Charger 20W", category: "Charger",     qty: 3,  cost: 3500,   price: 5000   },
  { id: 4, name: "AirPods Pro 2",      category: "Airpods",     qty: 8,  cost: 28000,  price: 35000  },
  { id: 5, name: "USB-C Cable",        category: "Cable",       qty: 2,  cost: 600,    price: 1500   },
  { id: 6, name: "Samsung Tab S9",     category: "Tablets",     qty: 6,  cost: 90000,  price: 120000 },
  { id: 7, name: "Apple Watch S9",     category: "Wearables",   qty: 1,  cost: 70000,  price: 95000  },
  { id: 8, name: "Screen Protector",   category: "Covers",      qty: 40, cost: 400,    price: 1200   },
];

const SALES = [
  { id: 1, invoiceNo: "INV-0001", date: "2026-04-19", customer: { name: "Kamal Perera" },    items: [{ name: "iPhone 13",     qty: 1, unitPrice: 250000, subtotal: 250000 }],                                                             grandTotal: 250000, paymentMethod: "Cash"          },
  { id: 2, invoiceNo: "INV-0002", date: "2026-04-20", customer: { name: "Nimal Silva" },     items: [{ name: "AirPods Pro 2", qty: 1, unitPrice: 35000,  subtotal: 34000  }, { name: "Charger", qty: 2, unitPrice: 5000, subtotal: 10000 }], grandTotal: 43000,  paymentMethod: "Card"          },
  { id: 3, invoiceNo: "INV-0003", date: "2026-04-21", customer: { name: "Saman Fernando" },  items: [{ name: "Samsung S24",   qty: 1, unitPrice: 220000, subtotal: 215000 }],                                                             grandTotal: 215000, paymentMethod: "Bank Transfer" },
  { id: 4, invoiceNo: "INV-0004", date: "2026-04-21", customer: { name: "Amara Jayasinghe" },items: [{ name: "USB-C Cable",   qty: 3, unitPrice: 1500,   subtotal: 4500   }],                                                             grandTotal: 4500,   paymentMethod: "Cash"          },
  { id: 5, invoiceNo: "INV-0005", date: "2026-04-21", customer: { name: "Ruwan Bandara" },   items: [{ name: "Apple Watch S9",qty: 1, unitPrice: 95000,  subtotal: 95000  }],                                                             grandTotal: 95000,  paymentMethod: "Card"          },
];

const REPAIRS = [
  { id: 1, device: "iPhone 11",      phone: "0771234567", date: "2026-04-20", fault: "Screen damage",        status: "pending" },
  { id: 2, device: "Samsung S22",    phone: "0751234567", date: "2026-04-20", fault: "Battery swollen",      status: "pending" },
  { id: 3, device: "iPhone 13",      phone: "0741234567", date: "2026-04-19", fault: "Back glass broken",    status: "done"    },
  { id: 4, device: "Redmi Note 12",  phone: "0731234567", date: "2026-04-21", fault: "Charging port issue",  status: "pending" },
];

const salesAreaData = [
  { day: "Apr 15", revenue: 85000,  profit: 22000 },
  { day: "Apr 16", revenue: 212000, profit: 58000 },
  { day: "Apr 17", revenue: 54000,  profit: 14000 },
  { day: "Apr 18", revenue: 310000, profit: 87000 },
  { day: "Apr 19", revenue: 250000, profit: 68000 },
  { day: "Apr 20", revenue: 293000, profit: 79000 },
  { day: "Apr 21", revenue: 314500, profit: 92000 },
];

const weeklyBarData = [
  { week: "Week 1", sales: 520000 },
  { week: "Week 2", sales: 780000 },
  { week: "Week 3", sales: 430000 },
  { week: "Week 4", sales: 910000 },
];

const paymentData = [
  { name: "Cash",          value: 40, color: "#b00000" },
  { name: "Card",          value: 35, color: "#3b82f6" },
  { name: "Bank Transfer", value: 15, color: "#22c55e" },
  { name: "Online",        value: 10, color: "#f59e0b" },
];

const repairTrendData = [
  { month: "Jan", pending: 4, done: 8  },
  { month: "Feb", pending: 6, done: 12 },
  { month: "Mar", pending: 3, done: 9  },
  { month: "Apr", pending: 5, done: 7  },
];

const CAT_COLORS = ["#b00000","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#06b6d4","#f43f5e","#84cc16"];
const Rs = (v) => `Rs ${Number(v).toLocaleString()}`;
const todayStr = "2026-04-21";

// Tooltip bg adapts to theme via context
const tooltipStyle = {
  background: "var(--tooltip-bg, #111)",
  border: "1px solid var(--tooltip-border, #1f1f1f)",
  borderRadius: 8,
  padding: "8px 12px",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 12, color: p.color, margin: "2px 0", fontWeight: 600 }}>
          {p.name}: {typeof p.value === "number" && p.value > 999 ? Rs(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle}>
      <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 12, color: p.color, margin: "2px 0", fontWeight: 600 }}>
          {p.name}: {Rs(p.value)}
        </p>
      ))}
    </div>
  );
};

// Reusable card class
const cardCls = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";

const Dashboard = () => {
  const todaySales     = SALES.filter((s) => s.date === todayStr);
  const todayRevenue   = todaySales.reduce((s, x) => s + x.grandTotal, 0);
  const totalRevenue   = SALES.reduce((s, x) => s + x.grandTotal, 0);
  const totalProfit    = SALES.reduce((sum, s) =>
    sum + s.items.reduce((a, item) => {
      const prod = PRODUCTS.find((p) => p.name === item.name);
      return a + (prod ? (item.unitPrice - prod.cost) * item.qty : 0);
    }, 0), 0);
  const lowStock       = PRODUCTS.filter((p) => p.qty <= 5);
  const inventoryValue = PRODUCTS.reduce((s, p) => s + p.qty * p.price, 0);
  const pendingRepairs = REPAIRS.filter((r) => r.status === "pending").length;

  const catMap = {};
  PRODUCTS.forEach((p) => { catMap[p.category] = (catMap[p.category] || 0) + p.qty * p.price; });
  const catPieData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  const sellerMap = {};
  SALES.forEach((s) => s.items.forEach((item) => {
    sellerMap[item.name] = (sellerMap[item.name] || 0) + item.qty;
  }));
  const topSellers = Object.entries(sellerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name: name.length > 16 ? name.slice(0, 16) + "…" : name, qty }));

  return (
    <div className="text-gray-900 dark:text-white space-y-4 sm:space-y-5">

      {/* ── Greeting ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Good morning, Admin 👋</h1>
          <p className="text-xs text-gray-500 mt-0.5">Here's your SmartSpider overview for today.</p>
        </div>
        <div className={`${cardCls} text-xs text-gray-500 px-3 py-1.5 rounded-lg w-fit`}>
          {todayStr}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: <FaDollarSign />, label: "Today's Revenue",  value: Rs(todayRevenue),   sub: `${todaySales.length} sales today`,    color: "#22c55e", border: "border-green-500/20"  },
          { icon: <FaChartLine />,  label: "Total Revenue",    value: Rs(totalRevenue),   sub: `${SALES.length} total invoices`,       color: "#3b82f6", border: "border-blue-500/20"   },
          { icon: <FaFire />,       label: "Total Profit",     value: Rs(totalProfit),    sub: "all time earnings",                    color: "#b00000", border: "border-red-500/20"    },
          { icon: <FaBox />,        label: "Inventory Value",  value: Rs(inventoryValue), sub: `${PRODUCTS.length} products`,          color: "#f59e0b", border: "border-yellow-500/20" },
        ].map((s, i) => (
          <div key={i} className={`border ${s.border} rounded-xl p-3 sm:p-4 backdrop-blur-sm bg-white/80 dark:bg-[rgba(17,17,17,0.6)]`}>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider leading-tight" style={{ color: s.color }}>{s.label}</span>
              <span style={{ color: s.color, opacity: 0.5, fontSize: 13 }}>{s.icon}</span>
            </div>
            <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{s.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <FaArrowUp size={9} className="text-green-500 dark:text-green-400 flex-shrink-0" />
              <span className="text-[10px] text-gray-500 truncate">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Area Chart + Quick Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Revenue & Profit Area Chart */}
        <div className={`${cardCls} lg:col-span-2 p-3 sm:p-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Revenue & Profit — Last 7 Days</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Daily breakdown in Rs</div>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block flex-shrink-0 bg-[#b00000]" />Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block flex-shrink-0 bg-green-500" />Profit</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={salesAreaData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#b00000" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#b00000" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" className="dark:[stroke:#1a1a1a]" vertical={false} />
              <XAxis dataKey="day"  tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<RevenueTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#b00000" strokeWidth={2} fill="url(#gradRevenue)" dot={false} activeDot={{ r: 4, fill: "#b00000" }} />
              <Area type="monotone" dataKey="profit"  name="Profit"  stroke="#22c55e" strokeWidth={2} fill="url(#gradProfit)"  dot={false} activeDot={{ r: 4, fill: "#22c55e" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {[
            { icon: <FaShoppingCart size={13} />,      label: "Today's Sales",   value: todaySales.length, sub: "transactions",    color: "#3b82f6", border: "border-blue-500/20"   },
            { icon: <FaExclamationTriangle size={13} />,label: "Low Stock",      value: lowStock.length,   sub: "need reorder",    color: "#f59e0b", border: "border-yellow-500/20" },
            { icon: <FaTools size={13} />,             label: "Pending Repairs", value: pendingRepairs,    sub: "awaiting service", color: "#b00000", border: "border-red-500/20"    },
            { icon: <FaBox size={13} />,               label: "Total Products",  value: PRODUCTS.length,   sub: "in inventory",    color: "#22c55e", border: "border-green-500/20"  },
          ].map((s, i) => (
            <div key={i} className={`${cardCls} border ${s.border} rounded-xl p-3 flex items-center gap-3`}>
              <div style={{ color: s.color, opacity: 0.7, flexShrink: 0 }}>{s.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-500 leading-tight">{s.label}</div>
                <div className="text-[10px] text-gray-400 dark:text-gray-600 hidden sm:block">{s.sub}</div>
              </div>
              <div className="text-lg sm:text-xl font-bold flex-shrink-0" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 3: Bar Chart + Pie Charts ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Weekly Sales Bar Chart */}
        <div className={`${cardCls} p-3 sm:p-4`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Monthly Sales by Week</div>
          <div className="text-[10px] text-gray-500 mb-3 sm:mb-4">April 2026</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={weeklyBarData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:[stroke:#1a1a1a]" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<RevenueTooltip />} />
              <Bar dataKey="sales" name="Sales" radius={[4, 4, 0, 0]}>
                {weeklyBarData.map((_, i) => (
                  <Cell key={i} fill={i === weeklyBarData.length - 1 ? "#b00000" : "#3a0000"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Method Pie */}
        <div className={`${cardCls} p-3 sm:p-4`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Payment Methods</div>
          <div className="text-[10px] text-gray-500 mb-2">Distribution this month</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={paymentData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                {paymentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
                wrapperClassName="dark:[&>div]:!bg-[#111] dark:[&>div]:!border-[#1f1f1f]"
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1">
            {paymentData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[10px] text-gray-500 truncate">{d.name}</span>
                <span className="text-[10px] font-semibold text-gray-900 dark:text-white ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Category Pie */}
        <div className={`${cardCls} p-3 sm:p-4 sm:col-span-2 lg:col-span-1`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Inventory by Category</div>
          <div className="text-[10px] text-gray-500 mb-2">Value distribution</div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 lg:gap-0">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={catPieData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                  {catPieData.map((_, i) => (
                    <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => Rs(value)}
                  contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
                  wrapperClassName="dark:[&>div]:!bg-[#111] dark:[&>div]:!border-[#1f1f1f]"
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 sm:flex-1 lg:flex-none max-h-[90px] overflow-y-auto pr-1">
              {catPieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                  <span className="text-[10px] text-gray-500 flex-1 truncate">{d.name}</span>
                  <span className="text-[10px] font-semibold text-gray-900 dark:text-white">{Rs(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Repair Trend + Top Sellers ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

        {/* Repair Trend Bar */}
        <div className={`${cardCls} p-3 sm:p-4`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Repair Jobs Trend</div>
          <div className="text-[10px] text-gray-500 mb-3 sm:mb-4">Pending vs Completed — Jan to Apr</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={repairTrendData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:[stroke:#1a1a1a]" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pending"  name="Pending"   fill="#b00000" radius={[3, 3, 0, 0]} />
              <Bar dataKey="done"     name="Completed" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#6b7280", paddingTop: 8 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Sellers */}
        <div className={`${cardCls} p-3 sm:p-4`}>
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <FaFire size={12} className="text-[#b00000]" /> Top Selling Products
          </div>
          <div className="text-[10px] text-gray-500 mb-3 sm:mb-4">By units sold</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={topSellers} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:[stroke:#1a1a1a]" horizontal={false} />
              <XAxis type="number"   tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="qty" name="Units Sold" radius={[0, 4, 4, 0]}>
                {topSellers.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#b00000" : i === 1 ? "#8b0000" : "#5a0000"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 5: Recent Sales + Low Stock + Pending Repairs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Recent Sales */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaShoppingCart size={12} className="text-[#b00000]" /> Recent Sales
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{SALES.length} total</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
            {[...SALES].reverse().slice(0, 4).map((s) => (
              <div key={s.id} className="px-3 sm:px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                <div className="min-w-0 flex-1 mr-2">
                  <div className="text-[11px] font-mono font-semibold text-[#b00000] dark:text-[#e05050]">{s.invoiceNo}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{s.customer.name || "Walk-in"} · {s.date}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-green-600 dark:text-green-400">{Rs(s.grandTotal)}</div>
                  <div className="text-[9px] px-1.5 py-0.5 rounded mt-0.5 border border-gray-200 dark:border-[#2a2a2a] text-gray-500 bg-gray-50 dark:bg-white/[0.02] whitespace-nowrap">
                    {s.paymentMethod}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-xl border border-yellow-500/20 overflow-hidden bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm">
          <div className="px-3 sm:px-4 py-3 border-b border-yellow-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-yellow-500 dark:text-yellow-400">
              <FaExclamationTriangle size={12} /> Low Stock Alert
            </div>
            <span className="text-[10px] text-yellow-500/60">{lowStock.length} items</span>
          </div>
          <div className="p-3 space-y-2">
            {lowStock.length === 0 ? (
              <p className="text-center text-gray-400 dark:text-gray-600 text-xs py-4">All stock levels OK</p>
            ) : lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-lg border border-yellow-500/10 bg-yellow-500/[0.04]">
                <div className="min-w-0 flex-1 mr-2">
                  <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-gray-500">{p.category}</div>
                </div>
                <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded
                  ${p.qty === 0
                    ? "bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20"}`}>
                  {p.qty === 0 ? "Out" : `Qty: ${p.qty}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Repairs */}
        <div className={`${cardCls} overflow-hidden sm:col-span-2 lg:col-span-1`}>
          <div className="px-3 sm:px-4 py-3 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FaTools size={12} className="text-[#b00000]" /> Pending Repairs
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{pendingRepairs} jobs</span>
          </div>
          <div className="p-3 space-y-2">
            {REPAIRS.filter((r) => r.status === "pending").map((r) => (
              <div key={r.id} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[rgba(10,10,10,0.5)]">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-gray-900 dark:text-white truncate mr-2">{r.device}</span>
                  <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                    <FaClock size={7} /> Pending
                  </span>
                </div>
                <div className="text-[10px] text-gray-500">{r.fault}</div>
                <div className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{r.phone} · {r.date}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;