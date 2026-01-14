import dayjs from "dayjs";
import { User, type UserDocument } from "../models/User";
import { EmailVerificationCode } from "../models/EmailVerificationCode";
import { AdminInvitation } from "../models/AdminInvitation";
import { AppError } from "../utils/appError";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateNumericCode } from "../utils/code";
import { emailService } from "./email.service";
import { BOOTSTRAP_ADMIN_EMAIL, EMAIL_CODE_EXPIRY_MINUTES } from "../utils/constants";
import env from "../config/env";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type RegisterResult = {
  user: UserDocument;
  verificationCode?: string;
};

export const authService = {
  register: async ({ name, email, password }: RegisterInput): Promise<RegisterResult> => {
    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new AppError("Email đã tồn tại", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      isEmailVerified: false,
    });

    const code = generateNumericCode();
    await EmailVerificationCode.deleteMany({ user: user._id });
    await EmailVerificationCode.create({
      user: user._id,
      code,
      expiresAt: dayjs().add(EMAIL_CODE_EXPIRY_MINUTES, "minute").toDate(),
    });

    // Default to "vi" locale for email verification links
    // In the future, this could be determined from user preferences or request headers
    await emailService.sendVerificationEmail(user.email, user.name, code, "vi");

    const shouldExposeDevCode = !env.sendGridApiKey && env.nodeEnv !== "production";

    return {
      user,
      ...(shouldExposeDevCode && { verificationCode: code }),
    };
  },

  verifyEmail: async (email: string, code: string) => {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new AppError("Người dùng không tồn tại", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email đã được xác nhận trước đó", 400);
    }

    const record = await EmailVerificationCode.findOne({
      user: user._id,
      code,
    }).sort({ createdAt: -1 });

    if (!record || record.expiresAt < new Date()) {
      throw new AppError("Mã không hợp lệ hoặc đã hết hạn", 400);
    }

    user.isEmailVerified = true;
    if (user.email === BOOTSTRAP_ADMIN_EMAIL) {
      user.role = "admin";
    } else {
      // Check if user was invited as admin
      const invitation = await AdminInvitation.findOne({ email: user.email });
      if (invitation) {
        user.role = "admin";
        // Remove invitation after granting admin role
        await AdminInvitation.deleteOne({ email: user.email });
      }
    }
    await user.save();
    await EmailVerificationCode.deleteMany({ user: user._id });

    return user;
  },

  login: async (email: string, password: string): Promise<UserDocument> => {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new AppError("Thông tin đăng nhập sai", 401);
    }

    if (!user.isEmailVerified) {
      throw new AppError("Vui lòng xác nhận email trước khi đăng nhập", 403);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Thông tin đăng nhập sai", 401);
    }

    return user;
  },

  resendVerificationCode: async (email: string, locale?: string | null) => {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new AppError("Người dùng không tồn tại", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email đã được xác nhận trước đó", 400);
    }

    const code = generateNumericCode();
    await EmailVerificationCode.deleteMany({ user: user._id });
    await EmailVerificationCode.create({
      user: user._id,
      code,
      expiresAt: dayjs().add(EMAIL_CODE_EXPIRY_MINUTES, "minute").toDate(),
    });

    await emailService.sendVerificationEmail(user.email, user.name, code, locale || "vi");

    const shouldExposeDevCode = !env.sendGridApiKey && env.nodeEnv !== "production";

    return {
      message: "Mã xác nhận mới đã được gửi",
      verificationCode: shouldExposeDevCode ? code : undefined,
    };
  },
};

