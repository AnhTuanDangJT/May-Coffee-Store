import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? defaultLocale;

  if (!locales.includes(resolvedLocale as (typeof locales)[number])) {
    throw new Error(`Unsupported locale: ${resolvedLocale}`);
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});


