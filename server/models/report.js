import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    type:       { type: String, enum: ["sales", "repair"], required: true },
    month:      { type: Number, required: true }, // 1-12
    year:       { type: Number, required: true },
    monthLabel: { type: String },                 // "January 2026"

    // ── Sales report fields ───────────────────────────────────
    totalSales:       { type: Number, default: 0 },
    totalRevenue:     { type: Number, default: 0 },
    totalDiscount:    { type: Number, default: 0 },
    totalExtraIncome: { type: Number, default: 0 },
    totalProfit:      { type: Number, default: 0 },
    totalAmountPaid:  { type: Number, default: 0 },
    totalChange:      { type: Number, default: 0 },

    paymentBreakdown: {
      Cash:          { type: Number, default: 0 },
      Card:          { type: Number, default: 0 },
      "Bank Transfer": { type: Number, default: 0 },
      Online:        { type: Number, default: 0 },
    },

    topProducts: [
      {
        name:     String,
        qty:      Number,
        revenue:  Number,
      },
    ],

    dailySales: [
      {
        date:    String,
        sales:   Number,
        revenue: Number,
      },
    ],

    // ── Repair report fields ──────────────────────────────────
    totalRepairs:    { type: Number, default: 0 },
    totalDone:       { type: Number, default: 0 },
    totalPending:    { type: Number, default: 0 },
    totalReturned:   { type: Number, default: 0 },
    totalRepairIncome: { type: Number, default: 0 },

    warrantyBreakdown: {
      warranty:    { type: Number, default: 0 },
      nonWarranty: { type: Number, default: 0 },
    },

    brandBreakdown: [
      {
        brand: String,
        count: Number,
      },
    ],

    // ── Meta ─────────────────────────────────────────────────
    generatedAt: { type: Date, default: Date.now },
    emailSent:   { type: Boolean, default: false },
    emailSentAt: { type: Date,    default: null  },
  },
  { timestamps: true }
);

// Unique per type+month+year
reportSchema.index({ type: 1, month: 1, year: 1 }, { unique: true });

const reportModel = mongoose.models.Report || mongoose.model("Report", reportSchema);
export default reportModel;