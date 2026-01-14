"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import type { FeedbackItem, RatingSummary } from "@/types/feedback";
import { RatingStars } from "@/components/feedback/rating-stars";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { FeedbackList } from "@/components/feedback/feedback-list";
import type { Locale } from "@/i18n/routing";

type FeedbackContentProps = {
  locale: Locale;
};

export const FeedbackContent = ({ locale }: FeedbackContentProps) => {
  const t = useTranslations("feedbackPage");
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summaryRes, feedbackRes] = await Promise.all([
        apiFetch<{ data: RatingSummary }>("/api/feedback/summary", { silent: true }),
        apiFetch<{ data: FeedbackItem[] }>("/api/feedback/public", { silent: true }),
      ]);
      if (summaryRes?.data) {
        setSummary(summaryRes.data);
      } else {
        setSummary(null);
      }
      if (feedbackRes?.data) {
        setFeedback(feedbackRes.data);
      } else {
        setFeedback([]);
      }
    } catch (error) {
      // Network errors are handled by silent mode, but log unexpected errors
      if (error instanceof Error && error.name !== "NetworkError") {
        console.error("Feedback fetch error:", error);
      }
      setSummary(null);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const avg = summary?.averageRating ?? 0;
  const count = summary?.countApproved ?? 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 text-[#3a1f16] sm:px-6 sm:py-16 lg:py-24 lg:px-8">
      <div className="space-y-4 text-[#3a1f16]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#c38c5a]">
          May Coffee
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="text-base leading-relaxed text-[#6f4633] sm:text-lg">{t("subtitle")}</p>
      </div>

      <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-[#f4d4b6] bg-white/95 p-5 text-[#3a1f16] shadow-[0_25px_60px_rgba(244,202,167,0.35)] sm:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#c38c5a]">
              {t("ratingTitle")}
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              <div>
                <p className="text-4xl font-semibold text-[#b45a30] sm:text-5xl">{avg.toFixed(1)}</p>
                <p className="text-sm leading-relaxed text-[#6f4633]">{t("ratingSubtitle")}</p>
              </div>
              <div className="flex flex-col">
                <RatingStars value={avg} />
                <p className="text-xs leading-relaxed text-[#a46a47]">{count} feedback</p>
              </div>
            </div>
          </div>

          <FeedbackForm onSubmitted={fetchData} />
        </div>

        <FeedbackList
          items={feedback}
          locale={locale}
          title={t("list.title")}
          emptyLabel={t("list.empty")}
          note={t("list.note")}
        />
      </div>

      {loading && (
        <p className="mt-4 text-sm text-[#a46a47]">{t("list.note")}...</p>
      )}
    </section>
  );
};

