import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },

    // OTP fields (temporary)
    otp: { type: String },
    otpExpiresAt: { type: Date },
    otpAttempts: { type: Number, default: 0 },

    loginHistory: [
      {
        time: { type: Date, default: Date.now },
        ipAddress: String,
        deviceInfo: String,
      },
    ],
  },
  { timestamps: true }
);

const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;