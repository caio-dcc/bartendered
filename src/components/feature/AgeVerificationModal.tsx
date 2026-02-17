"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";
import { useTranslations } from "next-intl";

export function AgeVerificationModal() {
  // We don't use useTranslations here yet to ensure hardcoded fallback or we need to ensure i18n is ready.
  // Using hardcoded PT-BR for now as requested "The Drinking Boy" context is specific.
  // Actually, let's try to use i18n if possible, or fallback to Portuguese since the user emphasized it.

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isOver18 = localStorage.getItem("isOver18");
    if (isOver18 !== "true") {
      setIsOpen(true);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem("isOver18", "true");
    setIsOpen(false);
  };

  const handleNo = () => {
    localStorage.setItem("isOver18", "false");
    window.location.href = "https://www.google.com"; // Redirect away or show block message
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
      <div className="max-w-md w-full bg-background border border-[#5C3A2E] rounded-xl p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#5C3A2E]/10 rounded-full">
            <Wine className="w-12 h-12 text-[#5C3A2E]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#5C3A2E] mb-2 font-secondary">
          The Drinking Man
        </h2>
        <p className="text-muted-foreground mb-8">
          Você precisa ter 18 anos ou mais para acessar este site.
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleNo}
            className="w-32 border-[#5C3A2E] text-[#5C3A2E] hover:bg-[#5C3A2E]/10"
          >
            Não
          </Button>
          <Button
            onClick={handleYes}
            className="w-32 bg-[#5C3A2E] text-white hover:bg-[#5C3A2E]/90"
          >
            Sim
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/50 mt-8">
          Ao entrar, você concorda com nossos termos de uso. Beba com moderação.
        </p>
      </div>
    </div>
  );
}
