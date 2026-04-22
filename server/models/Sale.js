import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

  name: { type: String, required: true },
  imei: String,

  qty: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },

  subtotal: { type: Number, required: true },
});

const saleSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },

    items: { type: [itemSchema], required: true },

    paymentMethod: { type: String, required: true },

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },

    grandTotal: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    change: { type: Number, required: true },

    customer: {
      name: String,
      phone: String,
      cashier: String,
    },

    status: { type: String, default: "completed" },
  },
  { timestamps: true }
);

const saleModel = mongoose.models.Sale || mongoose.model("Sale", saleSchema);

export default saleModel;