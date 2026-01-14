import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../utils/appError";

export const validateRequest = (schema: ZodTypeAny): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return next(new AppError(message, 400));
    }

    next();
  };
};

