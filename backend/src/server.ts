import http from "http";
import app from "./app";
import env from "./config/env";
import { connectMongo } from "./lib/mongo";
import { logger } from "./config/logger";
import { User } from "./models/User";
import { BOOTSTRAP_ADMIN_EMAIL } from "./utils/constants";

const ensureAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ email: BOOTSTRAP_ADMIN_EMAIL });
    if (adminUser) {
      if (adminUser.role !== "admin") {
        // Use updateOne to avoid full document validation
        // This prevents errors if the user record has missing required fields
        await User.updateOne({ email: BOOTSTRAP_ADMIN_EMAIL }, { role: "admin" });
        logger.info(`[Migration] Updated ${BOOTSTRAP_ADMIN_EMAIL} to admin role`);
      }
    } else {
      logger.warn(`[Migration] Admin user ${BOOTSTRAP_ADMIN_EMAIL} not found. Will be promoted on email verification.`);
    }
  } catch (error) {
    logger.error("[Migration] Failed to ensure admin user", error);
  }
};

const startServer = async () => {
  try {
    await connectMongo();
    await ensureAdminUser();
    const server = http.createServer(app);
    server.listen(env.port, () => {
      logger.info(`[Server] May Coffee backend running on http://localhost:${env.port}`);
      if (env.nodeEnv === "development") {
        logger.info(`[DEV MODE] Frontend origin locked to http://localhost:3000`);
      } else {
        logger.info(`[Server] Frontend URL: ${env.frontendUrl}`);
      }
      logger.info(`[Server] Cookie name: ${env.cookieName}`);
      logger.info(`[Server] Cookie options:`, {
        sameSite: "lax",
        secure: env.nodeEnv === "production",
        httpOnly: true,
        path: "/",
      });
    });
  } catch (error) {
    logger.error("[Server] Failed to start", error);
    process.exit(1);
  }
};

void startServer();
