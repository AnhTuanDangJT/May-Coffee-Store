import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { feedbackService } from "../services/feedback.service";
import { adminService } from "../services/admin.service";
import { serializeUser } from "../utils/serialization";
import { User } from "../models/User";

export const listAdminFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const status = req.query.status as "approved" | "pending" | undefined;
    const data = await feedbackService.listForAdmin(status);
    res.json({ data });
  },
);

export const updateFeedbackApproval = catchAsync(
  async (req: Request, res: Response) => {
    const { approved } = req.body as { approved: boolean };
    const { id } = req.params as { id: string };
    const feedback = await feedbackService.setApproval(
      id,
      approved,
      req.user!._id.toString(),
    );
    res.json({ data: feedback });
  },
);

export const ratingsSummary = catchAsync(
  async (_req: Request, res: Response) => {
    const summary = await feedbackService.ratingsSummary();
    res.json({ data: summary });
  },
);

export const userFeedbackHistory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const history = await feedbackService.userHistory(id);
    res.json({ data: history });
  },
);

export const addAdmin = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const result = await adminService.promoteUser(req.user!._id.toString(), email);
  
  if ("invited" in result && result.invited) {
    return res.json({
      message: `Đã gửi lời mời admin đến ${result.email}. User sẽ được cấp quyền admin sau khi đăng ký và xác nhận email.`,
      invited: true,
      email: result.email,
    });
  }
  
  res.json({
    message: "Đã nâng quyền user thành admin",
    data: serializeUser(result as any),
  });
});

export const revokeAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const user = await adminService.revokeAdmin(req.user!._id.toString(), id);
  res.json({
    message: "Đã thu hồi quyền admin",
    data: serializeUser(user),
  });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { reason } = req.body as { reason: string };
  await adminService.deleteUser(req.user!._id.toString(), id, reason);
  res.json({
    message: "Đã xóa user và feedback liên quan",
  });
});

export const deleteFeedback = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await feedbackService.delete(
      id,
      req.user!._id.toString(),
    );
    res.json(result);
  },
);

export const listUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await User.find({}, "name email role isEmailVerified createdAt").sort({
    createdAt: -1,
  });
  res.json({
    data: users.map(serializeUser),
  });
});

