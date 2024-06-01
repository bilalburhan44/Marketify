const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("authorization").split(" ")[1];
    const decoded = jwt.verify(token, process.env.jwt_secret);

    if (decoded.authMethod === 'google') {
      // Handle Google authenticated user
      req.body.userId = decoded.userId;
      req.user = await User.findOne({ googleId: decoded.userId });
    } else {
      // Handle email/password authenticated user
      req.body.userId = decoded.userId;
      req.user = await User.findById(decoded.userId);
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};