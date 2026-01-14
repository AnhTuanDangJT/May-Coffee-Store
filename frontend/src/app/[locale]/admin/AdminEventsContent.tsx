"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "@/lib/api";
import type { Event } from "@/types/event";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/form-message";
import { AdminNav } from "@/components/admin/admin-nav";

const eventSchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().min(10).max(2000),
  location: z.string().max(200).optional(),
  isPublished: z.boolean().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

export const AdminEventsContent = ({ locale }: { locale: string }) => {
  const t = useTranslations("admin.events");
  const tMessages = useTranslations("admin.messages");
  const { user, status: authStatus } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Don't render content or make API calls until auth is confirmed
  const isAuthenticatedAdmin = useMemo(
    () => authStatus === "idle" && user && user.role === "admin",
    [authStatus, user]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const fetchEvents = useCallback(async () => {
    // Double check authentication before making request
    if (!isAuthenticatedAdmin) {
      return;
    }

    try {
      const response = await apiFetch<{ data: Event[] }>("/api/admin/events", { silent: true });
      if (response?.data) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      // Network errors are handled by silent mode, but log unexpected errors
      if (error instanceof Error && error.name !== "NetworkError") {
        console.error("Failed to fetch events:", error);
      }
      setEvents([]);
    }
  }, [isAuthenticatedAdmin]);

  useEffect(() => {
    // Only fetch when we're certain user is authenticated admin
    if (isAuthenticatedAdmin) {
      void fetchEvents();
    } else {
      setEvents([]);
    }
  }, [fetchEvents, isAuthenticatedAdmin]);

  useEffect(() => {
    if (editingEvent) {
      setValue("title", editingEvent.title);
      setValue("description", editingEvent.description);
      setValue("location", editingEvent.location || "");
      setValue("isPublished", editingEvent.isPublished);
    } else {
      reset();
    }
  }, [editingEvent, setValue, reset]);

  const onSubmit = async (data: EventFormData) => {
    setStatus(null);
    try {
      if (editingEvent) {
        await apiFetch(`/api/admin/events/${editingEvent._id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        setStatus({ type: "success", message: tMessages("success") });
      } else {
        await apiFetch("/api/admin/events", {
          method: "POST",
          body: JSON.stringify(data),
        });
        setStatus({ type: "success", message: tMessages("success") });
      }
      reset();
      setEditingEvent(null);
      await fetchEvents();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : tMessages("error"),
      });
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await apiFetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      });
      await fetchEvents();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : tMessages("error"),
      });
    }
  };

  const handleTogglePublish = async (event: Event) => {
    try {
      await apiFetch(`/api/admin/events/${event._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !event.isPublished }),
      });
      await fetchEvents();
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
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4 rounded-[28px] border border-[#a46a47]/15 bg-[#FFF9F3] p-5 shadow-[0_8px_24px_rgba(164,106,71,0.12)]"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-[#6B4F3A] font-medium">
              {editingEvent ? t("editEvent") : t("createEvent")}
            </p>
            <Input
              placeholder={t("titlePlaceholder")}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-rose-600">{errors.title.message}</p>
            )}
            <textarea
              placeholder={t("descriptionPlaceholder")}
              {...register("description")}
              className="min-h-[100px] w-full rounded-lg border border-[#a46a47]/20 bg-white px-3 py-2 text-sm text-[#3A2A1F] placeholder:text-[#8B6F5A] focus:border-[#a46a47]/40 focus:outline-none"
            />
            {errors.description && (
              <p className="text-sm text-rose-600">{errors.description.message}</p>
            )}
            <Input
              placeholder={t("locationPlaceholder")}
              {...register("location")}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                {...register("isPublished")}
                className="h-4 w-4 rounded border-[#a46a47]/20 text-[#a46a47] focus:ring-[#a46a47]"
              />
              <label htmlFor="isPublished" className="text-sm text-[#5A4638]">
                {t("publishLabel")}
              </label>
            </div>
            {status && <FormMessage type={status.type} message={status.message} />}
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {editingEvent ? t("updateButton") : t("createButton")}
              </Button>
              {editingEvent && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingEvent(null);
                    reset();
                  }}
                >
                  {t("cancelButton")}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-8 grid gap-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="rounded-[28px] border border-[#a46a47]/15 bg-[#FFF9F3] p-5 shadow-[0_8px_24px_rgba(164,106,71,0.12)]"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#3A2A1F]">{event.title}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          event.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.isPublished ? t("published") : t("draft")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#5A4638]">{event.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#6B4F3A]">
                      <span>{locale === "vi" ? "Thông báo" : "Announcement"}</span>
                      {event.location && <span>• {event.location}</span>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingEvent(event)}
                  >
                    {t("editButton")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(event)}
                  >
                    {event.isPublished ? t("unpublishButton") : t("publishButton")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(event._id)}
                  >
                    {t("deleteButton")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
};

