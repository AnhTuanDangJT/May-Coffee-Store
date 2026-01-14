import QRCode from "qrcode";
import env from "../config/env";
import { logger } from "../config/logger";

type CacheRecord = {
  buffer: Buffer;
  generatedAt: number;
};

const cache: Record<string, CacheRecord> = {};
const CACHE_TTL_MS = 1000 * 60 * 60; // 1h

const ensureFrontendUrl = () => {
  const base = (env.frontendUrl ?? "").trim();
  if (!base) {
    const message = "[QR] FRONTEND_URL is not configured";
    logger.error(message);
    throw new Error(message);
  }
  return base.replace(/\/$/, "");
};

const getMenuUrl = () => {
  const menuUrl = `${ensureFrontendUrl()}/menu`;
  logger.debug(`[QR] Menu QR target URL: ${menuUrl}`);
  return menuUrl;
};

export const qrService = {
  getMenuQr: async () => {
    const cacheKey = "menu";
    const existing = cache[cacheKey];
    if (existing && Date.now() - existing.generatedAt < CACHE_TTL_MS) {
      return existing.buffer;
    }

    const targetUrl = getMenuUrl();

    const buffer = await QRCode.toBuffer(targetUrl, {
      type: "png",
      scale: 8,
      margin: 2,
      color: {
        dark: "#1F0C08",
        light: "#FFFFFF",
      },
    });

    cache[cacheKey] = {
      buffer,
      generatedAt: Date.now(),
    };
    logger.info("[QR] Generated menu QR image");
    return buffer;
  },
};


