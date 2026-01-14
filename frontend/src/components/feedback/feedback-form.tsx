"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./rating-stars";
import { FormMessage } from "@/components/forms/form-message";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

const schema = z.object({
  comment: z.string().min(10).max(500),
});

type FormValues = z.infer<typeof schema>;

type FeedbackFormProps = {
  onSubmitted?: () => void;
};

import { AnimatePresence, motion } from "framer-motion";
import { Star, Quote, CheckCircle2, Heart, Sparkles } from "lucide-react";

export const FeedbackForm = ({ onSubmitted }: FeedbackFormProps) => {
  const t = useTranslations("feedbackPage.form");
  const tErrors = useTranslations("auth.errors");
  const { user, status: authStatus } = useAuth();
  const [rating, setRating] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      setStatus({
        type: "error",
        message: t("loginRequired"),
      });
      return;
    }
    setStatus(null);
    try {
      await apiFetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({ rating, comment: values.comment }),
      });
      setIsSuccess(true);
      reset();
      setRating(5);
      onSubmitted?.();

      // Reset success state after a few seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 0 || error.name === "NetworkError") {
          setStatus({
            type: "error",
            message: t("networkError"),
          });
          return;
        }
        if (error.status === 429) {
          setStatus({ type: "error", message: t("limit") });
          return;
        }
        if (error.status === 401) {
          setStatus({
            type: "error",
            message: t("loginRequiredError"),
          });
          return;
        }
      }
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : tErrors("generic"),
      });
    }
  };

  if (authStatus === "loading") {
    return (
      <div className="rounded-[32px] border border-white/50 bg-white/40 p-10 text-center backdrop-blur-md">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="mx-auto w-6 h-6 border-2 border-accent-amber border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-[32px] border border-white/50 bg-white/40 p-10 text-center backdrop-blur-md">
        <p className="text-coffee-medium opacity-70">{t("loginRequired")}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/50 bg-white/30 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center rounded-[32px] bg-latte/10 border border-latte/20">
              <div className="h-16 w-16 rounded-full bg-latte/20 flex items-center justify-center text-latte mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="font-display text-xl text-dark mb-2">{t("successTitle")}</h3>
              <p className="text-sm text-caramel">
                {t("successMessage")}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="mb-6">
              <h2 className="font-display text-2xl text-dark uppercase tracking-wide">{t("title")}</h2>
              <p className="text-sm text-caramel opacity-80 mt-1">{t("description")}</p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-caramel mb-2 block">
                {t("ratingLabel")}
              </label>
              <RatingStars
                value={rating}
                interactive
                onSelect={(val) => setRating(val)}
                className="mt-2 justify-center"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-3 left-6 flex items-center gap-1 bg-white px-2 text-[10px] font-bold uppercase tracking-widest text-caramel">
                {t("commentLabel")}
              </label>
              <textarea
                {...register("comment")}
                placeholder={t("placeholder")}
                className="min-h-[160px] w-full rounded-[30px] border border-beige/60 bg-beige/50 px-6 py-6 text-base text-dark placeholder:text-caramel/40 shadow-inner focus:border-caramel focus:outline-none transition-all"
              />
              {errors.comment && (
                <p className="mt-2 ml-4 text-xs font-bold text-accent-rose uppercase tracking-wider">{errors.comment.message}</p>
              )}
            </div>

            {status && <FormMessage type={status.type} message={status.message} />}

            <div className="flex justify-center">
              <Button
                type="submit"
                size="xl"
                className="min-w-[200px] shadow-xl shadow-accent-amber/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-coffee-dark border-t-transparent rounded-full" />
                ) : (
                  <>{t("submitButton")}</>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

