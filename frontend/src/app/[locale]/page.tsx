import { HeroSection } from "@/components/sections/hero-section";
import { MenuSignature } from "@/components/sections/menu-signature";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EventsPreview } from "@/components/sections/events-preview";
import { FeedbackPreview } from "@/components/sections/feedback-preview";
import { DrinkQuiz } from "@/components/menu/drink-quiz";
import { setRequestLocale } from "next-intl/server";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <HeroSection locale={locale} />
      <MenuSignature />
      <DrinkQuiz />
      <ExperienceSection />
      <EventsPreview />
      <FeedbackPreview />
    </>
  );
}

