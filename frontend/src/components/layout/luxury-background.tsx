"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useHydrated } from "@/hooks/use-hydrated";
import { useEffect, useState, memo } from "react";

const LuxuryBackgroundComponent = () => {
    const shouldReduceMotion = useReducedMotion();
    const isHydrated = useHydrated();
    const [showAnimations, setShowAnimations] = useState(false);

    // Delay animations until after page idle
    useEffect(() => {
        if (!isHydrated || shouldReduceMotion) return;
        
        const idleTimer = setTimeout(() => {
            setShowAnimations(true);
        }, 1500);
        
        return () => clearTimeout(idleTimer);
    }, [isHydrated, shouldReduceMotion]);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#FBEED7]">
            {/* Layer 1: Base Radial Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#FDFCF5_0%,_transparent_70%)] opacity-40" />

            {/* Layer 2: Static Texture (No parallax - performance) */}
            <div className="absolute inset-0 opacity-[0.08] grayscale">
                <div className="h-full w-full bg-menu-pattern bg-[length:400px_400px]" />
            </div>

            {/* Layer 3: Ambient Light Spots - Delayed until idle */}
            {showAnimations && !shouldReduceMotion && (
                <>
                    <m.div
                        animate={{
                            x: ["-8%", "8%", "-4%"],
                            y: ["-4%", "4%", "0%"],
                            opacity: [0.12, 0.2, 0.12],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] rounded-full bg-[#B7966B] blur-[120px]"
                    />
                    <m.div
                        animate={{
                            x: ["8%", "-4%", "4%"],
                            y: ["4%", "-8%", "0%"],
                            opacity: [0.12, 0.22, 0.12],
                        }}
                        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[-10%] right-[-15%] w-[70%] h-[70%] rounded-full bg-[#D9C19D] blur-[120px]"
                    />
                </>
            )}

            {/* Layer 4: Static Organic Curves - Delayed animations */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.1]" xmlns="http://www.w3.org/2000/svg">
                {showAnimations && !shouldReduceMotion ? (
                    <>
                        <m.g
                            animate={{
                                y: [0, 30, 0],
                                x: [0, 15, 0]
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <path
                                d="M-100,200 C150,120 350,280 600,200 S950,120 1200,200 S1450,280 1700,200"
                                stroke="#502B0F"
                                strokeWidth="2"
                                fill="none"
                            />
                        </m.g>
                        <m.g
                            animate={{
                                y: [0, -25, 0],
                                x: [0, -12, 0]
                            }}
                            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                        >
                            <path
                                d="M-100,500 C200,420 400,580 700,500 S1100,420 1400,500 S1800,580 2100,500"
                                stroke="#724A24"
                                strokeWidth="1.5"
                                fill="none"
                            />
                        </m.g>
                    </>
                ) : (
                    <>
                        <path
                            d="M-100,200 C150,120 350,280 600,200 S950,120 1200,200 S1450,280 1700,200"
                            stroke="#502B0F"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M-100,500 C200,420 400,580 700,500 S1100,420 1400,500 S1800,580 2100,500"
                            stroke="#724A24"
                            strokeWidth="1.5"
                            fill="none"
                        />
                    </>
                )}
            </svg>

            {/* Breathing Global Glow - Delayed until idle */}
            {showAnimations && !shouldReduceMotion && (
                <m.div
                    animate={{ opacity: [0.04, 0.08, 0.04] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[#F4E6D4] pointer-events-none blur-[48px]"
                />
            )}

            {/* Corner Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#2B1606/3_100%)]" />
        </div>
    );
};

export const LuxuryBackground = memo(LuxuryBackgroundComponent);
