const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  console.log('Error handling middleware executed:', err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Cast Error || Wrong mpongodb Id error in parameter passing (CRUD)
  if (err.name === "CastError") {
    const message = `resource not found. Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong Json web token error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  // JwT expire error
  if (err.name === "JsonWebTokenExpiredError") {
    const message = `Json Web token is invalid now, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
