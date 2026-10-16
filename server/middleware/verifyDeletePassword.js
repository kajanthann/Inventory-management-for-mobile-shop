const verifyDeletePassword = (req, res, next) => {
  const { deletePassword } = req.body;

  if (!deletePassword) {
    return res.status(400).json({
      success: false,
      message: "Delete password is required",
    });
  }

  if (deletePassword !== process.env.ADMIN_DELETE_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password",
    });
  }

  next();
};

export default verifyDeletePassword;