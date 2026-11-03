import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },

    // ── Edit/Delete password (bcrypt hashed). Set via Change Password + OTP ──
    password: { type: String, default: null },

    // ── OTP fields ───────────────────────────────────────────
    otp:          { type: String },
    otpExpiresAt: { type: Date },
    otpAttempts:  { type: Number, default: 0 },
    otpPurpose:   { type: String, enum: ["login", "changeDeletePassword"], default: "login" },

    loginHistory: [
      {
        time:       { type: Date, default: Date.now },
        ipAddress:  String,
        deviceInfo: String,
      },
    ],
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;