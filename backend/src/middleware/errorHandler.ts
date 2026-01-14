import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/appError";
import { logger } from "../config/logger";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const appError =
    err instanceof AppError ? err : new AppError("Internal server error", 500, false);

  if (!appError.isOperational) {
    logger.error(err.message, err);
  }

  // Map status codes to error codes
  const getErrorCode = (statusCode: number): string => {
    if (statusCode === 401) return "UNAUTHORIZED";
    if (statusCode === 403) return "FORBIDDEN";
    if (statusCode === 404) return "NOT_FOUND";
    if (statusCode === 400) return "BAD_REQUEST";
    if (statusCode === 409) return "CONFLICT";
    if (statusCode === 429) return "RATE_LIMIT_EXCEEDED";
    if (statusCode >= 500) return "INTERNAL_ERROR";
    return "ERROR";
  };

  res.status(appError.statusCode).json({
    code: getErrorCode(appError.statusCode),
    message: appError.message,
  });
};

