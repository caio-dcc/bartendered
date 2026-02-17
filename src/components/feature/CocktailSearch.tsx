"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface CocktailSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (type: "category" | "alcoholic", value: string) => void;
}

export function CocktailSearch({
  onSearch,
  onFilterChange,
}: CocktailSearchProps) {
  const t = useTranslations("Search");
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 rounded-lg bg-transparent">
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <Input
          placeholder={t("placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="!bg-transparent !border-white/30 focus:!border-white !text-white placeholder:!text-white/60 shadow-none h-10"
          style={{ backgroundColor: "transparent", color: "white" }}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 border border-primary/20"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select onValueChange={(val) => onFilterChange("category", val)}>
          <SelectTrigger
            className="w-full sm:w-[140px] !bg-transparent !border-white/30 !text-white shadow-none h-10 hover:!bg-white/5 transition-colors"
            style={{ backgroundColor: "transparent", color: "white" }}
          >
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent className="!bg-background !text-foreground !border-primary/20">
            <SelectItem value="Cocktail">{t("cocktail")}</SelectItem>
            <SelectItem value="Ordinary_Drink">{t("ordinary")}</SelectItem>
            <SelectItem value="Shake">{t("shake")}</SelectItem>
            <SelectItem value="Cocoa">{t("cocoa")}</SelectItem>
            <SelectItem value="Shot">{t("shot")}</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => onFilterChange("alcoholic", val)}>
          <SelectTrigger
            className="w-full sm:w-[140px] !bg-transparent !border-white/30 !text-white shadow-none h-10 hover:!bg-white/5 transition-colors"
            style={{ backgroundColor: "transparent", color: "white" }}
          >
            <SelectValue placeholder={t("type")} />
          </SelectTrigger>
          <SelectContent className="!bg-background !text-foreground !border-primary/20">
            <SelectItem value="Alcoholic">{t("alcoholic")}</SelectItem>
            <SelectItem value="Non_Alcoholic">{t("non_alcoholic")}</SelectItem>
            <SelectItem value="Optional_Alcohol">{t("optional")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
