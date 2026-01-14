"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { apiFetch } from "@/lib/api";
import type { FeedbackItem } from "@/types/feedback";
import { RatingStars } from "@/components/feedback/rating-stars";

export const FeedbackPreview = () => {
  const t = useTranslations("feedback");
  const locale = useLocale() as "vi" | "en";
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const localeMap = locale === "vi" ? vi : enUS;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch<{ data: FeedbackItem[] }>("/feedback/public", {
          silent: true, // Prevent network errors from crashing
        });
        if (res?.data) {
          setFeedback(res.data);
        } else {
          // Network error or no data - set empty array
          setFeedback([]);
        }
      } catch (error) {
        // This should rarely happen with silent mode, but handle gracefully
        if (error instanceof Error && error.name !== "NetworkError") {
          console.error("Feedback fetch error:", error);
        }
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  return (
    <section id="feedback" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:px-8">
      <SectionReveal className="space-y-4 text-[#3a1f16]">
        <Badge tone="rose">{t("badge")}</Badge>
        <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">{t("title")}</h2>
        {t("subtitle") && (
          <p className="text-base leading-relaxed text-[#6f4633] sm:text-lg">{t("subtitle")}</p>
        )}
        <div className="rounded-3xl border border-[#f4d4b6] bg-white/90 p-5 text-[#4c2b1d] shadow-[0_15px_40px_rgba(244,202,167,0.35)] sm:p-6">
          <p className="text-base leading-relaxed">
            {t("ctaDescription")}
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/feedback">{t("ctaButton")}</Link>
            </Button>
          </div>
        </div>

        {!loading && feedback.length > 0 && (
          <div className="mt-6 space-y-4">
            {feedback.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-[#f4d4b6] bg-white/90 p-4 shadow-[0_8px_20px_rgba(244,202,167,0.2)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#3a1f16]">{item.user?.name}</p>
                  <p className="text-xs text-[#a46a47]">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                      locale: localeMap,
                    })}
                  </p>
                </div>
                <RatingStars value={item.rating} className="mt-2" />
                <p className="mt-2 text-sm leading-relaxed text-[#5f3724]">{item.comment}</p>
              </div>
            ))}
          </div>
        )}
      </SectionReveal>
    </section>
  );
};

