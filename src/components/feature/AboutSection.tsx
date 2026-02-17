import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Languages, ScrollText } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function AboutSection() {
  const t = await getTranslations("About");

  return (
    <section
      id="about"
      className="py-20 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            {t("badge")}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold font-secondary text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Languages */}
          <Card className="bg-card border-primary/10 hover:border-primary/30 transition-colors shadow-lg">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Languages className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-secondary text-card-foreground">
                {t("languages")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-card-foreground">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("english")}</span>
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  {t("advanced")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("spanish")}</span>
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  {t("basic")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("portuguese")}</span>
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  {t("native")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="bg-card border-primary/10 hover:border-primary/30 transition-colors shadow-lg">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Award className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-secondary text-card-foreground">
                {t("certifications")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium leading-none">Diageo Bar Academy</p>
                  <p className="text-sm text-secondary/80 mt-1">
                    {t("bartending")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Philosophy */}
          <Card className="bg-card border-primary/10 hover:border-primary/30 transition-colors shadow-lg md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <ScrollText className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-secondary text-card-foreground">
                {t("philosophy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground/90 italic">"{t("quote")}"</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="text-primary border-primary/40 bg-primary/5"
                >
                  Molecular Mixology
                </Badge>
                <Badge
                  variant="outline"
                  className="text-primary border-primary/40 bg-primary/5"
                >
                  Sustainable Bar
                </Badge>
                <Badge
                  variant="outline"
                  className="text-primary border-primary/40 bg-primary/5"
                >
                  Storytelling
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
