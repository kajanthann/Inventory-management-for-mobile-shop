import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";

const verifyDeletePassword = async (req, res, next) => {
  try {
    // Header first (proxy-safe), body fallback
    const deletePassword =
      req.headers["x-delete-password"] || req.body?.deletePassword;

    if (!deletePassword) {
      return res.status(400).json({ success: false, message: "Delete password is required" });
    }

    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL?.trim().toLowerCase() });

    // DB hash set aagala na .env fallback
    if (!admin?.deletePassword) {
      if (deletePassword !== process.env.ADMIN_DELETE_PASSWORD) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }
      return next();
    }

    const match = await bcrypt.compare(deletePassword, admin.deletePassword);
    if (!match) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }
    next();
  } catch (err) {
    console.error("verifyDeletePassword:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default verifyDeletePassword;