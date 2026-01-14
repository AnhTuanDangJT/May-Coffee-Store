import type { RequestHandler } from "express";
import env from "../config/env";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/appError";
import { User } from "../models/User";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    // Comprehensive logging for debugging
    const shouldLog = env.nodeEnv === "development";
    
    if (shouldLog) {
      console.log(`[Auth Middleware] ${req.method} ${req.url}`);
      console.log(`[Auth Middleware] Origin:`, req.headers.origin || "(none)");
      console.log(`[Auth Middleware] Referer:`, req.headers.referer || "(none)");
      console.log(`[Auth Middleware] Cookie header:`, req.headers.cookie || "(none)");
    }

    // Check if cookies are available
    if (!req.cookies) {
      if (shouldLog) {
        console.log(`[Auth Middleware] ERROR: req.cookies is undefined`);
        console.log(`[Auth Middleware] Cookie header exists:`, !!req.headers.cookie);
      }
      return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
    }

    // Log all available cookies
    if (shouldLog) {
      const cookieNames = Object.keys(req.cookies);
      console.log(`[Auth Middleware] Available cookies:`, cookieNames);
      console.log(`[Auth Middleware] Looking for cookie:`, env.cookieName);
    }

    // Get token from cookie
    const token = req.cookies[env.cookieName];
    if (!token) {
      if (shouldLog) {
        console.log(`[Auth Middleware] REJECTED: Cookie '${env.cookieName}' not found`);
        console.log(`[Auth Middleware] Available cookie keys:`, Object.keys(req.cookies));
      }
      return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
    }

    if (shouldLog) {
      console.log(`[Auth Middleware] Cookie found, token length:`, token.length);
    }

    // Verify JWT token
    let payload;
    try {
      payload = verifyAccessToken(token);
      if (shouldLog) {
        console.log(`[Auth Middleware] Token verified, userId:`, payload.sub, `role:`, payload.role);
      }
    } catch (jwtError) {
      if (shouldLog) {
        console.log(`[Auth Middleware] Token verification failed:`, jwtError instanceof Error ? jwtError.message : String(jwtError));
      }
      if (jwtError instanceof TokenExpiredError) {
        return next(new AppError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại", 401));
      }
      if (jwtError instanceof JsonWebTokenError) {
        return next(new AppError("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại", 401));
      }
      return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
    }

    // Fetch user from database
    const user = await User.findById(payload.sub);
    if (!user) {
      if (shouldLog) {
        console.log(`[Auth Middleware] User not found in database:`, payload.sub);
      }
      return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
    }

    // Attach user to request
    req.user = user;
    if (shouldLog) {
      console.log(`[Auth Middleware] AUTHORIZED: User ${user.email} (${user.role})`);
    }
    next();
  } catch (error) {
    // Handle unexpected errors
    if (error instanceof AppError) {
      return next(error);
    }
    // Log unexpected errors
    console.error("[Auth Middleware] Unexpected error:", error);
    if (env.nodeEnv === "development" && error instanceof Error) {
      console.error("[Auth Middleware] Error stack:", error.stack);
    }
    return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
  }
};

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user) {
    if (env.nodeEnv === "development") {
      console.log(`[Auth Middleware] requireAdmin: No user found on request`);
    }
    return next(new AppError("Vui lòng đăng nhập để tiếp tục", 401));
  }
  
  if (req.user.role !== "admin") {
    if (env.nodeEnv === "development") {
      console.log(`[Auth Middleware] requireAdmin: User ${req.user.email} (role: ${req.user.role}) is not admin`);
    }
    return next(new AppError("Bạn không có quyền truy cập trang này", 403));
  }
  
  if (env.nodeEnv === "development") {
    console.log(`[Auth Middleware] requireAdmin: Authorized admin ${req.user.email}`);
  }
  return next();
};

