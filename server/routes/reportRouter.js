import express from "express";
import {
  getAllReports,
  getReportById,
  manualGenerateReport,
  sendReportEmailManual,
  deleteReport,
} from "../controllers/reportController.js";
import authAdmin from "../middleware/authAdmin.js";
import verifyDeletePassword from "../middleware/verifyDeletePassword.js";

const reportRouter = express.Router();

reportRouter.use(authAdmin);

reportRouter.get   ("/all",           getAllReports);
reportRouter.get   ("/:id",          getReportById);
reportRouter.post  ("/generate",     manualGenerateReport);
reportRouter.post  ("/:id/send-email", sendReportEmailManual);
reportRouter.delete("/:id",          verifyDeletePassword, deleteReport);

export default reportRouter;