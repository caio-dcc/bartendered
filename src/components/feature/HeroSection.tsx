import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function HeroSection() {
  const t = await getTranslations("Hero");
  const tNav = await getTranslations("Navigation");

  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?q=80&w=1920&auto=format&fit=crop"
          alt="Bar Background"
          className="w-full h-full object-cover scale-105 blur-[1px]"
        />
      </div>

      <div className="relative z-20 text-center container px-4 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-secondary tracking-wider">
          {t("title")}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#drinkingman">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-lg shadow-primary/20"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {t("cta_primary")}
            </Button>
          </Link>
          <Link href="/cocktails">
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10 font-semibold px-8 py-6 text-lg"
            >
              <Search className="mr-2 h-5 w-5" />
              {t("cta_secondary")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
