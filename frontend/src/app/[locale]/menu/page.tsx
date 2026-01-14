import { MenuExplorer } from "@/components/menu/menu-explorer";
import { MenuQrPromo } from "@/components/menu/menu-qr-promo";
import { DrinkQuiz } from "@/components/menu/drink-quiz";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

type MenuPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function MenuPage({ params }: MenuPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "menu" });

  return (
    <>
      <MenuExplorer
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        searchPlaceholder={t("searchPlaceholder")}
        emptyState={t("emptyState")}
      />
      <DrinkQuiz />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <MenuQrPromo
          locale={locale}
          badge={t("qrSection.badge")}
          title={t("qrSection.title")}
          subtitle={t("qrSection.subtitle")}
          cta={t("qrSection.cta")}
          downloadLabel={t("qrSection.download")}
          copyLabel={t("qrSection.copyLink")}
          copySuccess={t("qrSection.copySuccess")}
        />
      </div>
    </>
  );
}

