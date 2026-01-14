"use client";

import { useTranslations } from "next-intl";
import { Facebook, Instagram, Music2 } from "lucide-react";

export const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-[#f4dcc1] bg-[#fff5ea] text-[#5c2b15]">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:gap-8 sm:py-10 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#c38c5a]">
            May Coffee
          </p>
          <p className="mt-3 text-base font-semibold leading-relaxed sm:text-lg">
            111/103 Đặng Thùy Trâm, P13, Bình Thạnh
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#8a5c3d]">{t("openHours")}</p>
        </div>
      </div>
      <div className="border-t border-[#f4dcc1] py-4 text-center text-xs leading-relaxed text-[#8a5c3d]">
        {t("credit")}
      </div>
    </footer>
  );
};

