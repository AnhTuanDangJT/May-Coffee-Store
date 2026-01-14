import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AdminEventsContent } from "../AdminEventsContent";

type AdminEventsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminEventsPage({ params }: AdminEventsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminEventsContent locale={locale} />;
}













