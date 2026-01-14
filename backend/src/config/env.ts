import dotenv from "dotenv";

dotenv.config();

type AppEnv = {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  frontendUrl: string;
  sendGridApiKey: string;
  sendGridFromEmail: string;
  emailLogoUrl: string;
  jwtAccessSecret: string;
  jwtAccessExpiresIn: string;
  cookieName: string;
};

// Helper to enforce localhost-only in development
const resolveFrontendUrl = (): string => {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const envUrl = process.env.FRONTEND_URL ?? process.env.CLIENT_BASE_URL;
  const defaultUrl = "http://localhost:3000";

  // In development, always use localhost:3000 (ignore IP addresses)
  if (nodeEnv === "development") {
    return "http://localhost:3000";
  }

  // In production, use environment variable or default
  return envUrl ?? defaultUrl;
};

// Helper to resolve email logo URL
const resolveEmailLogoUrl = (): string => {
  const frontendUrl = resolveFrontendUrl();
  // Default to frontend URL + /logo.png, but allow override via EMAIL_LOGO_URL
  return process.env.EMAIL_LOGO_URL ?? `${frontendUrl}/logo.png`;
};

const env: AppEnv = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? "",
  frontendUrl: resolveFrontendUrl(),
  sendGridApiKey: process.env.SENDGRID_API_KEY ?? "",
  sendGridFromEmail: process.env.SENDGRID_FROM_EMAIL ?? "no-reply@maycoffee.vn",
  emailLogoUrl: resolveEmailLogoUrl(),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? "",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "2h",
  cookieName: process.env.SESSION_COOKIE_NAME ?? "maycoffee_session",
};

const requiredKeys: Array<keyof Pick<AppEnv, "mongoUri" | "jwtAccessSecret">> = [
  "mongoUri",
  "jwtAccessSecret",
];

const envNameMap: Record<(typeof requiredKeys)[number], string> = {
  mongoUri: "MONGODB_URI",
  jwtAccessSecret: "JWT_ACCESS_SECRET",
};

const missing = requiredKeys.filter((key) => !env[key]);

if (missing.length > 0) {
  const printable = missing.map((key) => envNameMap[key]).join(", ");
  throw new Error(`[Env] Missing required environment variables: ${printable}`);
}

export default env;


