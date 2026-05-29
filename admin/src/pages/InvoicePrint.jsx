import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPrint, FaArrowLeft, FaPlus } from "react-icons/fa";
import { assets } from "../assets/assets";

// ── Spider SVG Logo ──────────────────────────────────────────────
const SpiderLogo = () => (
  <svg width="64" height="72" viewBox="0 0 64 72" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="38" rx="11" ry="14" fill="#cc0000" />
    <circle cx="32" cy="22" r="9" fill="#cc0000" />
    <ellipse cx="28.5" cy="20" rx="3" ry="3.5" fill="white" />
    <ellipse cx="35.5" cy="20" rx="3" ry="3.5" fill="white" />
    <circle cx="28.5" cy="20.5" r="1.8" fill="#cc0000" />
    <circle cx="35.5" cy="20.5" r="1.8" fill="#cc0000" />
    <path d="M21 32 Q8 26 2 20"   stroke="#cc0000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M21 36 Q7 33 1 30"   stroke="#cc0000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M21 40 Q7 40 1 40"   stroke="#cc0000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M21 44 Q8 48 2 54"   stroke="#cc0000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M43 32 Q56 26 62 20" stroke="#cc0000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M43 36 Q57 33 63 30" stroke="#cc0000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M43 40 Q57 40 63 40" stroke="#cc0000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <path d="M43 44 Q56 48 62 54" stroke="#cc0000" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    <line x1="32" y1="0" x2="32" y2="13" stroke="#cc0000" strokeWidth="1.5" strokeDasharray="3,2"/>
  </svg>
);

// ── Invoice Template (matches physical bill exactly) ─────────────
const InvoiceTemplate = React.forwardRef(({ invoice }, ref) => {
  const RED    = "#cc0000";
  const ROWS   = 7; // always show 7 item rows like real invoice
  const items  = invoice?.items || [];
  const empty  = Math.max(0, ROWS - items.length);
  const subTotal = items.reduce((s, i) => s + (i.subtotal || 0), 0);

  // Format invoice number as 4-digit
  const invoiceNum = (invoice?.invoiceNo || "")
    .toString()
    .replace(/\D/g, "")
    .padStart(4, "0");

  const s = {
    page:      { fontFamily: "Arial, sans-serif", background: "#fff", color: "#111", padding: "20px 24px", maxWidth: "680px", margin: "0 auto", fontSize: "12px" },
    th:        { background: RED, color: "#fff", padding: "6px 5px", fontSize: "10px", fontWeight: "700", textAlign: "center", border: `1px solid ${RED}`, lineHeight: "1.3" },
    td:        { border: `1px solid ${RED}`, padding: "5px 5px", fontSize: "11px", textAlign: "center", height: "28px", verticalAlign: "middle" },
    tdLeft:    { border: `1px solid ${RED}`, padding: "5px 8px", fontSize: "11px", textAlign: "left",   height: "28px", verticalAlign: "middle" },
    tdRight:   { border: `1px solid ${RED}`, padding: "5px 5px", fontSize: "11px", textAlign: "right",  height: "28px", verticalAlign: "middle" },
    sigLine:   { borderTop: "1px dashed #999", paddingTop: "5px", marginTop: "32px", fontSize: "10px", color: "#333", textAlign: "center", fontWeight: "600" },
    bullet:    { marginLeft: "10px", marginBottom: "2px", fontSize: "9.5px", color: "#222", lineHeight: "1.65" },
    numbered:  { marginLeft: "16px", marginBottom: "2px", fontSize: "9.5px", color: "#222", lineHeight: "1.65" },
  };

  return (
    <div ref={ref} style={s.page}>

      {/* ════ HEADER ════ */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "10px" }}>
        <tbody>
          <tr>
            {/* Logo + Brand */}
            <td style={{ verticalAlign: "top", width: "42%" }}>
              <div>
                <img src={assets.logo1} alt="Logo" className="h-24"/>
              </div>
            </td>

            {/* Invoice title + Company */}
            <td style={{ verticalAlign: "top", textAlign: "right" }}>
              <div style={{ fontSize: "26px", fontWeight: "900", letterSpacing: "1px", color: "#111" }}>INVOICE</div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#111", marginTop: "2px" }}>SMART SPIDER (PVT) LTD</div>
              <div style={{ fontSize: "11px", color: "#444", marginTop: "3px", lineHeight: "1.7" }}>
                No.80/20, Kasthuriyar Road, Jaffna.<br/>
                Tel: 021 221 5994 / 070 225 7777
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ════ DIVIDER ════ */}
      <div style={{ height: "2px", background: "#111", margin: "8px 0 10px" }} />

      {/* ════ CUSTOMER / INVOICE INFO ROW ════ */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "10px" }}>
        <tbody>
          <tr>
            {/* Customer box */}
            <td style={{ border: `1px solid ${RED}`, padding: "8px 10px", verticalAlign: "top", width: "47%", minHeight: "72px" }}>
              <div className="font-bold">Customer</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#111" }}>
                {invoice?.customer?.name || ""}
              </div>
              {invoice?.customer?.phone && (
                <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{invoice.customer.phone}</div>
              )}
              {invoice?.customer?.cashier && (
                <div style={{ fontSize: "10px", color: "#888", marginTop: "4px" }}>
                  Prepared by: {invoice.customer.cashier}
                </div>
              )}
            </td>

            <td style={{ width: "6%" }} />

            {/* Date / Invoice No / DC No */}
            <td style={{ verticalAlign: "top", width: "47%" }}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ border: `1px solid ${RED}`, padding: "5px 8px", fontWeight: "600", fontSize: "11px", width: "42%", borderBottom: `1px solid ${RED}` }}>Date</td>
                    <td style={{ border: `1px solid ${RED}`, padding: "5px 8px", fontSize: "11px", borderBottom: `1px solid ${RED}` }}>
                      {invoice?.date || ""}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: `1px solid ${RED}`, padding: "5px 8px", fontWeight: "600", fontSize: "11px", borderBottom: `1px solid ${RED}` }}>Invoice No.</td>
                    <td style={{ border: `1px solid ${RED}`, padding: "5px 8px", fontSize: "18px", fontWeight: "900", color: RED, letterSpacing: "2px", borderBottom: `1px solid ${RED}` }}>
                      {invoiceNum}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: `1px solid ${RED}`, padding: "5px 8px", fontWeight: "600", fontSize: "11px" }}>DC No.</td>
                    <td style={{ border: `1px solid ${RED}`, padding: "5px 8px", fontSize: "11px" }}></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ════ ITEMS TABLE ════ */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse", marginBottom: "10px" }}>
        <thead>
          <tr>
            <th style={{ ...s.th, width: "13%" }}>MODEL<br/>NO.</th>
            <th style={{ ...s.th, width: "18%" }}>IMEI<br/>NO.</th>
            <th style={{ ...s.th }}>DESCRIPTION</th>
            <th style={{ ...s.th, width: "7%" }}>QTY.</th>
            <th style={{ ...s.th, width: "14%" }}>UNIT PRICE<br/><span style={{ fontSize: "9px" }}>LKR</span></th>
            <th style={{ ...s.th, width: "14%" }}>AMOUNT<br/><span style={{ fontSize: "9px" }}>LKR</span></th>
          </tr>
        </thead>
        <tbody>
          {/* Filled rows */}
          {items.map((item, i) => (
            <tr key={i}>
              <td style={s.td}>{item.model || ""}</td>
              <td style={{ ...s.td, fontFamily: "monospace", fontSize: "9px" }}>{item.imei || ""}</td>
              <td style={s.tdLeft}>{item.name || ""}</td>
              <td style={s.td}>{item.qty || ""}</td>
              <td style={s.tdRight}>
                {item.unitPrice ? Number(item.unitPrice).toLocaleString() : ""}
              </td>
              <td style={s.tdRight}>
                {item.subtotal ? Number(item.subtotal).toLocaleString() : ""}
              </td>
            </tr>
          ))}

          {/* Empty rows */}
          {Array.from({ length: empty }).map((_, i) => (
            <tr key={`e-${i}`}>
              <td style={s.td}>&nbsp;</td>
              <td style={s.td}>&nbsp;</td>
              <td style={s.tdLeft}>&nbsp;</td>
              <td style={s.td}>&nbsp;</td>
              <td style={s.tdRight}>&nbsp;</td>
              <td style={s.tdRight}>&nbsp;</td>
            </tr>
          ))}

          {/* Sub Total */}
          <tr>
            <td colSpan={5} style={{ ...s.td, textAlign: "right", fontWeight: "700", background: "#fafafa", borderRight: "none", paddingRight: "10px" }}>
              Sub Total
            </td>
            <td style={{ ...s.tdRight, fontWeight: "800" }}>
              {invoice?.grandTotal ? Number(invoice.grandTotal).toLocaleString() : ""}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ════ PAYMENT METHOD (small note below table) ════ */}
      <div style={{ fontSize: "10px", color: "#555", marginBottom: "8px", textAlign: "right" }}>
        Payment: <strong style={{ color: "#111" }}>{invoice?.paymentMethod || ""}</strong>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        Paid: <strong style={{ color: "#111" }}>Rs {Number(invoice?.amountPaid || 0).toLocaleString()}</strong>
        {invoice?.change > 0 && (
          <>&nbsp;&nbsp;|&nbsp;&nbsp;Change: <strong>Rs {Number(invoice.change).toLocaleString()}</strong></>
        )}
      </div>

      {/* ════ SIGNATURES ════ */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "14px" }}>
        <tbody>
          <tr>
            <td style={{ width: "33%", padding: "0 6px 0 0" }}>
              <div style={s.sigLine}>Customer's Signature &amp; Chop</div>
            </td>
            <td style={{ width: "34%", padding: "0 6px", textAlign: "center" }}>
              <div style={s.sigLine}>Prepared by</div>
            </td>
            <td style={{ width: "33%", padding: "0 0 0 6px", textAlign: "right" }}>
              <div style={s.sigLine}>Authorized by</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ════ DIVIDER ════ */}
      <div style={{ height: "1.5px", background: "#111", margin: "4px 0 10px" }} />

      {/* ════ WARRANTY + T&C ════ */}
      <div style={{ marginBottom: "6px" }}>
        <span style={{ color: RED, fontWeight: "800", fontSize: "12.5px" }}>Smart Spider Warranty Certificate</span>
        <span style={{ fontWeight: "800", fontSize: "12.5px", marginLeft: "28px" }}>Terms and Conditions</span>
      </div>
      <p style={{ ...s.bullet, marginLeft: 0, marginBottom: "5px" }}>
        We Guarantee the items(s) specified above to be free of defects and in perfect working order on delivery. Smart Spider
        Undertake to replace or repair free of charge any part(s) which we consider is /are defective in manufacture subject to the
        conditions given below.
      </p>
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

      {/* ════ RED FOOTER BAR ════ */}
      <div style={{ marginTop: "12px", background: RED, padding: "7px 14px", textAlign: "right", borderRadius: "2px" }}>
        <span style={{ color: "#fff", fontStyle: "italic", fontSize: "14px", fontWeight: "600", letterSpacing: "0.5px" }}>
          Weaves your Success
        </span>
      </div>
    </div>
  );
});
InvoiceTemplate.displayName = "InvoiceTemplate";

// ════════════════════════════════════════════════════════════════
// ── INVOICE PRINT PAGE ───────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
const InvoicePrint = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const printRef  = useRef();

  // Get invoice data passed from NewSale via navigate state
  const invoice = location.state?.invoice;

  // If no invoice data, redirect back to sales
  useEffect(() => {
    if (!invoice) navigate("/sales", { replace: true });
  }, [invoice]);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;

    const win = window.open("", "_blank", "width=820,height=1000");
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice?.invoiceNo || ""} — SmartSpider</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; background: #fff; }
            @media print {
              @page { size: A4; margin: 10mm; }
              body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  if (!invoice) return null;

  return (
    <div className="">

      {/* ── Top Action Bar ── */}
      <div className="sticky top-0 z-10">
        <div className="mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">

          {/* Left: Back */}
          <div>
            <button
            onClick={() => navigate("/sales")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <FaArrowLeft size={11} /> Back to Sales
          </button>

            {/* Invoice info */}
          {/* <div className=" mt-4 px-3 py-2 rounded-lg" style={{ background: "rgba(176,0,0,0.07)", border: "1px solid rgba(176,0,0,0.15)" }}>
            <div className="font-mono font-bold text-sm" style={{ color: "#b00000" }}>
              {invoice.invoiceNo}
            </div>
            <div className="text-[10px] text-gray-400">
              {invoice.date}
            </div>
            <div className="text-[10px] text-gray-400">
              {invoice.customer?.name || "Walk-in"}
            </div>
          </div> */}

          </div>
          

          {/* Right: Print*/}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
              style={{ background: "#b00000" }}
              onMouseEnter={e => e.currentTarget.style.background = "#8b0000"}
              onMouseLeave={e => e.currentTarget.style.background = "#b00000"}
            >
              <FaPrint size={12} /> Print Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ── Invoice Preview ── */}
      <div className="max-w-[720px] mx-auto px-4 py-3">


        {/* Invoice card */}
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
          <div ref={printRef}>
            <InvoiceTemplate invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrint;