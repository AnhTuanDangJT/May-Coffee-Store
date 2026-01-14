"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

type AuthGuardProps = {
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export const AuthGuard = ({
  requireAdmin = false,
  fallback,
  children,
}: AuthGuardProps) => {
  const { user, status } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  const pathname = usePathname();
  
  useEffect(() => {
    if (status === "idle" && !user) {
      // Use next-intl router which handles locale automatically
      const nextPath = pathname || "/";
      router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [status, user, router, pathname]);

  if (status === "loading") {
    return (
      <div className="flex h-64 items-center justify-center text-white/70">
        {t("loading")}
      </div>
    );
  }

  if (!user) {
    return fallback ?? null;
  }

  if (requireAdmin && user.role !== "admin") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        {t("noPermission")}
      </div>
    );
  }

  return <>{children}</>;
};

