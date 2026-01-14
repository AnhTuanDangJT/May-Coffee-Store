"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/form-message";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";
import { defaultLocale, type Locale } from "@/i18n/routing";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "@/i18n/navigation";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

type FormValues = z.infer<typeof schema>;

type VerifyFormProps = {
  locale?: Locale;
  initialEmail?: string;
};

export const VerifyForm = ({ locale, initialEmail }: VerifyFormProps) => {
  const t = useTranslations("auth.verify");
  const tErrors = useTranslations("auth.errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, refresh } = useAuth();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const email = initialEmail || searchParams.get("email");
    if (email) {
      setValue("email", email);
    }
  }, [initialEmail, searchParams, setValue]);

  const onSubmit = async (data: FormValues) => {
    setStatus(null);
    try {
      const response = await apiFetch<{ data: User }>("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setUser(response.data);
      // Refresh auth state to verify cookie is working
      await refresh();
      setStatus({ type: "success", message: t("success") });
      setTimeout(() => {
        // Use next-intl router which handles locale automatically
        router.push("/auth/login");
      }, 1500);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : tErrors("generic"),
      });
    }
  };

  const handleResendCode = async () => {
    const email = initialEmail || searchParams.get("email");
    if (!email) {
      setStatus({
        type: "error",
        message: tErrors("emailRequired") || "Email is required to resend code",
      });
      return;
    }

    setIsResending(true);
    setStatus(null);
    try {
      await apiFetch<{ message: string; devVerificationCode?: string }>("/auth/resend-code", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const message = t("resendSuccess") || "Verification code has been resent to your email";
      setStatus({ type: "success", message });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : tErrors("generic"),
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-[32px] border border-[#f4d4b6] bg-white/95 p-5 text-[#3a1f16] shadow-[0_35px_80px_rgba(244,202,167,0.35)] sm:p-6"
    >
      <div>
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c38c5a]">
          Email
        </label>
        <Input
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          className="mt-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-rose-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c38c5a]">
          {t("codeLabel")}
        </label>
        <Input
          type="text"
          inputMode="numeric"
          maxLength={6}
          {...register("code")}
          placeholder="123456"
          className="mt-2 tracking-[0.5em]"
        />
        {errors.code && (
          <p className="mt-1 text-sm text-rose-500">{errors.code.message}</p>
        )}
      </div>

      {status && <FormMessage type={status.type} message={status.message} />}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "..." : t("submit")}
      </Button>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={handleResendCode}
          disabled={isResending || isSubmitting}
          className="text-sm text-[#c38c5a] hover:text-[#a46a47] underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? t("resending") || "Sending..." : t("resendCode") || "Resend code"}
        </button>
      </div>
    </form>
  );
};

