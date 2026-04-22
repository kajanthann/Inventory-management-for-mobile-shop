import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", addProduct);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);
productRouter.get("/all", getProducts);
productRouter.get("/:id", getProductById);

export default productRouter;