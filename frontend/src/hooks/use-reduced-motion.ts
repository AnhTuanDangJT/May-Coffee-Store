"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if animations should be reduced for performance or accessibility.
 * Returns true if:
 * - User prefers reduced motion (accessibility)
 * - Device is mobile (performance optimization)
 */
export function useReducedMotion() {
    const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

    useEffect(() => {
        // Check for user's motion preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        // Check if mobile device (viewport width < 768px)
        const isMobile = window.innerWidth < 768;

        const updateMotionPreference = () => {
            setShouldReduceMotion(mediaQuery.matches || isMobile);
        };

        updateMotionPreference();

        // Listen for changes
        mediaQuery.addEventListener("change", updateMotionPreference);
        window.addEventListener("resize", updateMotionPreference);

        return () => {
            mediaQuery.removeEventListener("change", updateMotionPreference);
            window.removeEventListener("resize", updateMotionPreference);
        };
    }, []);

    return shouldReduceMotion;
}
