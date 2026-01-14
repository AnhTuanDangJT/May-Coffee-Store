"use client";

import { useEffect, useState, memo, useMemo } from "react";
import { AnimatePresence, m } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type HeroSectionProps = {
  locale: string;
};

const HeroSectionComponent = ({ locale }: HeroSectionProps) => {
  const t = useTranslations("hero");
  const isHydrated = useHydrated();
  const shouldReduceMotion = useReducedMotion();
  
  const rotatingLines = (t.raw("rotatingLines") as string[] | undefined)?.filter(
    (line) => line && line.length > 0,
  );
  const titles = useMemo(() => 
    rotatingLines && rotatingLines.length > 0 ? rotatingLines : [t("title")],
    [rotatingLines, t]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [titles.length]);

  useEffect(() => {
    if (titles.length <= 1 || !isHydrated || shouldReduceMotion) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [titles.length, isHydrated, shouldReduceMotion]);

  const currentTitle = useMemo(() => titles[currentIndex % titles.length], [titles, currentIndex]);

  return (
    <section className="relative overflow-hidden pb-12 pt-8">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 text-dark sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:py-24 lg:px-8">
        <SectionReveal className="flex-1 space-y-8">
          <m.div
            initial={isHydrated ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
            animate={isHydrated ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-beige bg-beige/20 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-espresso shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            {t("badge")}
          </m.div>

          <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl">
            {isHydrated && titles.length > 1 ? (
              <AnimatePresence mode="wait">
                <m.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-gradient bg-gradient-to-r from-dark to-espresso bg-clip-text text-transparent"
                >
                  {currentTitle}
                </m.span>
              </AnimatePresence>
            ) : (
              <span className="block text-gradient bg-gradient-to-r from-dark to-espresso bg-clip-text text-transparent">
                {currentTitle}
              </span>
            )}
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-coffee opacity-90 sm:text-xl">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-5">
            <Link href="/menu" locale={locale}>
              <Button size="xl" className="rounded-full px-8 shadow-xl shadow-espresso/20 transition-transform hover:scale-105 active:scale-95">
                {t("primaryCta")}
              </Button>
            </Link>
            <Link href="/menu/qr" locale={locale}>
              <Button variant="outline" size="xl" className="rounded-full border-espresso/30 px-8 text-espresso bg-cream/40 transition-all hover:bg-beige/40">
                {t("secondaryCta")}
              </Button>
            </Link>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.3} className="flex-1">
          <div className="relative group">
            <div className="relative rounded-[40px] border border-beige bg-beige/20 p-6 shadow-2xl sm:p-10">
              <div className="relative mx-auto mb-8 flex h-64 w-64 items-center justify-center rounded-full border-2 border-dashed border-latte/20 bg-cream p-4 shadow-inner sm:h-80 sm:w-80 md:h-[350px] md:w-[350px]">
                {!shouldReduceMotion && (
                  <m.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-latte/30 rounded-full opacity-60"
                  />
                )}
                <m.div
                  animate={!shouldReduceMotion ? {
                    y: [-12, -27, -12],
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 flex items-center justify-center w-full h-full"
                >
                  <Image
                    src="/may.png"
                    alt="May Coffee"
                    width={500}
                    height={500}
                    className="h-auto w-full max-w-[115%] object-contain transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: "drop-shadow(0 32px 64px rgba(80,43,15,0.4))" }}
                    priority
                  />
                </m.div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {useMemo(() => [
                  { label: t("ratingHighlight"), value: "4.9", color: "text-latte" },
                  { label: t("menuHighlight"), value: "30+", color: "text-espresso" },
                  { label: t("vibeHighlight"), value: "R&B", color: "text-caramel" },
                  { label: t("serviceHighlight"), value: "24/7", color: "text-coffee" },
                ], [t]).map((stat, i) => (
                  <m.div
                    key={stat.label}
                    initial={isHydrated ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={isHydrated ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <p className={cn("text-3xl font-display", stat.color)}>{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-caramel/80">{stat.label}</p>
                  </m.div>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export const HeroSection = memo(HeroSectionComponent);
