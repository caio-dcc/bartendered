"use client";

import { useBarStore } from "@/store/useBarStore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function InventoryManager() {
  const { inventory, toggleIngredient } = useBarStore();
  const t = useTranslations("Common"); // Assuming common translations or add new ones

  // Group by category
  const groupedInventory = inventory.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof inventory>,
  );

  return (
    <Card className="w-full bg-card/50 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl font-secondary text-primary">
          Bar Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedInventory).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Label
                          htmlFor={`toggle-${item.name}`}
                          className={`cursor-pointer ${
                            !item.available &&
                            "text-muted-foreground line-through opacity-70"
                          }`}
                        >
                          {item.name}
                        </Label>
                        {!item.available && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5 px-1.5"
                          >
                            Out
                          </Badge>
                        )}
                      </div>
                      <Switch
                        id={`toggle-${item.name}`}
                        checked={item.available}
                        onCheckedChange={() => toggleIngredient(item.name)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
