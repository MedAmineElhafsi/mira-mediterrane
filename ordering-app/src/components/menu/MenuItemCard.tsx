"use client";

import { formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Leaf, Flame } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { MenuItemModal } from "./MenuItemModal";

interface Variant {
  id: string;
  name: string;
  priceCents: number;
}

interface MenuItemCardProps {
  id: string;
  code?: string;
  name: string;
  description?: string;
  priceCents: number | null;
  imageUrl?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  isBeverage: boolean;
  available: boolean;
  variants: Variant[];
}

export function MenuItemCard({
  id,
  code,
  name,
  description,
  priceCents,
  isVegetarian,
  isVegan,
  isSpicy,
  isBeverage,
  available,
  variants,
}: MenuItemCardProps) {
  const { addItem } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const hasVariants = variants.length > 0;

  const handleQuickAdd = () => {
    if (!available) return;
    if (hasVariants) {
      setModalOpen(true);
      return;
    }
    if (priceCents == null) return;

    addItem({
      id,
      menuItemId: id,
      name: code ? `${code} – ${name}` : name,
      priceCents,
      quantity: 1,
      isBeverage,
    });
    toast.success(`${name} zum Warenkorb hinzugefügt`, {
      description: formatPrice(priceCents),
    });
  };

  return (
    <>
      <div
        className={`flex items-center justify-between py-4 px-3 rounded-xl transition-colors group ${
          available
            ? "hover:bg-sand/50 cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }`}
        onClick={available ? () => (hasVariants ? setModalOpen(true) : handleQuickAdd()) : undefined}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-charcoal text-sm">
              {code && (
                <span className="text-charcoal/50 mr-1">{code} –</span>
              )}
              {name}
            </span>
            {isVegan && (
              <Badge
                variant="outline"
                className="bg-olive/10 text-olive border-olive/20 text-[10px] px-1.5 py-0"
              >
                <Leaf className="w-3 h-3 mr-0.5" />
                Vegan
              </Badge>
            )}
            {isVegetarian && !isVegan && (
              <Badge
                variant="outline"
                className="bg-olive/10 text-olive border-olive/20 text-[10px] px-1.5 py-0"
              >
                Veg
              </Badge>
            )}
            {isSpicy && (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-600 border-red-200 text-[10px] px-1.5 py-0"
              >
                <Flame className="w-3 h-3 mr-0.5" />
                Scharf
              </Badge>
            )}
            {!available && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                Ausverkauft
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-charcoal/50 mt-0.5 line-clamp-2">
              {description}
            </p>
          )}
          {hasVariants && (
            <div className="mt-1 space-y-0.5">
              {variants.map((v) => (
                <span key={v.id} className="text-xs text-charcoal/50 block">
                  {v.name}: <span className="text-terracotta font-medium">{formatPrice(v.priceCents)}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 ml-4 shrink-0">
          {!hasVariants && (
            <span className="font-semibold text-terracotta whitespace-nowrap">
              {formatPrice(priceCents)}
            </span>
          )}
          {available && priceCents != null && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleQuickAdd();
              }}
              aria-label={`${name} hinzufügen`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          {available && hasVariants && (
            <Button
              variant="outline"
              size="sm"
              className="border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-white transition-colors text-xs opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              aria-label={`${name} konfigurieren`}
            >
              Auswählen
            </Button>
          )}
        </div>
      </div>

      {modalOpen && (
        <MenuItemModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={{ id, code, name, description, priceCents, isVegetarian, isVegan, isSpicy, isBeverage, variants }}
        />
      )}
    </>
  );
}
