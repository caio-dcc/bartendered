"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { askDrinkingMan } from "@/services/geminiApi";
import { DrinkingManPreferences, DrinkingManResponse } from "@/types";
import { Loader2, Sparkles, Wine, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { cocktailApi } from "@/services/cocktailApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

import { FlavorSlider } from "@/components/feature/FlavorSlider";
import { VisualMoodSelector } from "@/components/feature/VisualMoodSelector";

import { useSearchParams } from "next/navigation";

export function DrinkingManForm() {
  const t = useTranslations("DrinkingMan");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DrinkingManResponse | null>(null);

  // Bar Context from URL
  const barName = searchParams.get("barName");
  const unavailableIngredients =
    searchParams.get("unavailable")?.split(",") || [];

  // Calculate available ingredients for the prompt (Inverted logic: Prompt needs VALID ingredients, or we pass the blacklist?)
  // Actually, my geminiApi logic accepts "availableIngredients".
  // If I pass a blacklist, I need to handle it.
  // But wait, the `geminiApi` update I made expects "availableIngredients".
  // The Bar Registration page generates "unavailable" list (what is OFF).
  // The logic in `askDrinkingMan` says: "You can ONLY use the following ingredients: ${availableIngredients}".
  // So I need to pass the ALLOWED list.
  // Converting "unavailable" blacklist to "available" whitelist is hard without a full database of ALL ingredients.
  // BETTER APPROACH: Update `askDrinkingMan` to accept `unavailableIngredients` (Blacklist) instead of Whitelist.
  // It's safer to say "DO NOT USE: Mint, Lime" than "ONLY USE: Vodka, Gin...".

  // Let's stick to the current plan but I need to modify `geminiApi.ts` again to support BLACKLISTING,
  // because Whitelisting requires sending the ENTIRE universe of ingredients every time.
  // Or I can just pass the "Common Ingredients" MINUS "Unavailable".

  // Refined Logic:
  // 1. Get `unavailable` from URL.
  // 2. We don't have the full list of ingredients on the client side `DrinkingManForm`, only in `useBarStore` (which is for the Bar Admin).
  // 3. User doesn't have `useBarStore` populated.

  // Decision: I will modify `askDrinkingMan` to accept `unavailableIngredients` instead of `available`.
  // This is much more robust for an "Open World" cocktail AI.

  const [sliderValues, setSliderValues] = useState({
    sweetBitter: 50,
    smoothStrong: 50,
    refreshingHeavy: 50,
  });

  const [formData, setFormData] = useState<DrinkingManPreferences>({
    baseSpirit: "",
    flavorProfile: [],
    occasion: "",
    mood: "",
  });

  const [visualImages, setVisualImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  useEffect(() => {
    if (response) {
      const fetchImages = async () => {
        setIsLoadingImages(true);
        try {
          const searchTerm = response.visualMatch || response.name;
          let drinks = await cocktailApi.searchByName(searchTerm);
          if (!drinks || drinks.length === 0) {
            // Fallback to searching by name if visualMatch returns nothing
            drinks = await cocktailApi.searchByName(response.name);
          }
          if (!drinks || drinks.length === 0) {
            // Second fallback: Search by Base Spirit (guaranteed results usually)
            // We use filterByIngredient which is slightly different but robust
            const spirit =
              formData.baseSpirit !== "None" ? formData.baseSpirit : "Vodka";
            // Note: cocktailApi doesn't have filterByIngredient exposed directly in the interface I saw?
            // Let's check cocktailApi.ts. It has filterByCategory, filterByAlcoholic.
            // I will use searchByName with the spirit as a fallback, which acts like a search.
            drinks = await cocktailApi.searchByName(spirit);
          }
          if (drinks && drinks.length > 0) {
            setVisualImages(drinks.slice(0, 4).map((d) => d.strDrinkThumb));
          } else {
            setVisualImages([]);
          }
        } catch (error) {
          console.error("Error fetching images:", error);
          setVisualImages([]);
        } finally {
          setIsLoadingImages(false);
        }
      };
      fetchImages();
    }
  }, [response]);

  /*
   * Convert slider values (0-100) to meaningful descriptive strings for the AI.
   * This logic maps the user's analog input to the digital prompt.
   */
  const getMappedFlavors = () => {
    const flavors = [];

    // Sweet <-> Bitter
    if (sliderValues.sweetBitter < 30) flavors.push("Very Sweet");
    else if (sliderValues.sweetBitter < 45) flavors.push("Sweet");
    else if (sliderValues.sweetBitter > 70) flavors.push("Very Bitter");
    else if (sliderValues.sweetBitter > 55) flavors.push("Bitter");
    else flavors.push("Balanced Sweet/Bitter");

    // Smooth <-> Strong
    if (sliderValues.smoothStrong < 30)
      flavors.push("Very Smooth", "Easy to Drink");
    else if (sliderValues.smoothStrong < 45) flavors.push("Smooth");
    else if (sliderValues.smoothStrong > 70)
      flavors.push("Very Strong", "High Alcohol");
    else if (sliderValues.smoothStrong > 55) flavors.push("Strong");
    else flavors.push("Standard Strength");

    // Refreshing <-> Heavy
    if (sliderValues.refreshingHeavy < 30)
      flavors.push("Very Refreshing", "Light Body");
    else if (sliderValues.refreshingHeavy < 45) flavors.push("Refreshing");
    else if (sliderValues.refreshingHeavy > 70)
      flavors.push("Heavy Body", "Complex", "Creamy/Thick");
    else if (sliderValues.refreshingHeavy > 55) flavors.push("Full Body");
    else flavors.push("Medium Body");

    return flavors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked"); // DEBUG
    setLoading(true);
    setResponse(null);

    try {
      console.log("Form Data:", formData); // DEBUG
      console.log("Slider Values:", sliderValues); // DEBUG

      // Create a temporary data object with the mapped flavors
      const submissionData = {
        ...formData,
        flavorProfile: getMappedFlavors(),
      };

      console.log("Mapped Submission Data:", submissionData); // DEBUG

      // Pass the blacklist to the API
      console.log(
        "Calling calling Gemini API with:",
        locale,
        unavailableIngredients,
      ); // DEBUG
      const result = await askDrinkingMan(
        submissionData,
        locale,
        unavailableIngredients,
      );
      console.log("Gemini Result:", result); // DEBUG
      setResponse(result);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-20 bg-background relative overflow-hidden"
      id="drinkingman"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-12">
          {/* Badge removed as per user request */}
          <h2 className="text-3xl md:text-5xl font-bold font-secondary text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl">{t("subtitle")}</p>

          {barName && (
            <div className="mt-4 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center animate-in fade-in slide-in-from-top-4">
              <Wine className="w-4 h-4 mr-2" />
              Connected to {barName}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="bg-card shadow-xl border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-secondary text-card-foreground">
                <Bot className="mr-2 h-6 w-6 text-primary" />
                {t("preferences")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary/80 mb-2">
                    {t("baseSpirit")}
                  </label>
                  <Select
                    onValueChange={(val) =>
                      setFormData({ ...formData, baseSpirit: val })
                    }
                    required
                  >
                    <SelectTrigger
                      className="!bg-white !text-[#5C3A2E] !border-[#5C3A2E]/50 shadow-sm font-medium"
                      style={{ backgroundColor: "white", color: "#5C3A2E" }}
                    >
                      <SelectValue placeholder={t("placeholderSpirit")} />
                    </SelectTrigger>
                    <SelectContent
                      className="!bg-white !text-[#5C3A2E] !border-[#5C3A2E]/50"
                      style={{ backgroundColor: "white", color: "#5C3A2E" }}
                    >
                      {[
                        "Vodka",
                        "Gin",
                        "Rum",
                        "Tequila",
                        "Whiskey",
                        "Mezcal",
                        "Brandy",
                        "None",
                      ].map((spirit) => (
                        <SelectItem
                          key={spirit}
                          value={spirit}
                          className="!text-[#5C3A2E] focus:!bg-[#5C3A2E]/10 focus:!text-[#5C3A2E] cursor-pointer font-medium"
                          style={{ color: "#5C3A2E" }}
                        >
                          {spirit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C3A2E] mb-4">
                    {t("flavorProfile")}
                  </label>
                  <div className="space-y-6 bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                    <FlavorSlider
                      labelLeft={t("sliders.sweet")}
                      labelRight={t("sliders.bitter")}
                      value={sliderValues.sweetBitter}
                      onChange={(val) =>
                        setSliderValues({ ...sliderValues, sweetBitter: val })
                      }
                    />
                    <FlavorSlider
                      labelLeft={t("sliders.smooth")}
                      labelRight={t("sliders.strong")}
                      value={sliderValues.smoothStrong}
                      onChange={(val) =>
                        setSliderValues({ ...sliderValues, smoothStrong: val })
                      }
                    />
                    <FlavorSlider
                      labelLeft={t("sliders.refreshing")}
                      labelRight={t("sliders.heavy")}
                      value={sliderValues.refreshingHeavy}
                      onChange={(val) =>
                        setSliderValues({
                          ...sliderValues,
                          refreshingHeavy: val,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C3A2E] mb-2">
                    {t("occasion")}
                  </label>
                  <Select
                    onValueChange={(val) =>
                      setFormData({ ...formData, occasion: val })
                    }
                    required
                  >
                    <SelectTrigger
                      className="!bg-white !text-[#5C3A2E] !border-[#5C3A2E]/50 shadow-sm font-medium"
                      style={{ backgroundColor: "white", color: "#5C3A2E" }}
                    >
                      <SelectValue placeholder={t("placeholderOccasion")} />
                    </SelectTrigger>
                    <SelectContent
                      className="!bg-white !text-[#5C3A2E] !border-[#5C3A2E]/50"
                      style={{ backgroundColor: "white", color: "#5C3A2E" }}
                    >
                      {[
                        "Date Night",
                        "Party",
                        "Relaxing",
                        "Business",
                        "Celebration",
                        "Casual",
                      ].map((o) => (
                        <SelectItem
                          key={o}
                          value={o}
                          className="!text-[#5C3A2E] focus:!bg-[#5C3A2E]/10 focus:!text-[#5C3A2E] cursor-pointer font-medium"
                          style={{ color: "#5C3A2E" }}
                        >
                          {t(`occasions.${o}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C3A2E] mb-4">
                    {t("mood")}
                  </label>
                  <VisualMoodSelector
                    options={[
                      {
                        id: "Happy",
                        label: t("moods.Happy"),
                        emoji: "😊",
                        color: "bg-yellow-100",
                      },
                      {
                        id: "Melancholic",
                        label: t("moods.Melancholic"),
                        emoji: "🌧️",
                        color: "bg-blue-100",
                      },
                      {
                        id: "Adventurous",
                        label: t("moods.Adventurous"),
                        emoji: "🚀",
                        color: "bg-red-100",
                      },
                      {
                        id: "Tired",
                        label: t("moods.Tired"),
                        emoji: "😴",
                        color: "bg-gray-100",
                      },
                      {
                        id: "Energetic",
                        label: t("moods.Energetic"),
                        emoji: "⚡",
                        color: "bg-orange-100",
                      },
                      {
                        id: "Romantic",
                        label: t("moods.Romantic"),
                        emoji: "🌹",
                        color: "bg-pink-100",
                      },
                    ]}
                    selectedMood={formData.mood}
                    onSelect={(moodId) =>
                      setFormData({ ...formData, mood: moodId })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("mixing")}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      {t("submit")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              {response ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full"
                >
                  <Card className="border-primary bg-card/90 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
                        <Wine className="w-8 h-8 text-primary" />
                      </div>
                      <Badge
                        variant="outline"
                        className="mx-auto mb-2 border-primary/50 text-secondary"
                      >
                        {t("suggests")}
                      </Badge>
                      <CardTitle className="text-3xl font-secondary text-primary">
                        {response.name}
                      </CardTitle>
                    </CardHeader>

                    {/* Dynamic Images Section */}
                    {visualImages.length > 0 && (
                      <div className="px-6 pb-2">
                        {/* Mobile Carousel */}
                        <div className="md:hidden">
                          <Carousel className="w-full max-w-xs mx-auto">
                            <CarouselContent>
                              {visualImages.map((img, index) => (
                                <CarouselItem key={index}>
                                  <div className="p-1">
                                    <div className="overflow-hidden rounded-xl aspect-square relative shadow-md border-2 border-primary/20">
                                      <Image
                                        src={img}
                                        alt={`Cocktail visual ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                          </Carousel>
                        </div>

                        {/* Desktop Grid */}
                        <div className="hidden md:grid grid-cols-4 gap-4 mt-4">
                          {visualImages.map((img, index) => (
                            <div
                              key={index}
                              className="overflow-hidden rounded-xl aspect-square relative shadow-md border-2 border-primary/20 hover:scale-105 transition-transform duration-300"
                            >
                              <Image
                                src={img}
                                alt={`Cocktail visual ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <CardContent className="space-y-6 pt-4">
                      <div className="bg-secondary/20 p-4 rounded-lg italic text-center text-card-foreground/90 border border-primary/10">
                        "{response.description}"
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-primary mb-2 flex items-center">
                            {t("ingredients")}
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-sm text-card-foreground/80">
                            {response.ingredients.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">
                            {t("instructions")}
                          </h4>
                          <p className="text-sm text-card-foreground/80 leading-relaxed">
                            {response.instructions}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border">
                        <div>
                          <h4 className="font-semibold text-primary mb-2 text-sm">
                            {t("whyItFits")}
                          </h4>
                          <p className="text-sm text-card-foreground/70 italic">
                            {response.whyItFits}
                          </p>
                        </div>

                        {response.history && (
                          <div>
                            <h4 className="font-semibold text-primary mb-2 text-sm">
                              {t("history")}
                            </h4>
                            <p className="text-sm text-card-foreground/70">
                              {response.history}
                            </p>
                          </div>
                        )}

                        {response.funFact && (
                          <div>
                            <h4 className="font-semibold text-primary mb-2 text-sm">
                              {t("funFact")}
                            </h4>
                            <p className="text-sm text-card-foreground/70">
                              {response.funFact}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground p-8"
                >
                  <div className="w-24 h-24 bg-primary/5 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Ready to Serve</h3>
                  <p className="max-w-md mx-auto">{t("initialPrompt")}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
