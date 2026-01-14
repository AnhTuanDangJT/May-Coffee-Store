"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Home, Coffee, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import type { ComponentProps } from "react";

type NavHref = ComponentProps<typeof Link>["href"];

export const BottomNav = () => {
    const t = useTranslations();
    const pathname = usePathname();

    const navItems: Array<{ key: string; href: NavHref; icon: any }> = [
        { key: "nav.home", href: "/", icon: Home },
        { key: "nav.menu", href: "/menu", icon: Coffee },
        { key: "nav.events", href: "/events", icon: Calendar },
        { key: "nav.feedback", href: "/feedback", icon: MessageSquare },
    ];

    return (
        <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-beige/40 bg-cream/90 p-2 shadow-2xl md:hidden">
            {navItems.map((item) => {
                const hrefPath = typeof item.href === "string" ? item.href : item.href?.pathname || "";
                const isActive = pathname === hrefPath || (hrefPath !== "/" && pathname.startsWith(hrefPath));
                const Icon = item.icon;

                return (
                    <Link
                        key={item.key}
                        href={item.href}
                        className={cn(
                            "relative flex flex-col items-center justify-center rounded-full px-4 py-2 transition-all duration-300",
                            isActive ? "text-espresso" : "text-coffee hover:text-dark"
                        )}
                    >
                        {isActive && (
                            <m.div
                                layoutId="nav-active-bg"
                                layout={false}
                                style={{ willChange: "transform", transform: "translateZ(0)" }}
                                className="absolute inset-0 rounded-full bg-latte/20"
                                transition={{ type: "spring", bounce: 0.35, duration: 0.5 }}
                            />
                        )}
                        <div className="relative z-10 flex flex-col items-center">
                            <Icon
                                size={20}
                                className={cn(
                                    "transition-transform duration-300",
                                    isActive ? "text-espresso scale-110" : "scale-100"
                                )}
                            />
                            {isActive && (
                                <m.span
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    layout={false}
                                    style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                                    className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-espresso"
                                >
                                    {t(item.key)}
                                </m.span>
                            )}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
};
