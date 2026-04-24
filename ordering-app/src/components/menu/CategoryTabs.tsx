"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export function CategoryTabs({ categories, activeSlug, onSelect }: CategoryTabsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              activeSlug === cat.slug
                ? "bg-terracotta text-white shadow-md"
                : "bg-sand text-charcoal hover:bg-sand-dark"
            }`}
            aria-label={`Kategorie ${cat.name} anzeigen`}
          >
            <span>{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
