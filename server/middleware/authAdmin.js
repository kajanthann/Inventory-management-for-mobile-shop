import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.aToken || req.headers.atoken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default authAdmin;