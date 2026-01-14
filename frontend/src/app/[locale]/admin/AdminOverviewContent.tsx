"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import type { RatingSummary } from "@/types/feedback";
import { RatingStars } from "@/components/feedback/rating-stars";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminNav } from "@/components/admin/admin-nav";

type AdminFeedback = {
  _id: string;
  rating: number;
  comment: string;
  user: { name: string; email: string } | null;
  createdAt: string;
};

type AdminOverviewContentProps = {
  locale: string;
};

export const AdminOverviewContent = ({ locale }: AdminOverviewContentProps) => {
  const t = useTranslations("admin");
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [pending, setPending] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, status } = useAuth();

  // Don't render content or make API calls until auth is confirmed
  const isAuthenticatedAdmin = useMemo(
    () => status === "idle" && user && user.role === "admin",
    [status, user]
  );

  const fetchData = useCallback(async () => {
    // Double check authentication before making request
    if (!isAuthenticatedAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [summaryRes, pendingRes] = await Promise.all([
        apiFetch<{ data: RatingSummary }>("/api/admin/ratings/summary", { silent: true }),
        apiFetch<{ data: AdminFeedback[] }>("/api/admin/feedback?status=pending", { silent: true }),
      ]);
      if (summaryRes?.data) {
        setSummary(summaryRes.data);
      } else {
        setSummary(null);
      }
      if (pendingRes?.data) {
        setPending(pendingRes.data);
      } else {
        setPending([]);
      }
    } catch (error) {
      // Network errors are handled by silent mode, but log unexpected errors
      if (error instanceof Error && error.name !== "NetworkError") {
        console.error("Failed to fetch admin data:", error);
      }
      setSummary(null);
      setPending([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticatedAdmin]);

  useEffect(() => {
    // Only fetch when we're certain user is authenticated admin
    if (isAuthenticatedAdmin) {
      void fetchData();
    } else {
      setSummary(null);
      setPending([]);
      setLoading(false);
    }
  }, [fetchData, isAuthenticatedAdmin]);

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      if (approved) {
        // Approve: update status
        await apiFetch(`/api/admin/feedback/${id}/approve`, {
          method: "PATCH",
          body: JSON.stringify({ approved }),
        });
        // Remove from pending list since it's now approved
        setPending((prev) => prev.filter((item) => item._id !== id));
      } else {
        // Hide: permanently delete the feedback
        await apiFetch(`/api/admin/feedback/${id}`, {
          method: "DELETE",
        });
        // Remove from pending list immediately
        setPending((prev) => prev.filter((item) => item._id !== id));
      }
      // Refresh data to ensure consistency
      await fetchData();
    } catch (error) {
      // If API call fails, refresh to restore correct state
      console.error("Error updating feedback:", error);
      await fetchData();
    }
  };

  // Show loading state while auth is being verified
  if (status === "loading") {
    return (
      <AuthGuard requireAdmin>
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-[#6B4F3A]">Loading...</p>
        </div>
      </AuthGuard>
    );
  }

  // Don't render anything if not authenticated admin
  if (!isAuthenticatedAdmin) {
    return null;
  }

  return (
    <AuthGuard requireAdmin>
      <div className="bg-gradient-to-b from-[#FFF7ED] via-[#FAF0E6] to-[#FFF7ED]">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:px-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[#6B4F3A] font-medium">
              May Coffee • Admin
            </p>
            <h1 className="text-3xl font-bold text-[#3A2A1F] tracking-tight sm:text-4xl">{t("overview.title")}</h1>
            <p className="text-base leading-relaxed text-[#5A4638] font-normal sm:text-lg">
              {user?.name} · {user?.email}
            </p>
          </div>
          <AdminNav />

          <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-2">
            <div className="rounded-[32px] border border-[#a46a47]/15 bg-[#FFF9F3] p-5 shadow-[0_8px_24px_rgba(164,106,71,0.12)] sm:p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[#6B4F3A] font-medium">
                {t("feedback.title")}
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                <div>
                  <p className="text-4xl font-bold text-[#3A2A1F] sm:text-5xl">
                    {summary ? summary.averageRating.toFixed(1) : "--"}
                  </p>
                  <p className="text-sm leading-relaxed text-[#6B4F3A] font-normal mt-1">
                    {summary?.countApproved ?? 0} feedback
                  </p>
                </div>
                <RatingStars value={summary?.averageRating ?? 0} />
              </div>
            </div>

            <div className="rounded-[32px] border border-[#a46a47]/15 bg-[#FFF9F3] p-5 shadow-[0_8px_24px_rgba(164,106,71,0.12)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#6B4F3A] font-medium">
                    {t("overview.pendingTitle")}
                  </p>
                  <p className="text-xs text-[#5A4638] font-medium mt-1">{pending.length}</p>
                </div>
                <Button asChild variant="secondary" size="md" className="w-full sm:w-auto">
                  <Link href="/admin/feedback">{t("overview.cta")}</Link>
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {pending.length === 0 && (
                  <p className="text-sm leading-relaxed text-[#6B4F3A]">{t("overview.empty")}</p>
                )}
                {pending.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-[#a46a47]/12 bg-white/60 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#3A2A1F]">{item.user?.name ?? "Unknown User"}</p>
                        <p className="text-xs leading-relaxed text-[#5A4638]">{item.user?.email ?? "No email"}</p>
                      </div>
                      <RatingStars value={item.rating} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#3A2A1F]/90 line-clamp-2">
                      {item.comment}
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
                      <Button
                        size="md"
                        onClick={() => handleApprove(item._id, true)}
                        className="w-full sm:w-auto"
                      >
                        {t("feedback.approve")}
                      </Button>
                      <Button
                        size="md"
                        variant="ghost"
                        onClick={() => handleApprove(item._id, false)}
                        className="w-full sm:w-auto"
                      >
                        {t("feedback.hide")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <p className="mt-6 text-sm text-[#6B4F3A]">Loading admin data...</p>
          )}
        </section>
      </div>
    </AuthGuard>
  );
};

