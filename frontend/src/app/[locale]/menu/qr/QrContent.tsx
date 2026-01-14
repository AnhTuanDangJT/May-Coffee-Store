"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Download, Link2 } from "lucide-react";
import { BACKEND_BASE_URL } from "@/lib/config";
import QRCode from "qrcode";

type QrContentProps = {
  badge: string;
  title: string;
  subtitle: string;
  steps: string[];
  note: string;
  primaryCta: string;
  secondaryCta: string;
  download: string;
  copyLink: string;
  copySuccess: string;
  loadingLabel: string;
  errorTitle: string;
  errorDescription: string;
  retryCta: string;
  downloadError: string;
};

const LOADING_TIMEOUT_MS = 5000; // 5 seconds timeout

import { motion } from "framer-motion";
import { SectionReveal } from "@/components/animations/section-reveal";

export const QrContent = ({
  badge,
  title,
  subtitle,
  steps,
  note,
  primaryCta,
  secondaryCta,
  download,
  copyLink,
  copySuccess,
  loadingLabel,
  errorTitle,
  errorDescription,
  retryCta,
  downloadError,
}: QrContentProps) => {
  const [copied, setCopied] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);
  const [cacheBustToken, setCacheBustToken] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState<string | null>(null);

  const QR_MENU_URL =
    process.env.NEXT_PUBLIC_QR_MENU_URL ??
    (typeof window !== "undefined" ? `${window.location.origin}/menu/qr` : "");
  
  const qrPageUrl = QR_MENU_URL;
  const qrImageUrl = `${BACKEND_BASE_URL}/qr/menu`;

  const [clientQrSrc, setClientQrSrc] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const resolvedQrSrc = useMemo(() => {
    if (!cacheBustToken) return qrImageUrl;
    return `${qrImageUrl}?v=${cacheBustToken}`;
  }, [cacheBustToken, qrImageUrl]);

  useEffect(() => {
    if (!qrPageUrl) {
      setHasImageError(true);
      setIsImageLoading(false);
      return;
    }

    let isMounted = true;
    const generateClientQr = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(qrPageUrl, {
          width: 600,
          margin: 2,
          color: {
            dark: "#1F0C08",
            light: "#FFFFFF",
          },
        });
        if (isMounted) {
          setClientQrSrc(dataUrl);
          setImageSrc(dataUrl);
          setIsImageLoading(false);
          setHasImageError(false);
        }
      } catch (error) {
        if (isMounted) {
          setHasImageError(true);
          setIsImageLoading(false);
        }
      }
    };

    generateClientQr();
    return () => {
      isMounted = false;
    };
  }, [qrPageUrl]);

  useEffect(() => {
    if (!isImageLoading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (clientQrSrc) {
        setImageSrc(clientQrSrc);
        setIsImageLoading(false);
        setHasImageError(false);
      } else {
        setHasImageError(true);
        setIsImageLoading(false);
      }
    }, LOADING_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isImageLoading, clientQrSrc]);

  const handleDownload = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      setDownloadErrorMessage(null);
      setIsDownloading(true);

      let downloadBlob: Blob | null = null;

      try {
        const response = await fetch(resolvedQrSrc, { cache: "no-store" });
        if (response.ok) {
          downloadBlob = await response.blob();
        }
      } catch (error) {
        if (clientQrSrc) {
          const response = await fetch(clientQrSrc);
          downloadBlob = await response.blob();
        }
      }

      if (!downloadBlob) {
        throw new Error("Failed to load QR for download");
      }

      const url = URL.createObjectURL(downloadBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "may-coffee-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadErrorMessage(downloadError);
    } finally {
      setIsDownloading(false);
    }
  }, [downloadError, resolvedQrSrc, clientQrSrc]);

  const handleCopy = async () => {
    if (!navigator?.clipboard || !qrPageUrl) return;
    await navigator.clipboard.writeText(qrPageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetry = () => {
    setHasImageError(false);
    setIsImageLoading(true);
    setCacheBustToken(Date.now().toString());
    if (clientQrSrc) {
      setImageSrc(clientQrSrc);
      setIsImageLoading(false);
    }
  };

  const handleImageError = () => {
    if (clientQrSrc && imageSrc !== clientQrSrc) {
      setImageSrc(clientQrSrc);
      setIsImageLoading(false);
      setHasImageError(false);
      return;
    }
    setHasImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setHasImageError(false);
  };

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 text-coffee-dark sm:px-6 sm:gap-16 sm:py-20 lg:flex-row lg:items-center lg:py-32 lg:px-8">
      <SectionReveal className="flex-1 space-y-8">
        <div className="space-y-4">
          <Badge tone="amber">{badge}</Badge>
          <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="text-lg leading-relaxed text-coffee-medium opacity-80 sm:text-xl">{subtitle}</p>
        </div>

        <div className="space-y-6">
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-amber/10 text-sm font-bold text-accent-amber">
                  {index + 1}
                </span>
                <span className="text-base leading-relaxed text-coffee-medium pt-1">{step}</span>
              </motion.li>
            ))}
          </ol>

          <div className="rounded-3xl border border-white/40 bg-white/20 p-6 text-sm italic text-coffee-medium shadow-sm backdrop-blur-sm">
            {note}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Button asChild size="xl" className="rounded-full shadow-lg shadow-accent-amber/20">
            <Link href="/menu" locale="en">
              {primaryCta}
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="rounded-full border-coffee-medium/20 text-coffee-medium backdrop-blur-sm">
            <Link href="/menu" locale="vi">
              {secondaryCta}
            </Link>
          </Button>
          <div className="w-full h-px bg-coffee-medium/10 my-2 sm:hidden" />
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="md"
              className="rounded-full"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download size={18} className="mr-2" />
              {download}
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="rounded-full"
              onClick={handleCopy}
            >
              <Link2 size={18} className="mr-2" />
              {copied ? copySuccess : copyLink}
            </Button>
          </div>
        </div>
        {downloadErrorMessage && (
          <p className="text-xs font-bold text-accent-rose uppercase tracking-widest">{downloadErrorMessage}</p>
        )}
      </SectionReveal>

      <SectionReveal delay={0.3} className="flex-1">
        <div className="relative group mx-auto max-w-[440px]">
          {/* Pulsing Outer Ring */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-8 bg-gradient-to-tr from-accent-amber/30 to-accent-rose/30 rounded-[60px] blur-3xl"
          />

          <div className="relative rounded-[48px] border border-white/50 bg-white/40 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
            <div className="relative aspect-square w-full rounded-[32px] border-2 border-dashed border-accent-amber/30 p-2 sm:p-4">
              {/* Spinning Accent */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-accent-amber/5 rounded-[28px] border-t-accent-amber/30"
              />

              {(isImageLoading || hasImageError) && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="h-32 w-32 rounded-3xl bg-background-soft shadow-inner"
                  />
                  <p className="text-xs font-bold uppercase tracking-widest text-coffee-medium opacity-40">
                    {hasImageError ? errorTitle : loadingLabel}
                  </p>
                </div>
              )}

              {imageSrc && (
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: hasImageError ? 0 : 1, scale: hasImageError ? 0.8 : 1 }}
                  ref={imageRef}
                  src={imageSrc}
                  alt="May Coffee QR code"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className="w-full h-full rounded-[24px] object-contain shadow-sm"
                />
              )}
            </div>

            <div className="mt-10 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-amber mb-2">Quét để xem menu online</p>
              <div className="flex justify-center gap-2">
                <div className="h-1.5 w-8 rounded-full bg-accent-amber" />
                <div className="h-1.5 w-1.5 rounded-full bg-accent-rose" />
                <div className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
};

