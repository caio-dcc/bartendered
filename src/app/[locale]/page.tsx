import { Footer } from "@/components/shared/Footer";
import { HeroSection } from "@/components/feature/HeroSection";
import { AboutSection } from "@/components/feature/AboutSection";
import { DrinkingManForm } from "@/components/feature/DrinkingManForm";

import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <AboutSection />
      <Suspense
        fallback={
          <div className="h-96 w-full flex items-center justify-center text-primary">
            Loading...
          </div>
        }
      >
        <DrinkingManForm />
      </Suspense>
    </main>
  );
}
