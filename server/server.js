import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongooDB.js';
import productRouter from './routes/productRoutes.js';
import saleRouter from './routes/salesRoutes.js';
import repairRouter from './routes/repairRoutes.js';
import adminRouter from './routes/adminRoute.js';
import cookieParser from "cookie-parser";


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use(cookieParser());
app.use('/api/products', productRouter);
app.use('/api/sales', saleRouter);
app.use('/api/repairs', repairRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('Hello World! smart spider server is Here');
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});