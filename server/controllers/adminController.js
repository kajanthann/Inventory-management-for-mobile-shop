import jwt from "jsonwebtoken";
import sendEmail from "../middleware/sendEmail.js";
import Admin from "../models/Admin.js";
import saleModel   from "../models/Sale.js";
import productModel from "../models/product.js";
import repairModel  from "../models/repair.js";


// ======================
// STEP 1: SEND OTP
// ======================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let admin = await Admin.findOne({ email });

    if (!admin) {
      admin = await Admin.create({ email });
    }

    admin.otp = otp;
    admin.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 MINUTE
    admin.otpAttempts = 0;

    await admin.save();

    await sendEmail(
      email,
      "Admin OTP Login",
      `Your OTP is ${otp}. It expires in 1 minute.`
    );

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// STEP 2: VERIFY OTP
// ======================
export const verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!admin.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP requested",
      });
    }

    if (admin.otpExpiresAt < new Date()) {
      admin.otp = null;
      admin.otpExpiresAt = null;
      await admin.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (admin.otpAttempts >= 5) {
      admin.otp = null;
      admin.otpExpiresAt = null;
      await admin.save();

      return res.status(429).json({
        success: false,
        message: "Too many attempts",
      });
    }

    if (otp !== admin.otp) {
      admin.otpAttempts += 1;
      await admin.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // SUCCESS
    admin.otp = null;
    admin.otpExpiresAt = null;
    admin.otpAttempts = 0;

    admin.loginHistory.push({
      time: new Date(),
      ipAddress: ip,
      deviceInfo: userAgent,
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("aToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// LOGOUT
// ======================
export const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("aToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// SEND EMAIL
// ======================
export const sendEmailTo = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    await sendEmail(to, subject, text);

    return res.json({
      success: true,
      message: "Email sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ── helpers ───────────────────────────────────────────────────────
const startOf = (unit, date = new Date()) => {
  const d = new Date(date);
  if (unit === "day")   { d.setHours(0,0,0,0); return d; }
  if (unit === "week")  { d.setHours(0,0,0,0); d.setDate(d.getDate() - d.getDay()); return d; }
  if (unit === "month") { return new Date(d.getFullYear(), d.getMonth(), 1); }
  if (unit === "year")  { return new Date(d.getFullYear(), 0, 1); }
};

export const getDashboardStats = async (req, res) => {
  try {
    const now        = new Date();
    const todayStart = startOf("day");
    const weekStart  = startOf("week");
    const monthStart = startOf("month");
    const yearStart  = startOf("year");

    // ── All data ──────────────────────────────────────────────
    const [allSales, allProducts, allRepairs] = await Promise.all([
      saleModel.find().sort({ createdAt: -1 }),
      productModel.find(),
      repairModel.find().sort({ createdAt: -1 }),
    ]);

    const completedSales = allSales.filter(s => s.status === "completed");

    // ── Revenue helpers ───────────────────────────────────────
    const revenueIn = (sales, from) =>
      sales.filter(s => new Date(s.createdAt) >= from)
           .reduce((sum, s) => sum + s.grandTotal, 0);

    const profitIn = (sales, from, products) =>
      sales.filter(s => new Date(s.createdAt) >= from)
           .reduce((sum, s) =>
             sum + (s.items || []).reduce((a, item) => {
               const prod = products.find(p => String(p._id) === String(item.product));
               return a + (prod ? (item.unitPrice - prod.cost) * item.qty : 0);
             }, 0), 0);

    // ── KPI ───────────────────────────────────────────────────
    const kpi = {
      today:   { revenue: revenueIn(completedSales, todayStart),  profit: profitIn(completedSales, todayStart,  allProducts), sales: completedSales.filter(s => new Date(s.createdAt) >= todayStart).length  },
      week:    { revenue: revenueIn(completedSales, weekStart),   profit: profitIn(completedSales, weekStart,   allProducts), sales: completedSales.filter(s => new Date(s.createdAt) >= weekStart).length   },
      month:   { revenue: revenueIn(completedSales, monthStart),  profit: profitIn(completedSales, monthStart,  allProducts), sales: completedSales.filter(s => new Date(s.createdAt) >= monthStart).length  },
      year:    { revenue: revenueIn(completedSales, yearStart),   profit: profitIn(completedSales, yearStart,   allProducts), sales: completedSales.filter(s => new Date(s.createdAt) >= yearStart).length   },
      allTime: { revenue: revenueIn(completedSales, new Date(0)), profit: profitIn(completedSales, new Date(0), allProducts), sales: completedSales.length },
    };

    // ── Daily revenue chart — last 14 days ────────────────────
    const dailyMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { day: key, revenue: 0, profit: 0, sales: 0 };
    }
    completedSales.forEach(s => {
      const key = (s.date || s.createdAt?.toISOString().slice(0, 10));
      if (dailyMap[key]) {
        dailyMap[key].revenue += s.grandTotal;
        dailyMap[key].sales   += 1;
        dailyMap[key].profit  += (s.items || []).reduce((a, item) => {
          const prod = allProducts.find(p => String(p._id) === String(item.product));
          return a + (prod ? (item.unitPrice - prod.cost) * item.qty : 0);
        }, 0);
      }
    });
    const dailyChart = Object.values(dailyMap);

    // ── Weekly chart — last 8 weeks ───────────────────────────
    const weeklyMap = {};
    for (let i = 7; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i * 7);
      const week = startOf("week", d);
      const key  = week.toISOString().slice(0, 10);
      weeklyMap[key] = { week: `W${String(Math.ceil((week.getDate()) / 7)).padStart(2,"0")} ${week.toLocaleString("default",{month:"short"})}`, revenue: 0, profit: 0, sales: 0 };
    }
    completedSales.forEach(s => {
      const d    = new Date(s.createdAt);
      const week = startOf("week", d);
      const key  = week.toISOString().slice(0, 10);
      if (weeklyMap[key]) {
        weeklyMap[key].revenue += s.grandTotal;
        weeklyMap[key].sales   += 1;
        weeklyMap[key].profit  += (s.items || []).reduce((a, item) => {
          const prod = allProducts.find(p => String(p._id) === String(item.product));
          return a + (prod ? (item.unitPrice - prod.cost) * item.qty : 0);
        }, 0);
      }
    });
    const weeklyChart = Object.values(weeklyMap);

    // ── Monthly chart — last 12 months ────────────────────────
    const monthlyMap = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      monthlyMap[key] = { month: d.toLocaleString("default",{month:"short",year:"2-digit"}), revenue: 0, profit: 0, sales: 0 };
    }
    completedSales.forEach(s => {
      const d   = new Date(s.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += s.grandTotal;
        monthlyMap[key].sales   += 1;
        monthlyMap[key].profit  += (s.items || []).reduce((a, item) => {
          const prod = allProducts.find(p => String(p._id) === String(item.product));
          return a + (prod ? (item.unitPrice - prod.cost) * item.qty : 0);
        }, 0);
      }
    });
    const monthlyChart = Object.values(monthlyMap);

    // ── Yearly chart — last 5 years ───────────────────────────
    const yearlyMap = {};
    for (let i = 4; i >= 0; i--) {
      const yr = now.getFullYear() - i;
      yearlyMap[yr] = { year: String(yr), revenue: 0, profit: 0, sales: 0 };
    }
    completedSales.forEach(s => {
      const yr = new Date(s.createdAt).getFullYear();
      if (yearlyMap[yr]) {
        yearlyMap[yr].revenue += s.grandTotal;
        yearlyMap[yr].sales   += 1;
        yearlyMap[yr].profit  += (s.items || []).reduce((a, item) => {
          const prod = allProducts.find(p => String(p._id) === String(item.product));
          return a + (prod ? (item.unitPrice - prod.cost) * item.qty : 0);
        }, 0);
      }
    });
    const yearlyChart = Object.values(yearlyMap);

    // ── Payment method breakdown ──────────────────────────────
    const payMap = {};
    completedSales.forEach(s => { payMap[s.paymentMethod] = (payMap[s.paymentMethod] || 0) + 1; });
    const paymentChart = Object.entries(payMap).map(([name, value]) => ({ name, value }));

    // ── Top selling products ──────────────────────────────────
    const sellerMap = {};
    completedSales.forEach(s =>
      (s.items || []).forEach(item => {
        const key = item.name;
        if (!sellerMap[key]) sellerMap[key] = { name: key, qty: 0, revenue: 0 };
        sellerMap[key].qty     += item.qty;
        sellerMap[key].revenue += item.subtotal;
      })
    );
    const topSellers = Object.values(sellerMap).sort((a,b) => b.qty - a.qty).slice(0, 7);

    // ── Inventory ─────────────────────────────────────────────
    const lowStock       = allProducts.filter(p => p.qty <= 5).map(p => ({ _id: p._id, name: p.name, qty: p.qty, category: p.category }));
    const inventoryValue = allProducts.reduce((s, p) => s + p.qty * p.price, 0);
    const catMap         = {};
    allProducts.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + p.qty * p.price; });
    const categoryChart  = Object.entries(catMap).map(([name, value]) => ({ name, value }));

    // ── Repairs ───────────────────────────────────────────────
    const repairStats = {
      pending:  allRepairs.filter(r => r.status === "pending").length,
      done:     allRepairs.filter(r => r.status === "done").length,
      returned: allRepairs.filter(r => r.status === "returned").length,
      total:    allRepairs.length,
    };
    const pendingRepairs = allRepairs.filter(r => r.status === "pending").slice(0, 5);

    const repairMonthMap = {};
    for (let i = 5; i >= 0; i--) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      repairMonthMap[key] = { month: d.toLocaleString("default",{month:"short"}), pending: 0, done: 0, returned: 0 };
    }
    allRepairs.forEach(r => {
      const d   = new Date(r.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      if (repairMonthMap[key]) repairMonthMap[key][r.status] = (repairMonthMap[key][r.status] || 0) + 1;
    });
    const repairChart = Object.values(repairMonthMap);

    // ── Recent sales ──────────────────────────────────────────
    const recentSales = allSales.slice(0, 5).map(s => ({
      _id: s._id, invoiceNo: s.invoiceNo, date: s.date,
      customer: s.customer, grandTotal: s.grandTotal,
      paymentMethod: s.paymentMethod, status: s.status,
      itemCount: (s.items||[]).length,
    }));

    return res.json({
      success: true,
      kpi,
      charts: { daily: dailyChart, weekly: weeklyChart, monthly: monthlyChart, yearly: yearlyChart },
      paymentChart,
      topSellers,
      categoryChart,
      repairChart,
      repairStats,
      pendingRepairs,
      recentSales,
      lowStock,
      inventoryValue,
      totalProducts: allProducts.length,
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};