import mongoose from "mongoose";

const preOrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone:        { type: String, required: true, trim: true },
    productName:  { type: String, required: true, trim: true },
    model:        { type: String, default: "", trim: true },
    date:         { type: Date,   required: true },
    price:          { type: Number, required: true, min: 0 },
    advancePayment: { type: Number, required: true, min: 0 },
    balancePayment: { type: Number, required: true, min: 0 },
    notes:  { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["pending", "delivered", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const preOrderModel =
  mongoose.models.PreOrder || mongoose.model("PreOrder", preOrderSchema);

export default preOrderModel;