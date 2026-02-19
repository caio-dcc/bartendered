"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Wine,
  BookOpen,
  DollarSign,
  Home,
  User,
  GlassWater,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("about"), icon: Home },
    { href: "/#drinkingman", label: t("drinkingman"), icon: User },
    { href: "/cocktails", label: t("cocktails"), icon: GlassWater },
    { href: "/articles", label: "Articles", icon: BookOpen },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
  ];

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/10"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="bg-background border-l border-primary/20 w-[300px] sm:w-[400px]"
        >
          <div className="flex flex-col h-full py-6">
            <div className="flex items-center space-x-2 mb-8 px-2">
              <Wine className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary font-secondary">
                The Drinking Man
              </span>
            </div>

            <nav className="flex flex-col space-y-2">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.replace("/#", ""));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto px-4">
              <Link href="/bar/register" onClick={() => setOpen(false)}>
                <Button className="w-full font-bold">Owner Login</Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
