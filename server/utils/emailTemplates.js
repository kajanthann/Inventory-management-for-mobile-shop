export const getOtpEmailTemplate = (otp) => {
  // ... your existing OTP template
};

export const getChangePasswordOtpTemplate = (otp) => {
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Change Delete Password</title></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:20px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="background:linear-gradient(135deg,#b00000,#7a0000);border-radius:10px;padding:10px 24px;">
              <span style="font-size:19px;font-weight:900;color:#fff;">SMART<span style="color:#ffaaaa;font-weight:400;">SPIDER</span></span>
            </td>
          </tr></table>
          <p style="margin:8px 0 0;font-size:11px;color:#3a3a3a;letter-spacing:2px;text-transform:uppercase;">Inventory Management System</p>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#111111;border-radius:16px;border:1px solid #1e1e1e;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
          <div style="height:3px;background:linear-gradient(90deg,#6a0000,#b00000,#ff3333,#b00000,#6a0000);"></div>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:36px 32px 20px;">
              <div style="width:68px;height:68px;background:radial-gradient(circle,rgba(176,0,0,0.18),rgba(176,0,0,0.04));border:1px solid rgba(176,0,0,0.28);border-radius:50%;font-size:30px;line-height:68px;text-align:center;margin-bottom:18px;display:inline-block;">🔑</div>
              <h1 style="margin:0 0 8px;font-size:21px;font-weight:800;color:#f1f1f1;letter-spacing:-0.4px;">Change Delete Password</h1>
              <p style="margin:0;font-size:13.5px;color:#555;line-height:1.65;">Use this OTP to verify your identity<br/>before changing your <strong style="color:#888;">admin delete password</strong>.</p>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:0 32px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#1e1e1e,transparent);"></div></td></tr>

            <!-- OTP -->
            <tr><td align="center" style="padding:28px 32px 20px;">
              <p style="margin:0 0 18px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#3a3a3a;">Verification Code</p>
              <table cellpadding="0" cellspacing="0" align="center" style="margin-bottom:18px;"><tr>
                ${otp.split("").map((d, i) => `
                  <td style="padding:0 4px;">
                    ${i === 3 ? `<td style="padding:0 4px;vertical-align:middle;"><span style="font-size:22px;color:#2a2a2a;font-weight:300;line-height:1;">—</span></td>` : ""}
                    <div style="width:44px;height:52px;background:linear-gradient(160deg,#1a1a1a,#141414);border:1px solid #242424;border-bottom:2px solid #b00000;border-radius:8px;font-size:26px;font-weight:800;color:#ffffff;line-height:52px;text-align:center;font-family:'Courier New',monospace;">${d}</div>
                  </td>
                `).join("")}
              </tr></table>
              <div style="display:inline-block;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:99px;padding:6px 16px;">
                <span style="font-size:12px;font-weight:600;color:#d97706;">⏱&nbsp; Expires in 1 minute</span>
              </div>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:0 32px;"><div style="height:1px;background:linear-gradient(90deg,transparent,#1e1e1e,transparent);"></div></td></tr>

            <!-- Warning -->
            <tr><td style="padding:20px 32px 8px;">
              <div style="background:rgba(176,0,0,0.06);border:1px solid rgba(176,0,0,0.14);border-left:3px solid #b00000;border-radius:8px;padding:14px 16px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#b00000;">🚨 SECURITY NOTICE</p>
                <p style="margin:0;font-size:12px;color:#555;line-height:1.7;">If you did not request a delete password change, someone may be attempting to access your system. Change your login credentials immediately.</p>
              </div>
            </td></tr>

            <!-- Checklist -->
            <tr><td style="padding:16px 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:11.5px;color:#3a3a3a;line-height:1.9;vertical-align:top;">
                  <span style="color:#b00000;">✓</span>&nbsp; Never share this OTP with anyone<br/>
                  <span style="color:#b00000;">✓</span>&nbsp; This OTP is for delete password change only<br/>
                  <span style="color:#b00000;">✓</span>&nbsp; Valid for a single use only
                </td>
                <td align="right" style="font-size:10.5px;color:#2a2a2a;vertical-align:top;white-space:nowrap;padding-left:12px;">${timestamp}</td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding:20px 0 4px;">
          <p style="margin:0 0 4px;font-size:11.5px;color:#2a2a2a;font-weight:600;">SmartSpider (PVT) Ltd.</p>
          <p style="margin:0 0 4px;font-size:11px;color:#222;">NO.80/20, Kasthuriyar Road, Jaffna, Sri Lanka</p>
          <p style="margin:0;font-size:10.5px;color:#1e1e1e;">© ${new Date().getFullYear()} SmartSpider. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
};

const Rs = (v) => `Rs ${Number(v || 0).toLocaleString()}`;
const bar = (val, max, color = "#b00000") => {
  const pct = max > 0 ? Math.round((val / max) * 100) : 0;
  return `
    <div style="background:#1a1a1a;border-radius:4px;height:8px;width:100%;margin-top:4px;">
      <div style="background:${color};height:8px;border-radius:4px;width:${pct}%;"></div>
    </div>
    <div style="font-size:10px;color:#555;margin-top:2px;">${pct}%</div>
  `;
};

export const getSalesReportEmailTemplate = (report) => {
  const topProduct = report.topProducts?.[0];
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:20px;">
    <div style="background:linear-gradient(135deg,#b00000,#7a0000);border-radius:10px;padding:10px 24px;display:inline-block;">
      <span style="font-size:19px;font-weight:900;color:#fff;">SMART<span style="color:#ffaaaa;font-weight:400;">SPIDER</span></span>
    </div>
    <p style="margin:8px 0 0;font-size:11px;color:#3a3a3a;letter-spacing:2px;text-transform:uppercase;">Monthly Sales Report</p>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:#111;border-radius:16px;border:1px solid #1e1e1e;overflow:hidden;">
    <div style="height:3px;background:linear-gradient(90deg,#6a0000,#b00000,#ff3333,#b00000,#6a0000);"></div>

    <!-- Header -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:28px 32px 20px;">
        <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#f1f1f1;">${report.monthLabel} — Sales Report</h1>
        <p style="margin:0;font-size:12px;color:#555;">Generated on ${new Date(report.generatedAt).toLocaleString()}</p>
      </td></tr>

      <!-- Divider -->
      <tr><td style="padding:0 32px;"><div style="height:1px;background:#1e1e1e;"></div></td></tr>

      <!-- KPI Grid -->
      <tr><td style="padding:24px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${[
              ["Total Sales",    report.totalSales,           "#3b82f6"],
              ["Total Revenue",  Rs(report.totalRevenue),     "#22c55e"],
              ["Total Profit",   Rs(report.totalProfit),      "#10b981"],
              ["Total Discount", Rs(report.totalDiscount),    "#f59e0b"],
            ].map(([label, value, color]) => `
              <td style="width:25%;padding:0 6px 0 0;vertical-align:top;">
                <div style="background:#1a1a1a;border:1px solid #222;border-top:2px solid ${color};border-radius:8px;padding:14px 12px;">
                  <div style="font-size:10px;color:#555;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">${label}</div>
                  <div style="font-size:18px;font-weight:800;color:${color};font-family:'Courier New',monospace;">${value}</div>
                </div>
              </td>
            `).join("")}
          </tr>
        </table>
      </td></tr>

      <!-- Divider -->
      <tr><td style="padding:0 32px;"><div style="height:1px;background:#1e1e1e;"></div></td></tr>

      <!-- Payment Breakdown -->
      <tr><td style="padding:20px 32px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:14px;">Payment Method Breakdown</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${Object.entries(report.paymentBreakdown || {}).map(([method, count]) => `
            <tr>
              <td style="padding:5px 0;font-size:12px;color:#aaa;width:140px;">${method}</td>
              <td style="padding:5px 0;">
                <div style="background:#1a1a1a;border-radius:4px;height:6px;width:100%;">
                  <div style="background:#b00000;height:6px;border-radius:4px;width:${report.totalSales > 0 ? Math.round((count/report.totalSales)*100) : 0}%;"></div>
                </div>
              </td>
              <td style="padding:5px 0 5px 10px;font-size:12px;color:#fff;font-weight:700;text-align:right;white-space:nowrap;">${count} sales</td>
            </tr>
          `).join("")}
        </table>
      </td></tr>

      <!-- Divider -->
      <tr><td style="padding:0 32px;"><div style="height:1px;background:#1e1e1e;"></div></td></tr>

      <!-- Top Products -->
      ${report.topProducts?.length > 0 ? `
      <tr><td style="padding:20px 32px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:14px;">Top Selling Products</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr style="background:#1a1a1a;">
            <th style="padding:8px 10px;font-size:10px;color:#555;text-align:left;font-weight:600;letter-spacing:1px;">PRODUCT</th>
            <th style="padding:8px 10px;font-size:10px;color:#555;text-align:center;font-weight:600;letter-spacing:1px;">QTY</th>
            <th style="padding:8px 10px;font-size:10px;color:#555;text-align:right;font-weight:600;letter-spacing:1px;">REVENUE</th>
          </tr>
          ${report.topProducts.slice(0, 5).map((p, i) => `
            <tr style="background:${i % 2 === 0 ? "#161616" : "#111"};">
              <td style="padding:9px 10px;font-size:12px;color:#ddd;">${p.name}</td>
              <td style="padding:9px 10px;font-size:12px;color:#3b82f6;text-align:center;font-weight:700;">${p.qty}</td>
              <td style="padding:9px 10px;font-size:12px;color:#22c55e;text-align:right;font-weight:700;font-family:'Courier New',monospace;">${Rs(p.revenue)}</td>
            </tr>
          `).join("")}
        </table>
      </td></tr>
      ` : ""}

      <!-- Summary Row -->
      <tr><td style="padding:16px 32px 28px;">
        <div style="background:#1a1a1a;border:1px solid #222;border-radius:10px;padding:16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["Amount Paid",     Rs(report.totalAmountPaid)],
              ["Extra Income",    Rs(report.totalExtraIncome)],
              ["Total Change Given", Rs(report.totalChange)],
            ].map(([k, v]) => `
              <tr>
                <td style="padding:5px 0;font-size:12px;color:#666;">${k}</td>
                <td style="padding:5px 0;font-size:12px;color:#aaa;text-align:right;font-family:'Courier New',monospace;">${v}</td>
              </tr>
            `).join("")}
          </table>
        </div>
      </td></tr>

    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:20px 0 4px;">
    <p style="margin:0 0 4px;font-size:11px;color:#2a2a2a;font-weight:600;">SmartSpider (PVT) Ltd. · NO.80/20, Kasthuriyar Road, Jaffna</p>
    <p style="margin:0;font-size:10px;color:#1e1e1e;">© ${new Date().getFullYear()} SmartSpider. All rights reserved. · This is an automated report.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
};

export const getRepairReportEmailTemplate = (report) => {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:20px;">
    <div style="background:linear-gradient(135deg,#b00000,#7a0000);border-radius:10px;padding:10px 24px;display:inline-block;">
      <span style="font-size:19px;font-weight:900;color:#fff;">SMART<span style="color:#ffaaaa;font-weight:400;">SPIDER</span></span>
    </div>
    <p style="margin:8px 0 0;font-size:11px;color:#3a3a3a;letter-spacing:2px;text-transform:uppercase;">Monthly Repair Report</p>
  </td></tr>

  <!-- Card -->
  <tr><td style="background:#111;border-radius:16px;border:1px solid #1e1e1e;overflow:hidden;">
    <div style="height:3px;background:linear-gradient(90deg,#6a0000,#b00000,#ff3333,#b00000,#6a0000);"></div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:28px 32px 20px;">
        <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#f1f1f1;">${report.monthLabel} — Repair Report</h1>
        <p style="margin:0;font-size:12px;color:#555;">Generated on ${new Date(report.generatedAt).toLocaleString()}</p>
      </td></tr>

      <tr><td style="padding:0 32px;"><div style="height:1px;background:#1e1e1e;"></div></td></tr>

      <!-- KPI Grid -->
      <tr><td style="padding:24px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${[
              ["Total Jobs",    report.totalRepairs,            "#3b82f6"],
              ["Completed",     report.totalDone,               "#22c55e"],
              ["Pending",       report.totalPending,            "#f59e0b"],
              ["Repair Income", Rs(report.totalRepairIncome),   "#10b981"],
            ].map(([label, value, color]) => `
              <td style="width:25%;padding:0 6px 0 0;vertical-align:top;">
                <div style="background:#1a1a1a;border:1px solid #222;border-top:2px solid ${color};border-radius:8px;padding:14px 12px;">
                  <div style="font-size:10px;color:#555;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">${label}</div>
                  <div style="font-size:18px;font-weight:800;color:${color};font-family:'Courier New',monospace;">${value}</div>
                </div>
              </td>
            `).join("")}
          </tr>
        </table>
      </td></tr>

      <tr><td style="padding:0 32px;"><div style="height:1px;background:#1e1e1e;"></div></td></tr>

      <!-- Warranty Breakdown -->
      <tr><td style="padding:20px 32px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:14px;">Warranty Breakdown</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[
            ["Warranty",     report.warrantyBreakdown?.warranty    || 0, "#3b82f6"],
            ["Non-Warranty", report.warrantyBreakdown?.nonWarranty || 0, "#f59e0b"],
          ].map(([label, count, color]) => `
            <tr>
              <td style="padding:6px 0;font-size:12px;color:#aaa;width:140px;">${label}</td>
              <td style="padding:6px 0;">
                <div style="background:#1a1a1a;border-radius:4px;height:6px;width:100%;">
                  <div style="background:${color};height:6px;border-radius:4px;width:${report.totalRepairs > 0 ? Math.round((count/report.totalRepairs)*100) : 0}%;"></div>
                </div>
              </td>
              <td style="padding:6px 0 6px 10px;font-size:12px;color:#fff;font-weight:700;text-align:right;">${count} jobs</td>
            </tr>
          `).join("")}
        </table>
      </td></tr>

      <tr><td style="padding:0 32px;"><div style="height:1px;background:#1e1e1e;"></div></td></tr>

      <!-- Brand Breakdown -->
      ${report.brandBreakdown?.length > 0 ? `
      <tr><td style="padding:20px 32px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#555;margin-bottom:14px;">Top Brands Repaired</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr style="background:#1a1a1a;">
            <th style="padding:8px 10px;font-size:10px;color:#555;text-align:left;font-weight:600;">BRAND</th>
            <th style="padding:8px 10px;font-size:10px;color:#555;text-align:right;font-weight:600;">JOBS</th>
          </tr>
          ${report.brandBreakdown.slice(0, 5).map((b, i) => `
            <tr style="background:${i % 2 === 0 ? "#161616" : "#111"};">
              <td style="padding:9px 10px;font-size:12px;color:#ddd;">${b.brand || "Unknown"}</td>
              <td style="padding:9px 10px;font-size:12px;color:#b00000;text-align:right;font-weight:700;">${b.count}</td>
            </tr>
          `).join("")}
        </table>
      </td></tr>
      ` : ""}

      <!-- Returned -->
      <tr><td style="padding:0 32px 28px;">
        <div style="background:#1a1a1a;border:1px solid #222;border-radius:10px;padding:14px 16px;margin-top:20px;">
          <div style="display:flex;justify-content:space-between;">
            <span style="font-size:12px;color:#666;">Devices Returned</span>
            <span style="font-size:12px;color:#a78bfa;font-weight:700;">${report.totalReturned}</span>
          </div>
        </div>
      </td></tr>

    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:20px 0 4px;">
    <p style="margin:0 0 4px;font-size:11px;color:#2a2a2a;font-weight:600;">SmartSpider (PVT) Ltd. · NO.80/20, Kasthuriyar Road, Jaffna</p>
    <p style="margin:0;font-size:10px;color:#1e1e1e;">© ${new Date().getFullYear()} SmartSpider. All rights reserved. · This is an automated report.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
};