type LogLevel = "info" | "warn" | "error" | "debug";

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const timestamp = new Date().toISOString();
  // eslint-disable-next-line no-console
  console[level](
    `[${timestamp}] [${level.toUpperCase()}] ${message}`,
    meta ?? "",
  );
};

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
};

