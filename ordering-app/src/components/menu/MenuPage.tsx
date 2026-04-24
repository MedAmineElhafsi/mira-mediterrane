"use client";

import { useState } from "react";
import { CategoryTabs } from "./CategoryTabs";
import { MenuItemCard } from "./MenuItemCard";
import { isOpenForOrders, getTodayHours, getNextOpenTime } from "@/lib/hours";
import { RESTAURANT } from "@/lib/constants";
import { Clock, MapPin, Phone, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Variant {
  id: string;
  name: string;
  priceCents: number;
  sortOrder: number;
}

interface MenuItem {
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  priceCents: number | null;
  imageUrl: string | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  isBeverage: boolean;
  available: boolean;
  variants: Variant[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  items: MenuItem[];
}

interface MenuPageProps {
  categories: Category[];
}

export function MenuPage({ categories }: MenuPageProps) {
  const [activeSlug, setActiveSlug] = useState(
    categories.length > 0 ? categories[0].slug : ""
  );

  const activeCategory = categories.find((c) => c.slug === activeSlug);
  const isOpen = isOpenForOrders();

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-charcoal to-[#1a1208] text-white py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-terracotta-light text-sm font-semibold uppercase tracking-widest">
            Online Bestellen
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Mira <span className="text-terracotta-light italic">Speisekarte</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto mb-6">
            Wählen Sie Ihre Lieblingsgerichte und bestellen Sie bequem online –
            zur Lieferung oder Abholung.
          </p>

          {/* Info bar */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-white/70">
              <Clock className="w-4 h-4" />
              <span>Heute: {getTodayHours()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70">
              <MapPin className="w-4 h-4" />
              <span>{RESTAURANT.address}</span>
            </div>
            <a
              href={`tel:${RESTAURANT.phone}`}
              className="flex items-center gap-1.5 text-terracotta-light hover:text-terracotta transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{RESTAURANT.phone}</span>
            </a>
          </div>

          {/* Closed warning */}
          {!isOpen && (
            <div className="mt-6 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-200 px-4 py-2 rounded-full text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>
                Aktuell geschlossen. Nächste Bestellmöglichkeit: {getNextOpenTime()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Category tabs */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm pb-4 pt-2 -mx-4 px-4">
          <CategoryTabs
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              emoji: c.emoji,
            }))}
            activeSlug={activeSlug}
            onSelect={setActiveSlug}
          />
        </div>

        {/* Active category items */}
        {activeCategory && (
          <div>
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-bold text-charcoal flex items-center gap-2">
                <span>{activeCategory.emoji}</span>
                {activeCategory.name}
              </h2>
            </div>

            <div className="divide-y divide-sand-dark">
              {activeCategory.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  id={item.id}
                  code={item.code || undefined}
                  name={item.name}
                  description={item.description || undefined}
                  priceCents={item.priceCents}
                  imageUrl={item.imageUrl || undefined}
                  isVegetarian={item.isVegetarian}
                  isVegan={item.isVegan}
                  isSpicy={item.isSpicy}
                  isBeverage={item.isBeverage}
                  available={item.available}
                  variants={item.variants}
                />
              ))}
            </div>

            {activeCategory.items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-charcoal/50">
                  Keine Gerichte in dieser Kategorie verfügbar.
                </p>
              </div>
            )}
          </div>
        )}

        <Separator className="my-8" />

        {/* Bottom info */}
        <div className="text-center pb-8">
          <p className="text-sm text-charcoal/50 mb-2">
            Haben Sie Fragen zu Allergenen oder besonderen Diätwünschen?
          </p>
          <a
            href={`tel:${RESTAURANT.phone}`}
            className="inline-flex items-center gap-2 text-terracotta font-semibold hover:text-terracotta-dark transition-colors"
          >
            📞 Jetzt anrufen & informieren
          </a>
        </div>
      </div>
    </div>
  );
}
