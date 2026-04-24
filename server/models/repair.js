import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    collectionNo: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    tel1: { type: String, required: true },
    tel2: { type: String },

    brand: { type: String },
    model: { type: String },
    imei: { type: String },

    purchaseDate: { type: String },
    warranty: {
      type: String,
      enum: ["warranty", "non-warranty"],
      default: "non-warranty",
    },

    faultDescription: { type: String },

    handover: {
      charger: { type: Boolean, default: false },
      cable: { type: Boolean, default: false },
      backCover: { type: Boolean, default: false },
      warrantyCard: { type: Boolean, default: false },
      other: { type: String, default: "" },
    },

    date: { type: String }, // received date

    status: {
      type: String,
      enum: ["pending", "done","returned"],
      default: "pending",
    },

    price: { type: Number, default: null },
  },
  { timestamps: true }
);


const repairModel = mongoose.models.Repair || mongoose.model("Repair", repairSchema);

export default repairModel;