import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";

const montserratAlternates = Montserrat_Alternates({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat-alternates",
});

export const metadata: Metadata = {
  title: "The Drinking Man | Curadoria de Mixologia & IA",
  description:
    "Explore a coquetelaria moderna com The Drinking Man. Uma coleção curada por um mixologista humano, potencializada por análise de dados e IA.",
  keywords: [
    "Mixologia",
    "Barman",
    "Coquetéis",
    "IA Sommelier",
    "Sugestor de Drinks",
    "Análise de Dados",
    "Receitas de Drinks",
    "The Drinking Man",
  ],
  authors: [{ name: "The Drinking Man Creator" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${montserratAlternates.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
