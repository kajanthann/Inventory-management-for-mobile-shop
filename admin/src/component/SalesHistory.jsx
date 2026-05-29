import React, { useState, useRef } from "react";
import {
  FaEye, FaTimes, FaSearch, FaFilter, FaSync,
  FaChevronLeft, FaChevronRight, FaUser, FaBoxOpen, FaPrint,
} from "react-icons/fa";

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

// ── Spider SVG Logo ───────────────────────────────────────────────
const SpiderLogo = () => (
  <svg width="72" height="80" viewBox="0 0 72 80" xmlns="http://www.w3.org/2000/svg">
    <line x1="36" y1="0" x2="36" y2="18" stroke="#cc0000" strokeWidth="1.4" strokeDasharray="3,2"/>
    <ellipse cx="36" cy="46" rx="13" ry="17" fill="#cc0000" />
    <circle cx="36" cy="26" r="11" fill="#cc0000" />
    <ellipse cx="31" cy="23.5" rx="4.5" ry="5" fill="white" />
    <ellipse cx="41" cy="23.5" rx="4.5" ry="5" fill="white" />
    <ellipse cx="31" cy="24" rx="3" ry="3.5" fill="#cc0000" />
    <ellipse cx="41" cy="24" rx="3" ry="3.5" fill="#cc0000" />
    <circle cx="30" cy="22" r="1" fill="white" opacity="0.6"/>
    <circle cx="40" cy="22" r="1" fill="white" opacity="0.6"/>
    <ellipse cx="36" cy="50" rx="8" ry="10" fill="#aa0000" />
    <path d="M23 38 Q10 30 2 22"  stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M23 43 Q9 38 1 34"   stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M23 48 Q9 48 1 48"   stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M23 53 Q10 60 2 68"  stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M49 38 Q62 30 70 22" stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M49 43 Q63 38 71 34" stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M49 48 Q63 48 71 48" stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M49 53 Q62 60 70 68" stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
  </svg>
);

// ── Invoice Print Component ───────────────────────────────────────
const InvoicePrintView = ({ bill = {} }) => {
  const RED = "#cc0000";
  const ROWS = 6;
  const items = bill.items || [];
  const emptyRows = Math.max(0, ROWS - items.length);
  const subTotal = items.reduce(
    (s, i) => s + (i.subtotal || (i.qty * i.unitPrice) || 0), 0
  );

  const s = {
    page: { fontFamily: "Arial, sans-serif", background: "#fff", color: "#111", padding: "22px 28px", maxWidth: "700px", margin: "0 auto", fontSize: "12px" },
    headerTable: { width: "100%", marginBottom: "10px", borderCollapse: "collapse" },
    logoCell: { verticalAlign: "top", width: "45%" },
    brandBlock: { display: "flex", alignItems: "center", gap: "10px" },
    brandText: { paddingTop: "6px" },
    brandName: { fontSize: "26px", fontWeight: "900", letterSpacing: "-0.5px", lineHeight: "1.05", color: RED, textTransform: "uppercase" },
    tagline: { fontSize: "9.5px", color: "#666", fontStyle: "italic", marginTop: "3px" },
    invoiceCell: { verticalAlign: "top", textAlign: "right" },
    invoiceTitle: { fontSize: "28px", fontWeight: "900", letterSpacing: "3px", color: "#111", textTransform: "uppercase" },
    companyName: { fontSize: "15px", fontWeight: "800", color: "#111", marginTop: "2px" },
    companyAddr: { fontSize: "11px", color: "#444", marginTop: "4px", lineHeight: "1.6" },
    divider: { height: "2.5px", background: "#111", margin: "8px 0 10px" },
    infoTable: { width: "100%", marginBottom: "12px", borderCollapse: "collapse" },
    customerBox: { border: "1px solid #aaa", padding: "8px 10px", verticalAlign: "top", width: "50%", minHeight: "80px" },
    customerLabel: { fontWeight: "700", fontSize: "12.5px", color: "#111" },
    customerValue: { fontSize: "13px", fontWeight: "600", marginTop: "8px" },
    infoBox: { verticalAlign: "top", width: "46%" },
    infoInner: { borderCollapse: "collapse", width: "100%", border: `1px solid ${RED}` },
    infoLabelTd: { padding: "6px 10px", fontWeight: "700", fontSize: "11.5px", borderRight: `1px solid ${RED}`, borderBottom: `1px solid ${RED}`, whiteSpace: "nowrap", width: "42%", background: "#fafafa" },
    infoValTd: { padding: "6px 10px", fontSize: "11.5px", fontWeight: "500", borderBottom: `1px solid ${RED}` },
    invoiceNumVal: { padding: "6px 10px", fontSize: "17px", fontWeight: "900", color: RED, letterSpacing: "2px", borderBottom: `1px solid ${RED}` },
    lastInfoLabelTd: { padding: "6px 10px", fontWeight: "700", fontSize: "11.5px", borderRight: `1px solid ${RED}`, whiteSpace: "nowrap", width: "42%", background: "#fafafa" },
    lastInfoValTd: { padding: "6px 10px", fontSize: "11.5px", fontWeight: "500" },
    table: { width: "100%", borderCollapse: "collapse", marginBottom: "12px" },
    th: { background: RED, color: "#fff", padding: "7px 6px", fontSize: "10.5px", fontWeight: "700", textAlign: "center", border: `1px solid ${RED}`, letterSpacing: "0.3px", lineHeight: "1.4" },
    thDesc: { background: RED, color: "#fff", padding: "7px 8px", fontSize: "10.5px", fontWeight: "700", textAlign: "center", border: `1px solid ${RED}` },
    td: { border: `1px solid ${RED}`, padding: "5px 6px", fontSize: "11px", textAlign: "center", height: "28px" },
    tdDesc: { border: `1px solid ${RED}`, padding: "5px 8px", fontSize: "11px", textAlign: "left", height: "28px" },
    tdRight: { border: `1px solid ${RED}`, padding: "5px 6px", fontSize: "11px", textAlign: "right", height: "28px" },
    subLabelTd: { border: `1px solid ${RED}`, padding: "6px 10px", fontWeight: "700", textAlign: "right", fontSize: "11.5px", background: "#fafafa" },
    subValTd: { border: `1px solid ${RED}`, padding: "6px 6px", fontWeight: "700", textAlign: "right", fontSize: "11.5px" },
    sigTable: { width: "100%", marginTop: "18px", marginBottom: "14px" },
    sigTd: { textAlign: "center", verticalAlign: "bottom", padding: "0 12px" },
    sigLine: { borderTop: "1px dashed #999", paddingTop: "5px", marginTop: "30px", fontSize: "10.5px", color: "#333", fontWeight: "600" },
    separator: { borderTop: "1.5px solid #111", margin: "8px 0" },
    warrantyTitle: { color: RED, fontWeight: "800", fontSize: "13.5px", display: "inline" },
    tncTitle: { fontWeight: "800", fontSize: "13.5px", display: "inline", marginLeft: "36px" },
    warrantyBody: { fontSize: "9.5px", color: "#222", lineHeight: "1.7", marginTop: "7px" },
    bullet: { marginLeft: "12px", marginBottom: "2px" },
    numbered: { marginLeft: "20px", marginBottom: "2px" },
    footerBar: { marginTop: "16px", background: RED, padding: "8px 16px", textAlign: "right", borderRadius: "2px" },
    footerText: { color: "#fff", fontStyle: "italic", fontSize: "15px", fontWeight: "600", letterSpacing: "0.8px" },
  };

  return (
    <div style={s.page}>
      {/* HEADER */}
      <table style={s.headerTable} cellPadding="0" cellSpacing="0">
        <tbody><tr>
          <td style={s.logoCell}>
            <div style={s.brandBlock}>
              <SpiderLogo />
              <div style={s.brandText}>
                <div style={s.brandName}>SMART<br/>SPIDER</div>
                <div style={s.tagline}>Weaves Your Success</div>
              </div>
            </div>
          </td>
          <td style={s.invoiceCell}>
            <div style={s.invoiceTitle}>INVOICE</div>
            <div style={s.companyName}>SMART SPIDER (PVT) LTD</div>
            <div style={s.companyAddr}>No.80/20, Kasthuriyar Road, Jaffna.<br/>Tel: 021 221 5994 / 070 225 7777</div>
          </td>
        </tr></tbody>
      </table>

      <div style={s.divider} />

      {/* CUSTOMER / INFO */}
      <table style={s.infoTable} cellPadding="0" cellSpacing="0">
        <tbody><tr>
          <td style={s.customerBox}>
            <div style={s.customerLabel}>Customer</div>
            <div style={s.customerValue}>{bill.customer?.name || bill.name || ""}</div>
            {bill.customer?.phone && (
              <div style={{ fontSize: "11px", fontWeight: "400", marginTop: "3px", color: "#555" }}>{bill.customer.phone}</div>
            )}
          </td>
          <td style={{ width: "4%" }} />
          <td style={s.infoBox}>
            <table style={s.infoInner} cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={s.infoLabelTd}>Date</td>
                  <td style={s.infoValTd}>
                    {bill.date ? new Date(bill.date).toLocaleDateString("en-GB")
                      : bill.createdAt ? new Date(bill.createdAt).toLocaleDateString("en-GB") : ""}
                  </td>
                </tr>
                <tr>
                  <td style={s.infoLabelTd}>Invoice No.</td>
                  <td style={s.invoiceNumVal}>
                    {bill.invoiceNo ? bill.invoiceNo.toString().replace(/\D/g, "").padStart(4, "0") : ""}
                  </td>
                </tr>
                <tr>
                  <td style={s.lastInfoLabelTd}>DC No.</td>
                  <td style={s.lastInfoValTd}>{bill.collectionNo || bill.dcNo || ""}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr></tbody>
      </table>

      {/* ITEMS TABLE */}
      <table style={s.table} cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            <th style={{ ...s.th, width: "14%" }}>MODEL<br/>NO.</th>
            <th style={s.thDesc}>DESCRIPTION</th>
            <th style={{ ...s.th, width: "8%" }}>QTY.</th>
            <th style={{ ...s.th, width: "16%" }}>AMOUNT<br/><span style={{ fontSize: "9px" }}>LKR</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={s.td}>{item.model || ""}</td>
              <td style={s.tdDesc}>{item.name || item.description || ""}</td>
              <td style={s.td}>{item.qty || ""}</td>
              <td style={s.tdRight}>
                {item.subtotal ? Number(item.subtotal).toLocaleString()
                  : item.qty && item.unitPrice ? (item.qty * item.unitPrice).toLocaleString() : ""}
              </td>
            </tr>
          ))}
          {Array.from({ length: emptyRows }).map((_, i) => (
            <tr key={`e-${i}`}>
              <td style={s.td}>&nbsp;</td>
              <td style={s.tdDesc}>&nbsp;</td>
              <td style={s.td}>&nbsp;</td>
              <td style={s.tdRight}>&nbsp;</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} style={s.subLabelTd}>Sub Total</td>
            <td style={s.subValTd}>{subTotal > 0 ? subTotal.toLocaleString() : ""}</td>
          </tr>
        </tbody>
      </table>

      {/* SIGNATURES */}
      <table style={s.sigTable} cellPadding="0" cellSpacing="0">
        <tbody><tr>
          <td style={s.sigTd}><div style={s.sigLine}>Customer's Signature &amp; Chop</div></td>
          <td style={s.sigTd}><div style={s.sigLine}>Prepared by</div></td>
        </tr></tbody>
      </table>

      <div style={s.separator} />

      {/* WARRANTY */}
      <div style={{ marginTop: "8px" }}>
        <span style={s.warrantyTitle}>Smart Spider Warranty Certificate</span>
        <span style={s.tncTitle}>Terms and Conditions</span>
      </div>
      <div style={s.warrantyBody}>
        <p style={{ marginBottom: "5px" }}>We Guarantee the items(s) specified above to be free of defects and in perfect working order on delivery. Smart Spider Undertake to replace or repair free of charge any part(s) which we consider is /are defective in manufacture subject to the conditions given below.</p>
        <p style={s.bullet}>*&nbsp;&nbsp;We are giving three moths warranty for the same fault from the date of repaired.</p>
        <p style={s.bullet}>*&nbsp;&nbsp;This guarantee is valid only within Sri Lanka.</p>
        <p style={s.bullet}>*&nbsp;&nbsp;This guarantee becomes Null &amp; Void if in our opinion.</p>
        <p style={s.numbered}>1.&nbsp;&nbsp;The item(s) has/have in anyway being abused or misused.</p>
        <p style={s.numbered}>2.&nbsp;&nbsp;The Serial/chassis number of this card or the product is defaced or altered.</p>
        <p style={s.numbered}>3.&nbsp;&nbsp;The signature of our official does not appear on the document.</p>
        <p style={s.bullet}>*&nbsp;&nbsp;In on case shall Smart Spider assume liability for any claim(s) of damages caused to our product by any other a defective product or person.</p>
        <p style={s.bullet}>*&nbsp;&nbsp;Warranty shall not coyer for any damages or loss(es) under any circumstances in relation to this unit(s) against Lightning, Water, Typhoon, Sea corrosion, Power Fluctuations, Storm, Flood, Fire, Animals, Insects, theft and accidents caused by any other act of God, or if appliance(s) has/have been incorrectly installed, modified or repaired by any person other than a service employee of Smart Spider.</p>
        <p style={s.bullet}>*&nbsp;&nbsp;Any item(s) returned without manual(s) and product box(es) will be charged a ta fair and appropriate value which is (5%) of the purchase price.</p>
        <p style={s.bullet}>*&nbsp;&nbsp;In The event of any unforeseen circumstances, and spares not being available, the company's prevailing depreciation rules will be binding on the purchaser to accept a commercial solution in lieu of repairs.</p>
      </div>

      <div style={s.footerBar}>
        <span style={s.footerText}>Weaves your Success</span>
      </div>
    </div>
  );
};

// ── Print helper — opens invoice in new window and prints ─────────
const printInvoice = (sale) => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  // We need to render the React component to an HTML string
  // Use a hidden iframe approach for clean printing
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:800px;height:1100px;border:none;";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  // Build the invoice HTML inline (no React dependency in iframe)
  const RED = "#cc0000";
  const items = sale.items || [];
  const ROWS = 6;
  const emptyRows = Math.max(0, ROWS - items.length);
  const subTotal = items.reduce((s, i) => s + (i.subtotal || (i.qty * i.unitPrice) || 0), 0);
  const invoiceNo = sale.invoiceNo ? sale.invoiceNo.toString().replace(/\D/g, "").padStart(4, "0") : "";
  const dateStr = sale.date
    ? new Date(sale.date).toLocaleDateString("en-GB")
    : sale.createdAt ? new Date(sale.createdAt).toLocaleDateString("en-GB") : "";

  const itemRows = items.map(item => `
    <tr>
      <td style="border:1px solid ${RED};padding:5px 6px;font-size:11px;text-align:center;height:28px;">${item.model || ""}</td>
      <td style="border:1px solid ${RED};padding:5px 8px;font-size:11px;text-align:left;height:28px;">${item.name || item.description || ""}</td>
      <td style="border:1px solid ${RED};padding:5px 6px;font-size:11px;text-align:center;height:28px;">${item.qty || ""}</td>
      <td style="border:1px solid ${RED};padding:5px 6px;font-size:11px;text-align:right;height:28px;">
        ${item.subtotal ? Number(item.subtotal).toLocaleString() : (item.qty && item.unitPrice ? (item.qty * item.unitPrice).toLocaleString() : "")}
      </td>
    </tr>`).join("");

  const emptyRowsHtml = Array.from({ length: emptyRows }).map(() => `
    <tr>
      <td style="border:1px solid ${RED};padding:5px 6px;font-size:11px;height:28px;">&nbsp;</td>
      <td style="border:1px solid ${RED};padding:5px 8px;font-size:11px;height:28px;">&nbsp;</td>
      <td style="border:1px solid ${RED};padding:5px 6px;font-size:11px;height:28px;">&nbsp;</td>
      <td style="border:1px solid ${RED};padding:5px 6px;font-size:11px;height:28px;">&nbsp;</td>
    </tr>`).join("");

  // SVG spider logo as inline string
  const spiderSVG = `<svg width="72" height="80" viewBox="0 0 72 80" xmlns="http://www.w3.org/2000/svg">
    <line x1="36" y1="0" x2="36" y2="18" stroke="#cc0000" stroke-width="1.4" stroke-dasharray="3,2"/>
    <ellipse cx="36" cy="46" rx="13" ry="17" fill="#cc0000"/>
    <circle cx="36" cy="26" r="11" fill="#cc0000"/>
    <ellipse cx="31" cy="23.5" rx="4.5" ry="5" fill="white"/>
    <ellipse cx="41" cy="23.5" rx="4.5" ry="5" fill="white"/>
    <ellipse cx="31" cy="24" rx="3" ry="3.5" fill="#cc0000"/>
    <ellipse cx="41" cy="24" rx="3" ry="3.5" fill="#cc0000"/>
    <circle cx="30" cy="22" r="1" fill="white" opacity="0.6"/>
    <circle cx="40" cy="22" r="1" fill="white" opacity="0.6"/>
    <ellipse cx="36" cy="50" rx="8" ry="10" fill="#aa0000"/>
    <path d="M23 38 Q10 30 2 22" stroke="#cc0000" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M23 43 Q9 38 1 34" stroke="#cc0000" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M23 48 Q9 48 1 48" stroke="#cc0000" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M23 53 Q10 60 2 68" stroke="#cc0000" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M49 38 Q62 30 70 22" stroke="#cc0000" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M49 43 Q63 38 71 34" stroke="#cc0000" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M49 48 Q63 48 71 48" stroke="#cc0000" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M49 53 Q62 60 70 68" stroke="#cc0000" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </svg>`;

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoiceNo}</title>
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
<div style="font-family:Arial,sans-serif;background:#fff;color:#111;padding:22px 28px;max-width:700px;margin:0 auto;font-size:12px;">

  <!-- HEADER -->
  <table style="width:100%;margin-bottom:10px;border-collapse:collapse;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="vertical-align:top;width:45%;">
        <div style="display:flex;align-items:center;gap:10px;">
          ${spiderSVG}
          <div style="padding-top:6px;">
            <div style="font-size:26px;font-weight:900;line-height:1.05;color:${RED};text-transform:uppercase;">SMART<br/>SPIDER</div>
            <div style="font-size:9.5px;color:#666;font-style:italic;margin-top:3px;">Weaves Your Success</div>
          </div>
        </div>
      </td>
      <td style="vertical-align:top;text-align:right;">
        <div style="font-size:28px;font-weight:900;letter-spacing:3px;color:#111;text-transform:uppercase;">INVOICE</div>
        <div style="font-size:15px;font-weight:800;color:#111;margin-top:2px;">SMART SPIDER (PVT) LTD</div>
        <div style="font-size:11px;color:#444;margin-top:4px;line-height:1.6;">No.80/20, Kasthuriyar Road, Jaffna.<br/>Tel: 021 221 5994 / 070 225 7777</div>
      </td>
    </tr>
  </table>

  <!-- DIVIDER -->
  <div style="height:2.5px;background:#111;margin:8px 0 10px;"></div>

  <!-- CUSTOMER / INFO -->
  <table style="width:100%;margin-bottom:12px;border-collapse:collapse;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="border:1px solid #aaa;padding:8px 10px;vertical-align:top;width:50%;min-height:80px;">
        <div style="font-weight:700;font-size:12.5px;color:#111;">Customer</div>
        <div style="font-size:13px;font-weight:600;margin-top:8px;">${sale.customer?.name || sale.name || ""}</div>
        ${sale.customer?.phone ? `<div style="font-size:11px;font-weight:400;margin-top:3px;color:#555;">${sale.customer.phone}</div>` : ""}
      </td>
      <td style="width:4%;"></td>
      <td style="vertical-align:top;width:46%;">
        <table style="border-collapse:collapse;width:100%;border:1px solid ${RED};" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:6px 10px;font-weight:700;font-size:11.5px;border-right:1px solid ${RED};border-bottom:1px solid ${RED};white-space:nowrap;width:42%;background:#fafafa;">Date</td>
            <td style="padding:6px 10px;font-size:11.5px;font-weight:500;border-bottom:1px solid ${RED};">${dateStr}</td>
          </tr>
          <tr>
            <td style="padding:6px 10px;font-weight:700;font-size:11.5px;border-right:1px solid ${RED};border-bottom:1px solid ${RED};white-space:nowrap;background:#fafafa;">Invoice No.</td>
            <td style="padding:6px 10px;font-size:17px;font-weight:900;color:${RED};letter-spacing:2px;border-bottom:1px solid ${RED};">${invoiceNo}</td>
          </tr>
          <tr>
            <td style="padding:6px 10px;font-weight:700;font-size:11.5px;border-right:1px solid ${RED};white-space:nowrap;background:#fafafa;">DC No.</td>
            <td style="padding:6px 10px;font-size:11.5px;font-weight:500;">${sale.collectionNo || sale.dcNo || ""}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- ITEMS TABLE -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:12px;" cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th style="background:${RED};color:#fff;padding:7px 6px;font-size:10.5px;font-weight:700;text-align:center;border:1px solid ${RED};line-height:1.4;width:14%;">MODEL<br/>NO.</th>
        <th style="background:${RED};color:#fff;padding:7px 8px;font-size:10.5px;font-weight:700;text-align:center;border:1px solid ${RED};">DESCRIPTION</th>
        <th style="background:${RED};color:#fff;padding:7px 6px;font-size:10.5px;font-weight:700;text-align:center;border:1px solid ${RED};width:8%;">QTY.</th>
        <th style="background:${RED};color:#fff;padding:7px 6px;font-size:10.5px;font-weight:700;text-align:center;border:1px solid ${RED};line-height:1.4;width:16%;">AMOUNT<br/><span style="font-size:9px;">LKR</span></th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
      ${emptyRowsHtml}
      <tr>
        <td colspan="3" style="border:1px solid ${RED};padding:6px 10px;font-weight:700;text-align:right;font-size:11.5px;background:#fafafa;">Sub Total</td>
        <td style="border:1px solid ${RED};padding:6px 6px;font-weight:700;text-align:right;font-size:11.5px;">${subTotal > 0 ? subTotal.toLocaleString() : ""}</td>
      </tr>
    </tbody>
  </table>

  <!-- SIGNATURES -->
  <table style="width:100%;margin-top:18px;margin-bottom:14px;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="text-align:center;vertical-align:bottom;padding:0 12px;">
        <div style="border-top:1px dashed #999;padding-top:5px;margin-top:30px;font-size:10.5px;color:#333;font-weight:600;">Customer's Signature &amp; Chop</div>
      </td>
      <td style="text-align:center;vertical-align:bottom;padding:0 12px;">
        <div style="border-top:1px dashed #999;padding-top:5px;margin-top:30px;font-size:10.5px;color:#333;font-weight:600;">Prepared by</div>
      </td>
    </tr>
  </table>

  <!-- SEPARATOR -->
  <div style="border-top:1.5px solid #111;margin:8px 0;"></div>

  <!-- WARRANTY -->
  <div style="margin-top:8px;">
    <span style="color:${RED};font-weight:800;font-size:13.5px;">Smart Spider Warranty Certificate</span>
    <span style="font-weight:800;font-size:13.5px;margin-left:36px;">Terms and Conditions</span>
  </div>
  <div style="font-size:9.5px;color:#222;line-height:1.7;margin-top:7px;">
    <p style="margin-bottom:5px;">We Guarantee the items(s) specified above to be free of defects and in perfect working order on delivery. Smart Spider Undertake to replace or repair free of charge any part(s) which we consider is /are defective in manufacture subject to the conditions given below.</p>
    <p style="margin-left:12px;margin-bottom:2px;">*&nbsp;&nbsp;We are giving three moths warranty for the same fault from the date of repaired.</p>
    <p style="margin-left:12px;margin-bottom:2px;">*&nbsp;&nbsp;This guarantee is valid only within Sri Lanka.</p>
    <p style="margin-left:12px;margin-bottom:2px;">*&nbsp;&nbsp;This guarantee becomes Null &amp; Void if in our opinion.</p>
    <p style="margin-left:20px;margin-bottom:2px;">1.&nbsp;&nbsp;The item(s) has/have in anyway being abused or misused.</p>
    <p style="margin-left:20px;margin-bottom:2px;">2.&nbsp;&nbsp;The Serial/chassis number of this card or the product is defaced or altered.</p>
    <p style="margin-left:20px;margin-bottom:2px;">3.&nbsp;&nbsp;The signature of our official does not appear on the document.</p>
    <p style="margin-left:12px;margin-bottom:2px;">*&nbsp;&nbsp;In on case shall Smart Spider assume liability for any claim(s) of damages caused to our product by any other a defective product or person.</p>
    <p style="margin-left:12px;margin-bottom:2px;">*&nbsp;&nbsp;Warranty shall not coyer for any damages or loss(es) under any circumstances in relation to this unit(s) against Lightning, Water, Typhoon, Sea corrosion, Power Fluctuations, Storm, Flood, Fire, Animals, Insects, theft and accidents caused by any other act of God, or if appliance(s) has/have been incorrectly installed, modified or repaired by any person other than a service employee of Smart Spider.</p>
    <p style="margin-left:12px;margin-bottom:2px;">*&nbsp;&nbsp;Any item(s) returned without manual(s) and product box(es) will be charged a ta fair and appropriate value which is (5%) of the purchase price.</p>
    <p style="margin-left:12px;margin-bottom:2px;">*&nbsp;&nbsp;In The event of any unforeseen circumstances, and spares not being available, the company's prevailing depreciation rules will be binding on the purchaser to accept a commercial solution in lieu of repairs.</p>
  </div>

  <!-- FOOTER -->
  <div style="margin-top:16px;background:${RED};padding:8px 16px;text-align:right;border-radius:2px;">
    <span style="color:#fff;font-style:italic;font-size:15px;font-weight:600;letter-spacing:0.8px;">Weaves your Success</span>
  </div>

</div>
</body>
</html>`);
  iframeDoc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
      document.body.removeChild(container);
    }, 1000);
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

                      {/* Action buttons — Eye + Print */}
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setViewSale(s)}
                            className="p-1.5 rounded border border-blue-500/20 text-blue-500 dark:text-blue-400 hover:bg-blue-500/10 transition"
                            title="View details"
                          >
                            <FaEye size={11} />
                          </button>
                          {/* Print invoice */}
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
                  {/* Print from modal too */}
                  <button
                    onClick={() => printInvoice(viewSale)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#b00000]/20 text-[#b00000] dark:text-[#e05050] hover:bg-[#b00000]/10 transition text-xs font-medium"
                    title="Print invoice"
                  >
                    <FaPrint size={10} />
                    Print
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
                    <Field label="Subtotal"       value={Rs(viewSale.subtotal)}   valueClass="text-gray-700 dark:text-gray-300 font-mono" />
                    {itemDiscountTotal > 0 && <Field label="Item Discounts" value={`- ${Rs(itemDiscountTotal)}`} valueClass="text-yellow-500 dark:text-yellow-400 font-mono" />}
                    {viewSale.discount > 0  && <Field label="Extra Discount" value={`- ${Rs(viewSale.discount)}`} valueClass="text-yellow-500 dark:text-yellow-400 font-mono" />}
                    {viewSale.tax > 0       && <Field label="Tax"            value={Rs(viewSale.tax)}           valueClass="text-gray-700 dark:text-gray-300 font-mono" />}
                    <div className="border-t border-gray-200 dark:border-[#1f1f1f] pt-2.5">
                      <Field label="Grand Total"     value={Rs(viewSale.grandTotal)}  valueClass="text-green-600 dark:text-green-400 font-bold text-base font-mono" />
                    </div>
                    <Field label="Payment Method" value={viewSale.paymentMethod}   valueClass="text-gray-900 dark:text-white" />
                    <Field label="Amount Paid"    value={Rs(viewSale.amountPaid)}  valueClass="text-gray-900 dark:text-white font-mono font-semibold" />
                    <Field label="Change"         value={Rs(viewSale.change)}      valueClass="text-green-600 dark:text-green-400 font-mono" />
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