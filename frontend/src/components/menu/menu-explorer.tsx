"use client";

import { MENU_ITEMS, type MenuCategoryId } from "@/data/menu";
import { MenuItemCard } from "./menu-item-card";
import { MenuFilters } from "./menu-filters";
import { MenuSearch } from "./menu-search";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useState, useMemo } from "react";

type MenuExplorerProps = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  emptyState: string;
};

export const MenuExplorer = ({
  title,
  subtitle,
  searchPlaceholder,
  emptyState,
}: MenuExplorerProps) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId | "all">(
    "all",
  );
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory = activeCategory === "all" || item.category === activeCategory;
      const text = `${item.name_vi} ${item.name_en} ${item.shortDesc_vi} ${item.shortDesc_en}`.toLowerCase();
      const matchQuery = text.includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [activeCategory, query]);

  return (
    <section className="relative overflow-hidden bg-menu-pattern">
      {/* Ambient shadow gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2B1606]/5 via-transparent to-[#2B1606]/5 pointer-events-none" />

      {/* Subtle radial light glow behind active area */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="space-y-4 text-[#2B1606]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#946D43]">Menu Explorer</p>
            <LanguageSwitcher />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-gradient bg-gradient-to-r from-[#2B1606] to-[#502B0F] bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[#724A24] sm:text-lg">
            {subtitle}
          </p>
          <div className="max-w-xl">
            <MenuSearch
              value={query}
              placeholder={searchPlaceholder}
              onChange={setQuery}
            />
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <MenuFilters active={activeCategory} onChange={setActiveCategory} />
        </div>

        {filteredItems.length === 0 ? (
          <div className="mt-8 rounded-[40px] border border-dashed border-[#D9C19D] bg-white/20 p-12 text-center sm:mt-10">
            <p className="text-sm italic text-[#946D43]">
              {emptyState}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:mt-10 md:grid-cols-2">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

