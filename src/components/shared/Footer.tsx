export function Footer() {
  return (
    <footer className="w-full py-6 border-t border-border/10 bg-background">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-2">
        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} DrinkPortfolio. All rights reserved.
        </p>
        <p className="text-xs text-foreground/40">Designed with ❤️ and 🍸</p>
      </div>
    </footer>
  );
}
