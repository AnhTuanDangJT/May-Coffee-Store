"use client";

import { MENU_CATEGORIES, type MenuCategoryId } from "@/data/menu";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

type MenuFiltersProps = {
  active: MenuCategoryId | "all";
  onChange: (category: MenuCategoryId | "all") => void;
};

export const MenuFilters = ({ active, onChange }: MenuFiltersProps) => {
  const locale = useLocale() as "vi" | "en";
  const t = useTranslations("menu");

  const allLabel = t("categoryAll");

  return (
    <div className="flex snap-x gap-3 overflow-x-auto pb-4">
      <FilterChip
        label={allLabel}
        active={active === "all"}
        onClick={() => onChange("all")}
      />
      {MENU_CATEGORIES.map((category) => (
        <FilterChip
          key={category.id}
          label={locale === "vi" ? category.label_vi : category.label_en}
          active={active === category.id}
          onClick={() => onChange(category.id)}
        />
      ))}
    </div>
  );
};

type ChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const FilterChip = ({ label, active, onClick }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "snap-center rounded-full border px-6 py-2.5 text-sm font-bold transition-all duration-300 shadow-sm",
      active
        ? "border-[#B7966B] bg-[#502B0F] text-[#FBEED7] shadow-[#724A24]/30"
        : "border-[#D9C19D]/50 bg-white/20 text-[#724A24] hover:bg-[#D9C19D]/30 hover:text-[#2B1606]",
    )}
  >
    {label}
  </button>
);


