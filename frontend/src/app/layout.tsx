import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Inter, Outfit } from "next/font/google";
import { locales, type Locale, defaultLocale } from "@/i18n/routing";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "May Coffee – Tea & Specialty",
  description: "May Coffee – Không gian cà phê & trà đặc sản, nơi thư giãn và kết nối.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "May Coffee – Tea & Specialty",
    description: "May Coffee – Không gian cà phê & trà đặc sản tại Việt Nam.",
    url: "https://maycoffee.store",
    siteName: "May Coffee",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "May Coffee Logo",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const resolveLocale = (cookieLocale?: string | null): Locale => {
  if (!cookieLocale) return defaultLocale;
  const normalized = cookieLocale.toLowerCase();
  if (locales.includes(normalized as Locale)) {
    return normalized as Locale;
  }
  return defaultLocale;
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const lang = resolveLocale(cookieStore.get("NEXT_LOCALE")?.value);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
