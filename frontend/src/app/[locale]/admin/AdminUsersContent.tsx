"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/form-message";
import { FeedbackList } from "@/components/feedback/feedback-list";
import type { FeedbackItem } from "@/types/feedback";
import { useAuth } from "@/context/auth-context";
import { AdminNav } from "@/components/admin/admin-nav";

const addAdminSchema = z.object({
  email: z.string().email(),
});

export const AdminUsersContent = ({ locale }: { locale: string }) => {
  const t = useTranslations("admin.users");
  const tMessages = useTranslations("admin.messages");
  const { user: currentUser, status: authStatus } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<FeedbackItem[] | null>(null);
  const [historyUser, setHistoryUser] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Don't render content or make API calls until auth is confirmed
  const isAuthenticatedAdmin = useMemo(
    () => authStatus === "idle" && currentUser && currentUser.role === "admin",
    [authStatus, currentUser]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof addAdminSchema>>({
    resolver: zodResolver(addAdminSchema),
  });

  const fetchUsers = useCallback(async () => {
    // Double check authentication before making request
    if (!isAuthenticatedAdmin) {
      return;
    }

    try {
      const response = await apiFetch<{ data: User[] }>("/api/admin/users");
      setUsers(response.data);
    } catch (error) {
      // Silently handle errors - AuthGuard will redirect if needed
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  }, [isAuthenticatedAdmin]);

  useEffect(() => {
    // Only fetch when we're certain user is authenticated admin
    if (isAuthenticatedAdmin) {
      void fetchUsers();
    } else {
      setUsers([]);
    }
  }, [fetchUsers, isAuthenticatedAdmin]);

  const onPromote = async (data: z.infer<typeof addAdminSchema>) => {
    setStatus(null);
    try {
      const response = await apiFetch<{ message: string; invited?: boolean; email?: string }>("/api/admin/add-admin", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setStatus({ 
        type: "success", 
        message: response.message || tMessages("success") 
      });
      reset();
      // Only refresh users list if user was promoted (not invited)
      if (!response.invited) {
        await fetchUsers();
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : tMessages("error"),
      });
    }
  };

  const loadHistory = async (userId: string) => {
    const response = await apiFetch<{ data: FeedbackItem[] }>(
      `/api/admin/users/${userId}/feedback-history`,
    );
    setHistoryUser(userId);
    setSelectedHistory(response.data);
  };

  const deleteUser = async (userId: string) => {
    const reason = prompt(t("reasonPrompt"), t("reasonPlaceholder"));
    if (!reason) return;
    await apiFetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      body: JSON.stringify({ reason }),
    });
    await fetchUsers();
  };

  const promoteUser = async (email: string) => {
    await onPromote({ email });
  };

  const revokeAdmin = async (userId: string) => {
    if (!confirm(t("revokeConfirm"))) return;
    setStatus(null);
    try {
      await apiFetch(`/api/admin/revoke-admin/${userId}`, {
        method: "POST",
      });
      setStatus({ type: "success", message: tMessages("success") });
      await fetchUsers();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : tMessages("error"),
      });
    }
  };

  // Show loading state while auth is being verified
  if (authStatus === "loading") {
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

          <form
            onSubmit={handleSubmit(onPromote)}
            className="mt-6 space-y-3 rounded-[28px] border border-[#a46a47]/15 bg-[#FFF9F3] p-5 shadow-[0_8px_24px_rgba(164,106,71,0.12)]"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-[#6B4F3A] font-medium">
              {t("addAdminTitle")}
            </p>
            <Input
              placeholder={t("addAdminPlaceholder")}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-rose-600">{errors.email.message}</p>
            )}
            {status && <FormMessage type={status.type} message={status.message} />}
            <Button type="submit" disabled={isSubmitting}>
              {t("addAdminButton")}
            </Button>
          </form>

          <div className="mt-8 grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-[28px] border border-[#a46a47]/15 bg-[#FFF9F3] p-5 shadow-[0_8px_24px_rgba(164,106,71,0.12)]"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-[#3A2A1F]">{user.name}</p>
                    <p className="text-sm text-[#5A4638]">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs uppercase">
                    <span className="rounded-full border border-[#a46a47]/20 bg-white/80 px-3 py-1 text-[#5A4638] font-medium">
                      {user.role === "admin" ? t("roleAdmin") : t("roleUser")}
                    </span>
                    <span className="rounded-full border border-[#a46a47]/20 bg-white/80 px-3 py-1 text-[#5A4638] font-medium">
                      {user.isEmailVerified ? t("verified") : t("notVerified")}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => loadHistory(user.id)}
                  >
                    {t("historyButton")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    {t("deleteButton")}
                  </Button>
                  {user.role !== "admin" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => promoteUser(user.email)}
                    >
                      {t("grantAdminButton")}
                    </Button>
                  ) : (
                    currentUser?.id !== user.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => revokeAdmin(user.id)}
                      >
                        {t("revokeAdminButton")}
                      </Button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedHistory && (
            <div className="mt-8">
              <FeedbackList
                items={selectedHistory}
                locale={locale as "vi" | "en"}
                title={`${t("historyButton")} — ${
                  users.find((u) => u.id === historyUser)?.name ?? ""
                }`}
                emptyLabel={t("historyEmpty")}
                note=""
              />
            </div>
          )}
        </section>
      </div>
    </AuthGuard>
  );
};

