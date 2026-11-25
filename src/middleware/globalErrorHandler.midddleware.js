import CustomError from "../shared/utils/CustomError.js";

/**
 * Handle Mongoose CastError (e.g., invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new CustomError(message, 400);
};

/**
 * Handle Mongoose Duplicate Key Error (E11000)
 */
const handleDuplicateFieldsDB = (err) => {
  const fields = err.keyValue ? Object.keys(err.keyValue).join(", ") : "field";
  const value = err.keyValue ? Object.values(err.keyValue).join(", ") : "";
  const message = `Duplicate value for ${fields}: '${value}'. Please use another value.`;
  return new CustomError(message, 409);
};

/**
 * Handle Mongoose Schema ValidationError
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors || {}).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  const message = `Invalid input data: ${errors.map((e) => e.message).join(". ")}`;
  return new CustomError(message, 400, errors);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => {
  return new CustomError("Invalid token. Please log in again.", 401);
};

const handleJWTExpiredError = () => {
  return new CustomError("Your token has expired. Please log in again.", 401);
};

/**
 * Handle Malformed JSON in request body
 */
const handleSyntaxError = () => {
  return new CustomError("Malformed JSON payload in request body.", 400);
};

/**
 * Development Error Response:
 * Detailed error including message, errors array, raw error object, and stack trace.
 */
const sendErrorDev = (err, req, res) => {
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    status:
      err.status || (statusCode >= 400 && statusCode < 500 ? "fail" : "error"),
    statusCode,
    message: err.message || "Internal server error",
    errors:
      Array.isArray(err.errors) && err.errors.length > 0
        ? err.errors
        : undefined,
    data: null,
    stack: err.stack,
    error: err,
  });
};

/**
 * Production Error Response:
 * Leaks no sensitive details or stack traces for unknown 500 errors.
 * Sends clean message for operational / client errors.
 */
const sendErrorProd = (err, req, res) => {
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;

  // Operational, trusted error: send message to client
  if (err.isOperational || (statusCode >= 400 && statusCode < 500)) {
    return res.status(statusCode).json({
      success: false,
      status: err.status || "fail",
      statusCode,
      message: err.message,
      errors:
        Array.isArray(err.errors) && err.errors.length > 0
          ? err.errors
          : undefined,
      data: null,
    });
  }

  // Programming or unknown error: log it to console/monitoring and send generic response
  console.error("UNHANDLED ERROR 💥:", err);

  return res.status(500).json({
    success: false,
    status: "error",
    statusCode: 500,
    message: "Something went wrong. Please try again later.",
    data: null,
  });
};

/**
 * Express Global Error Handling Middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Delegate to default Express handler if response headers are already sent
  if (res.headersSent) {
    return next(err);
  }

  const env = (
    process.env.ENVIRONMENT ||
    process.env.NODE_ENV ||
    "development"
  ).toLowerCase();

  let error = err;
  // Ensure basic properties
  error.statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  error.status =
    err.status ||
    (error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error");

  // Transform known library/database errors into clean operational CustomError instances
  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    error = handleSyntaxError();
  }

  if (env === "production" || env === "prod") {
    sendErrorProd(error, req, res);
  } else {
    sendErrorDev(error, req, res);
  }
};

export default globalErrorHandler;
