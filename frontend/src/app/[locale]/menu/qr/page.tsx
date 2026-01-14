import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { QrContent } from "./QrContent";

type MenuQrPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function MenuQrPage({ params }: MenuQrPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "qrPage" });
  const steps = t.raw("steps") as string[];

  return (
    <QrContent
      badge={t("badge")}
      title={t("title")}
      subtitle={t("subtitle")}
      steps={steps}
      note={t("note")}
      primaryCta={t("primaryCta")}
      secondaryCta={t("secondaryCta")}
      download={t("download")}
      copyLink={t("copyLink")}
      copySuccess={t("copySuccess")}
      loadingLabel={t("loadingLabel")}
      errorTitle={t("errorTitle")}
      errorDescription={t("errorDescription")}
      retryCta={t("retryCta")}
      downloadError={t("downloadError")}
    />
  );
}

