import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },

    // ── Delete password (hashed) ──────────────────────────────
    deletePassword: { type: String, default: null },

    // ── OTP fields (login + change password) ─────────────────
    otp:          { type: String  },
    otpExpiresAt: { type: Date    },
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

// ── Hash deletePassword before save ──────────────────────────────

adminSchema.pre("save", async function () {
  if (this.isModified("deletePassword") && this.deletePassword) {
    this.deletePassword = await bcrypt.hash(this.deletePassword, 10);
  }
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;