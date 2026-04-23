import express from "express";
import {
  adminLogin,
  verifyAdminOtp,
  logoutAdmin,
  sendEmailTo,
} from "../controllers/adminController.js";

import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

// PUBLIC
adminRouter.post("/login", adminLogin);
adminRouter.post("/verify-otp", verifyAdminOtp);

// PROTECTED
adminRouter.use(authAdmin);

adminRouter.post("/logout", logoutAdmin);
adminRouter.post("/send-email", sendEmailTo);

export default adminRouter;