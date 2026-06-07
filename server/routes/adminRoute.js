import express from "express";
import {
  adminLogin,
  logoutAdmin,
  sendEmailTo,
  getDashboardStats,
} from "../controllers/adminController.js";

import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

// PUBLIC
adminRouter.post("/login", adminLogin);

// PROTECTED
adminRouter.use(authAdmin);

adminRouter.post("/logout", logoutAdmin);
adminRouter.post("/send-email", sendEmailTo);
adminRouter.get("/dashboard", getDashboardStats);

export default adminRouter;