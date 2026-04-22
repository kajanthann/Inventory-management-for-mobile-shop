import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    device: { type: String, required: true },
    imei: { type: String, required: true },
    phone: { type: String, required: true },
    fault: { type: String, required: true },
    status: { type: String, enum: ["pending", "done"], default: "pending" },
    price: { type: Number},
  },
  { timestamps: true }
);

const repairModel = 
  mongoose.models.Repair || mongoose.model("Repair", repairSchema);

export default repairModel;