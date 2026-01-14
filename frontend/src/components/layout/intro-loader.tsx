"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type IntroLoaderProps = {
    onComplete: () => void;
};

export const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
    const [phase, setPhase] = useState<"logo" | "pattern" | "reveal" | "complete">("logo");
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        // Optimized sequence timing for Chrome performance
        const logoTimer = setTimeout(() => setPhase("pattern"), 1600);
        const revealTimer = setTimeout(() => setPhase("reveal"), 2800);
        const completeTimer = setTimeout(() => {
            setPhase("complete");
            onComplete();
        }, 4000);

        return () => {
            clearTimeout(logoTimer);
            clearTimeout(revealTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== "complete" && (
                <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
                    {/* Logo & Pattern Area (Stays until revealed) */}
                    <motion.div
                        animate={phase === "reveal" ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-[102] flex items-center justify-center pointer-events-auto"
                    >
                        {/* Moving Patterns from Sides */}
                        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-12 pointer-events-none overflow-hidden">
                            {/* Left Pattern */}
                            <motion.div
                                initial={{ x: -100, opacity: 0, rotate: -10 }}
                                animate={phase === "pattern" ? { x: 0, opacity: 0.7, rotate: 0 } : phase === "reveal" ? { x: -250, opacity: 0 } : { x: -100, opacity: 0 }}
                                transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                                className="relative h-64 w-64 md:h-[500px] md:w-[500px]"
                            >
                                <motion.div
                                    animate={phase === "pattern" && !shouldReduceMotion ? {
                                        y: [0, -8, 0],
                                    } : {}}
                                    transition={{ duration: 7, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
                                    style={{
                                        willChange: "transform",
                                        transform: "translateZ(0)"
                                    }}
                                    className="w-full h-full"
                                >
                                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#502B0F]">
                                        <path d="M0 100C40 100 60 80 60 40C60 0 100 0 100 0" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                                        <circle cx="20" cy="180" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
                                        <path d="M0 200L200 0" stroke="currentColor" strokeWidth="0.5" />
                                        <circle cx="100" cy="100" r="3" fill="currentColor" />
                                    </svg>
                                </motion.div>
                            </motion.div>

                            {/* Right Pattern */}
                            <motion.div
                                initial={{ x: 100, opacity: 0, rotate: 10 }}
                                animate={phase === "pattern" ? { x: 0, opacity: 0.7, rotate: 0 } : phase === "reveal" ? { x: 250, opacity: 0 } : { x: 100, opacity: 0 }}
                                transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                                className="relative h-64 w-64 md:h-[500px] md:w-[500px]"
                            >
                                <motion.div
                                    animate={phase === "pattern" && !shouldReduceMotion ? {
                                        y: [0, 8, 0],
                                    } : {}}
                                    transition={{ duration: 8, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
                                    style={{
                                        willChange: "transform",
                                        transform: "translateZ(0)"
                                    }}
                                    className="w-full h-full"
                                >
                                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#502B0F] scale-x-[-1]">
                                        <path d="M0 100C40 100 60 80 60 40C60 0 100 0 100 0" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                                        <circle cx="20" cy="180" r="120" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
                                        <path d="M0 200L200 0" stroke="currentColor" strokeWidth="0.5" />
                                        <circle cx="100" cy="100" r="3" fill="currentColor" />
                                    </svg>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Animated Background Pattern - Deepened (Legacy) */}
                        <AnimatePresence>
                            {phase === "pattern" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.12 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0"
                                >
                                    <motion.div
                                        animate={!shouldReduceMotion ? {
                                            x: [0, -20, 0],
                                            y: [0, 10, 0]
                                        } : {}}
                                        transition={{
                                            duration: 25,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        style={{
                                            willChange: "transform",
                                            transform: "translateZ(0)"
                                        }}
                                        className="h-[200%] w-[200%] bg-menu-pattern rotate-12"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#502B0F]/5 via-transparent to-[#B7966B]/5" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative flex flex-col items-center">
                            {/* Layered Ambient Glows - Disabled on mobile for performance */}
                            {!shouldReduceMotion && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: [0.12, 0.24, 0.12]
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: [0.22, 1, 0.36, 1]
                                        }}
                                        style={{
                                            willChange: "opacity",
                                            transform: "translateZ(0)",
                                            backfaceVisibility: "hidden"
                                        }}
                                        className="absolute h-[300px] w-[300px] rounded-full bg-[#B7966B]/18 blur-[70px]"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: [0.08, 0.16, 0.08]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: [0.22, 1, 0.36, 1],
                                            delay: 0.3
                                        }}
                                        style={{
                                            willChange: "opacity",
                                            transform: "translateZ(0)",
                                            backfaceVisibility: "hidden"
                                        }}
                                        className="absolute h-[250px] w-[250px] rounded-full bg-[#D9C19D]/22 blur-[50px]"
                                    />
                                </>
                            )}

                            {/* Logo Assembly - Removed expensive drop-shadow animation */}
                            <motion.div
                                layoutId="main-logo"
                                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{
                                    duration: 1.8,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: 0.3
                                }}
                                className="relative z-10 flex flex-col items-center"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="May Coffee"
                                    width={280}
                                    height={280}
                                    className="h-auto w-44 sm:w-60 md:w-72 object-contain brightness-110 drop-shadow-xl"
                                    priority
                                />

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="mt-6 text-center"
                                >
                                    <span className="block text-sm font-bold uppercase tracking-[0.5em] text-[#502B0F] sm:text-base">
                                        May Coffee
                                    </span>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                    {/* Left Panel */}
                    <motion.div
                        initial={{ x: 0 }}
                        animate={phase === "reveal" ? { x: "-100%" } : { x: 0 }}
                        transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                        className="absolute inset-y-0 left-0 z-[101] w-1/2 bg-[#FBEED7] border-r border-[#D9C19D]/30"
                    />

                    {/* Right Panel */}
                    <motion.div
                        initial={{ x: 0 }}
                        animate={phase === "reveal" ? { x: "100%" } : { x: 0 }}
                        transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                        className="absolute inset-y-0 right-0 z-[101] w-1/2 bg-[#FBEED7] border-l border-[#D9C19D]/30"
                    />

                </div>
            )}
        </AnimatePresence>
    );
};
