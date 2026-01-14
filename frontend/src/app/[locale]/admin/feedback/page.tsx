import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AdminFeedbackContent } from "../AdminFeedbackContent";

type AdminFeedbackPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminFeedbackPage({ params }: AdminFeedbackPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminFeedbackContent />;
}


