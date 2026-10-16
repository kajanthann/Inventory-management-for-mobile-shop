import express from 'express';
import mongoose from 'mongoose';
import cron from "node-cron";
import reportRouter from "./routes/reportRouter.js";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongooDB.js';
import productRouter from './routes/productRoutes.js';
import saleRouter from './routes/salesRoutes.js';
import repairRouter from './routes/repairRoutes.js';
import adminRouter from './routes/adminRoute.js';
import cookieParser from "cookie-parser";
import DbStatsRouter from './routes/dbStatsRoute.js';
import preOrderRouter from './routes/preOrderRouter.js';
import { autoGenerateMonthlyReports } from "./controllers/reportController.js";


dotenv.config();
connectDB();

const frontendUrl = process.env.FRONTEND_URL;

const app = express();
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));
app.use(express.json());

app.use(cookieParser());
app.use('/api/products', productRouter);
app.use('/api/sales', saleRouter);
app.use('/api/repairs', repairRouter);
app.use('/api/preorders', preOrderRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reports', reportRouter);
app.use('/api/db', DbStatsRouter);

// ── Cron: runs at 11:59 PM on the last day of every month ────────
// "59 23 28-31 * *" fires on days 28-31; controller uses current month
cron.schedule("59 23 28-31 * *", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Only run on actual last day
  if (tomorrow.getDate() === 1) {
    console.log("📅 Month end detected — generating reports...");
    await autoGenerateMonthlyReports();
  }
});

console.log("⏰ Monthly report cron job scheduled");

app.get('/', (req, res) => {
  res.send('Hello World! smart spider server is Here');
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});