import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    product:   { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name:      { type: String, required: true },
    imei:      { type: String, default: "" },
    qty:       { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    discount:  { type: Number, default: 0, min: 0 },
    subtotal:  { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

// ── Additional charge item ───────────────────────────────────────
const extraItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true, trim: true },

    date: { type: String, required: true },
    time: { type: String, required: true },

    
    items: {
      type: [itemSchema],
      default: [],
      validate: {
        validator: function (val) {
          return val.length > 0 || (this.extraItems && this.extraItems.length > 0);
        },
        message: "Add at least one product or additional item",
      },
    },

    
    extraItems: { type: [extraItemSchema], default: [] },
    extraTotal: { type: Number, default: 0, min: 0 },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "Online"],
      required: true,
    },

    subtotal:   { type: Number, default: 0, min: 0 },
    discount:   { type: Number, default: 0, min: 0 },
    tax:        { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, required: true, min: 0 },
    change:     { type: Number, default: 0, min: 0 },

    customer: {
      name:    { type: String, default: "" },
      phone:   { type: String, default: "" },
      cashier: { type: String, default: "" },
    },

    status: {
      type: String,
      enum: ["completed", "pending", "cancelled", "returned"],
      default: "completed",
    },
  },
  { timestamps: true }
);

const saleModel = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
export default saleModel;