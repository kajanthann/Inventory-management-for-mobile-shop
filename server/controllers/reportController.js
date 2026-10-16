import saleModel   from "../models/Sale.js";
import repairModel from "../models/repair.js";
import reportModel from "../models/report.js";
import productModel from "../models/product.js";
import sendEmail   from "../middleware/sendEmail.js";
import {
  getSalesReportEmailTemplate,
  getRepairReportEmailTemplate,
} from "../utils/emailTemplates.js";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── Build date range for a given month/year ───────────────────────
const getMonthRange = (month, year) => {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end   = new Date(year, month,     0, 23, 59, 59, 999); // last day
  return { start, end };
};

// ════════════════════════════════════════════════════════════════
// ── GENERATE SALES REPORT ────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
export const generateSalesReport = async (month, year) => {
  const { start, end } = getMonthRange(month, year);
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const sales = await saleModel.find({
    createdAt: { $gte: start, $lte: end },
    status:    "completed",
  });

  // ── KPIs ──────────────────────────────────────────────────────
  const totalSales       = sales.length;
  const totalRevenue     = sales.reduce((s, x) => s + x.grandTotal, 0);
  const totalDiscount    = sales.reduce((s, x) => s + (x.discount || 0), 0);
  const totalExtraIncome = sales.reduce((s, x) => s + (x.extraTotal || 0), 0);
  const totalAmountPaid  = sales.reduce((s, x) => s + x.amountPaid, 0);
  const totalChange      = sales.reduce((s, x) => s + (x.change || 0), 0);

  // ── Profit ────────────────────────────────────────────────────
  const allProducts = await productModel.find({}, "_id cost");
  const costMap     = {};
  allProducts.forEach(p => { costMap[String(p._id)] = p.cost || 0; });

  let totalProfit = 0;
  sales.forEach(sale => {
    (sale.items || []).forEach(item => {
      const cost   = costMap[String(item.product)] || 0;
      totalProfit += (item.unitPrice - cost) * item.qty;
    });
    totalProfit += (sale.extraTotal || 0);
  });

  // ── Payment breakdown ─────────────────────────────────────────
  const paymentBreakdown = { Cash: 0, Card: 0, "Bank Transfer": 0, Online: 0 };
  sales.forEach(s => { if (paymentBreakdown[s.paymentMethod] !== undefined) paymentBreakdown[s.paymentMethod]++; });

  // ── Top products ──────────────────────────────────────────────
  const productMap = {};
  sales.forEach(sale => {
    (sale.items || []).forEach(item => {
      const key = item.name;
      if (!productMap[key]) productMap[key] = { name: key, qty: 0, revenue: 0 };
      productMap[key].qty     += item.qty;
      productMap[key].revenue += item.subtotal;
    });
  });
  const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 7);

  // ── Daily sales ───────────────────────────────────────────────
  const dailyMap = {};
  sales.forEach(s => {
    const key = s.date || new Date(s.createdAt).toISOString().slice(0, 10);
    if (!dailyMap[key]) dailyMap[key] = { date: key, sales: 0, revenue: 0 };
    dailyMap[key].sales++;
    dailyMap[key].revenue += s.grandTotal;
  });
  const dailySales = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  // ── Upsert report ─────────────────────────────────────────────
  const report = await reportModel.findOneAndUpdate(
    { type: "sales", month, year },
    {
      type: "sales", month, year, monthLabel,
      totalSales, totalRevenue, totalDiscount,
      totalExtraIncome, totalProfit,
      totalAmountPaid, totalChange,
      paymentBreakdown, topProducts, dailySales,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return report;
};

// ════════════════════════════════════════════════════════════════
// ── GENERATE REPAIR REPORT ───────────────────────────────────────
// ════════════════════════════════════════════════════════════════
export const generateRepairReport = async (month, year) => {
  const { start, end } = getMonthRange(month, year);
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const repairs = await repairModel.find({
    createdAt: { $gte: start, $lte: end },
  });

  const totalRepairs     = repairs.length;
  const totalDone        = repairs.filter(r => r.status === "done").length;
  const totalPending     = repairs.filter(r => r.status === "pending").length;
  const totalReturned    = repairs.filter(r => r.status === "returned").length;
  const totalRepairIncome = repairs
    .filter(r => r.status === "done" && r.price)
    .reduce((s, r) => s + (r.price || 0), 0);

  const warrantyBreakdown = {
    warranty:    repairs.filter(r => r.warranty === "warranty").length,
    nonWarranty: repairs.filter(r => r.warranty === "non-warranty").length,
  };

  // Brand breakdown
  const brandMap = {};
  repairs.forEach(r => {
    const brand = r.brand || "Unknown";
    brandMap[brand] = (brandMap[brand] || 0) + 1;
  });
  const brandBreakdown = Object.entries(brandMap)
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count);

  const report = await reportModel.findOneAndUpdate(
    { type: "repair", month, year },
    {
      type: "repair", month, year, monthLabel,
      totalRepairs, totalDone, totalPending,
      totalReturned, totalRepairIncome,
      warrantyBreakdown, brandBreakdown,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return report;
};

// ════════════════════════════════════════════════════════════════
// ── SEND REPORT EMAIL ────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
const sendReportEmail = async (report) => {
  const email   = process.env.ADMIN_EMAIL;
  const isSales = report.type === "sales";

  const subject = isSales
    ? `📊 SmartSpider — ${report.monthLabel} Sales Report`
    : `🔧 SmartSpider — ${report.monthLabel} Repair Report`;

  const html = isSales
    ? getSalesReportEmailTemplate(report)
    : getRepairReportEmailTemplate(report);

  await sendEmail(email, subject, html);

  await reportModel.findByIdAndUpdate(report._id, {
    emailSent:   true,
    emailSentAt: new Date(),
  });
};

// ════════════════════════════════════════════════════════════════
// ── AUTO GENERATE (called by cron at month end) ──────────────────
// ════════════════════════════════════════════════════════════════
export const autoGenerateMonthlyReports = async () => {
  try {
    const now   = new Date();
    const month = now.getMonth() + 1;  // 1-12
    const year  = now.getFullYear();

    console.log(`🔄 Auto-generating ${MONTH_NAMES[month - 1]} ${year} reports...`);

    const [salesReport, repairReport] = await Promise.all([
      generateSalesReport(month, year),
      generateRepairReport(month, year),
    ]);

    await Promise.all([
      sendReportEmail(salesReport),
      sendReportEmail(repairReport),
    ]);

    console.log(`✅ Monthly reports generated and emailed for ${MONTH_NAMES[month - 1]} ${year}`);
  } catch (err) {
    console.error("❌ Auto report generation failed:", err.message);
  }
};

// ════════════════════════════════════════════════════════════════
// ── API CONTROLLERS ──────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════

// GET all reports
export const getAllReports = async (req, res) => {
  try {
    const { type, year } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (year) filter.year = Number(year);

    const reports = await reportModel.find(filter).sort({ year: -1, month: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single report
export const getReportById = async (req, res) => {
  try {
    const report = await reportModel.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST manually generate report
export const manualGenerateReport = async (req, res) => {
  try {
    const { type, month, year } = req.body;

    if (!type || !month || !year) {
      return res.status(400).json({ success: false, message: "type, month and year required" });
    }
    if (!["sales", "repair"].includes(type)) {
      return res.status(400).json({ success: false, message: "type must be sales or repair" });
    }

    const report = type === "sales"
      ? await generateSalesReport(Number(month), Number(year))
      : await generateRepairReport(Number(month), Number(year));

    res.json({ success: true, message: "Report generated", report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST send report email manually
export const sendReportEmailManual = async (req, res) => {
  try {
    const report = await reportModel.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: "Report not found" });

    await sendReportEmail(report);
    res.json({ success: true, message: "Report emailed successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE report
export const deleteReport = async (req, res) => {
  try {
    const deleted = await reportModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};