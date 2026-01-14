"use client";

import { useEffect } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

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
  const router = useNextRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  const pathname = usePathname();
  
  useEffect(() => {
    if (status === "idle" && !user) {
      const nextPath = pathname || "/";
      router.push(`/${locale}/auth/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [status, user, router, pathname, locale]);

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

