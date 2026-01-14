import fs from "fs";
import path from "path";
import { logger } from "../config/logger";

/**
 * Loads the logo image and converts it to a base64 data URI for email embedding
 * @returns Base64 data URI string or null if logo not found
 */
export function loadLogoAsDataUri(): string | null {
  try {
    // Try multiple possible logo locations
    const possiblePaths = [
      // From backend directory, try resourceimg first
      path.join(process.cwd(), "../resourceimg/logo.png"),
      // From backend directory, try frontend/public
      path.join(process.cwd(), "../frontend/public/logo.png"),
      // Using __dirname (for compiled dist/ or src/)
      path.join(__dirname, "../../../resourceimg/logo.png"),
      path.join(__dirname, "../../../frontend/public/logo.png"),
    ];

    for (const logoPath of possiblePaths) {
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        const base64 = logoBuffer.toString("base64");
        logger.debug(`[Logo Loader] Successfully loaded logo from ${logoPath}`);
        return `data:image/png;base64,${base64}`;
      }
    }

    logger.warn(`[Logo Loader] Logo not found in any of these locations: ${possiblePaths.join(", ")}`);
    return null;
  } catch (error) {
    logger.error("[Logo Loader] Failed to load logo", error);
    return null;
  }
}

