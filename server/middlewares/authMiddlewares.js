const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async(req, res, next) => {
  try {
    const token = req.header("authorization").split(" ")[1];
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decoded.userId;
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.send({
      success: false,
      message: error,
    });
  }
};
