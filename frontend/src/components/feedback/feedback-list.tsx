'use client';

import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import type { FeedbackItem } from "@/types/feedback";
import { RatingStars } from "./rating-stars";

type FeedbackListProps = {
  items: FeedbackItem[];
  locale: "vi" | "en";
  title: string;
  emptyLabel: string;
  note: string;
};

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export const FeedbackList = ({
  items,
  locale,
  title,
  emptyLabel,
  note,
}: FeedbackListProps) => {
  const localeMap = locale === "vi" ? vi : enUS;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-coffee-medium/10 pb-4">
        <div>
          <h2 className="font-display text-2xl text-dark uppercase tracking-wide">{title}</h2>
          {note && <p className="text-[10px] uppercase tracking-[0.2em] text-latte font-bold">{note}</p>}
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-latte/10 text-xs font-bold text-latte">
          {items.length}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 rounded-[32px] border border-dashed border-beige">
          <p className="text-sm text-caramel opacity-50 italic">{emptyLabel}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-[32px] border border-beige bg-beige/10 p-6 shadow-lg backdrop-blur-md transition-all duration-300"
            >
              <div className="absolute top-4 right-6 opacity-10 text-latte group-hover:opacity-20 transition-opacity">
                <Quote size={40} fill="currentColor" />
              </div>

              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-latte to-caramel flex items-center justify-center text-cream font-bold shadow-md">
                    {item.user?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark">{item.user?.name}</p>
                    <p className="text-[10px] font-medium text-caramel opacity-50 uppercase tracking-widest">
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                        locale: localeMap,
                      })}
                    </p>
                  </div>
                </div>
                <RatingStars value={item.rating} />
              </div>

              <p className="text-sm leading-relaxed text-coffee opacity-80 italic">
                "{item.comment}"
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

