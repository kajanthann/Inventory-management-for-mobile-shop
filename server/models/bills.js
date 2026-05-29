import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  billNo:       { type: String, unique: true, required: true },
  type:         { type: String, enum: ["sale", "repair"], required: true },
  refId:        { type: String }, // invoiceNo or collectionNo
  customer: {
    name:  { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  items: [
    {
      name:      String,
      qty:       Number,
      unitPrice: Number,
      discount:  Number,
      subtotal:  Number,
    },
  ],
  subtotal:       { type: Number, default: 0 },
  discount:       { type: Number, default: 0 },
  tax:            { type: Number, default: 0 },
  grandTotal:     { type: Number, required: true },
  paymentMethod:  { type: String },
  amountPaid:     { type: Number },
  change:         { type: Number },
  pdfPath:        { type: String },
  emailSent:      { type: Boolean, default: false },
  smsSent:        { type: Boolean, default: false },
  whatsappSent:   { type: Boolean, default: false },
  status:         { type: String, enum: ["paid", "pending"], default: "paid" },
}, { timestamps: true });

// ✅ FIXED (important)
const billModel =
  mongoose.models.bill || mongoose.model("bill", billSchema);

export default billModel;