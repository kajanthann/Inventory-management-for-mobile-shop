import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
} from "../controllers/salesController.js";

const saleRouter = express.Router();

saleRouter.post("/add", createSale);
saleRouter.get("/all", getSales);
saleRouter.get("/:id", getSaleById);

export default saleRouter;