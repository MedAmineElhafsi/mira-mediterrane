import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CartProvider } from "@/hooks/useCart";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/ui/cookie-banner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Online Bestellen – Mira Mediterrane Küche",
    template: "%s | Mira Mediterrane Küche",
  },
  description:
    "Bestellen Sie online bei Mira Mediterrane Küche in Merseburg. Authentische mediterrane und syrisch-arabische Spezialitäten – frisch zubereitet und direkt zu Ihnen geliefert.",
  keywords:
    "Mira Restaurant, Online Bestellen, Merseburg, Shawarma, Falafel, Mediterran, Lieferung",
  openGraph: {
    title: "Online Bestellen – Mira Mediterrane Küche",
    description:
      "Authentische mediterrane Küche aus Merseburg – jetzt online bestellen!",
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <CartProvider>
            <CookieBanner />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 bg-sand-light pt-20">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
