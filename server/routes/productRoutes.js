import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", addProduct);
productRouter.get("/all", getProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;