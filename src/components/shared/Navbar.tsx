"use client";

import Link from "next/link";
import { Wine, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GooeyNav from "@/components/ui/GooeyNav";

export function Navbar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const handleLanguageChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <nav className="w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Wine className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">
            The Drinking Man
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <div className="hidden md:block">
            <GooeyNav
              items={[
                { label: t("about"), href: "/#about" },
                { label: t("drinkingman"), href: "/#drinkingman" },
                { label: t("cocktails"), href: "/cocktails" },
              ]}
              initialActiveIndex={-1}
            />
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select onValueChange={handleLanguageChange} defaultValue={locale}>
              <SelectTrigger className="w-[70px] h-8 bg-secondary border-none focus:ring-0 px-1 text-primary-foreground hover:text-primary-foreground/90 shadow-sm">
                <SelectValue placeholder="Lang" />
              </SelectTrigger>
              <SelectContent className="bg-secondary text-primary-foreground">
                <SelectItem
                  value="pt"
                  className="focus:bg-primary/20 focus:text-primary-foreground"
                >
                  PT
                </SelectItem>
                <SelectItem
                  value="en"
                  className="focus:bg-primary/20 focus:text-primary-foreground"
                >
                  EN
                </SelectItem>
                <SelectItem
                  value="es"
                  className="focus:bg-primary/20 focus:text-primary-foreground"
                >
                  ES
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </nav>
  );
}
