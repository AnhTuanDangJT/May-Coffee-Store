import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AdminUsersContent } from "../AdminUsersContent";

type AdminUsersPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminUsersPage({ params }: AdminUsersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminUsersContent locale={locale} />;
}


