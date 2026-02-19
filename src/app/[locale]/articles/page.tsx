import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export default function ArticlesPage() {
  const t = useTranslations("Navbar"); // Using Navbar namespace for common terms temporarily

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-primary font-secondary">
          Articles & Insights
        </h1>
        <p className="text-xl text-muted-foreground">
          Explore the world of mixology, spirits history and bar management
          tips.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-primary/20 rounded-xl p-6 hover:shadow-lg transition-all text-left"
            >
              <Badge variant="outline" className="mb-4">
                Coming Soon
              </Badge>
              <h3 className="text-xl font-bold text-foreground mb-2">
                The Art of Mixology Vol. {i}
              </h3>
              <p className="text-muted-foreground text-sm">
                Detailed insights into the craft of cocktail making. Stay tuned
                for expert advice.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
