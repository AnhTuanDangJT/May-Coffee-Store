import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { feedbackService } from "../services/feedback.service";

export const createFeedback = catchAsync(async (req: Request, res: Response) => {
  const feedback = await feedbackService.create(req.user!, req.body);
  res.status(201).json({
    message: "Cảm ơn vì feedback, admin sẽ duyệt sớm!",
    data: feedback,
  });
});

export const listPublicFeedback = catchAsync(
  async (_req: Request, res: Response) => {
    const feedback = await feedbackService.listPublic();
    res.json({ data: feedback });
  },
);

export const publicRatingSummary = catchAsync(
  async (_req: Request, res: Response) => {
    const summary = await feedbackService.ratingsSummary();
    res.json({ data: summary });
  },
);

