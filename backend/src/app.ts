import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import env from "./config/env";
import authRoutes from "./routes/auth.routes";
import feedbackRoutes from "./routes/feedback.routes";
import adminRoutes from "./routes/admin.routes";
import eventsRoutes from "./routes/events.routes";
import qrRoutes from "./routes/qr.routes";
import { errorHandler } from "./middleware/errorHandler";
import { AppError } from "./utils/appError";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (health checks, server-to-server, preflight)
    if (!origin) {
      return callback(null, true);
    }

    // Allow explicit allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel deployments (preview + production)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware - MUST be before auth middleware
app.use(cookieParser());

// Log cookie parsing in development
if (env.nodeEnv === "development") {
  app.use((req, _res, next) => {
    if (req.cookies && Object.keys(req.cookies).length > 0) {
      console.log(`[Cookie Parser] Parsed cookies:`, Object.keys(req.cookies));
    }
    next();
  });
  
  // Log Set-Cookie headers in responses
  app.use((req, res, next) => {
    res.on("finish", () => {
      const setCookieHeader = res.getHeader("Set-Cookie");
      if (setCookieHeader) {
        const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        console.log(`[Response] Set-Cookie header for ${req.method} ${req.path}:`, cookies);
        cookies.forEach((cookie, idx) => {
          const cookieStr = String(cookie);
          if (cookieStr.includes("maycoffee_session")) {
            console.log(`[Response] ✓ maycoffee_session cookie found in Set-Cookie header #${idx + 1}`);
          }
        });
      } else if (req.path.startsWith("/api/auth/login") || req.path.startsWith("/api/auth/verify")) {
        console.warn(`[Response] ⚠ WARNING: No Set-Cookie header for ${req.method} ${req.path} - cookie may not be set!`);
      }
    });
    next();
  });
}

app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  legacyHeaders: false,
  standardHeaders: true,
});

app.use(limiter);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "may-coffee-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventsRoutes);
app.use("/qr", qrRoutes);

app.use((_req, _res, next) => {
  next(new AppError("Endpoint not found", 404));
});

app.use(errorHandler);

export default app;


