import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const remotePatternCandidates = [
  process.env.NEXT_PUBLIC_BACKEND_URL,
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, ""),
  "http://localhost:4000",
];

const remotePatterns = remotePatternCandidates
  .filter(Boolean)
  .map((value) => {
    try {
      const url = new URL(value as string);
      const protocol = url.protocol.replace(":", "");
      return {
        protocol,
        hostname: url.hostname,
        port: url.port || undefined,
      };
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .reduce<Array<{ protocol: string; hostname: string; port?: string }>>(
    (acc, pattern) => {
      if (!pattern) return acc;
      const key = `${pattern.protocol}-${pattern.hostname}-${pattern.port ?? "default"}`;
      if (!acc.find((item) => `${item.protocol}-${item.hostname}-${item.port ?? "default"}` === key)) {
        acc.push(pattern);
      }
      return acc;
    },
    [],
  );

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: remotePatterns.length
      ? remotePatterns.map((pattern) => ({
          ...pattern,
          pathname: "/qr/**",
        }))
      : undefined,
  },
};

export default withNextIntl(nextConfig);
