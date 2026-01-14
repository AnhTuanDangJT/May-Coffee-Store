import mongoose from "mongoose";
import env from "../config/env";
import { logger } from "../config/logger";

export const connectMongo = async (): Promise<void> => {
  if (!env.mongoUri) {
    logger.warn("[Mongo] Missing MONGODB_URI, skipping connection.");
    return;
  }

  try {
    await mongoose.connect(env.mongoUri);
    logger.info("[Mongo] Connected successfully.");
  } catch (err) {
    logger.error("[Mongo] Connection failed", err);
    throw err;
  }
};

export const disconnectMongo = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("[Mongo] Disconnected.");
  } catch (err) {
    logger.error("[Mongo] Disconnect error", err);
  }
};















