"use client";

import { cn } from "@/lib/utils";
import { m, useAnimation } from "framer-motion";
import { useEffect, memo, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useHydrated } from "@/hooks/use-hydrated";

type SectionRevealProps = {
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

const SectionRevealComponent = ({
  className,
  children,
  delay = 0.05,
}: SectionRevealProps) => {
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();
  const isHydrated = useHydrated();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  useEffect(() => {
    if (inView && isHydrated) {
      controls.start("visible");
    }
  }, [controls, inView, isHydrated]);

  const variants = useMemo(() => ({
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.38,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1] as const
      }
    },
    hidden: {
      opacity: shouldReduceMotion || !isHydrated ? 1 : 0,
      y: shouldReduceMotion || !isHydrated ? 0 : 16
    },
  }), [shouldReduceMotion, delay, isHydrated]);

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
};

export const SectionReveal = memo(SectionRevealComponent);
