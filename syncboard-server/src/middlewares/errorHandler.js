const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  // Mongoose Duplicate Key Error (E11000) -> 409 Conflict
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
    const value = err.keyValue ? err.keyValue[field] : "";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    errors = [
      {
        field,
        message: `${field} '${value}' is already taken.`,
      },
    ];
  }
  // Mongoose Validation Error -> 400 Bad Request
  else if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors || {}).map((val) => ({
      field: val.path || "",
      message: val.message,
    }));
    message = errors[0]?.message || "Validation Error";
  }
  // Mongoose CastError (invalid ObjectId) -> 404 Not Found
  else if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found with id of ${err.value}`;
    errors = [
      {
        field: err.path || "id",
        message: `Invalid ${err.path || "id"}: '${err.value}'`,
      },
    ];
  }
  // Zod Validation Error
  else if (err.name === "ZodError") {
    statusCode = 400;
    const issues = err.issues || err.errors || [];
    message = issues[0]?.message || "Validation Error";
    errors = issues.map((e) => ({
      field: Array.isArray(e.path) ? e.path.join(".") : String(e.path || ""),
      message: e.message,
    }));
  }
  // JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(errors.length > 0 && { errors }),
  });
};

export default errorHandler;