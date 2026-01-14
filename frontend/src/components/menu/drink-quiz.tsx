"use client";

import { useState, useEffect, useTransition } from "react";
import { MENU_ITEMS, type MenuItem, type MenuCategoryId } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { formatVND } from "@/lib/currency";
import {
  Thermometer,
  Candy,
  Coffee,
  Leaf,
  Clock,
  RotateCcw,
  ShoppingCart
} from "lucide-react";
import { cn } from "@/lib/utils";

type Answer = string;

type QuizState = {
  currentQuestion: number;
  answers: Answer[];
  isComplete: boolean;
  recommendedDrink: MenuItem | null;
};

const QUESTIONS = [
  {
    id: "weather",
    icon: Thermometer,
    question_vi: "Thời tiết đối với bạn có nóng bức không?",
    question_en: "Does the weather feel hot to you?",
    options: [
      { value: "very-hot", label_vi: "Rất nóng", label_en: "Very hot" },
      { value: "normal", label_vi: "Bình thường", label_en: "Normal" },
      { value: "cool", label_vi: "Mát", label_en: "Cool" },
    ],
  },
  {
    id: "sweetness",
    icon: Candy,
    question_vi: "Bạn có thích đồ ngọt không?",
    question_en: "Do you like sweet drinks?",
    options: [
      { value: "love-sweet", label_vi: "Rất thích", label_en: "Love sweet" },
      { value: "medium", label_vi: "Vừa phải", label_en: "Medium" },
      { value: "not-sweet", label_vi: "Không thích ngọt", label_en: "Not sweet" },
    ],
  },
  {
    id: "coffee",
    icon: Coffee,
    question_vi: "Bạn có muốn uống cà phê không?",
    question_en: "Do you want a coffee-based drink?",
    options: [
      { value: "yes-caffeine", label_vi: "Có, cần tỉnh táo", label_en: "Yes, I need caffeine" },
      { value: "light", label_vi: "Nhẹ thôi", label_en: "Light caffeine" },
      { value: "no-coffee", label_vi: "Không uống cà phê", label_en: "No coffee" },
    ],
  },
  {
    id: "flavor",
    icon: Leaf,
    question_vi: "Bạn thích hương vị nào hơn?",
    question_en: "Which flavor do you prefer?",
    options: [
      { value: "tea-fruity", label_vi: "Trà & trái cây", label_en: "Tea & fruity" },
      { value: "milky-creamy", label_vi: "Sữa béo", label_en: "Milky & creamy" },
      { value: "bold-bitter", label_vi: "Đậm & đắng nhẹ", label_en: "Bold & bitter" },
    ],
  },
  {
    id: "occasion",
    icon: Clock,
    question_vi: "Bạn đang uống nước trong lúc nào?",
    question_en: "When are you having this drink?",
    options: [
      { value: "refresh", label_vi: "Giải nhiệt – thư giãn", label_en: "Refresh & chill" },
      { value: "work", label_vi: "Làm việc – học tập", label_en: "Work & study" },
      { value: "social", label_vi: "Gặp bạn bè", label_en: "Hang out" },
    ],
  },
];

// Scoring system: maps answer values to category scores
const SCORING: Record<string, Partial<Record<MenuCategoryId, number>>> = {
  // Weather
  "very-hot": { "fruit-tea": 3, "fresh-juice": 3, "shake-yogurt": 2 },
  "normal": { "coffee": 2, "milk-tea": 2, "fruit-tea": 1 },
  "cool": { "coffee": 3, "milk-tea": 3 },

  // Sweetness
  "love-sweet": { "milk-tea": 3, "shake-yogurt": 3, "fruit-tea": 2 },
  "medium": { "coffee": 2, "milk-tea": 2, "fruit-tea": 2 },
  "not-sweet": { "coffee": 3, "fresh-juice": 2 },

  // Coffee preference
  "yes-caffeine": { "coffee": 5 },
  "light": { "coffee": 2, "milk-tea": 2 },
  "no-coffee": { "milk-tea": 3, "fruit-tea": 3, "shake-yogurt": 3, "fresh-juice": 3 },

  // Flavor
  "tea-fruity": { "fruit-tea": 4, "milk-tea": 1 },
  "milky-creamy": { "milk-tea": 4, "shake-yogurt": 3 },
  "bold-bitter": { "coffee": 4 },

  // Occasion
  "refresh": { "fruit-tea": 3, "fresh-juice": 3, "shake-yogurt": 2 },
  "work": { "coffee": 4, "milk-tea": 2 },
  "social": { "milk-tea": 3, "fruit-tea": 2, "shake-yogurt": 2 },
};

function calculateRecommendation(answers: Answer[]): MenuItem | null {
  const scores: Partial<Record<MenuCategoryId, number>> = {};

  // Calculate scores for each category
  answers.forEach((answer) => {
    const answerScores = SCORING[answer];
    if (answerScores) {
      Object.entries(answerScores).forEach(([category, points]) => {
        scores[category as MenuCategoryId] = (scores[category as MenuCategoryId] || 0) + points;
      });
    }
  });

  // Find category with highest score
  const topCategory = Object.entries(scores).reduce(
    (max, [category, score]) => (score > (max[1] || 0) ? [category, score] : max),
    ["coffee", 0] as [string, number]
  )[0] as MenuCategoryId;

  // Filter out ice-blended items and get items from top category
  const eligibleItems = MENU_ITEMS.filter(
    (item) => item.category === topCategory && item.category !== "ice-blended" && item.category !== "toppings"
  );

  if (eligibleItems.length === 0) {
    // Fallback: try other categories if top category has no eligible items
    const fallbackCategories: MenuCategoryId[] = ["coffee", "milk-tea", "fruit-tea", "shake-yogurt", "fresh-juice"];
    for (const category of fallbackCategories) {
      const items = MENU_ITEMS.filter(
        (item) => item.category === category && item.category !== "ice-blended" && item.category !== "toppings"
      );
      if (items.length > 0) {
        return items[Math.floor(Math.random() * items.length)];
      }
    }
    return null;
  }

  // Return a random item from the top category
  return eligibleItems[Math.floor(Math.random() * eligibleItems.length)];
}

export const DrinkQuiz = () => {
  const locale = useLocale() as "vi" | "en";
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    isComplete: false,
    recommendedDrink: null,
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Trigger result animation when quiz completes
  useEffect(() => {
    if (state.isComplete) {
      setShowResult(true);
    }
  }, [state.isComplete]);

  const handleLanguageSwitch = (targetLocale: string) => {
    if (targetLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: targetLocale });
    });
  };

  const handleAnswer = (answer: Answer) => {
    setIsTransitioning(true);

    // Wait for slide-out animation before updating state
    setTimeout(() => {
      const newAnswers = [...state.answers, answer];
      const nextQuestion = state.currentQuestion + 1;

      if (nextQuestion >= QUESTIONS.length) {
        // Quiz complete, calculate recommendation
        const recommended = calculateRecommendation(newAnswers);
        setState({
          currentQuestion: nextQuestion,
          answers: newAnswers,
          isComplete: true,
          recommendedDrink: recommended,
        });
      } else {
        setState({
          ...state,
          currentQuestion: nextQuestion,
          answers: newAnswers,
        });
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleReset = () => {
    setShowResult(false);
    setState({
      currentQuestion: 0,
      answers: [],
      isComplete: false,
      recommendedDrink: null,
    });
  };

  const handleOrder = () => {
    // Scroll to top of page to see menu items
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (state.isComplete && state.recommendedDrink) {
    const drink = state.recommendedDrink;
    return (
      <section className="relative overflow-hidden bg-menu-pattern py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "relative rounded-[32px] bg-gradient-to-br from-cream to-beige p-6 shadow-xl shadow-espresso/5 sm:p-8 lg:p-10",
              showResult && "animate-[quiz-result-scale-in_0.5s_ease-out]"
            )}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="quiz-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.8" fill="currentColor" className="text-espresso/30" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#quiz-pattern)" />
              </svg>
            </div>


            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-3 animate-[quiz-fade-in-up_0.4s_ease-out]">
                {/* Language Switcher */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-1 rounded-full border border-beige/50 bg-white/30 p-1 shadow-sm">
                    {[{ code: "vi", label: "VI" }, { code: "en", label: "EN" }].map((lang) => {
                      const isActive = lang.code === locale;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          disabled={isPending}
                          onClick={() => handleLanguageSwitch(lang.code)}
                          className={cn(
                            "relative rounded-full px-3 py-1 text-xs font-bold transition-all duration-200",
                            isActive
                              ? "bg-espresso text-cream shadow-sm"
                              : "text-coffee hover:text-dark hover:bg-white/40",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                          )}
                        >
                          {lang.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title and Subtitle */}
                <div className="space-y-2">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark">
                    {locale === "vi" ? "Gợi ý dành cho bạn" : "Our Recommendation"}
                  </h2>
                  <p className="text-sm text-coffee">
                    {locale === "vi"
                      ? "Dựa trên câu trả lời của bạn, chúng tôi nghĩ bạn sẽ thích:"
                      : "Based on your answers, we think you'll love:"}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] bg-white/40 p-6 sm:p-8 border border-beige/30 animate-[quiz-fade-in-up_0.4s_ease-out_0.15s_both]">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-dark mb-2">
                        {locale === "vi" ? drink.name_vi : drink.name_en}
                      </h3>
                      {locale === "vi" && (
                        <p className="text-sm text-coffee/70 mb-2">{drink.name_en}</p>
                      )}
                      {locale === "en" && (
                        <p className="text-sm text-coffee/70 mb-2">{drink.name_vi}</p>
                      )}
                    </div>
                    <span className="shrink-0 font-display text-lg sm:text-xl font-bold text-espresso">
                      {formatVND(drink.price_vnd, locale)}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-coffee">
                    {locale === "vi" ? drink.shortDesc_vi : drink.shortDesc_en}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-[quiz-fade-in-up_0.4s_ease-out_0.3s_both]">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ShoppingCart size={18} />}
                  onClick={handleOrder}
                  className="flex-1"
                >
                  {locale === "vi" ? "Order tại quầy" : "Order at counter"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<RotateCcw size={18} />}
                  onClick={handleReset}
                  className="flex-1"
                >
                  {locale === "vi" ? "Làm lại" : "Try again"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentQuestion = QUESTIONS[state.currentQuestion];
  const Icon = currentQuestion.icon;
  const progress = ((state.currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <section className="relative overflow-hidden bg-menu-pattern py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] bg-gradient-to-br from-cream to-beige p-6 shadow-xl shadow-espresso/5 sm:p-8 lg:p-10 animate-[quiz-fade-in-up_0.4s_ease-out]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="quiz-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.8" fill="currentColor" className="text-espresso/30" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#quiz-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Header with Language Switcher */}
            <div className="text-center space-y-3">
              {/* Language Switcher */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-1 rounded-full border border-beige/50 bg-white/30 p-1 shadow-sm">
                  {[{ code: "vi", label: "VI" }, { code: "en", label: "EN" }].map((lang) => {
                    const isActive = lang.code === locale;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        disabled={isPending}
                        onClick={() => handleLanguageSwitch(lang.code)}
                        className={cn(
                          "relative rounded-full px-3 py-1 text-xs font-bold transition-all duration-200",
                          isActive
                            ? "bg-espresso text-cream shadow-sm"
                            : "text-coffee hover:text-dark hover:bg-white/40",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark">
                  {locale === "vi" ? "Không biết uống gì?" : "Not sure what to drink?"}
                </h2>
                <p className="text-sm text-coffee">
                  {locale === "vi"
                    ? "Trả lời 5 câu hỏi để chúng tôi gợi ý món phù hợp với bạn"
                    : "Answer 5 questions and we'll suggest the perfect drink for you"}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-coffee/70">
                <span>
                  {locale === "vi" ? "Câu hỏi" : "Question"} {state.currentQuestion + 1} / {QUESTIONS.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-beige/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-latte to-caramel transition-all duration-700 ease-out"
                  style={{
                    width: `${progress}%`,
                    transform: 'translateZ(0)',
                    willChange: 'width'
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div
              className={cn(
                "space-y-6",
                !isTransitioning && "animate-[quiz-slide-in-right_0.3s_ease-out]"
              )}
              key={state.currentQuestion}
            >
              <div className="flex items-center gap-3 text-coffee">
                <div className="rounded-full bg-latte/20 p-3 transition-transform duration-200 hover:scale-110">
                  <Icon size={24} className="text-espresso" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-dark">
                    {locale === "vi" ? currentQuestion.question_vi : currentQuestion.question_en}
                  </h3>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    disabled={isTransitioning}
                    className={cn(
                      "w-full text-left rounded-[20px] p-4 sm:p-5",
                      "bg-white/40 border-2 border-beige/30",
                      "hover:bg-white/60 hover:border-latte/50 hover:scale-[1.02]",
                      "active:scale-[0.98] active:animate-[quiz-button-ripple_0.6s_ease-out]",
                      "transition-all duration-200 ease-out",
                      "focus:outline-none focus:ring-2 focus:ring-latte focus:ring-offset-2",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "transform will-change-transform"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <span className="font-medium text-base sm:text-lg text-dark">
                      {locale === "vi" ? option.label_vi : option.label_en}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

