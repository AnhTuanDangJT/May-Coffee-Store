import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { signAccessToken } from "../utils/jwt";
import env from "../config/env";
import { COOKIE_BASE_OPTIONS } from "../utils/constants";
import { serializeUser } from "../utils/serialization";
import { AppError } from "../utils/appError";

const setSessionCookie = (res: Response, token: string) => {
  res.cookie(env.cookieName, token, {
    ...COOKIE_BASE_OPTIONS,
    maxAge: 1000 * 60 * 60 * 12,
  });
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    message: "Đăng ký thành công. Hãy kiểm tra email để xác nhận.",
    data: serializeUser(result.user),
    ...(result.verificationCode && { verificationCode: result.verificationCode }),
  });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const user = await authService.verifyEmail(email, code);
  const token = signAccessToken({ sub: user._id.toString(), role: user.role });
  setSessionCookie(res, token);
  res.json({
    message: "Xác nhận email thành công",
    data: serializeUser(user),
  });
});

export const resendCode = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const locale = (req.headers["accept-language"] || "").includes("en") ? "en" : "vi";
  const result = await authService.resendVerificationCode(email, locale);
  res.json({
    message: result.message,
    ...(result.verificationCode && { verificationCode: result.verificationCode }),
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const token = signAccessToken({ sub: user._id.toString(), role: user.role });
  setSessionCookie(res, token);
  res.json({
    message: "Đăng nhập thành công",
    data: serializeUser(user),
  });
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie(env.cookieName, COOKIE_BASE_OPTIONS);
  res.json({ message: "Đã đăng xuất" });
});

export const me = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  res.json({ data: serializeUser(req.user) });
});

