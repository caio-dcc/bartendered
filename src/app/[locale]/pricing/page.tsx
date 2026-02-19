import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Wine, QrCode, BarChart3 } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-primary font-secondary">
            Bartendered for Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Digitize your bar's inventory, offer a smart AI Sommelier to your
            customers, and reduce waste with our intelligent platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="bg-card border border-primary/20 rounded-xl p-8 flex flex-col hover:border-primary/50 transition-colors">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-primary">Starter</h3>
              <div className="text-3xl font-bold mt-2">
                $0{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  / month
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                Perfect for home bars and small events.
              </p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> AI Cocktail
                Suggestions
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Basic Inventory
                Management
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Manual QR Code
                Sharing
              </li>
            </ul>
            <Link href="/bar/register" className="w-full">
              <Button variant="outline" className="w-full">
                Start for Free
              </Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative bg-primary/5 border border-primary rounded-xl p-8 flex flex-col shadow-2xl transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-primary">Pro Bar</h3>
              <div className="text-3xl font-bold mt-2">
                $29{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  / month
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">
                For professional bars aiming to increase sales.
              </p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />{" "}
                <strong>Everything in Starter</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Real-time Inventory
                Sync
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Printed QR Code
                Assets
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Customer Analytics
              </li>
            </ul>
            <Link href="/bar/register" className="w-full">
              <Button className="w-full font-bold">Get Started</Button>
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-card border border-primary/20 rounded-xl p-8 flex flex-col hover:border-primary/50 transition-colors">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-primary">Enterprise</h3>
              <div className="text-3xl font-bold mt-2">Custom</div>
              <p className="text-muted-foreground text-sm mt-2">
                For chains and large venues.
              </p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Multi-location
                Support
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> POS Integration
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" /> Dedicated Account
                Manager
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-card rounded-xl border border-primary/10">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Inventory</h3>
            <p className="text-muted-foreground">
              Track every bottle. Reduce waste and know exactly what you can
              serve at any moment.
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-primary/10">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wine className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Sommelier</h3>
            <p className="text-muted-foreground">
              Give your customers a personalized digital mixologist that
              suggests drinks based on their mood.
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-xl border border-primary/10">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Menu</h3>
            <p className="text-muted-foreground">
              Generate a dynamic QR code menu that automatically updates based
              on your stock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
