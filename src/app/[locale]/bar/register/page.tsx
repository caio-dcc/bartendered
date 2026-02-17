"use client";

import { useState, useEffect } from "react";
import { useBarStore } from "@/store/useBarStore";
import { InventoryManager } from "@/components/feature/InventoryManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { QrCode, Clipboard, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function BarRegistrationPage() {
  const t = useTranslations("Common"); // Need to ensure we have translations, using Common fallback
  const { barName, setBarName, inventory } = useBarStore();
  const [generatedLink, setGeneratedLink] = useState("");

  // Determine the base URL
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const generateLink = () => {
    // Filter out unavailable ingredients
    const unavailable = inventory
      .filter((i) => !i.available)
      .map((i) => i.name)
      .join(",");

    const params = new URLSearchParams();
    if (barName) params.append("barName", barName);
    if (unavailable) params.append("unavailable", unavailable);

    const link = `${origin}?${params.toString()}#drinkingman`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    // Could add a toast here
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-secondary text-primary">
          Bar Partner Portal
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Configure your bar's inventory and generate a QR code for your
          customers. The Drinking Man will only suggest drinks you can actually
          make.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Bar Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Bar Name
                </label>
                <Input
                  value={barName}
                  onChange={(e) => setBarName(e.target.value)}
                  placeholder="e.g. Moe's Tavern"
                  className="bg-white/5"
                />
              </div>
            </CardContent>
          </Card>

          <InventoryManager />
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Your Digital Menu Link
              </CardTitle>
              <CardDescription>
                Generate a link that encodes your current inventory status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={generateLink} size="lg" className="w-full">
                Generate QR / Link
              </Button>

              {generatedLink && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-4 bg-white rounded-lg border-4 border-primary/20 flex items-center justify-center">
                    {/* Placeholder for QR Code - in a real app use a library */}
                    <div className="text-center text-slate-800 space-y-2">
                      <QrCode className="w-32 h-32 mx-auto opacity-80" />
                      <p className="text-xs font-mono text-slate-500">
                        Scan to view {barName}'s Menu
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase font-bold">
                      Shareable Link
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="font-mono text-xs bg-black/20"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={copyToClipboard}
                      >
                        <Clipboard className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button asChild variant="secondary" className="w-full">
                    <a
                      href={generatedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 w-4 h-4" />
                      Test Link (Simulate User)
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
