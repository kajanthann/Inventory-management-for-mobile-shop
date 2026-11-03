import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";

export const getAdminEmail = () => process.env.ADMIN_EMAIL?.trim().toLowerCase();

// true -> password correct
export const checkAdminPassword = async (plain) => {
  if (!plain) return false;

  const admin = await Admin.findOne({ email: getAdminEmail() });

  // Admin innum password set pannala -> login password (.env) use aagum
  if (!admin?.password) {
    return plain === process.env.ADMIN_PASSWORD;
  }

  return bcrypt.compare(plain, admin.password);
};