"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cocktailApi } from "@/services/cocktailApi";
import { getCocktailDescription } from "@/services/geminiApi";
import { Cocktail } from "@/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  BookOpen,
  Info,
  ChefHat,
  Utensils,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MoreCocktailInfo } from "@/types";

export default function CocktailDetailsPage() {
  const t = useTranslations("Details");
  const tGallery = useTranslations("Gallery");
  const params = useParams();
  const id = params.id as string;
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [description, setDescription] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const locale = useLocale();
  const [unit, setUnit] = useState<"standard" | "metric">("standard");

  // More Info State
  const [moreInfo, setMoreInfo] = useState<MoreCocktailInfo | null>(null);
  const [moreInfoLoading, setMoreInfoLoading] = useState(false);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);

  const handleMoreInfo = async () => {
    if (moreInfo || !cocktail) return;

    setMoreInfoLoading(true);

    try {
      const { getMoreCocktailInfo } = await import("@/services/geminiApi");
      const ingredients = getIngredients().map((i) => i.ingredient);

      const info = await getMoreCocktailInfo(
        cocktail.strDrink,
        ingredients,
        locale,
      );

      if (info) {
        setMoreInfo(info);
      }
    } catch (error) {
      console.error("Failed to fetch more info", error);
    } finally {
      setMoreInfoLoading(false);
    }
  };

  // Import local data
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const localCocktailsData = require("@/data/cocktails.json") as Cocktail[];

  useEffect(() => {
    if (id) {
      // 1. Try to find in local data first (fastest + enriched)
      const localMatch = localCocktailsData.find((c) => c.idDrink === id);

      if (localMatch) {
        setCocktail(localMatch);
        setLoading(false);
        // Set initial description and enriched fields from local JSON if available
        const descKey = `description${locale.toUpperCase()}` as keyof Cocktail;
        const historyKey =
          `strHistory${locale.toUpperCase()}` as keyof Cocktail;
        const funFactKey =
          `strFunFact${locale.toUpperCase()}` as keyof Cocktail;

        const staticData = {
          description: localMatch[descKey],
          history: localMatch[historyKey],
          funFact: localMatch[funFactKey],
        };

        if (staticData.description) {
          setDescription(staticData);
        }

        // Only trigger AI if we are missing data
        if (!staticData.description || !staticData.history) {
          setAiLoading(true);
          import("@/services/geminiApi").then(
            async ({ enrichCocktailDetails }) => {
              // Collect ingredients safely
              const ing = [];
              for (let i = 1; i <= 15; i++) {
                const val = localMatch[`strIngredient${i}` as keyof Cocktail];
                if (val) ing.push(val as string);
              }
              try {
                const desc = await enrichCocktailDetails(
                  localMatch.strDrink,
                  ing,
                  locale,
                );
                setDescription(desc); // This will overwrite with full object { description, history, funFact... }
              } catch (e) {
                console.error(e);
              } finally {
                setAiLoading(false);
              }
            },
          );
        }
      } else {
        // 2. Fallback to API
        cocktailApi.getDetailsById(id).then(async (data) => {
          setCocktail(data);
          setLoading(false);

          if (data) {
            setAiLoading(true);
            const ing = [];
            for (let i = 1; i <= 15; i++) {
              const val = data[`strIngredient${i}` as keyof Cocktail];
              if (val) ing.push(val as string);
            }
            const { enrichCocktailDetails } =
              await import("@/services/geminiApi");
            const desc = await enrichCocktailDetails(
              data.strDrink,
              ing,
              locale,
            );
            setDescription(desc);
            setAiLoading(false);
          }
        });
      }
    }
  }, [id, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cocktail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-4">
        <h2 className="text-2xl font-bold">{t("notFound")}</h2>
        <Link href="/cocktails">
          <Button variant="outline">{tGallery("back")}</Button>
        </Link>
      </div>
    );
  }

  // Helper to extract ingredients and measures
  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      let ingredient = cocktail[`strIngredient${i}` as keyof Cocktail];
      let measure = cocktail[`strMeasure${i}` as keyof Cocktail];

      // Localized Ingredient Name
      if (locale === "pt") {
        const ptName = (cocktail as any)[`strIngredientPT${i}`];
        if (ptName) ingredient = ptName;
      } else if (locale === "es") {
        const esName = (cocktail as any)[`strIngredientES${i}`];
        if (esName) ingredient = esName;
      }

      // Unit Logic
      if (unit === "metric") {
        const metricMeasure = (cocktail as any)[`strMeasureML${i}`];
        if (metricMeasure) {
          measure = metricMeasure;
        } else if (locale === "pt") {
          // Fallback to legacy PT measure if available and no specific ML field
          const ptMeasure = (cocktail as any)[`strMeasurePT${i}`];
          if (ptMeasure) measure = ptMeasure;
        }
      }

      if (ingredient) {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <Link
          href="/cocktails"
          className="inline-flex items-center text-primary mb-6 hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {tGallery("back")}
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative h-[300px] md:h-[500px] w-full rounded-xl overflow-hidden shadow-2xl border border-primary/20">
              <Image
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold font-secondary text-foreground drop-shadow-sm">
                {cocktail.strDrink}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-white/20 text-foreground bg-white/5 text-lg py-1 px-3"
                >
                  {t(`tags.${cocktail.strCategory}`) || cocktail.strCategory}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/20 text-foreground bg-white/5 text-lg py-1 px-3"
                >
                  {t(`tags.${cocktail.strAlcoholic}`) || cocktail.strAlcoholic}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/20 text-foreground bg-white/5 text-lg py-1 px-3"
                >
                  {t(`tags.${cocktail.strGlass}`) || cocktail.strGlass}
                </Badge>
              </div>
            </div>

            {/* AI DrinkingMan Info Card */}
            <div className="bg-card shadow-xl p-6 rounded-xl border border-primary/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="h-40 w-40 text-primary" />
              </div>

              <h3 className="flex items-center text-lg font-semibold text-primary mb-4 border-b border-primary/20 pb-2">
                <Sparkles className="h-5 w-5 mr-2" /> {t("tale")}
              </h3>

              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 text-muted-foreground animate-pulse">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="text-sm italic">{t("summoning")}</span>
                </div>
              ) : description ? (
                <div className="space-y-4 text-secondary/90">
                  {/* ... existing description code ... */}
                  <p className="italic leading-relaxed font-serif text-lg border-l-2 border-primary/30 pl-4">
                    "{description.description}"
                  </p>

                  {/* History -> Creation */}
                  {description.history && (
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <span className="font-bold text-primary text-sm block mb-1">
                        {t("history")}
                      </span>
                      <p className="text-sm">{description.history}</p>
                    </div>
                  )}

                  {/* Fun Fact -> Observation */}
                  {description.funFact && (
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <span className="font-bold text-primary text-sm block mb-1">
                        {t("funFact")}
                      </span>
                      <p className="text-sm">{description.funFact}</p>
                    </div>
                  )}

                  {/* More Info Button */}
                  <div className="pt-4 flex justify-end">
                    <Button
                      onClick={() => {
                        setIsMoreInfoOpen(!isMoreInfoOpen);
                        if (!isMoreInfoOpen && !moreInfo) {
                          handleMoreInfo();
                        }
                      }}
                      variant="outline"
                      className="gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary transition-all duration-300"
                    >
                      <Sparkles className="w-4 h-4" />
                      {t("moreInfo") || "More Details"}
                      {isMoreInfoOpen ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div className="bg-card shadow-lg p-6 rounded-xl border border-primary/10">
              <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
                <h2 className="text-2xl font-secondary text-primary">
                  {t("ingredients")}
                </h2>
                <div className="flex items-center space-x-1 bg-primary/10 rounded-lg p-1 w-full md:w-auto">
                  <button
                    onClick={() => setUnit("standard")}
                    className={`flex-1 md:flex-none px-3 py-1 text-sm rounded-md transition-all whitespace-nowrap ${
                      unit === "standard"
                        ? "bg-primary text-white shadow-sm"
                        : "text-primary hover:bg-primary/5"
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setUnit("metric")}
                    className={`flex-1 md:flex-none px-3 py-1 text-sm rounded-md transition-all whitespace-nowrap ${
                      unit === "metric"
                        ? "bg-primary text-white shadow-sm"
                        : "text-primary hover:bg-primary/5"
                    }`}
                  >
                    Metric (ml)
                  </button>
                </div>
              </div>
              <ul className="space-y-3">
                {getIngredients().map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-lg"
                  >
                    <span className="font-medium text-secondary/90">
                      {item.ingredient}
                    </span>
                    <span className="text-primary italic">{item.measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card shadow-lg p-6 rounded-xl border border-primary/10">
              <h2 className="text-2xl font-secondary text-primary mb-4 border-b border-primary/20 pb-2">
                {t("preparation")}
              </h2>
              <div className="text-lg leading-relaxed text-secondary/80 space-y-2">
                {(locale === "pt" && cocktail.strInstructionsPT
                  ? cocktail.strInstructionsPT
                  : cocktail.strInstructions
                )
                  ?.split(".")
                  .filter((step) => step.trim().length > 0)
                  .map((step, idx) => (
                    <p key={idx}>- {step.trim()}.</p>
                  ))}
              </div>
            </div>

            <AnimatePresence>
              {isMoreInfoOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2 border-b border-primary/10 pb-4">
                      <Sparkles className="w-5 h-5" />
                      {t("moreInfoDescription") || "Discover hidden details"}
                    </h3>

                    {moreInfoLoading ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-4 text-muted-foreground animate-pulse">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <span className="text-base font-medium">
                          {t("consultingBartender") ||
                            "Consulting the Head Bartender..."}
                        </span>
                      </div>
                    ) : moreInfo ? (
                      <div className="space-y-8">
                        {/* Extended History */}
                        <div className="space-y-2">
                          <h4 className="font-bold flex items-center gap-2 text-primary text-sm uppercase tracking-wide">
                            <BookOpen className="w-4 h-4" />
                            {t("moreHistory") || "More about the history"}
                          </h4>
                          <p className="text-sm text-foreground/80 leading-relaxed pl-6 border-l-2 border-primary/20">
                            {moreInfo.history}
                          </p>
                        </div>

                        {/* Fun Fact */}
                        <div className="space-y-2">
                          <h4 className="font-bold flex items-center gap-2 text-primary text-sm uppercase tracking-wide">
                            <Lightbulb className="w-4 h-4" />
                            {t("didYouKnow")}
                          </h4>
                          <p className="text-sm text-foreground/80 font-medium pl-6">
                            {moreInfo.funFact}
                          </p>
                        </div>

                        {/* Serving Tips */}
                        <div className="space-y-2">
                          <h4 className="font-bold flex items-center gap-2 text-primary text-sm uppercase tracking-wide">
                            <ChefHat className="w-4 h-4" />
                            {t("servingTips")}
                          </h4>
                          <p className="text-sm text-foreground/80 pl-6">
                            {moreInfo.servingTips}
                          </p>
                        </div>

                        {/* Food Pairings */}
                        <div className="space-y-2">
                          <h4 className="font-bold flex items-center gap-2 text-primary text-sm uppercase tracking-wide">
                            <Utensils className="w-4 h-4" />
                            {t("perfectPairings")}
                          </h4>
                          <div className="flex flex-wrap gap-2 pl-6">
                            {moreInfo.foodPairings.map((pairing, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-background rounded-full border border-primary/10 text-xs text-foreground/80 shadow-sm"
                              >
                                {pairing}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Similar Drinks */}
                        <div className="space-y-2">
                          <h4 className="font-bold flex items-center gap-2 text-primary text-sm uppercase tracking-wide">
                            <Info className="w-4 h-4" />
                            {t("similarDrinks")}
                          </h4>
                          <div className="flex flex-wrap gap-2 pl-6">
                            {moreInfo.similarDrinks.map((drink, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="px-2 py-0.5 text-xs"
                              >
                                {drink}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <p className="text-sm">
                          {t("errorLoadingInfo") ||
                            "Could not load additional information."}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
