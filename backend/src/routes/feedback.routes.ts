import { Router } from "express";
import { z } from "zod";
import {
  createFeedback,
  listPublicFeedback,
  publicRatingSummary,
} from "../controllers/feedback.controller";
import { validateRequest } from "../middleware/validateRequest";
import { requireAuth } from "../middleware/auth";
import { feedbackRateLimiter } from "../middleware/rateLimiters";

const router = Router();

const feedbackSchema = z.object({
  body: z.object({
    rating: z.coerce
      .number("Rating phải là số")
      .int("Rating phải là số nguyên")
      .min(1, "Rating là bắt buộc và tối thiểu là 1 sao")
      .max(5, "Rating tối đa là 5 sao"),
    comment: z
      .string("Comment phải là chuỗi văn bản")
      .min(10, "Comment là bắt buộc và phải có ít nhất 10 ký tự")
      .max(500, "Comment không được vượt quá 500 ký tự")
      .trim(),
  }),
});

router.get("/public", listPublicFeedback);
router.get("/summary", publicRatingSummary);
router.post(
  "/",
  requireAuth,
  feedbackRateLimiter,
  validateRequest(feedbackSchema),
  createFeedback,
);

export default router;

