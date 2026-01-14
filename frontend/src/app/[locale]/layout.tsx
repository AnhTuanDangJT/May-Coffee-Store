import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, defaultLocale } from "@/i18n/routing";
import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/context/auth-context";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <AppShell locale={locale}>{children}</AppShell>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}


