"use client";

import React, { useState } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/form-message";
import { apiFetch } from "@/lib/api";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

type RegisterFormProps = {
  locale?: Locale;
};

export const RegisterForm = ({ locale }: RegisterFormProps): React.JSX.Element => {
  const t = useTranslations("auth.register");
  const tErrors = useTranslations("auth.errors");
  const router = useNextRouter();
  const currentLocale = useLocale();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setStatus(null);
    try {
      const response = await apiFetch<{ devVerificationCode?: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const message = response?.devVerificationCode
        ? `${t("success")} ${t("devCodeHint", { code: response.devVerificationCode })}`
        : t("success");
      setStatus({ type: "success", message });
      setTimeout(() => {
        // Use next/navigation router with locale prefix for query params
        router.push(`/${currentLocale}/auth/verify?email=${encodeURIComponent(data.email)}`);
      }, response?.devVerificationCode ? 1500 : 800);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : tErrors("generic"),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-[32px] border border-[#f4d4b6] bg-white/95 p-5 text-[#3a1f16] shadow-[0_35px_80px_rgba(244,202,167,0.35)] sm:p-6"
    >
      <div>
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c38c5a]">
          {t("nameLabel")}
        </label>
        <Input
          {...register("name")}
          placeholder="Lan Phương"
          className="mt-2"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-rose-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c38c5a]">
          {t("emailLabel")}
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
          {t("passwordLabel")}
        </label>
        <Input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="mt-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-rose-500">{errors.password.message}</p>
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

      <p className="text-sm text-[#6f4633]">
        {t("haveAccount")}{" "}
        <Link href="/auth/login" className="font-semibold text-[#b45a30]">
          →
        </Link>
      </p>
    </form>
  );
};

