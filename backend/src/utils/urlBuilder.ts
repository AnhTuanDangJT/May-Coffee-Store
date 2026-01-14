import env from "../config/env";
import { logger } from "../config/logger";

/**
 * Valid locales supported by the frontend
 */
const VALID_LOCALES = ["vi", "en"] as const;
type ValidLocale = (typeof VALID_LOCALES)[number];
const DEFAULT_LOCALE: ValidLocale = "vi";

/**
 * Validates and normalizes a locale string
 * @param locale - The locale to validate
 * @returns A valid locale, defaulting to "vi" if invalid
 */
function validateLocale(locale?: string | null): ValidLocale {
  if (!locale || typeof locale !== "string") {
    return DEFAULT_LOCALE;
  }
  const normalized = locale.toLowerCase().trim();
  if (VALID_LOCALES.includes(normalized as ValidLocale)) {
    return normalized as ValidLocale;
  }
  logger.warn(`[URL Builder] Invalid locale "${locale}", defaulting to "${DEFAULT_LOCALE}"`);
  return DEFAULT_LOCALE;
}

/**
 * Normalizes a base URL by removing trailing slashes and any locale segments
 * This prevents double locale issues if FRONTEND_URL accidentally includes a locale
 */
function normalizeBaseUrl(baseUrl: string): string {
  let normalized = baseUrl.trim().replace(/\/+$/, "");
  
  // Remove any locale segments from the end of the base URL
  // e.g., "http://localhost:3000/vi" -> "http://localhost:3000"
  for (const loc of VALID_LOCALES) {
    const localePattern = new RegExp(`/${loc}(/|$)$`);
    if (localePattern.test(normalized)) {
      normalized = normalized.replace(localePattern, "");
      logger.debug(`[URL Builder] Removed locale "${loc}" from base URL: ${baseUrl} -> ${normalized}`);
      break;
    }
  }
  
  return normalized;
}

/**
 * Normalizes a path by ensuring it starts with a single slash
 */
function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    return "/";
  }
  // Remove leading slashes, then add one
  return "/" + trimmed.replace(/^\/+/, "");
}

/**
 * Builds a frontend URL with locale prefix
 * 
 * @param path - The path (e.g., "/auth/verify" or "auth/verify")
 * @param locale - Optional locale (defaults to "vi")
 * @returns A complete URL like "http://localhost:3000/vi/auth/verify"
 * 
 * @example
 * buildFrontendUrl("/auth/verify", "vi") => "http://localhost:3000/vi/auth/verify"
 * buildFrontendUrl("auth/verify", "en") => "http://localhost:3000/en/auth/verify"
 * buildFrontendUrl("/auth/verify", undefined) => "http://localhost:3000/vi/auth/verify"
 */
export function buildFrontendUrl(path: string, locale?: string | null): string {
  const baseUrl = normalizeBaseUrl(env.frontendUrl);
  const validLocale = validateLocale(locale);
  const normalizedPath = normalizePath(path);

  // Ensure path doesn't already start with a locale
  // Remove any existing locale prefix to prevent double locale
  let cleanPath = normalizedPath;
  for (const loc of VALID_LOCALES) {
    if (cleanPath.startsWith(`/${loc}/`) || cleanPath === `/${loc}`) {
      cleanPath = cleanPath.replace(new RegExp(`^/${loc}(/|$)`), "/");
      if (!cleanPath.startsWith("/")) {
        cleanPath = "/" + cleanPath;
      }
      logger.debug(`[URL Builder] Removed duplicate locale "${loc}" from path: ${normalizedPath} -> ${cleanPath}`);
      break;
    }
  }

  // Build final URL
  const finalPath = cleanPath === "/" ? `/${validLocale}` : `/${validLocale}${cleanPath}`;
  const finalUrl = `${baseUrl}${finalPath}`;

  // Final safety check: ensure we didn't create a double locale
  const doubleLocalePattern = new RegExp(`/(${VALID_LOCALES.join("|")})/\\1/`);
  if (doubleLocalePattern.test(finalUrl)) {
    logger.error(`[URL Builder] WARNING: Double locale detected in URL: ${finalUrl}`);
    // Fix it by removing one locale segment
    const fixedUrl = finalUrl.replace(doubleLocalePattern, `/$1/`);
    logger.warn(`[URL Builder] Fixed double locale: ${finalUrl} -> ${fixedUrl}`);
    return fixedUrl;
  }

  logger.info(`[URL Builder] Built URL: path="${path}", locale="${locale || 'default'}", baseUrl="${baseUrl}" -> "${finalUrl}"`);

  return finalUrl;
}

/**
 * Builds a frontend URL with query parameters
 * 
 * @param path - The path
 * @param queryParams - Query parameters object
 * @param locale - Optional locale
 * @returns A complete URL with query string
 * 
 * @example
 * buildFrontendUrlWithQuery("/auth/verify", { email: "test@example.com" }, "vi")
 * => "http://localhost:3000/vi/auth/verify?email=test%40example.com"
 */
export function buildFrontendUrlWithQuery(
  path: string,
  queryParams: Record<string, string | number | boolean | null | undefined>,
  locale?: string | null
): string {
  const baseUrl = buildFrontendUrl(path, locale);
  
  const validParams: string[] = [];
  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== null && value !== undefined) {
      validParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }

  if (validParams.length === 0) {
    return baseUrl;
  }

  return `${baseUrl}?${validParams.join("&")}`;
}

