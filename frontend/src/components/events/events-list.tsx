"use client";

import { useEffect, useState, memo, useCallback, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { apiFetch } from "@/lib/api";
import type { Event } from "@/types/event";
import dayjs from "dayjs";
import { m } from "framer-motion";
import { Calendar, MapPin, Sparkle } from "lucide-react";
import { SectionReveal } from "@/components/animations/section-reveal";
import { useHydrated } from "@/hooks/use-hydrated";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EventsListComponent = () => {
  const t = useTranslations("events");
  const locale = useLocale() as "vi" | "en";
  const isHydrated = useHydrated();
  const shouldReduceMotion = useReducedMotion();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Move useMemo before any early returns to fix Rules of Hooks violation
  const eventVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  }), []);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await apiFetch<{ data: Event[] }>("/events/public");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  if (loading) {
    return (
      <div className="mt-12 flex justify-center py-20">
        {isHydrated && !shouldReduceMotion ? (
          <m.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            layout={false}
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className="w-8 h-8 border-4 border-accent-amber border-t-transparent rounded-full"
          />
        ) : (
          <div className="w-8 h-8 border-4 border-accent-amber border-t-transparent rounded-full" />
        )}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <SectionReveal className="mt-10 rounded-[40px] border border-beige bg-cream/30 p-12 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-latte/10 text-latte">
          <Calendar size={40} />
        </div>
        <h3 className="font-display text-2xl text-dark mb-2">{t("empty")}</h3>
        <p className="text-coffee opacity-60">
          {t("emptySubtitle")}
        </p>
      </SectionReveal>
    );
  }

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-1">
      {events.map((event, index) => (
        <SectionReveal key={event._id} delay={index * 0.08}>
          <m.div
            initial={isHydrated ? "hidden" : "visible"}
            whileInView={isHydrated ? "visible" : "visible"}
            viewport={{ once: true, margin: "-100px" }}
            variants={eventVariants}
            transition={{ delay: index * 0.08 }}
            whileHover={!shouldReduceMotion ? { y: -5 } : {}}
            layout={false}
            style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            className="group relative flex flex-col overflow-hidden rounded-[40px] border border-beige bg-beige/10 p-1 shadow-xl transition-all duration-500 hover:shadow-2xl"
          >
            <div className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
              {/* Event Icon/Date Blob */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[32px] bg-gradient-to-tr from-latte to-caramel text-cream shadow-lg sm:h-32 sm:w-32">
                {!shouldReduceMotion && (
                  <m.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    layout={false}
                    style={{ willChange: "transform", transform: "translateZ(0)" }}
                    className="absolute -top-2 -right-2 text-cream/40"
                  >
                    <Sparkle size={24} fill="currentColor" />
                  </m.div>
                )}
                {event.date ? (
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold">{dayjs(event.date).format("DD")}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest">{dayjs(event.date).format("MMM")}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Calendar size={32} className="mx-auto" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-latte/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-espresso">
                    {event.date ? t("eventLocation") : (locale === "vi" ? "Thông báo" : "Announcement")}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-dark sm:text-3xl group-hover:text-espresso transition-colors">{event.title}</h3>
                <p className="text-base leading-relaxed text-coffee opacity-70 line-clamp-2 md:line-clamp-none">
                  {event.description}
                </p>

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-6">
                  {event.date && (
                    <div className="flex items-center gap-2 text-sm font-medium text-caramel">
                      <Calendar size={16} className="text-latte" />
                      <span>{dayjs(event.date).format("HH:mm, dddd")}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm font-medium text-caramel">
                      <MapPin size={16} className="text-latte" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 pt-4 sm:pt-0">
                <m.button
                  whileHover={!shouldReduceMotion ? { scale: 1.05 } : {}}
                  whileTap={!shouldReduceMotion ? { scale: 0.95 } : {}}
                  layout={false}
                  style={{ willChange: "transform", transform: "translateZ(0)" }}
                  className="w-full rounded-2xl bg-beige/30 px-6 py-3 text-sm font-bold text-espresso shadow-sm hover:bg-beige/50 transition-colors sm:w-auto"
                >
                  {t("viewDetails")}
                </m.button>
              </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-accent-amber/10 to-transparent pointer-events-none" />
          </m.div>
        </SectionReveal>
      ))}
    </div>
  );
};

export const EventsList = memo(EventsListComponent);

