"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type NavHref = ComponentProps<typeof Link>["href"];

export const AdminNav = () => {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();

  const navItems: Array<{ key: string; href: NavHref }> = [
    { key: "overview", href: "/admin" },
    { key: "feedback", href: "/admin/feedback" },
    { key: "users", href: "/admin/users" },
    { key: "events", href: "/admin/events" },
  ];

  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-[#a46a47]/15 pb-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === "/admin" && pathname === "/admin");
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-[#F3D1B0] text-[#3A2A1F]"
                : "text-[#6B4F3A] hover:bg-[#F3D1B0]/50"
            )}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
};













