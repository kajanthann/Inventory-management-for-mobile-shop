import React, { useRef } from "react";

// ── Spider SVG Logo (matches the invoice image — spider/spiderman style) ──
const SpiderLogo = () => (
  <svg width="72" height="80" viewBox="0 0 72 80" xmlns="http://www.w3.org/2000/svg">
    {/* Web lines radiating from top */}
    <line x1="36" y1="0" x2="36" y2="18" stroke="#cc0000" strokeWidth="1.4" strokeDasharray="3,2"/>
    {/* Body - elongated, more spider-like */}
    <ellipse cx="36" cy="46" rx="13" ry="17" fill="#cc0000" />
    {/* Head */}
    <circle cx="36" cy="26" r="11" fill="#cc0000" />
    {/* Eyes - larger, more prominent like spiderman mask */}
    <ellipse cx="31" cy="23.5" rx="4.5" ry="5" fill="white" />
    <ellipse cx="41" cy="23.5" rx="4.5" ry="5" fill="white" />
    <ellipse cx="31" cy="24" rx="3" ry="3.5" fill="#cc0000" />
    <ellipse cx="41" cy="24" rx="3" ry="3.5" fill="#cc0000" />
    {/* White eye highlights */}
    <circle cx="30" cy="22" r="1" fill="white" opacity="0.6"/>
    <circle cx="40" cy="22" r="1" fill="white" opacity="0.6"/>
    {/* Abdomen detail line */}
    <ellipse cx="36" cy="50" rx="8" ry="10" fill="#aa0000" />
    {/* Left legs — 4 pairs */}
    <path d="M23 38 Q10 30 2 22"  stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M23 43 Q9 38 1 34"   stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M23 48 Q9 48 1 48"   stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M23 53 Q10 60 2 68"  stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    {/* Right legs — 4 pairs */}
    <path d="M49 38 Q62 30 70 22" stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M49 43 Q63 38 71 34" stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M49 48 Q63 48 71 48" stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <path d="M49 53 Q62 60 70 68" stroke="#cc0000" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
  </svg>
);

// ── Invoice Template ─────────────────────────────────────────────
const SmartSpiderInvoice = ({ bill = {} }) => {
  const printRef = useRef();

  // Always show 6 item rows total
  const ROWS = 6;
  const items = bill.items || [];
  const emptyRows = Math.max(0, ROWS - items.length);

  const subTotal = items.reduce(
    (s, i) => s + (i.subtotal || (i.qty * i.unitPrice) || 0),
    0
  );

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=820,height=1100");
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${bill.invoiceNo || ""}</title>
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

  const RED = "#cc0000";

  const s = {
    page: {
      fontFamily: "Arial, sans-serif",
      background: "#fff",
      color: "#111",
      padding: "22px 28px",
      maxWidth: "700px",
      margin: "0 auto",
      fontSize: "12px",
    },

    // ── Header ──────────────────────────────
    headerTable:  { width: "100%", marginBottom: "10px", borderCollapse: "collapse" },
    logoCell:     { verticalAlign: "top", width: "45%" },
    brandBlock:   { display: "flex", alignItems: "center", gap: "10px" },
    brandText:    { paddingTop: "6px" },
    brandName:    {
      fontSize: "26px", fontWeight: "900", letterSpacing: "-0.5px",
      lineHeight: "1.05", color: "#111", textTransform: "uppercase",
    },
    brandRed:     { color: RED },
    tagline:      { fontSize: "9.5px", color: "#666", fontStyle: "italic", marginTop: "3px" },

    invoiceCell:  { verticalAlign: "top", textAlign: "right" },
    invoiceTitle: {
      fontSize: "28px", fontWeight: "900", letterSpacing: "3px",
      color: "#111", textTransform: "uppercase",
    },
    companyName:  { fontSize: "15px", fontWeight: "800", color: "#111", marginTop: "2px" },
    companyAddr:  { fontSize: "11px", color: "#444", marginTop: "4px", lineHeight: "1.6" },

    // ── Divider ──────────────────────────────
    divider:      { height: "2.5px", background: "#111", margin: "8px 0 10px" },

    // ── Customer / Info ──────────────────────
    infoTable:    { width: "100%", marginBottom: "12px", borderCollapse: "collapse" },

    // Customer box — plain border (no red), matches image
    customerBox:  {
      border: "1px solid #aaa",
      padding: "8px 10px",
      verticalAlign: "top",
      width: "50%",
      minHeight: "80px",
    },
    customerLabel:  { fontWeight: "700", fontSize: "12.5px", color: "#111" },
    customerValue:  { fontSize: "13px", fontWeight: "600", marginTop: "8px" },
    customerPhone:  { fontSize: "11px", fontWeight: "400", marginTop: "3px", color: "#555" },

    spacerCell:   { width: "4%" },

    infoBox:      { verticalAlign: "top", width: "46%" },
    infoInner:    { borderCollapse: "collapse", width: "100%", border: `1px solid ${RED}` },
    infoLabelTd:  {
      padding: "6px 10px", fontWeight: "700", fontSize: "11.5px",
      borderRight: `1px solid ${RED}`, borderBottom: `1px solid ${RED}`,
      whiteSpace: "nowrap", width: "42%", background: "#fafafa",
    },
    infoValTd:    {
      padding: "6px 10px", fontSize: "11.5px", fontWeight: "500",
      borderBottom: `1px solid ${RED}`,
    },
    invoiceNumVal:  {
      padding: "6px 10px", fontSize: "17px", fontWeight: "900",
      color: RED, letterSpacing: "2px", borderBottom: `1px solid ${RED}`,
    },
    lastInfoLabelTd: {
      padding: "6px 10px", fontWeight: "700", fontSize: "11.5px",
      borderRight: `1px solid ${RED}`,
      whiteSpace: "nowrap", width: "42%", background: "#fafafa",
    },
    lastInfoValTd: { padding: "6px 10px", fontSize: "11.5px", fontWeight: "500" },

    // ── Items Table ──────────────────────────
    table:    { width: "100%", borderCollapse: "collapse", marginBottom: "12px" },
    th:       {
      background: RED, color: "#fff", padding: "7px 6px",
      fontSize: "10.5px", fontWeight: "700", textAlign: "center",
      border: `1px solid ${RED}`, letterSpacing: "0.3px", lineHeight: "1.4",
    },
    thDesc:   {
      background: RED, color: "#fff", padding: "7px 8px",
      fontSize: "10.5px", fontWeight: "700", textAlign: "center",
      border: `1px solid ${RED}`,
    },
    td:       {
      border: `1px solid ${RED}`, padding: "5px 6px",
      fontSize: "11px", textAlign: "center", height: "28px",
    },
    tdDesc:   {
      border: `1px solid ${RED}`, padding: "5px 8px",
      fontSize: "11px", textAlign: "left", height: "28px",
    },
    tdRight:  {
      border: `1px solid ${RED}`, padding: "5px 6px",
      fontSize: "11px", textAlign: "right", height: "28px",
    },
    subLabelTd: {
      border: `1px solid ${RED}`, padding: "6px 10px",
      fontWeight: "700", textAlign: "right", fontSize: "11.5px",
      background: "#fafafa",
    },
    subValTd: {
      border: `1px solid ${RED}`, padding: "6px 6px",
      fontWeight: "700", textAlign: "right", fontSize: "11.5px",
    },

    // ── Signatures ───────────────────────────
    sigTable:   { width: "100%", marginTop: "18px", marginBottom: "14px" },
    sigTd:      { textAlign: "center", verticalAlign: "bottom", padding: "0 12px" },
    sigLine:    {
      borderTop: "1px dashed #999", paddingTop: "5px", marginTop: "30px",
      fontSize: "10.5px", color: "#333", fontWeight: "600",
    },

    // ── Separator ────────────────────────────
    separator:  { borderTop: "1.5px solid #111", margin: "8px 0" },

    // ── Warranty ─────────────────────────────
    warrantyTitle:  {
      color: RED, fontWeight: "800", fontSize: "13.5px",
      display: "inline", fontFamily: "Arial, sans-serif",
    },
    tncTitle:       {
      fontWeight: "800", fontSize: "13.5px",
      display: "inline", marginLeft: "36px",
    },
    warrantyBody:   {
      fontSize: "9.5px", color: "#222", lineHeight: "1.7",
      marginTop: "7px",
    },
    bullet:   { marginLeft: "12px", marginBottom: "2px" },
    numbered: { marginLeft: "20px", marginBottom: "2px" },

    // ── Footer ───────────────────────────────
    footerBar: {
      marginTop: "16px", background: RED,
      padding: "8px 16px", textAlign: "right", borderRadius: "2px",
    },
    footerText: {
      color: "#fff", fontStyle: "italic",
      fontSize: "15px", fontWeight: "600", letterSpacing: "0.8px",
    },
  };

  return (
    <div>
      {/* ── Print Button ── */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <button
          onClick={handlePrint}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 18px", borderRadius: "8px", border: "none",
            background: RED, color: "#fff", fontSize: "13px",
            fontWeight: "700", cursor: "pointer",
          }}
        >
          🖨️ Print Invoice
        </button>
      </div>

      {/* ── Printable Invoice ── */}
      <div ref={printRef}>
        <div style={s.page}>

          {/* ════ HEADER ════ */}
          <table style={s.headerTable} cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                {/* Logo + Brand */}
                <td style={s.logoCell}>
                  <div style={s.brandBlock}>
                    <SpiderLogo />
                    <div style={s.brandText}>
                      <div style={s.brandName}>
                        <span style={s.brandRed}>SMART</span><br/>
                        <span style={s.brandRed}>SPIDER</span>
                      </div>
                      <div style={s.tagline}>Weaves Your Success</div>
                    </div>
                  </div>
                </td>

                {/* Invoice title + Company info */}
                <td style={s.invoiceCell}>
                  <div style={s.invoiceTitle}>INVOICE</div>
                  <div style={s.companyName}>SMART SPIDER (PVT) LTD</div>
                  <div style={s.companyAddr}>
                    No.80/20, Kasthuriyar Road, Jaffna.<br/>
                    Tel: 021 221 5994 / 070 225 7777
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ════ DIVIDER ════ */}
          <div style={s.divider} />

          {/* ════ CUSTOMER / INVOICE INFO ════ */}
          <table style={s.infoTable} cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                {/* Customer box */}
                <td style={s.customerBox}>
                  <div style={s.customerLabel}>Customer</div>
                  <div style={s.customerValue}>
                    {bill.customer?.name || bill.name || ""}
                  </div>
                  {(bill.customer?.phone) && (
                    <div style={s.customerPhone}>{bill.customer.phone}</div>
                  )}
                </td>

                <td style={s.spacerCell} />

                {/* Date / Invoice No / DC No */}
                <td style={s.infoBox}>
                  <table style={s.infoInner} cellPadding="0" cellSpacing="0">
                    <tbody>
                      <tr>
                        <td style={s.infoLabelTd}>Date</td>
                        <td style={s.infoValTd}>
                          {bill.date
                            ? new Date(bill.date).toLocaleDateString("en-GB")
                            : bill.createdAt
                            ? new Date(bill.createdAt).toLocaleDateString("en-GB")
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={s.infoLabelTd}>Invoice No.</td>
                        <td style={s.invoiceNumVal}>
                          {bill.invoiceNo
                            ? bill.invoiceNo.toString().replace(/\D/g, "").padStart(4, "0")
                            : ""}
                        </td>
                      </tr>
                      <tr>
                        <td style={s.lastInfoLabelTd}>DC No.</td>
                        <td style={s.lastInfoValTd}>
                          {bill.collectionNo || bill.dcNo || ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ════ ITEMS TABLE ════ */}
          {/* Image shows: MODEL NO. | DESCRIPTION | QTY. | AMOUNT LKR  (no IMEI column) */}
          <table style={s.table} cellPadding="0" cellSpacing="0">
            <thead>
              <tr>
                <th style={{ ...s.th, width: "14%" }}>MODEL<br/>NO.</th>
                <th style={{ ...s.thDesc }}>DESCRIPTION</th>
                <th style={{ ...s.th, width: "8%" }}>QTY.</th>
                <th style={{ ...s.th, width: "16%" }}>
                  AMOUNT<br/><span style={{ fontSize: "9px" }}>LKR</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Filled rows */}
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={s.td}>{item.model || ""}</td>
                  <td style={s.tdDesc}>{item.name || item.description || ""}</td>
                  <td style={s.td}>{item.qty || ""}</td>
                  <td style={s.tdRight}>
                    {item.subtotal
                      ? Number(item.subtotal).toLocaleString()
                      : item.qty && item.unitPrice
                      ? (item.qty * item.unitPrice).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))}

              {/* Empty rows */}
              {Array.from({ length: emptyRows }).map((_, i) => (
                <tr key={`e-${i}`}>
                  <td style={s.td}>&nbsp;</td>
                  <td style={s.tdDesc}>&nbsp;</td>
                  <td style={s.td}>&nbsp;</td>
                  <td style={s.tdRight}>&nbsp;</td>
                </tr>
              ))}

              {/* Sub Total */}
              <tr>
                <td
                  colSpan={3}
                  style={{ ...s.subLabelTd }}
                >
                  Sub Total
                </td>
                <td style={s.subValTd}>
                  {subTotal > 0 ? subTotal.toLocaleString() : ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* ════ SIGNATURES ════ */}
          {/* Image shows only 2: Customer's Signature & Chop | Prepared by */}
          <table style={s.sigTable} cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <td style={s.sigTd}>
                  <div style={s.sigLine}>Customer's Signature &amp; Chop</div>
                </td>
                <td style={s.sigTd}>
                  <div style={s.sigLine}>Prepared by</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ════ SEPARATOR ════ */}
          <div style={s.separator} />

          {/* ════ WARRANTY + T&C ════ */}
          <div style={{ marginTop: "8px" }}>
            <span style={s.warrantyTitle}>Smart Spider Warranty Certificate</span>
            <span style={s.tncTitle}>Terms and Conditions</span>
          </div>

          <div style={s.warrantyBody}>
            <p style={{ marginBottom: "5px" }}>
              We Guarantee the items(s) specified above to be free of defects and in perfect working
              order on delivery. Smart Spider Undertake to replace or repair free of charge any part(s)
              which we consider is /are defective in manufacture subject to the conditions given below.
            </p>
            <p style={s.bullet}>*&nbsp;&nbsp;We are giving three moths warranty for the same fault from the date of repaired.</p>
            <p style={s.bullet}>*&nbsp;&nbsp;This guarantee is valid only within Sri Lanka.</p>
            <p style={s.bullet}>*&nbsp;&nbsp;This guarantee becomes Null &amp; Void if in our opinion.</p>
            <p style={s.numbered}>1.&nbsp;&nbsp;The item(s) has/have in anyway being abused or misused.</p>
            <p style={s.numbered}>2.&nbsp;&nbsp;The Serial/chassis number of this card or the product is defaced or altered.</p>
            <p style={s.numbered}>3.&nbsp;&nbsp;The signature of our official does not appear on the document.</p>
            <p style={s.bullet}>
              *&nbsp;&nbsp;In on case shall Smart Spider assume liability for any claim(s) of damages caused
              to our product by any other a defective product or person.
            </p>
            <p style={s.bullet}>
              *&nbsp;&nbsp;Warranty shall not coyer for any damages or loss(es) under any circumstances in
              relation to this unit(s) against Lightning, Water, Typhoon, Sea corrosion, Power Fluctuations,
              Storm, Flood, Fire, Animals, Insects, theft and accidents caused by any other act of God, or
              if appliance(s) has/have been incorrectly installed, modified or repaired by any person other
              than a service employee of Smart Spider.
            </p>
            <p style={s.bullet}>
              *&nbsp;&nbsp;Any item(s) returned without manual(s) and product box(es) will be charged a ta
              fair and appropriate value which is (5%) of the purchase price.
            </p>
            <p style={s.bullet}>
              *&nbsp;&nbsp;In The event of any unforeseen circumstances, and spares not being available,
              the company's prevailing depreciation rules will be binding on the purchaser to accept a
              commercial solution in lieu of repairs.
            </p>
          </div>

          {/* ════ RED FOOTER BAR ════ */}
          <div style={s.footerBar}>
            <span style={s.footerText}>Weaves your Success</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SmartSpiderInvoice;