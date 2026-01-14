"use client";

import { Header } from "./header";
import { Footer } from "./footer";
import { BottomNav } from "./bottom-nav";
import { IntroLoader } from "./intro-loader";
import { LuxuryBackground } from "./luxury-background";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { LazyMotion, domAnimation, m } from "framer-motion";

type AppShellProps = {
  children: React.ReactNode;
  locale: string;
};

export const AppShell = ({ children, locale }: AppShellProps) => {
  const [showIntro, setShowIntro] = useState(true);

  // Skip intro in development if it's annoying, but for this task we want it on.
  // We can use sessionStorage to only show it once per session.
  useEffect(() => {
    const played = sessionStorage.getItem("intro_played");
    if (played) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("intro_played", "true");
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative flex min-h-screen flex-col text-foreground selection:bg-latte selection:text-dark">
        <IntroLoader onComplete={handleIntroComplete} />

        <LuxuryBackground />

        <m.div
          initial={showIntro ? { opacity: 0 } : { opacity: 1 }}
          animate={!showIntro ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative flex flex-1 flex-col"
        >
          <Header locale={locale} introFinished={!showIntro} />
          <main className="flex-1">{children}</main>
          <Footer />
          <BottomNav />
        </m.div>
      </div>
    </LazyMotion>
  );
};
