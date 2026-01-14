export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:4000";

// BACKEND_BASE_URL is the backend URL without /api suffix, used for QR codes and images
export const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  (process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") ?? "http://localhost:4000");

// FRONTEND_BASE_URL is the frontend URL
export const FRONTEND_BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

// QR_MENU_URL is the URL for the QR menu page
export const QR_MENU_URL =
  process.env.NEXT_PUBLIC_QR_MENU_URL ??
  `${FRONTEND_BASE_URL}/menu`;