import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { VerifyForm } from "@/components/auth/verify-form";

type VerifyPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyPage({ params, searchParams }: VerifyPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth.verify" });

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col gap-6 px-4 py-12 text-[#3a1f16] sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:py-24 lg:px-8">
      <div className="flex-1 space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-[#c38c5a]">May Coffee</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="text-base leading-relaxed text-[#6f4633] sm:text-lg">{t("subtitle")}</p>
      </div>
      <div className="flex-1">
        <Suspense fallback={<div className="text-[#a46a47]">Loading...</div>}>
          <VerifyForm locale={locale} initialEmail={resolvedSearchParams.email} />
        </Suspense>
      </div>
    </section>
  );
}

