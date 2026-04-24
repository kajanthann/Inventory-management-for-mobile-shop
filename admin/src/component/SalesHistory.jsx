import React, { useState } from "react";
import {
  FaEye, FaTimes, FaSearch, FaFilter,
} from "react-icons/fa";

const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "Online"];
const Rs = (v) => `Rs ${Number(v).toLocaleString()}`;

const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600";
const cardCls  = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";

const SalesHistory = ({ sales }) => {
  const [histSearch, setHistSearch] = useState("");
  const [histMethod, setHistMethod] = useState("");
  const [histDate, setHistDate]     = useState("");
  const [viewSale, setViewSale]     = useState(null);

  const filteredSales = sales.filter((s) =>
    (histSearch === "" ||
      s.invoiceNo.toLowerCase().includes(histSearch.toLowerCase()) ||
      s.customer.phone.includes(histSearch) ||
      s.customer.name.toLowerCase().includes(histSearch.toLowerCase())) &&
    (histMethod === "" || s.paymentMethod === histMethod) &&
    (histDate === "" || s.date === histDate)
  );

  const clearFilters = () => { setHistSearch(""); setHistMethod(""); setHistDate(""); };

  return (
    <div className="space-y-4">

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between flex-wrap">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
            <input
              placeholder="Invoice / name / phone..."
              value={histSearch}
              onChange={(e) => setHistSearch(e.target.value)}
              className={`${inputCls} pl-8 w-full sm:w-auto`}
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
            <select
              value={histMethod}
              onChange={(e) => setHistMethod(e.target.value)}
              className={`${inputCls} pl-8 w-full sm:w-auto`}
            >
              <option value="">All Payments</option>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <input
            type="date"
            value={histDate}
            onChange={(e) => setHistDate(e.target.value)}
            className={`${inputCls} w-full sm:w-auto`}
          />
          {(histSearch || histMethod || histDate) && (
            <button
              onClick={clearFilters}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition self-start sm:self-center"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {filteredSales.length} record{filteredSales.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className={`${cardCls} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "640px" }}>
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#1f1f1f]">
                {["Invoice","Date & Time","Customer","Items","Payment","Total","Status","Actions"].map((h) => (
                  <th key={h} className={`px-3 sm:px-4 py-3 text-left ${h === "Total" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400 dark:text-gray-600">No sales found</td>
                </tr>
              ) : filteredSales.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                  <td className="px-3 sm:px-4 py-3 font-mono text-xs font-semibold whitespace-nowrap text-[#b00000] dark:text-[#e05050]">
                    {s.invoiceNo}
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="text-xs text-gray-900 dark:text-white whitespace-nowrap">{s.date}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">{s.time}</div>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <div className="text-xs text-gray-900 dark:text-white">{s.customer.name || "—"}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">{s.customer.phone || ""}</div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {s.items.length} item{s.items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className="px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/[0.03] whitespace-nowrap">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                    {Rs(s.grandTotal)}
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <span className="px-2 py-1 text-[10px] rounded-full font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 whitespace-nowrap">
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <button
                      onClick={() => setViewSale(s)}
                      className="p-1.5 rounded border border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 transition"
                    >
                      <FaEye size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Sale Modal ── */}
      {viewSale && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="w-full max-w-[460px] max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111111]">
            <div className="h-1 bg-[#b00000]" />
            <div className="px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between sticky top-0 bg-white dark:bg-[#111111] z-10">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{viewSale.invoiceNo}</h2>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{viewSale.date} · {viewSale.time}</p>
              </div>
              <button onClick={() => setViewSale(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                <FaTimes />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {(viewSale.customer.name || viewSale.customer.phone) && (
                <div className="px-3 py-2 rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0a0a0a]">
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wider">Customer</div>
                  <div className="text-sm text-gray-900 dark:text-white">{viewSale.customer.name || "—"}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{viewSale.customer.phone}</div>
                </div>
              )}

              <div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Items</div>
                <div className="space-y-1">
                  {viewSale.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100 dark:border-[#1a1a1a]">
                      <div className="min-w-0 flex-1 mr-2">
                        <span className="text-gray-900 dark:text-white font-medium truncate block">{item.name}</span>
                        <span className="text-gray-400 dark:text-gray-500">× {item.qty}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {item.discount > 0 && (
                          <div className="text-[10px] text-yellow-500">- {Rs(item.discount)}</div>
                        )}
                        <div className="text-green-600 dark:text-green-400 font-medium">{Rs(item.subtotal)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 border-t border-gray-200 dark:border-[#1f1f1f] pt-3">
                {[
                  ["Subtotal",    Rs(viewSale.subtotal),       "text-gray-600 dark:text-gray-300"],
                  ["Discount",    `- ${Rs(viewSale.discount)}`, "text-yellow-500 dark:text-yellow-400"],
                  ["Grand Total", Rs(viewSale.grandTotal),     "text-green-600 dark:text-green-400 font-bold"],
                  ["Amount Paid", Rs(viewSale.amountPaid),     "text-gray-900 dark:text-white"],
                  ["Change",      Rs(viewSale.change),         "text-green-600 dark:text-green-400"],
                  ["Payment",     viewSale.paymentMethod,      "text-gray-600 dark:text-gray-300"],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className={`${c} whitespace-nowrap ml-2`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;