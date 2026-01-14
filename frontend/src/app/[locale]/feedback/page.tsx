import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { FeedbackContent } from "./FeedbackContent";

type FeedbackPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FeedbackContent locale={locale} />;
}


