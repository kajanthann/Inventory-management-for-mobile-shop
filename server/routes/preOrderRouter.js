import express from "express";
import {
  addPreOrder,
  getPreOrders,
  getPreOrderById,
  markDelivered,
  markFullPayment,
  deletePreOrder,
} from "../controllers/preOrderController.js";
import verifyDeletePassword from "../middleware/verifyDeletePassword.js";
import authMiddleware from "../middleware/authAdmin.js";

const preOrderRouter = express.Router();

preOrderRouter.post  ("/add",              authMiddleware, addPreOrder);
preOrderRouter.get   ("/all",              authMiddleware, getPreOrders);
preOrderRouter.get   ("/:id",             authMiddleware, getPreOrderById);
preOrderRouter.patch ("/:id/deliver",     authMiddleware, markDelivered);
preOrderRouter.patch ("/:id/fullpayment", authMiddleware, markFullPayment);
preOrderRouter.delete("/:id",             authMiddleware, verifyDeletePassword, deletePreOrder);

export default preOrderRouter;