import express from "express";
import {
  adminLogin,
  logoutAdmin,
  sendEmailTo,
  getDashboardStats,
  checkDeletePassword,
  requestChangeDeletePasswordOtp,
  changeDeletePassword,
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

// ── Delete password management ────────────────────────────────────
adminRouter.post("/delete-password/verify",          checkDeletePassword);    // check current pw
adminRouter.post("/delete-password/request-otp",     requestChangeDeletePasswordOtp); // send OTP
adminRouter.post("/delete-password/change",          changeDeletePassword);    // verify OTP + save new pw

export default adminRouter;