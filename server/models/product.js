import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imei: { type: String, required: true, unique: true },
  qty: { type: Number, default: 0 },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
}, { timestamps: true });

const productModel = mongoose.model.product || mongoose.model("product", productSchema);
export default productModel;