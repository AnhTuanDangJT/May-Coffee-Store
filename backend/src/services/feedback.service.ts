import dayjs from "dayjs";
import { Feedback } from "../models/Feedback";
import type { UserDocument } from "../models/User";
import { AppError } from "../utils/appError";
import { FEEDBACK_DAILY_LIMIT } from "../utils/constants";
import { emailService } from "./email.service";

type FeedbackInput = {
  rating: number;
  comment: string;
};

export const feedbackService = {
  create: async (user: UserDocument, input: FeedbackInput) => {
    const startOfDay = dayjs().startOf("day").toDate();
    const countToday = await Feedback.countDocuments({
      user: user._id,
      createdAt: { $gte: startOfDay },
    });

    if (countToday >= FEEDBACK_DAILY_LIMIT) {
      throw new AppError("Bạn đã gửi đủ 3 feedback hôm nay", 429);
    }

    const feedback = await Feedback.create({
      user: user._id,
      rating: input.rating,
      comment: input.comment,
      isApproved: false,
    });

    await emailService.sendFeedbackThankYou(user.email, user.name);

    return feedback;
  },

  listPublic: async () => {
    return Feedback.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .populate("user", "name");
  },

  listForAdmin: async (status?: "approved" | "pending") => {
    const filter: Record<string, unknown> = {};
    if (status === "approved") filter.isApproved = true;
    if (status === "pending") filter.isApproved = false;
    return Feedback.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email");
  },

  setApproval: async (id: string, approved: boolean) => {
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { isApproved: approved },
      { new: true },
    );
    if (!feedback) {
      throw new AppError("Feedback không tồn tại", 404);
    }
    return feedback;
  },

  ratingsSummary: async () => {
    const approved = await Feedback.find({ isApproved: true });
    if (approved.length === 0) {
      return { averageRating: 0, countApproved: 0 };
    }
    const total = approved.reduce((sum, item) => sum + item.rating, 0);
    return {
      averageRating: Number((total / approved.length).toFixed(2)),
      countApproved: approved.length,
    };
  },

  userHistory: async (userId: string) => {
    return Feedback.find({ user: userId }).sort({ createdAt: -1 });
  },

  delete: async (id: string, adminId: string) => {
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      throw new AppError("Feedback không tồn tại", 404);
    }
    return { message: "Đã xóa feedback thành công" };
  },
};

