import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    imei: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    qty: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    cost: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ FIXED (important)
const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;