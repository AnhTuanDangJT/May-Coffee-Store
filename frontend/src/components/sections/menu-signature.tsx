"use client";

import { MENU_ITEMS } from "@/data/menu";
import { formatVND } from "@/lib/currency";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Badge } from "@/components/ui/badge";
import { useLocale, useTranslations } from "next-intl";

export const MenuSignature = () => {
  const locale = useLocale() as "vi" | "en";
  const t = useTranslations("menu");
  const highlightItems = MENU_ITEMS.filter((item) => item.category === "best-sellers");

  return (
    <section
      id="menu"
      className="relative mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32 lg:pb-32 lg:pt-44 lg:px-8"
    >
      <div className="absolute inset-x-4 top-12 h-[80%] rounded-[48px] bg-gradient-to-b from-[#ffe9d6] via-[#fff4e6] to-[#fff8f0] blur-3xl opacity-60 sm:inset-x-6" />
      <div className="absolute inset-0 -z-10 rounded-[48px] bg-gradient-to-b from-[#ffe8d2] via-[#fff7ec] to-[#fff8f0]" />
      <SectionReveal className="relative space-y-4 text-[#3a1f16]">
        <Badge tone="amber">{t("badgeBest")}</Badge>
        <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">{t("titleShort")}</h2>
        <p className="text-base leading-relaxed text-[#6f4633] sm:text-lg">{t("descriptionShort")}</p>
      </SectionReveal>
      <div className="relative mt-8 grid gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2">
        {highlightItems.map((item, index) => (
          <SectionReveal key={item.id} delay={0.05 * index}>
            <div className="group flex flex-col gap-3 rounded-[32px] border border-white/60 bg-white/95 p-6 shadow-[0_25px_70px_rgba(238,186,148,0.35)] transition hover:-translate-y-1.5 hover:shadow-[0_35px_90px_rgba(238,186,148,0.45)] lg:p-8">
              <div className="flex items-center justify-between">
                <Badge tone="emerald">{t("badgeBest")}</Badge>
                <p className="text-lg font-semibold text-[#c15d2f]">
                  {formatVND(item.price_vnd, locale)}
                </p>
              </div>
              <h3 className="text-2xl font-semibold text-[#3a1f16]">
                {locale === "vi" ? item.name_vi : item.name_en}
              </h3>
              <p className="text-sm text-[#82533a]">
                {locale === "vi" ? item.shortDesc_vi : item.shortDesc_en}
              </p>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
};

