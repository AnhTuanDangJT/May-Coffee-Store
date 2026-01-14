import { Router } from "express";
import { z } from "zod";
import {
  login,
  logout,
  me,
  register,
  resendCode,
  verifyEmail,
} from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validateRequest";
import { requireAuth } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiters";

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const verifySchema = z.object({
  body: z.object({
    email: z.string().email(),
    code: z.string().length(6),
  }),
});

const resendCodeSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

router.post("/register", authRateLimiter, validateRequest(registerSchema), register);
router.post("/verify-email", authRateLimiter, validateRequest(verifySchema), verifyEmail);
router.post("/resend-code", authRateLimiter, validateRequest(resendCodeSchema), resendCode);
router.post("/login", authRateLimiter, validateRequest(loginSchema), login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);

export default router;

