import express from "express";
import {
  addPreOrder,
  getPreOrders,
  getPreOrderById,
  markDelivered,
  markFullPayment,
  deletePreOrder,
} from "../controllers/preOrderController.js";
import verifyAdminPassword from "../middleware/verifyAdminPassword.js";
import authAdmin from "../middleware/authAdmin.js";

const preOrderRouter = express.Router();

preOrderRouter.use(authAdmin);

preOrderRouter.post  ("/add", addPreOrder);
preOrderRouter.get   ("/all", getPreOrders);
preOrderRouter.get   ("/:id", getPreOrderById);
preOrderRouter.patch ("/:id/deliver", markDelivered);
preOrderRouter.patch ("/:id/fullpayment", markFullPayment);
preOrderRouter.delete("/:id", verifyAdminPassword , deletePreOrder);

export default preOrderRouter;