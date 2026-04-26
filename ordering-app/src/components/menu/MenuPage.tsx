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
    <div id="menu" className="min-h-screen bg-white">
      {/* Menu content */}
      <div className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
        
        <div className="text-center mb-12">
          <span className="text-terracotta text-sm font-semibold uppercase tracking-widest">
            Unsere Karte
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-charcoal mt-3 mb-4">
            Speisekarte
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Alle Gerichte werden täglich frisch und mit hochwertigen Zutaten zubereitet. Wählen Sie Ihre Lieblingsgerichte und bestellen Sie bequem online.
          </p>
        </div>

        {/* Closed warning */}
        {!isOpen && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 px-4 py-2 rounded-full text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>
                Aktuell geschlossen. Nächste Bestellmöglichkeit: {getNextOpenTime()}
              </span>
            </div>
          </div>
        )}
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
