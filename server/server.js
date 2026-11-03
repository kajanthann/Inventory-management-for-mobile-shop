import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";

import connectDB from "./config/mongooDB.js";
import productRouter from "./routes/productRoutes.js";
import saleRouter from "./routes/salesRoutes.js";
import repairRouter from "./routes/repairRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import DbStatsRouter from "./routes/dbStatsRoute.js";
import preOrderRouter from "./routes/preOrderRouter.js";
import reportRouter from "./routes/reportRouter.js";
import { autoGenerateMonthlyReports } from "./controllers/reportController.js";

const app = express();

// ── Middlewares ───────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "atoken",
    "x-admin-password",
  ],
}));
app.use(express.json({ limit: "15mb" }));   // PDF base64 attachments-kku
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────────
app.use("/api/products",  productRouter);
app.use("/api/sales",     saleRouter);
app.use("/api/repairs",   repairRouter);
app.use("/api/preorders", preOrderRouter);
app.use("/api/admin",     adminRouter);
app.use("/api/reports",   reportRouter);
app.use("/api/db",        DbStatsRouter);

app.get("/", (req, res) => {
  res.send("Hello World! smart spider server is Here");
});

// ── Cron: 11:59 PM on the LAST day of every month (Sri Lanka time) ─
// "59 23 28-31 * *" fires on days 28-31, so we check tomorrow is the 1st
cron.schedule(
  "59 23 28-31 * *",
  async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDate() === 1) {
      console.log("Month end detected — generating reports...");
      await autoGenerateMonthlyReports();
    }
  },
  { timezone: "Asia/Colombo" }
);
console.log("Monthly report cron job scheduled");

// ── Start server (DB first, then listen) ──────────────────────────
const start = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};
start();