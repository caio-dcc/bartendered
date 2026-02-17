"use client";

import { useState, useEffect } from "react";
import { cocktailApi } from "@/services/cocktailApi";
import { Cocktail } from "@/types";
import { DrinkCard } from "@/components/feature/DrinkCard";
import { CocktailSearch } from "@/components/feature/CocktailSearch";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import GooeyNav from "@/components/ui/GooeyNav";

const ITEMS_PER_PAGE = 12;
const MAIN_DISTILLATES = [
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Whiskey",
  "Brandy",
];

import localCocktailsData from "@/data/cocktails.json";

export default function CocktailsPage() {
  const t = useTranslations("Gallery");
  // Cast to Cocktail[] to ensure types match, though JSON should be compatible
  const localCocktails = localCocktailsData as unknown as Cocktail[];

  const [allCocktails, setAllCocktails] = useState<Cocktail[]>([]);
  const [displayedCocktails, setDisplayedCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // We no longer need to "enrich" manually via API since JSON has it all.
  // But we might need to handle pagination.

  const updateDisplayedPage = (page: number, sourceList = allCocktails) => {
    setLoading(true);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const slice = sourceList.slice(start, end);
    setDisplayedCocktails(slice);
    setLoading(false);
  };

  useEffect(() => {
    if (allCocktails.length > 0) {
      updateDisplayedPage(currentPage);
    }
  }, [currentPage, allCocktails]);

  const fetchDefaultCocktails = () => {
    setLoading(true);
    // Default to Alcoholic drinks or just all
    const drinks = localCocktails.filter((c) => c.strAlcoholic === "Alcoholic");
    setAllCocktails(drinks);
    setCurrentPage(1);
    setLoading(false);
  };

  useEffect(() => {
    fetchDefaultCocktails();
  }, []);

  const [activeFilter, setActiveFilter] = useState<{
    type: string;
    value: string;
  } | null>(null);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      fetchDefaultCocktails();
      setActiveFilter(null);
      return;
    }
    setLoading(true);
    const lowerQ = query.toLowerCase();
    const results = localCocktails.filter((c) =>
      c.strDrink.toLowerCase().includes(lowerQ),
    );
    setAllCocktails(results);
    setCurrentPage(1);
    setActiveFilter({ type: "search", value: query });
    setLoading(false);
  };

  const handleFilter = (
    type: "category" | "alcoholic" | "ingredient",
    value: string,
  ) => {
    setLoading(true);
    let results: Cocktail[] = [];
    if (type === "category") {
      results = localCocktails.filter((c) => c.strCategory === value);
    } else if (type === "alcoholic") {
      results = localCocktails.filter((c) => c.strAlcoholic === value);
    } else if (type === "ingredient") {
      // Check ingredients list or individual fields
      results = localCocktails.filter((c) => {
        // Check formatted list first
        if (
          c.ingredientsList &&
          c.ingredientsList.toLowerCase().includes(value.toLowerCase())
        )
          return true;
        // Fallback to fields
        for (let i = 1; i <= 15; i++) {
          const ing = c[`strIngredient${i}` as keyof Cocktail] as string;
          if (ing && ing.toLowerCase() === value.toLowerCase()) return true;
        }
        return false;
      });
    }
    setAllCocktails(results);
    setCurrentPage(1);
    setActiveFilter({ type, value });
    setLoading(false);
  };

  const clearFilter = () => {
    fetchDefaultCocktails();
    setActiveFilter(null);
  };

  const totalPages = Math.ceil(allCocktails.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold font-secondary text-primary mb-8 text-center">
          {t("title")}
        </h1>

        {/* Distillates List */}
        {/* Distillates List */}
        {/* Distillates List */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          <GooeyNav
            items={MAIN_DISTILLATES.map((spirit) => ({
              label: spirit,
              href: "#",
            }))}
            initialActiveIndex={-1}
            onItemClick={(item) => handleFilter("ingredient", item.label)}
            particleDistances={[50, 80]}
            particleCount={10}
            colors={[1, 2]}
          />
        </div>

        <CocktailSearch onSearch={handleSearch} onFilterChange={handleFilter} />

        {/* Active Filter Display */}
        {activeFilter && (
          <div className="flex justify-center mt-6 mb-8">
            <div className="bg-white border border-[#5C3A2E]/30 rounded-full px-6 py-2 flex items-center gap-3 text-[#5C3A2E] shadow-md">
              <span className="text-sm font-medium">
                {activeFilter.type === "search" ? t("search") : t("filter")}:{" "}
                <span className="font-bold">{activeFilter.value}</span>
              </span>
              <button
                onClick={clearFilter}
                className="hover:bg-[#5C3A2E]/10 rounded-full p-1 transition-colors group"
                aria-label="Clear filter"
              >
                <span className="sr-only">R</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x h-4 w-4 text-[#5C3A2E] group-hover:text-red-500 transition-colors"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {displayedCocktails.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {displayedCocktails.map((cocktail) => (
                    <DrinkCard key={cocktail.idDrink} cocktail={cocktail} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap justify-center items-center gap-4 mt-12 pb-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-primary/20 text-secondary hover:bg-primary/10 hover:text-primary h-12 w-12"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <span className="text-secondary font-medium text-lg">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="border-primary/20 text-secondary hover:bg-primary/10 hover:text-primary h-12 w-12"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-xl">{t("notFound")}</p>
                <p>{t("tryAgain")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
