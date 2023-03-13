const ErrorResponse = require("../utils/errorResponse.js");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.code === 11000) {
    const message = "Email already exist";
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "validationError") {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    status: "failed",
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
