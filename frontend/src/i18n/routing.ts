export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";
export const localePrefix = "always";

export const pathnames = {
  "/": "/",
  "/menu": "/menu",
  "/menu/qr": "/menu/qr",
  "/events": "/events",
  "/feedback": "/feedback",
  "/auth/login": "/auth/login",
  "/auth/register": "/auth/register",
  "/auth/verify": "/auth/verify",
  "/admin": "/admin",
  "/admin/feedback": "/admin/feedback",
  "/admin/users": "/admin/users",
  "/admin/events": "/admin/events",
} as const;


