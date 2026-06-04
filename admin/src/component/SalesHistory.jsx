import React, { useState, useRef } from "react";
import {
  FaEye, FaTimes, FaSearch, FaFilter, FaSync,
  FaChevronLeft, FaChevronRight, FaUser, FaBoxOpen, FaPrint,
} from "react-icons/fa";
import { assets } from "../assets/assets"; // ✅ for logo

const PAYMENT_METHODS = ["Cash", "Card", "Bank Transfer", "Online"];
const Rs = (v) => `Rs ${Number(v).toLocaleString()}`;

const inputCls = "w-full px-3 py-2 rounded-lg text-sm outline-none transition border focus:border-[#b00000] bg-gray-100 dark:bg-[#0a0a0a] border-gray-300 dark:border-[#1f1f1f] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600";
const cardCls  = "rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white/80 dark:bg-[rgba(17,17,17,0.6)] backdrop-blur-sm";

const PAGE_SIZE = 10;

const Field = ({ label, value, valueClass = "" }) => (
  <div className="flex justify-between items-start gap-2 text-sm">
    <span className="text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">{label}</span>
    <span className={`text-right break-all ${valueClass || "text-gray-900 dark:text-white"}`}>{value || "—"}</span>
  </div>
);

// ── Print helper — matches InvoiceTemplate exactly ────────────────
const printInvoice = (sale) => {
  const RED = "#cc0000";
  const ROWS = 7;
  const items = sale.items || [];
  const emptyRows = Math.max(0, ROWS - items.length);
  const subTotal = items.reduce((s, i) => s + (i.subtotal || (i.qty * i.unitPrice) || 0), 0);
  const grandTotal = sale.grandTotal || subTotal;

  const invoiceNo = sale.invoiceNo
    ? sale.invoiceNo.toString().replace(/\D/g, "").padStart(4, "0")
    : "";

  const dateStr = sale.date
    ? new Date(sale.date).toLocaleDateString("en-GB")
    : sale.createdAt
    ? new Date(sale.createdAt).toLocaleDateString("en-GB")
    : "";

  // ✅ Use the same logo image from assets
  const logoUrl = assets.logo1;

  const itemRows = items.map(item => `
    <tr>
      <td style="border:1px solid ${RED};padding:5px 5px;font-size:11px;text-align:center;height:28px;vertical-align:middle;">
        ${item.model || ""}
      </td>
      <td style="border:1px solid ${RED};padding:5px 5px;font-size:9px;text-align:center;height:28px;vertical-align:middle;font-family:monospace;">
        ${item.imei || ""}
      </td>
      <td style="border:1px solid ${RED};padding:5px 8px;font-size:11px;text-align:left;height:28px;vertical-align:middle;">
        ${item.name || item.description || ""}
      </td>
      <td style="border:1px solid ${RED};padding:5px 5px;font-size:11px;text-align:center;height:28px;vertical-align:middle;">
        ${item.qty || ""}
      </td>
      <td style="border:1px solid ${RED};padding:5px 5px;font-size:11px;text-align:right;height:28px;vertical-align:middle;">
        ${item.unitPrice ? Number(item.unitPrice).toLocaleString() : ""}
      </td>
      <td style="border:1px solid ${RED};padding:5px 5px;font-size:11px;text-align:right;height:28px;vertical-align:middle;">
        ${item.subtotal ? Number(item.subtotal).toLocaleString()
          : item.qty && item.unitPrice ? (item.qty * item.unitPrice).toLocaleString() : ""}
      </td>
    </tr>`).join("");

  const emptyRowsHtml = Array.from({ length: emptyRows }).map(() => `
    <tr>
      <td style="border:1px solid ${RED};padding:5px 5px;height:28px;">&nbsp;</td>
      <td style="border:1px solid ${RED};padding:5px 5px;height:28px;">&nbsp;</td>
      <td style="border:1px solid ${RED};padding:5px 8px;height:28px;">&nbsp;</td>
      <td style="border:1px solid ${RED};padding:5px 5px;height:28px;">&nbsp;</td>
      <td style="border:1px solid ${RED};padding:5px 5px;height:28px;">&nbsp;</td>
      <td style="border:1px solid ${RED};padding:5px 5px;height:28px;">&nbsp;</td>
    </tr>`).join("");

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:820px;height:1100px;border:none;";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoiceNo} — SmartSpider</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #fff; }
    @media print {
      @page { size: A4; margin: 10mm; }
      body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div style="font-family:Arial,sans-serif;background:#fff;color:#111;padding:20px 24px;max-width:680px;margin:0 auto;font-size:12px;">

  <!-- RED TOP BAR -->
  <div style="height:3px;background:${RED};margin-bottom:12px;"></div>

  <!-- HEADER -->
  <table style="width:100%;margin-bottom:10px;border-collapse:collapse;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="vertical-align:top;width:42%;">
        <img src="${logoUrl}" alt="SmartSpider Logo" style="height:96px;" />
      </td>
      <td style="vertical-align:top;text-align:right;">
        <div style="font-size:26px;font-weight:900;letter-spacing:1px;color:#111;">INVOICE</div>
        <div style="font-size:14px;font-weight:800;color:#111;margin-top:2px;">SMART SPIDER (PVT) LTD</div>
        <div style="font-size:11px;color:#444;margin-top:3px;line-height:1.7;">
          No.80/20, Kasthuriyar Road, Jaffna.<br/>
          Tel: 021 221 5994 / 070 225 7777
        </div>
      </td>
    </tr>
  </table>

  <!-- DIVIDER -->
  <div style="height:2px;background:#111;margin:8px 0 10px;"></div>

  <!-- CUSTOMER / INVOICE INFO -->
  <table style="width:100%;margin-bottom:10px;border-collapse:collapse;" cellpadding="0" cellspacing="0">
    <tr>
      <!-- Customer box -->
      <td style="border:1px solid ${RED};padding:8px 10px;vertical-align:top;width:47%;min-height:72px;">
        <div style="font-weight:700;">Customer</div>
        <div style="font-size:13px;font-weight:600;color:#111;margin-top:4px;">
          ${sale.customer?.name || sale.name || ""}
        </div>
        ${sale.customer?.phone
          ? `<div style="font-size:11px;color:#555;margin-top:2px;">${sale.customer.phone}</div>`
          : ""}
        ${sale.customer?.cashier
          ? `<div style="font-size:10px;color:#888;margin-top:4px;">Prepared by: ${sale.customer.cashier}</div>`
          : ""}
      </td>
      <td style="width:6%;"></td>
      <!-- Date / Invoice / DC -->
      <td style="vertical-align:top;width:47%;">
        <table style="width:100%;border-collapse:collapse;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border:1px solid ${RED};padding:5px 8px;font-weight:600;font-size:11px;width:42%;border-bottom:1px solid ${RED};">Date</td>
            <td style="border:1px solid ${RED};padding:5px 8px;font-size:11px;border-bottom:1px solid ${RED};">${dateStr}</td>
          </tr>
          <tr>
            <td style="border:1px solid ${RED};padding:5px 8px;font-weight:600;font-size:11px;border-bottom:1px solid ${RED};">Invoice No.</td>
            <td style="border:1px solid ${RED};padding:5px 8px;font-size:18px;font-weight:900;color:${RED};letter-spacing:2px;border-bottom:1px solid ${RED};">${invoiceNo}</td>
          </tr>
          <tr>
            <td style="border:1px solid ${RED};padding:5px 8px;font-weight:600;font-size:11px;">DC No.</td>
            <td style="border:1px solid ${RED};padding:5px 8px;font-size:11px;">${sale.collectionNo || sale.dcNo || ""}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ITEMS TABLE (6 columns — matches InvoiceTemplate) -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:10px;" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th style="background:${RED};color:#fff;padding:6px 5px;font-size:10px;font-weight:700;text-align:center;border:1px solid ${RED};line-height:1.3;width:13%;">MODEL<br/>NO.</th>
        <th style="background:${RED};color:#fff;padding:6px 5px;font-size:10px;font-weight:700;text-align:center;border:1px solid ${RED};line-height:1.3;width:18%;">IMEI<br/>NO.</th>
        <th style="background:${RED};color:#fff;padding:6px 5px;font-size:10px;font-weight:700;text-align:center;border:1px solid ${RED};line-height:1.3;">DESCRIPTION</th>
        <th style="background:${RED};color:#fff;padding:6px 5px;font-size:10px;font-weight:700;text-align:center;border:1px solid ${RED};line-height:1.3;width:7%;">QTY.</th>
        <th style="background:${RED};color:#fff;padding:6px 5px;font-size:10px;font-weight:700;text-align:center;border:1px solid ${RED};line-height:1.3;width:14%;">UNIT PRICE<br/><span style="font-size:9px;">LKR</span></th>
        <th style="background:${RED};color:#fff;padding:6px 5px;font-size:10px;font-weight:700;text-align:center;border:1px solid ${RED};line-height:1.3;width:14%;">AMOUNT<br/><span style="font-size:9px;">LKR</span></th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
      ${emptyRowsHtml}
      <!-- Sub Total -->
      <tr>
        <td colspan="5" style="border:1px solid ${RED};padding:6px 10px;font-weight:700;text-align:right;font-size:11.5px;background:#fafafa;border-right:none;">Sub Total</td>
        <td style="border:1px solid ${RED};padding:6px 5px;font-weight:800;text-align:right;font-size:11.5px;">
          ${grandTotal ? Number(grandTotal).toLocaleString() : ""}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- PAYMENT NOTE -->
  <div style="font-size:10px;color:#555;margin-bottom:8px;text-align:right;">
    Payment: <strong style="color:#111;">${sale.paymentMethod || ""}</strong>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    Paid: <strong style="color:#111;">Rs ${Number(sale.amountPaid || 0).toLocaleString()}</strong>
    ${sale.change > 0
      ? `&nbsp;&nbsp;|&nbsp;&nbsp;Change: <strong>Rs ${Number(sale.change).toLocaleString()}</strong>`
      : ""}
  </div>

  <!-- SIGNATURES -->
  <table style="width:100%;margin-bottom:14px;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="width:33%;padding:0 6px 0 0;">
        <div style="border-top:1px dashed #999;padding-top:5px;margin-top:32px;font-size:10px;color:#333;text-align:center;font-weight:600;">Customer's Signature &amp; Chop</div>
      </td>
      <td style="width:34%;padding:0 6px;text-align:center;">
        <div style="border-top:1px dashed #999;padding-top:5px;margin-top:32px;font-size:10px;color:#333;font-weight:600;">Prepared by</div>
      </td>
      <td style="width:33%;padding:0 0 0 6px;text-align:right;">
        <div style="border-top:1px dashed #999;padding-top:5px;margin-top:32px;font-size:10px;color:#333;font-weight:600;">Authorized by</div>
      </td>
    </tr>
  </table>

  <!-- DIVIDER -->
  <div style="height:1.5px;background:#111;margin:4px 0 10px;"></div>

  <!-- WARRANTY + T&C -->
  <div style="margin-bottom:6px;">
    <span style="color:${RED};font-weight:800;font-size:12.5px;">Smart Spider Warranty Certificate</span>
    <span style="font-weight:800;font-size:12.5px;margin-left:28px;">Terms and Conditions</span>
  </div>
  <p style="margin-left:0;margin-bottom:5px;font-size:9.5px;color:#222;line-height:1.65;">
    We Guarantee the items(s) specified above to be free of defects and in perfect working order on delivery. Smart Spider Undertake to replace or repair free of charge any part(s) which we consider is /are defective in manufacture subject to the conditions given below.
  </p>
  <p style="margin-left:10px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">*&nbsp;&nbsp;We are giving three moths warranty for the same fault from the date of repaired.</p>
  <p style="margin-left:10px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">*&nbsp;&nbsp;This guarantee is valid only within Sri Lanka.</p>
  <p style="margin-left:10px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">*&nbsp;&nbsp;This guarantee becomes Null &amp; Void if in our opinion.</p>
  <p style="margin-left:16px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">1.&nbsp;&nbsp;The item(s) has/have in anyway being abused or misused.</p>
  <p style="margin-left:16px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">2.&nbsp;&nbsp;The Serial/chassis number of this card or the product is defaced or altered.</p>
  <p style="margin-left:16px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">3.&nbsp;&nbsp;The signature of our official does not appear on the document.</p>
  <p style="margin-left:10px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">*&nbsp;&nbsp;In on case shall Smart Spider assume liability for any claim(s) of damages caused to our product by any other a defective product or person.</p>
  <p style="margin-left:10px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">*&nbsp;&nbsp;Warranty shall not coyer for any damages or loss(es) under any circumstances in relation to this unit(s) against Lightning, Water, Typhoon, Sea corrosion, Power Fluctuations, Storm, Flood, Fire, Animals, Insects, theft and accidents caused by any other act of God, or if appliance(s) has/have been incorrectly installed, modified or repaired by any person other than a service employee of Smart Spider.</p>
  <p style="margin-left:10px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">*&nbsp;&nbsp;Any item(s) returned without manual(s) and product box(es) will be charged a ta fair and appropriate value which is (5%) of the purchase price.</p>
  <p style="margin-left:10px;margin-bottom:2px;font-size:9.5px;color:#222;line-height:1.65;">*&nbsp;&nbsp;In The event of any unforeseen circumstances, and spares not being available, the company's prevailing depreciation rules will be binding on the purchaser to accept a commercial solution in lieu of repairs.</p>

  <!-- RED FOOTER BAR -->
  <div style="margin-top:12px;background:${RED};padding:7px 14px;text-align:right;border-radius:2px;">
    <span style="color:#fff;font-style:italic;font-size:14px;font-weight:600;letter-spacing:0.5px;">Weaves your Success</span>
  </div>

</div>
</body>
</html>`);
  iframeDoc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  }, 600);
};

// ── SalesHistory (main export) ────────────────────────────────────
const SalesHistory = ({ sales, loading, onRefresh }) => {
  const [histSearch,  setHistSearch]  = useState("");
  const [histMethod,  setHistMethod]  = useState("");
  const [histDate,    setHistDate]    = useState("");
  const [viewSale,    setViewSale]    = useState(null);
  const [refreshing,  setRefreshing]  = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filter ────────────────────────────────────────────────────
  const filteredSales = sales.filter((s) => {
    const saleDate = s.date || s.createdAt?.slice(0, 10) || "";
    return (
      (histSearch === "" ||
        s.invoiceNo?.toLowerCase().includes(histSearch.toLowerCase()) ||
        s.customer?.phone?.includes(histSearch) ||
        s.customer?.name?.toLowerCase().includes(histSearch.toLowerCase()) ||
        s.customer?.cashier?.toLowerCase().includes(histSearch.toLowerCase())) &&
      (histMethod === "" || s.paymentMethod === histMethod) &&
      (histDate   === "" || saleDate === histDate)
    );
  });

  // ── Pagination ────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredSales.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filteredSales.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const goTo       = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const handleSearch = (v) => { setHistSearch(v); setCurrentPage(1); };
  const handleMethod = (v) => { setHistMethod(v); setCurrentPage(1); };
  const handleDate   = (v) => { setHistDate(v);   setCurrentPage(1); };
  const clearFilters = () => { setHistSearch(""); setHistMethod(""); setHistDate(""); setCurrentPage(1); };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const getPageNumbers = () => {
    const pages = [];
    const left  = Math.max(2, safePage - 1);
    const right = Math.min(totalPages - 1, safePage + 1);
    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const statusColor = (s) => {
    switch (s) {
      case "completed": return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "pending":   return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "returned":  return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:          return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-gray-200 dark:bg-[#1a1a1a] flex-1" />
          ))}
        </div>
        <div className={`${cardCls} overflow-hidden`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 border-b border-gray-100 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#111]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between flex-wrap">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
            <input
              placeholder="Invoice / name / cashier / phone..."
              value={histSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className={`${inputCls} pl-8 w-full sm:w-56`}
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xs" />
            <select
              value={histMethod}
              onChange={(e) => handleMethod(e.target.value)}
              className={`${inputCls} pl-8 w-full sm:w-auto`}
            >
              <option value="">All Payments</option>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <input
            type="date"
            value={histDate}
            onChange={(e) => handleDate(e.target.value)}
            className={`${inputCls} w-full sm:w-auto`}
          />
          {(histSearch || histMethod || histDate) && (
            <button
              onClick={clearFilters}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition self-start sm:self-center"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {filteredSales.length} record{filteredSales.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 rounded border border-gray-200 dark:border-[#1f1f1f] text-gray-400 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-40"
            title="Refresh"
          >
            <FaSync size={11} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className={`${cardCls} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "700px" }}>
            <thead>
              <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#1f1f1f]">
                {["Invoice", "Date & Time", "Customer / Cashier", "Items", "Payment", "Total", "Status", ""].map((h) => (
                  <th key={h} className={`px-3 sm:px-4 py-3 text-left font-semibold ${h === "Total" ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400 dark:text-gray-600">
                    No sales found
                  </td>
                </tr>
              ) : (
                paginated.map((s) => {
                  const displayDate = s.date || s.createdAt?.slice(0, 10) || "—";
                  const displayTime = s.time || (s.createdAt
                    ? new Date(s.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "");

                  return (
                    <tr
                      key={s._id}
                      className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-white/[0.02] transition"
                    >
                      {/* Invoice */}
                      <td className="px-3 sm:px-4 py-3 font-mono text-xs font-bold whitespace-nowrap text-[#b00000] dark:text-[#e05050]">
                        {s.invoiceNo}
                      </td>

                      {/* Date & Time */}
                      <td className="px-3 sm:px-4 py-3">
                        <div className="text-xs text-gray-900 dark:text-white whitespace-nowrap">{displayDate}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">{displayTime}</div>
                      </td>

                      {/* Customer + Cashier */}
                      <td className="px-3 sm:px-4 py-3">
                        <div className="text-xs text-gray-900 dark:text-white font-medium">
                          {s.customer?.name || <span className="text-gray-400">Walk-in</span>}
                        </div>
                        {s.customer?.phone && (
                          <div className="text-[10px] text-gray-400 dark:text-gray-500">{s.customer.phone}</div>
                        )}
                        {s.customer?.cashier && (
                          <div className="text-[10px] text-gray-400 dark:text-gray-500">
                            Cashier: {s.customer.cashier}
                          </div>
                        )}
                      </td>

                      {/* Items count */}
                      <td className="px-3 sm:px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {(s.items || []).length} item{(s.items || []).length !== 1 ? "s" : ""}
                      </td>

                      {/* Payment method */}
                      <td className="px-3 sm:px-4 py-3">
                        <span className="px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/[0.03] whitespace-nowrap">
                          {s.paymentMethod}
                        </span>
                      </td>

                      {/* Grand total */}
                      <td className="px-3 sm:px-4 py-3 text-right text-xs font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
                        {Rs(s.grandTotal)}
                      </td>

                      {/* Status */}
                      <td className="px-3 sm:px-4 py-3">
                        <span className={`px-2 py-1 text-[10px] rounded-full font-medium border whitespace-nowrap ${statusColor(s.status)}`}>
                          {s.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewSale(s)}
                            className="p-1.5 rounded border border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 transition"
                            title="View details"
                          >
                            <FaEye size={11} />
                          </button>
                          <button
                            onClick={() => printInvoice(s)}
                            className="p-1.5 rounded border border-[#b00000]/20 text-[#b00000] dark:text-[#e05050] hover:bg-[#b00000]/10 transition"
                            title="Print invoice"
                          >
                            <FaPrint size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredSales.length)} of {filteredSales.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(safePage - 1)}
              disabled={safePage === 1}
              className="p-1.5 rounded border border-gray-200 dark:border-[#1f1f1f] text-gray-400 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={10} />
            </button>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-gray-400 dark:text-gray-600 select-none">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`min-w-[28px] h-7 rounded text-xs font-medium transition border ${
                    p === safePage
                      ? "bg-[#b00000] border-[#b00000] text-white"
                      : "border-gray-200 dark:border-[#1f1f1f] text-gray-600 dark:text-gray-300 hover:border-[#b00000] hover:text-[#b00000] dark:hover:text-[#e05050]"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => goTo(safePage + 1)}
              disabled={safePage === totalPages}
              className="p-1.5 rounded border border-gray-200 dark:border-[#1f1f1f] text-gray-400 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      )}

      {/* ── View Sale Modal ── */}
      {viewSale && (() => {
        const displayDate = viewSale.date || viewSale.createdAt?.slice(0, 10) || "—";
        const displayTime = viewSale.time || (viewSale.createdAt
          ? new Date(viewSale.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          : "—");
        const itemDiscountTotal = (viewSale.items || []).reduce((s, i) => s + (i.discount || 0), 0);

        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="w-full max-w-[500px] max-h-[92vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111111]">

              <div className="h-1 bg-[#b00000] rounded-t-xl" />

              {/* Modal Header */}
              <div className="px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-start justify-between sticky top-0 bg-white dark:bg-[#111111] z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#b00000] dark:text-[#e05050] text-sm">
                      {viewSale.invoiceNo}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium border ${statusColor(viewSale.status)}`}>
                      {viewSale.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                    {displayDate} · {displayTime}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <button
                    onClick={() => printInvoice(viewSale)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#b00000]/20 text-[#b00000] dark:text-[#e05050] hover:bg-[#b00000]/10 transition text-xs font-medium"
                    title="Print invoice"
                  >
                    <FaPrint size={10} /> Print
                  </button>
                  <button
                    onClick={() => setViewSale(null)}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-5">

                {/* Customer & Cashier */}
                <div className="rounded-lg border text-xs border-gray-200 dark:border-[#1f1f1f] overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 dark:bg-[#0d0d0d] border-b border-gray-200 dark:border-[#1f1f1f] flex items-center gap-2">
                    <FaUser size={9} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
                      Customer &amp; Cashier
                    </span>
                  </div>
                  <div className="px-3 py-3 space-y-2">
                    <Field label="Customer" value={viewSale.customer?.name || "Walk-in"} valueClass="text-gray-900 dark:text-white font-medium" />
                    <Field label="Phone"    value={viewSale.customer?.phone || "—"}      valueClass="text-gray-900 dark:text-white font-mono" />
                    <Field label="Cashier"  value={viewSale.customer?.cashier || "—"}    valueClass="text-gray-900 dark:text-white" />
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-lg border text-xs border-gray-200 dark:border-[#1f1f1f] overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 dark:bg-[#0d0d0d] border-b border-gray-200 dark:border-[#1f1f1f] flex items-center gap-2">
                    <FaBoxOpen size={9} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
                      Items ({(viewSale.items || []).length})
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 px-3 py-1.5 bg-gray-50/50 dark:bg-white/[0.01] border-b border-gray-100 dark:border-[#1a1a1a]">
                    {["Product", "Qty", "Unit Price", "Disc", "Subtotal"].map((h, i) => (
                      <div key={h} className={`text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-600 font-semibold ${
                        i === 0 ? "col-span-4" : i === 1 ? "col-span-1 text-center" : i === 2 ? "col-span-3 text-right" : i === 3 ? "col-span-2 text-right" : "col-span-2 text-right"
                      }`}>{h}</div>
                    ))}
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                    {(viewSale.items || []).map((item, i) => (
                      <div key={i} className="px-3 py-1.5">
                        <div className="grid grid-cols-12 gap-1 items-start">
                          <div className="col-span-4">
                            <div className="text-xs font-medium text-gray-900 dark:text-white leading-tight">{item.name || "—"}</div>
                            {item.imei && <div className="text-[9px] font-mono text-gray-400 dark:text-gray-500 mt-0.5 break-all">{item.imei}</div>}
                          </div>
                          <div className="col-span-1 text-center text-xs text-gray-600 dark:text-gray-300 font-semibold">{item.qty}</div>
                          <div className="col-span-3 text-right text-xs text-gray-500 dark:text-gray-400 font-mono">{Rs(item.unitPrice)}</div>
                          <div className="col-span-2 text-right text-xs text-yellow-500 dark:text-yellow-400 font-mono">
                            {item.discount > 0 ? `- ${Rs(item.discount)}` : <span className="text-gray-300 dark:text-gray-700">—</span>}
                          </div>
                          <div className="col-span-2 text-right text-xs font-bold text-green-600 dark:text-green-400 font-mono">{Rs(item.subtotal)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="rounded-lg border border-gray-200 dark:border-[#1f1f1f] overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 dark:bg-[#0d0d0d] border-b border-gray-200 dark:border-[#1f1f1f]">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Payment Summary</span>
                  </div>
                  <div className="px-3 py-3 text-[10px] space-y-1.5">
                    <Field label="Subtotal"       value={Rs(viewSale.subtotal)}  valueClass="text-gray-700 dark:text-gray-300 font-mono" />
                    {itemDiscountTotal > 0 && <Field label="Item Discounts" value={`- ${Rs(itemDiscountTotal)}`} valueClass="text-yellow-500 dark:text-yellow-400 font-mono" />}
                    {viewSale.discount > 0  && <Field label="Extra Discount" value={`- ${Rs(viewSale.discount)}`} valueClass="text-yellow-500 dark:text-yellow-400 font-mono" />}
                    {viewSale.tax > 0       && <Field label="Tax"            value={Rs(viewSale.tax)}            valueClass="text-gray-700 dark:text-gray-300 font-mono" />}
                    <div className="border-t border-gray-200 dark:border-[#1f1f1f] pt-2.5">
                      <Field label="Grand Total"    value={Rs(viewSale.grandTotal)} valueClass="text-green-600 dark:text-green-400 font-bold text-base font-mono" />
                    </div>
                    <Field label="Payment Method" value={viewSale.paymentMethod}  valueClass="text-gray-900 dark:text-white" />
                    <Field label="Amount Paid"    value={Rs(viewSale.amountPaid)} valueClass="text-gray-900 dark:text-white font-mono font-semibold" />
                    <Field label="Change"         value={Rs(viewSale.change)}     valueClass="text-green-600 dark:text-green-400 font-mono" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default SalesHistory;