import jwt from "jsonwebtoken";
import sendEmail from "../middleware/sendEmail.js";
import Admin from "../models/Admin.js";

// ======================
// STEP 1: SEND OTP
// ======================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email & password required",
      });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let admin = await Admin.findOne({ email });

    if (!admin) {
      admin = await Admin.create({ email });
    }

    admin.otp = otp;
    admin.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 MINUTE
    admin.otpAttempts = 0;

    await admin.save();

    await sendEmail(
      email,
      "Admin OTP Login",
      `Your OTP is ${otp}. It expires in 1 minute.`
    );

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// STEP 2: VERIFY OTP
// ======================
export const verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!admin.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP requested",
      });
    }

    if (admin.otpExpiresAt < new Date()) {
      admin.otp = null;
      admin.otpExpiresAt = null;
      await admin.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (admin.otpAttempts >= 5) {
      admin.otp = null;
      admin.otpExpiresAt = null;
      await admin.save();

      return res.status(429).json({
        success: false,
        message: "Too many attempts",
      });
    }

    if (otp !== admin.otp) {
      admin.otpAttempts += 1;
      await admin.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // SUCCESS
    admin.otp = null;
    admin.otpExpiresAt = null;
    admin.otpAttempts = 0;

    admin.loginHistory.push({
      time: new Date(),
      ipAddress: ip,
      deviceInfo: userAgent,
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("aToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// LOGOUT
// ======================
export const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("aToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// SEND EMAIL
// ======================
export const sendEmailTo = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    await sendEmail(to, subject, text);

    return res.json({
      success: true,
      message: "Email sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};