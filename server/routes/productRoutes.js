import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";
import verifyDeletePassword from "../middleware/verifyDeletePassword.js";
import authAdmin from "../middleware/authAdmin.js";


const productRouter = express.Router();

productRouter.use(authAdmin);

productRouter.post("/add", addProduct);
productRouter.get("/all", getProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", verifyDeletePassword, deleteProduct);

export default productRouter;