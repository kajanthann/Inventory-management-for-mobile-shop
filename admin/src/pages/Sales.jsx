import React, { useState } from "react";
import { FaShoppingCart, FaReceipt, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import NewSale from "../component/NewSale";
import SalesHistory from "../component/SalesHistory";

const PRODUCTS = [
  { id: 1,  name: "iPhone 15 Pro",           imei: "IPH15P-256", price: 380000, cost: 290000, stock: 8,  category: "Smartphones" },
  { id: 2,  name: "Samsung S24 Ultra",        imei: "SAM-S24U",   price: 320000, cost: 240000, stock: 5,  category: "Smartphones" },
  { id: 3,  name: "AirPods Pro 2",            imei: "APP-PRO2",   price: 35000,  cost: 22000,  stock: 12, category: "Airpods"     },
  { id: 4,  name: "iPhone 20W Charger",       imei: "CHR-20W",    price: 5000,   cost: 2800,   stock: 30, category: "Charger"     },
  { id: 5,  name: "USB-C Cable 1m",           imei: "CBL-USBC",   price: 1500,   cost: 600,    stock: 50, category: "Cable"       },
  { id: 6,  name: "Samsung Galaxy Tab S9",    imei: "SAM-TABS9",  price: 120000, cost: 90000,  stock: 4,  category: "Tablets"     },
  { id: 7,  name: "Apple Watch Series 9",     imei: "APW-S9",     price: 95000,  cost: 70000,  stock: 6,  category: "Wearables"   },
  { id: 8,  name: "Screen Protector iPhone 15", imei: "SPR-IPH15",price: 1200,   cost: 400,    stock: 40, category: "Covers"      },
  { id: 9,  name: "Xiaomi 14T Pro",           imei: "XIU-14TP",   price: 145000, cost: 110000, stock: 7,  category: "Smartphones" },
  { id: 10, name: "Anker Power Bank 20000",   imei: "ANK-PB20K",  price: 8500,   cost: 5200,   stock: 15, category: "Others"      },
];

const initialSales = [
  {
    id: 1, invoiceNo: "INV-0001", date: "2026-04-20", time: "10:15:32",
    customer: { name: "Kamal Perera", phone: "0771234567" },
    items: [{ id: 1, name: "iPhone 15 Pro", imei: "IPH15P-256", qty: 1, unitPrice: 380000, discount: 0, subtotal: 380000 }],
    paymentMethod: "Cash", subtotal: 380000, discount: 0, tax: 0,
    grandTotal: 380000, amountPaid: 380000, change: 0, status: "completed",
  },
  {
    id: 2, invoiceNo: "INV-0002", date: "2026-04-20", time: "13:42:10",
    customer: { name: "Nimal Silva", phone: "0751234567" },
    items: [
      { id: 3, name: "AirPods Pro 2",      imei: "APP-PRO2", qty: 1, unitPrice: 35000, discount: 1000, subtotal: 34000 },
      { id: 4, name: "iPhone 20W Charger", imei: "CHR-20W",  qty: 2, unitPrice: 5000,  discount: 0,    subtotal: 10000 },
    ],
    paymentMethod: "Card", subtotal: 44000, discount: 1000, tax: 0,
    grandTotal: 43000, amountPaid: 43000, change: 0, status: "completed",
  },
  {
    id: 3, invoiceNo: "INV-0003", date: "2026-04-21", time: "09:05:44",
    customer: { name: "Saman Fernando", phone: "0711234567" },
    items: [{ id: 2, name: "Samsung S24 Ultra", imei: "SAM-S24U", qty: 1, unitPrice: 320000, discount: 5000, subtotal: 315000 }],
    paymentMethod: "Bank Transfer", subtotal: 320000, discount: 5000, tax: 0,
    grandTotal: 315000, amountPaid: 315000, change: 0, status: "completed",
  },
];

const Rs = (v) => `Rs ${Number(v).toLocaleString()}`;
const today = () => new Date().toISOString().split("T")[0];

const Sales = () => {
  const [sales, setSales] = useState(initialSales);
  const [tab, setTab]     = useState("pos");

  const todaySales   = sales.filter((s) => s.date === today());
  const totalRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalProfit  = sales.reduce((sum, s) =>
    sum + s.items.reduce((a, item) => {
      const prod = PRODUCTS.find((p) => p.id === item.id);
      return a + (prod ? (item.unitPrice - prod.cost) * item.qty : 0);
    }, 0), 0);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.grandTotal, 0);

  const handleSaleComplete = (invoice) => {
    setSales((prev) => [invoice, ...prev]);
  };

  return (
    <div className="text-gray-900 dark:text-white space-y-4 sm:space-y-5">

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Invoices", value: sales.length,     color: "text-blue-500 dark:text-blue-400",    border: "border-blue-500/20"   },
          { label: "Today Revenue",  value: Rs(todayRevenue), color: "text-yellow-500 dark:text-yellow-400", border: "border-yellow-500/20" },
          { label: "Total Revenue",  value: Rs(totalRevenue), color: "text-green-500 dark:text-green-400",  border: "border-green-500/20"  },
          { label: "Total Profit",   value: Rs(totalProfit),  color: "text-red-500 dark:text-red-400",      border: "border-red-500/20"    },
        ].map((s, i) => (
          <div key={i} className={`border ${s.border} rounded-xl p-3 sm:p-4 backdrop-blur-sm bg-white/80 dark:bg-[rgba(17,17,17,0.6)]`}>
            <div className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${s.color} mb-1 sm:mb-2`}>{s.label}</div>
            <div className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 p-1 rounded-xl border border-gray-200 dark:border-[#1f1f1f] w-fit bg-gray-100 dark:bg-[rgba(10,10,10,0.6)]">
        {[
          { key: "pos",     icon: <FaShoppingCart size={12} />, label: "New Sale"      },
          { key: "history", icon: <FaReceipt size={12} />,      label: "Sales History" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition
              ${tab === t.key
                ? "bg-[#b00000] text-white"
                : "bg-transparent text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Render active tab ── */}
      {tab === "pos" && (
        <NewSale
          products={PRODUCTS}
          onSaleComplete={handleSaleComplete}
          onViewHistory={() => setTab("history")}
        />
      )}

      {tab === "history" && (
        <SalesHistory sales={sales} />
      )}
    </div>
  );
};

export default Sales;