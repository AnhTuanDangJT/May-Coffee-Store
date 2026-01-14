"use client";

import { SectionReveal } from "@/components/animations/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Waves, CupSoda, Music } from "lucide-react";
import { useTranslations } from "next-intl";

const features = [
  {
    icon: CupSoda,
    key: "craft",
  },
  {
    icon: Music,
    key: "music",
  },
  {
    icon: Waves,
    key: "ambience",
  },
];

export const ExperienceSection = () => {
  const t = useTranslations("experience");
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:px-8">
      <SectionReveal className="space-y-4 text-[#3a1f16]">
        <Badge tone="rose">{t("badge")}</Badge>
        <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">{t("title")}</h2>
        <p className="text-base leading-relaxed text-[#6f4633] sm:text-lg">{t("subtitle")}</p>
      </SectionReveal>
      <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <SectionReveal key={feature.key} delay={0.1 * index}>
              <div className="rounded-3xl border border-[#f4d4b6] bg-white/90 p-5 text-[#3a1f16] shadow-[0_20px_50px_rgba(244,202,167,0.35)] transition hover:-translate-y-1 hover:border-[#f0b98c] sm:p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0e0] text-[#d0723f]">
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold sm:text-xl">{t(`${feature.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#82533a]">
                  {t(`${feature.key}.description`)}
                </p>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
};

