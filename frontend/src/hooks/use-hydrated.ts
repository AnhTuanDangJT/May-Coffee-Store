"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if the component has hydrated (mounted on client)
 * Use this to disable animations during SSR/initial hydration
 */
export function useHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}




