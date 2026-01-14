"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/forms/form-message";
import { apiFetch, ApiError } from "@/lib/api";
import type { User } from "@/types/user";
import type { Locale } from "@/i18n/routing";
import { useAuth } from "@/context/auth-context";
import { Link, useRouter } from "@/i18n/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

type LoginFormProps = {
  locale?: Locale;
};

export const LoginForm = ({ locale }: LoginFormProps) => {
  const t = useTranslations("auth.login");
  const tErrors = useTranslations("auth.errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
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
      const response = await apiFetch<{ data: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setUser(response.data);
      if (!response.data.isEmailVerified) {
        setStatus({ type: "error", message: t("unverified") });
        // Use next-intl router which handles locale automatically
        router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
        return;
      }
      // Use next-intl router which handles locale automatically
      const redirectTo = searchParams.get("next") ?? "/";
      router.push(redirectTo);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 0 || error.name === "NetworkError") {
          setStatus({
            type: "error",
            message: tErrors("networkError"),
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-[32px] border border-[#f4d4b6] bg-white/95 p-5 text-[#3a1f16] shadow-[0_35px_80px_rgba(244,202,167,0.35)] sm:p-6"
    >
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
        {t("noAccount")}{" "}
        <Link href="/auth/register" className="font-semibold text-[#b45a30]">
          →
        </Link>
      </p>
    </form>
  );
};

