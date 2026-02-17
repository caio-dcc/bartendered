import Link from "next/link";
import { Cocktail } from "@/types";
import TiltedCard from "@/components/ui/TiltedCard";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale, useTranslations } from "next-intl";

interface DrinkCardProps {
  cocktail: Cocktail;
}

export function DrinkCard({ cocktail }: DrinkCardProps) {
  const locale = useLocale();
  const tTags = useTranslations("Details.tags");

  const descriptionKey = `description${locale.toUpperCase()}` as keyof Cocktail;
  const description = cocktail[descriptionKey] || cocktail.strInstructions;

  // Extract all ingredients dynamically (up to 15) with localization fallback
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const baseIng = cocktail[`strIngredient${i}` as keyof Cocktail];
    let finalIng = baseIng;

    if (locale === "pt") {
      const ptIng = (cocktail as any)[`strIngredientPT${i}`];
      if (ptIng) finalIng = ptIng;
    } else if (locale === "es") {
      const esIng = (cocktail as any)[`strIngredientES${i}`];
      if (esIng) finalIng = esIng;
    }

    if (finalIng) ingredients.push(finalIng);
  }

  // Helper to translate known tags or fallback to original
  const translateTag = (tag: string) => {
    // Try detailed tags first
    if (tTags.has(tag)) return tTags(tag);
    return tag;
  };

  return (
    <Link href={`/cocktails/${cocktail.idDrink}`}>
      <Card className="overflow-hidden hover:scale-[1.02] transition-transform duration-300 h-full border-none bg-transparent group shadow-none">
        <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-shadow duration-300">
          <TiltedCard
            imageSrc={cocktail.strDrinkThumb || ""}
            altText={cocktail.strDrink}
            captionText={cocktail.strDrink}
            containerHeight="100%"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.15}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 rounded-[15px]" />
            }
          />
        </div>
        <CardHeader className="p-3 pb-2 mt-4">
          <CardTitle className="text-xl font-secondary text-white truncate drop-shadow-md">
            {cocktail.strDrink}
          </CardTitle>
          {description && (
            <p className="text-[11px] text-white/70 mt-1 font-light tracking-wide leading-relaxed">
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-3 pt-0 mt-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {ingredients.map((ing, i) => (
              <span
                key={i}
                className="text-xs text-white/90 font-medium bg-white/10 border border-white/10 px-2 py-1 rounded-full backdrop-blur-sm"
              >
                {ing}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {cocktail.strCategory && (
              <Badge
                variant="outline"
                className="border-white/20 text-white/80 bg-white/5 font-medium hover:bg-white/10"
              >
                {translateTag(cocktail.strCategory)}
              </Badge>
            )}
            {cocktail.strAlcoholic && (
              <Badge
                variant="outline"
                className="border-white/20 text-white/80 bg-white/5 font-medium hover:bg-white/10"
              >
                {translateTag(cocktail.strAlcoholic)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
