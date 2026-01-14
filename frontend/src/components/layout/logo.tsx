"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { memo } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

type LogoProps = {
    className?: string;
    locale: string;
    layoutId?: string;
};

const LogoComponent = ({ className, locale, layoutId }: LogoProps) => {
    const isHydrated = useHydrated();

    return (
        <Link
            href="/"
            locale={locale}
            className={cn(
                "group relative inline-flex items-center gap-3 transition-all sm:gap-4",
                className,
            )}
        >
            <m.div
                layoutId={layoutId}
                transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1]
                }}
                layout={false}
                className="relative z-10 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-beige/60 bg-cream/80 shadow-lg sm:h-20 sm:w-20"
            >
                <Image
                    src="/logo.png"
                    alt="May Coffee"
                    width={80}
                    height={80}
                    className="h-auto w-[110%] object-contain transition-transform duration-150 group-hover:scale-[1.08] will-change-transform"
                    style={{
                        transform: "translateZ(0)",
                        backfaceVisibility: "hidden",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                    }}
                    priority
                />

                {/* Soft Inner Glow */}
                <div className="absolute inset-0 rounded-full bg-latte/5 shadow-[inset_0_0_12px_rgba(183,150,107,0.1)]" />
            </m.div>

            <div className="flex flex-col gap-0.5">
                <m.span
                    initial={isHydrated ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                    animate={isHydrated ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    layout={false}
                    style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                    className="font-display text-xl font-bold uppercase tracking-[0.3em] text-dark sm:text-2xl"
                >
                    May Coffee
                </m.span>
                <m.span
                    initial={isHydrated ? { opacity: 0, x: -5 } : { opacity: 1, x: 0 }}
                    animate={isHydrated ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    layout={false}
                    style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                    className="text-xs uppercase tracking-[0.2em] text-caramel sm:text-sm"
                >
                    Tea & Specialty
                </m.span>
            </div>
        </Link>
    );
};

export const Logo = memo(LogoComponent);
