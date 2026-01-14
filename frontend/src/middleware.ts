import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from './i18n/routing';

export default createMiddleware({
    locales,
    defaultLocale,
    localePrefix
});

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(vi|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
