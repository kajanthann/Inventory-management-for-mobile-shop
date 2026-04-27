import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    name: {
      type: String,
      required: true,
    },

    imei: {
      type: String,
      default: "",
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false } // cleaner array
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    date: {
      type: String, // "2026-04-24"
      required: true,
    },

    time: {
      type: String, // "10:15:32"
      required: true,
    },

    items: {
      type: [itemSchema],
      validate: [(val) => val.length > 0, "Cart cannot be empty"],
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "Online"],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },

    change: {
      type: Number,
      default: 0,
      min: 0,
    },

    customer: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      cashier: { type: String, default: "" },
    },

    status: {
      type: String,
      enum: ["completed", "pending", "cancelled", "returned"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

const saleModel =
  mongoose.models.Sale || mongoose.model("Sale", saleSchema);

export default saleModel;