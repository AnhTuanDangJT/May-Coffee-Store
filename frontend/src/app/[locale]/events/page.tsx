import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { EventsList } from "@/components/events/events-list";

type EventsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function EventsPage({ params }: EventsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "events" });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-[#3a1f16] sm:px-6 sm:py-16 lg:py-24 lg:px-8">
      <section className="space-y-4 text-[#3a1f16]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#c38c5a]">May Coffee • Events</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="text-base leading-relaxed text-[#6f4633] sm:text-lg">{t("subtitle")}</p>
      </section>
      <EventsList />
    </main>
  );
}


