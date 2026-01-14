import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AdminOverviewContent } from "./AdminOverviewContent";

type AdminPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminOverviewContent locale={locale} />;
}


