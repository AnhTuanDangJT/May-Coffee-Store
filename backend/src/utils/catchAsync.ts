import type { RequestHandler } from "express";

export const catchAsync =
  (handler: RequestHandler): RequestHandler =>
  async (req, res, next) => {
    try {
      await Promise.resolve(handler(req, res, next));
    } catch (error) {
      next(error);
    }
  };

