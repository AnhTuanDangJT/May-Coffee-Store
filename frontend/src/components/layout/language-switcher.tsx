"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";

const languages = [
  { code: "vi", label: "VN" },
  { code: "en", label: "EN" },
];

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelect = (targetLocale: string) => {
    if (targetLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: targetLocale });
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-beige bg-cream/60 p-1 shadow-inner">
      {languages.map((item) => {
        const isActive = item.code === locale;
        return (
          <button
            key={item.code}
            type="button"
            aria-pressed={isActive}
            disabled={isPending}
            onClick={() => onSelect(item.code)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300",
              isActive ? "text-cream" : "text-coffee hover:text-dark"
            )}
          >
            {isActive && (
              <m.div
                layoutId="lang-active"
                layout={false}
                style={{ willChange: "transform", transform: "translateZ(0)" }}
                className="absolute inset-0 rounded-full bg-espresso"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};


