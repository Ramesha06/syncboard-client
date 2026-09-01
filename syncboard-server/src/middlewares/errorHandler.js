const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  if (err.name === "ZodError") {
    statusCode = 400;
    const issues = err.issues || err.errors || [];
    message = issues[0]?.message || "Validation Error";
    errors = issues.map((e) => ({
      field: Array.isArray(e.path) ? e.path.join(".") : String(e.path || ""),
      message: e.message,
    }));
  } else if (err.name === "JsonWebTokenError") {
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