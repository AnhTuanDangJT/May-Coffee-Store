export const FEEDBACK_DAILY_LIMIT = 3;
export const EMAIL_CODE_EXPIRY_MINUTES = 10;
export const BOOTSTRAP_ADMIN_EMAIL = "dganhtuan.2k5@gmail.com";

export const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

