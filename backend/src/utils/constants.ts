export const FEEDBACK_DAILY_LIMIT = 3;
export const EMAIL_CODE_EXPIRY_MINUTES = 10;
export const BOOTSTRAP_ADMIN_EMAIL = "dganhtuan.2k5@gmail.com";

export const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  // Use "none" for cross-origin requests (Vercel frontend to Railway backend)
  // "lax" only works for same-site requests
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  // secure: true is REQUIRED when sameSite: "none"
  secure: process.env.NODE_ENV === "production",
  // DO NOT set domain for cross-origin cookies - the cookie should be associated with the backend domain
  // Setting domain would prevent the cookie from being sent to the backend when frontend and backend are on different domains
  path: "/",
};

