"use client";

import { useEffect, useState, useCallback } from "react";
import type { ComponentProps } from "react";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarHeart, Calendar, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { apiFetch } from "@/lib/api";
import type { Event } from "@/types/event";
import dayjs from "dayjs";

type LinkHref = ComponentProps<typeof Link>["href"];

type EventsPreviewProps = {
  ctaHref?: LinkHref;
  showCta?: boolean;
};

export const EventsPreview = ({ ctaHref = "/events", showCta = true }: EventsPreviewProps = {}) => {
  const t = useTranslations("events");
  const locale = useLocale() as "vi" | "en";
  const [latestEvent, setLatestEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestEvent = useCallback(async () => {
    try {
      const response = await apiFetch<{ data: Event[] }>("/events/public", { silent: true });
      if (response?.data && response.data.length > 0) {
        // Get the most recent event (first in the sorted list)
        setLatestEvent(response.data[0]);
      }
    } catch (error) {
      // Silently fail - just don't show event
      console.error("Failed to fetch latest event:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLatestEvent();
  }, [fetchLatestEvent]);

  return (
    <section id="events" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24 lg:px-8">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-2">
        <SectionReveal className="space-y-4 text-[#3a1f16]">
          <Badge tone="emerald">{t("badge")}</Badge>
          <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">{t("title")}</h2>
          <p className="text-base leading-relaxed text-[#6f4633] sm:text-lg">{t("subtitle")}</p>
          <ul className="space-y-3 text-sm leading-relaxed text-[#5f3724]">
            {t.raw("highlights").map((item: string) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4a261]" />
                {item}
              </li>
            ))}
          </ul>
          {showCta && (
            <Link href={ctaHref}>
              <Button className="mt-4" icon={<CalendarHeart size={18} />}>
                {t("cta")}
              </Button>
            </Link>
          )}
        </SectionReveal>
        <SectionReveal delay={0.15}>
          {loading ? (
            <div className="rounded-[32px] border border-[#f4d4b6] bg-gradient-to-br from-[#fffaf4] to-[#ffe0c8] p-6 text-[#3a1f16] shadow-[0_30px_90px_rgba(244,202,167,0.4)] sm:p-8">
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#c38c5a] border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : latestEvent ? (
            <div className="rounded-[32px] border border-[#f4d4b6] bg-gradient-to-br from-[#fffaf4] to-[#ffe0c8] p-6 text-[#3a1f16] shadow-[0_30px_90px_rgba(244,202,167,0.4)] sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-[#c38c5a]">
                {locale === "vi" ? "Thông báo mới nhất" : "Latest Announcement"}
              </p>
              <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">{latestEvent.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-[#6f4633] line-clamp-3">
                {latestEvent.description}
              </p>
              <div className="mt-6 rounded-2xl border border-[#f4d4b6] bg-white/80 p-4 text-sm leading-relaxed text-[#5f3724] space-y-2">
                {latestEvent.date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#c38c5a]" />
                    <span>{dayjs(latestEvent.date).format("DD/MM/YYYY • HH:mm")}</span>
                  </div>
                )}
                {latestEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#c38c5a]" />
                    <span>{latestEvent.location}</span>
                  </div>
                )}
                {!latestEvent.date && !latestEvent.location && (
                  <span className="text-[#6f4633]">
                    {locale === "vi" ? "Thông báo" : "Announcement"}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-[32px] border border-[#f4d4b6] bg-gradient-to-br from-[#fffaf4] to-[#ffe0c8] p-6 text-[#3a1f16] shadow-[0_30px_90px_rgba(244,202,167,0.4)] sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-[#c38c5a]">
                {t("nextEvent.label")}
              </p>
              <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">{t("nextEvent.title")}</h3>
              <p className="mt-2 text-base leading-relaxed text-[#6f4633]">{t("nextEvent.description")}</p>
              <div className="mt-6 rounded-2xl border border-[#f4d4b6] bg-white/80 p-4 text-sm leading-relaxed text-[#5f3724]">
                {t("nextEvent.schedule")}
              </div>
            </div>
          )}
        </SectionReveal>
      </div>
    </section>
  );
};

