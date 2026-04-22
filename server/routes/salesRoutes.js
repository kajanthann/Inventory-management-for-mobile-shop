import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  updateSale,
} from "../controllers/salesController.js";

const saleRouter = express.Router();

saleRouter.post("/add", createSale);
saleRouter.get("/all", getSales);
saleRouter.get("/:id", getSaleById);
saleRouter.put("/:id", updateSale);

export default saleRouter;