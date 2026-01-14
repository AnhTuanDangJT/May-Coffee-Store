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

// Build allowed origins list
const allowedOrigins: string[] = [];

// In development, allow localhost and local network IPs
if (env.nodeEnv === "development") {
  allowedOrigins.push("http://localhost:3000");
  allowedOrigins.push("http://127.0.0.1:3000");
  // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  // This enables access from other devices on the same network
  // Note: For production, ensure proper CORS configuration
} else {
  // In production, use the configured frontend URL
  allowedOrigins.push(env.frontendUrl);
}

// Helper function to check if origin is a local network address (development only)
const isLocalNetworkOrigin = (origin: string): boolean => {
  if (env.nodeEnv !== "development") return false;
  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    const port = url.port || "3000";
    
    // Allow localhost variants
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return port === "3000";
    }
    
    // Allow private IP ranges
    // 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12
    if (hostname.startsWith("192.168.") || hostname.startsWith("10.")) {
      return port === "3000";
    }
    if (hostname.startsWith("172.")) {
      const secondOctet = parseInt(hostname.split(".")[1] || "0");
      if (secondOctet >= 16 && secondOctet <= 31) {
        return port === "3000";
      }
    }
    
    return false;
  } catch {
    return false;
  }
};

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // CRITICAL: When using credentials, Access-Control-Allow-Origin must EXACTLY match
      // the request origin. We must return the origin string, not true.
      // Returning true causes Express to set a wildcard or static value, which browsers
      // reject when credentials are involved.
      if (allowedOrigins.includes(origin)) {
        // In development, log for debugging
        if (env.nodeEnv === "development") {
          console.log(`[CORS] origin=`, origin, `allowed=`, true);
        }
        // Return the actual origin string so Express sets Access-Control-Allow-Origin
        // to the exact requesting origin (required for credentials)
        return callback(null, origin);
      }
      
      // In development, also check for local network IPs
      if (env.nodeEnv === "development" && isLocalNetworkOrigin(origin)) {
        console.log(`[CORS] origin=`, origin, `allowed=`, true, `(local network)`);
        return callback(null, origin);
      }
      
      // In development, log blocked origins for debugging
      if (env.nodeEnv === "development") {
        console.log(`[CORS] origin=`, origin, `allowed=`, false);
        console.log(`[CORS] Blocked origin: ${origin}`);
        console.log(`[CORS] Allowed origins:`, allowedOrigins);
      }
      
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // CRITICAL: Must be true for cookies to work
  }),
);

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
          if (cookie.includes("maycoffee_session")) {
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


