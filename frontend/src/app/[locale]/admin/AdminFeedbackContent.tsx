"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/feedback/rating-stars";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { useAuth } from "@/context/auth-context";

type AdminFeedbackItem = {
  _id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  user: { name: string; email: string } | null;
  createdAt: string;
};

export const AdminFeedbackContent = () => {
  const t = useTranslations("admin.feedback");
  const { user, status } = useAuth();
  const [filter, setFilter] = useState<"pending" | "approved">("pending");
  const [items, setItems] = useState<AdminFeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);

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
      const response = await apiFetch<{ data: AdminFeedbackItem[] }>(
        `/api/admin/feedback?status=${filter}`,
        { silent: true }
      );
      if (response?.data) {
        setItems(response.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      // Network errors are handled by silent mode, but log unexpected errors
      if (error instanceof Error && error.name !== "NetworkError") {
        console.error("Failed to fetch feedback:", error);
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filter, isAuthenticatedAdmin]);

  useEffect(() => {
    // Only fetch when we're certain user is authenticated admin
    if (isAuthenticatedAdmin) {
      void fetchData();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [fetchData, isAuthenticatedAdmin]);

  const handleAction = async (id: string, approved: boolean) => {
    await apiFetch(`/api/admin/feedback/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    });
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }
    try {
      await apiFetch(`/api/admin/feedback/${id}`, {
        method: "DELETE",
      });
      await fetchData();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert(t("deleteError"));
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
        <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24 lg:px-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[#6B4F3A] font-medium">Admin</p>
            <h1 className="text-3xl font-bold text-[#3A2A1F] tracking-tight">{t("title")}</h1>
          </div>
          <AdminNav />
          <div className="mt-4 flex justify-end">
            <div className="flex gap-2 rounded-full border border-[#a46a47]/20 bg-white/60 p-1 shadow-sm">
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === "pending" ? "bg-[#3A2A1F] text-white" : "text-[#5A4638] hover:text-[#3A2A1F]"
                }`}
                onClick={() => setFilter("pending")}
              >
                {t("pending")}
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === "approved" ? "bg-[#3A2A1F] text-white" : "text-[#5A4638] hover:text-[#3A2A1F]"
                }`}
                onClick={() => setFilter("approved")}
              >
                {t("approved")}
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {loading && (
              <p className="text-sm text-[#6B4F3A]">Loading...</p>
            )}
            {!loading && items.length === 0 && (
              <p className="text-sm text-[#6B4F3A]">No feedback found.</p>
            )}
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-[24px] border border-[#a46a47]/15 bg-[#FFF9F3] p-5 shadow-[0_8px_24px_rgba(164,106,71,0.12)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#3A2A1F]">{item.user?.name ?? "Unknown User"}</p>
                    <p className="text-xs text-[#5A4638]">{item.user?.email ?? "No email"}</p>
                  </div>
                  <span className="rounded-full border border-[#a46a47]/20 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#5A4638] font-medium">
                    {t("status")}: {item.isApproved ? t("approved") : t("pending")}
                  </span>
                </div>
                <RatingStars value={item.rating} className="mt-3" />
                <p className="mt-3 text-sm text-[#3A2A1F]/90">{item.comment}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {!item.isApproved && (
                    <Button
                      size="sm"
                      onClick={() => handleAction(item._id, true)}
                    >
                      {t("approve")}
                    </Button>
                  )}
                  {item.isApproved && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAction(item._id, false)}
                      >
                        {t("hide")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        {t("delete")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
};

