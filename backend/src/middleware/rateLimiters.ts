import rateLimit from "express-rate-limit";

const baseOptions = {
  windowMs: 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
};

export const authRateLimiter = rateLimit({
  ...baseOptions,
  limit: 6,
  message: "Bạn thao tác quá nhanh, hãy thử lại sau một phút.",
});

export const feedbackRateLimiter = rateLimit({
  ...baseOptions,
  limit: 10,
  message: "Bạn đang gửi feedback quá nhanh, hãy thử lại sau.",
});
















