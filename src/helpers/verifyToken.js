const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return next(new ErrorResponse("Not authorized to access this route", 401));

  try {
    const findUser = jwt.verify(token, "mysecretkey", async (err, decoded) => {
      if (err) return next(new ErrorResponse("Expired token.", 401));

      const user = await User.findByPk(decoded.id);

      if (!user) return next(new ErrorResponse("User not found.", 401));

      return (req.user = user);
    });

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this router", 401));
  }
};
