import { checkAdminPassword } from "../utils/adminPassword.js";

const verifyAdminPassword = async (req, res, next) => {
  try {
    // Header first, body fallback (delete request-ku)
    const password = req.headers["x-admin-password"] || req.body?.adminPassword;

    if (!password) {
      return res.status(400).json({ success: false, message: "Admin password is required" });
    }

    const ok = await checkAdminPassword(password);
    if (!ok) {
      return res.status(403).json({ success: false, message: "Incorrect password" });
    }

    next();
  } catch (err) {
    console.error("verifyAdminPassword:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default verifyAdminPassword;