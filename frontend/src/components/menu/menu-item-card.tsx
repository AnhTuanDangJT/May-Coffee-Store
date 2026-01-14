"use client";

import { MENU_CATEGORIES, type MenuItem } from "@/data/menu";
import { formatVND } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Star, Zap } from "lucide-react";

type MenuItemCardProps = {
  item: MenuItem;
};

export const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const locale = useLocale() as "vi" | "en";
  const category = MENU_CATEGORIES.find((cat) => cat.id === item.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[32px] p-6 lg:p-8 min-h-[220px] transition-all duration-500",
        "bg-gradient-to-br shadow-xl shadow-espresso/5",
        category?.accentFrom || "from-cream",
        category?.accentTo || "to-beige"
      )}
    >
      {/* Dynamic Background Pattern - Extremely Subtle */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-700">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id={`pattern-${item.id}`} x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="currentColor" className="text-espresso/30" />
            <path d="M0 10 Q 5 5, 10 10 T 20 10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-espresso/20" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#pattern-${item.id})`} />
        </svg>
      </div>

      {/* Light Catch - Gentle Highlight */}
      <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/30 blur-3xl pointer-events-none group-hover:bg-white/40 transition-all duration-700" />

      {/* Floating Animated Overlay */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.03, 0.06, 0.03]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2
        }}
        className="absolute inset-0 bg-white blur-xl pointer-events-none"
      />

      {/* Header with Title & Price */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight text-dark transition-colors duration-500">
            {locale === "vi" ? item.name_vi : item.name_en}
          </h3>
          <span className="shrink-0 font-display text-lg sm:text-xl font-bold text-espresso transition-all group-hover:scale-105">
            {formatVND(item.price_vnd, locale)}
          </span>
        </div>

        <p className="line-clamp-3 text-sm sm:text-base font-medium leading-relaxed text-coffee transition-colors duration-500">
          {locale === "vi" ? item.shortDesc_vi : item.shortDesc_en}
        </p>
      </div>

      {/* Footer with Category & Badges */}
      <div className="relative z-10 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-espresso/40" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-espresso/60">
            {locale === "vi" ? category?.label_vi : category?.label_en}
          </span>
        </div>

        <div className="flex gap-2">
          {item.isBestSeller && (
            <div className="flex items-center gap-1.5 rounded-full bg-latte/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-espresso border border-latte/10">
              <Star size={10} fill="currentColor" />
              <span>{locale === "vi" ? "Bán chạy" : "Best Seller"}</span>
            </div>
          )}
          {item.isNew && (
            <div className="flex items-center gap-1.5 rounded-full bg-beige/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-caramel border border-beige/10">
              <Zap size={10} fill="currentColor" />
              <span>{locale === "vi" ? "Món mới" : "New"}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
