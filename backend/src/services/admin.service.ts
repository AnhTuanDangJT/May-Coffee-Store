import { User } from "../models/User";
import { Feedback } from "../models/Feedback";
import { EmailVerificationCode } from "../models/EmailVerificationCode";
import { AdminInvitation } from "../models/AdminInvitation";
import { AppError } from "../utils/appError";
import { emailService } from "./email.service";
import { auditService } from "./audit.service";
import { sanitizeText } from "../utils/sanitize";
import { buildFrontendUrl } from "../utils/urlBuilder";

export const adminService = {
  promoteUser: async (adminId: string, email: string) => {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // User doesn't exist - create invitation record and send email
      const existingInvitation = await AdminInvitation.findOne({ email: normalizedEmail });
      if (existingInvitation) {
        throw new AppError("Email này đã được mời trước đó", 400);
      }
      
      await AdminInvitation.create({
        email: normalizedEmail,
        invitedBy: adminId,
      });
      
      const registerUrl = buildFrontendUrl("/auth/register", "vi");
      await emailService.sendAdminInvitation(normalizedEmail, registerUrl);
      await auditService.log(adminId, "invite_admin", normalizedEmail);
      return { invited: true, email: normalizedEmail };
    }
    
    if (user.role === "admin") {
      throw new AppError("User đã là admin", 400);
    }
    
    user.role = "admin";
    await user.save();
    await auditService.log(adminId, "add_admin", user._id.toString());
    
    // Remove invitation if exists (user already registered)
    await AdminInvitation.deleteOne({ email: normalizedEmail });
    
    // Send notification email to the newly promoted admin
    await emailService.sendAdminPromotionNotification(user.email, user.name);
    
    return user;
  },

  revokeAdmin: async (adminId: string, userId: string) => {
    if (adminId === userId) {
      throw new AppError("Bạn không thể thu hồi quyền admin của chính mình", 400);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Không tìm thấy user", 404);
    }
    if (user.role !== "admin") {
      throw new AppError("User không phải admin", 400);
    }
    user.role = "user";
    await user.save();
    await auditService.log(adminId, "revoke_admin", userId);
    return user;
  },

  deleteUser: async (adminId: string, userId: string, reason: string) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Không tìm thấy user", 404);
    }
    if (user._id.toString() === adminId) {
      throw new AppError("Bạn không thể xóa chính mình", 400);
    }

    await Feedback.deleteMany({ user: user._id });
    await EmailVerificationCode.deleteMany({ user: user._id });
    await User.deleteOne({ _id: user._id });

    const sanitizedReason = sanitizeText(reason);

    if (sanitizedReason) {
      await emailService.sendAccountDeleted(user.email, user.name, sanitizedReason);
    }
    await auditService.log(adminId, "delete_user", userId, sanitizedReason || undefined);
    return user;
  },
};

