"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Link } from "@/i18n/navigation";
import { Download, Link2 } from "lucide-react";
import { BACKEND_BASE_URL, FRONTEND_BASE_URL } from "@/lib/config";

type MenuQrPromoProps = {
  locale: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  downloadLabel: string;
  copyLabel: string;
  copySuccess: string;
};

export const MenuQrPromo = ({
  locale,
  badge,
  title,
  subtitle,
  cta,
  downloadLabel,
  copyLabel,
  copySuccess,
}: MenuQrPromoProps) => {
  const [copied, setCopied] = useState(false);
  const qrImageUrl = `${BACKEND_BASE_URL}/qr/menu`;
  const qrPageUrl = `${FRONTEND_BASE_URL.replace(/\/$/, "")}/menu/qr`;

  const handleDownload = async () => {
    if (typeof window === "undefined") return;
    const response = await fetch(qrImageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "may-coffee-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(qrPageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SectionReveal className="mt-12 rounded-[32px] border border-[#f4d4b6] bg-white/90 p-6 text-[#3a1f16] shadow-[0_40px_100px_rgba(244,202,167,0.35)] sm:mt-16 sm:p-8">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <Badge tone="amber">{badge}</Badge>
        <h3 className="text-2xl font-semibold sm:text-3xl">{title}</h3>
        <p className="text-base leading-relaxed text-[#6f4633] sm:text-lg">{subtitle}</p>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/menu/qr" locale={locale}>
            {cta}
          </Link>
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button
            variant="secondary"
            size="md"
            icon={<Download size={16} />}
            onClick={handleDownload}
            className="w-full sm:w-auto"
          >
            {downloadLabel}
          </Button>
          <Button
            variant="ghost"
            size="md"
            icon={<Link2 size={16} />}
            onClick={handleCopy}
            className="w-full sm:w-auto"
          >
            {copied ? copySuccess : copyLabel}
          </Button>
        </div>
      </div>
    </SectionReveal>
  );
};

