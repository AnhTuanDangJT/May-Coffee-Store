"use client";

import React, { type ComponentProps } from "react";
import { useState, memo, useCallback, useMemo } from "react";
import { Logo } from "./logo";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/auth-context";
import { Menu, X } from "lucide-react";
import { m } from "framer-motion";
import { useHydrated } from "@/hooks/use-hydrated";

type NavHref = ComponentProps<typeof Link>["href"];

type HeaderProps = {
  locale: string;
  introFinished?: boolean;
};

const HeaderComponent = ({ locale, introFinished = true }: HeaderProps): React.JSX.Element => {
  const t = useTranslations();
  const { user, logout } = useAuth();
  const router = useRouter();
  const isHydrated = useHydrated();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  }, [logout, router]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const navItems = useMemo<Array<{ key: string; href: NavHref }>>(() => [
    { key: "nav.home", href: "/" },
    { key: "nav.menu", href: "/menu" },
    { key: "nav.events", href: "/events" },
    { key: "nav.feedback", href: "/feedback" },
  ], []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-beige bg-cream/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-dark sm:px-6 lg:px-8">
        <Logo locale={locale} layoutId={introFinished ? "main-logo" : undefined} />

        {/* Desktop Navigation */}
        <m.nav
          initial={isHydrated && introFinished ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
          animate={isHydrated && introFinished ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          layout={false}
          style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
          className="hidden items-center gap-6 text-sm font-bold text-coffee md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="transition-colors hover:text-latte"
            >
              {t(item.key)}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-full border border-latte/30 bg-latte/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-espresso font-bold transition hover:bg-latte/20"
            >
              {t("nav.admin")}
            </Link>
          )}
        </m.nav>

        {/* Desktop Actions */}
        <m.div
          initial={isHydrated && introFinished ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
          animate={isHydrated && introFinished ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          layout={false}
          style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
          className="hidden items-center gap-3 md:flex"
        >

          {user ? (
            <div className="flex items-center gap-3">
              {user.isEmailVerified ? (
                <span className="text-xs uppercase tracking-[0.3em] text-[#a46a47]">
                  {user.name}
                </span>
              ) : (
                <Link
                  href="/auth/verify"
                  className="text-xs uppercase tracking-[0.3em] text-caramel transition hover:text-espresso"
                >
                  {user.name}
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void handleLogout()}
                className="text-xs text-caramel transition hover:text-espresso"
              >
                {t("common.cta.logout")}
              </Button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-caramel transition hover:text-espresso"
              >
                {t("common.cta.login")}
              </Link>
              <Button asChild variant="secondary" size="sm">
                <Link href="/auth/register">{t("common.cta.signup")}</Link>
              </Button>
            </>
          )}
        </m.div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-beige bg-cream text-espresso transition hover:bg-beige focus:outline-none focus:ring-2 focus:ring-latte/30 md:hidden"
        >
          {isMobileMenuOpen ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          {/* Menu Panel */}
          <div className="fixed inset-x-0 top-[57px] z-30 max-h-[calc(100vh-57px)] overflow-y-auto border-b border-beige bg-cream/95 md:hidden">
            <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
              {/* Navigation Links */}
              <div className="space-y-1 border-b border-[#f4d3b0] pb-4">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex h-12 items-center text-base font-semibold text-espresso transition-colors hover:bg-beige/40 hover:text-dark active:bg-beige/60"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex h-12 items-center rounded-full border border-espresso/25 bg-beige/40 px-4 text-xs uppercase tracking-[0.2em] text-dark font-semibold transition hover:bg-beige/60"
                  >
                    {t("nav.admin")}
                  </Link>
                )}
              </div>



              {/* User Actions */}
              <div className="pt-4">
                {user ? (
                  <div className="space-y-3">
                    {user.isEmailVerified ? (
                      <div className="flex h-12 items-center text-sm uppercase tracking-[0.3em] text-[#a46a47]">
                        {user.name}
                      </div>
                    ) : (
                      <Link
                        href="/auth/verify"
                        onClick={closeMobileMenu}
                        className="flex h-12 items-center text-sm uppercase tracking-[0.3em] text-caramel transition hover:text-espresso"
                      >
                        {user.name}
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => void handleLogout()}
                      className="h-12 w-full text-base text-caramel transition hover:text-espresso hover:bg-beige/40"
                    >
                      {t("common.cta.logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      onClick={closeMobileMenu}
                      className="flex h-12 items-center justify-center text-base font-semibold text-caramel transition hover:text-espresso"
                    >
                      {t("common.cta.login")}
                    </Link>
                    <Button
                      asChild
                      variant="secondary"
                      size="md"
                      className="h-12 w-full text-base"
                    >
                      <Link href="/auth/register" onClick={closeMobileMenu}>
                        {t("common.cta.signup")}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export const Header = memo(HeaderComponent);

