import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
} from "../controllers/salesController.js";
import authAdmin from "../middleware/authAdmin.js";

const saleRouter = express.Router();

saleRouter.use(authAdmin);

saleRouter.post("/add", createSale);
saleRouter.get("/all", getSales);
saleRouter.get("/:id", getSaleById);

export default saleRouter;