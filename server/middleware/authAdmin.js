import jwt from "jsonwebtoken";

// admin auth middleware
const authAdmin = async (req, res, next) => {
    try {
        const {atoken} = req.headers;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }
        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
        if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export default authAdmin