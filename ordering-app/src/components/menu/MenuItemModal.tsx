"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface Variant {
  id: string;
  name: string;
  priceCents: number;
}

interface MenuItemModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    id: string;
    code?: string;
    name: string;
    description?: string;
    priceCents: number | null;
    isVegetarian: boolean;
    isVegan: boolean;
    isSpicy: boolean;
    isBeverage: boolean;
    variants: Variant[];
  };
}

export function MenuItemModal({ open, onClose, item }: MenuItemModalProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    item.variants.length > 0 ? item.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  const effectivePrice = selectedVariant
    ? selectedVariant.priceCents
    : item.priceCents;

  const handleAdd = () => {
    if (effectivePrice == null) return;

    const cartId = selectedVariant
      ? `${item.id}-${selectedVariant.id}`
      : item.id;

    addItem({
      id: cartId,
      menuItemId: item.id,
      variantId: selectedVariant?.id,
      name: item.code ? `${item.code} – ${item.name}` : item.name,
      variantName: selectedVariant?.name,
      priceCents: effectivePrice,
      quantity,
      specialInstructions: instructions || undefined,
      isBeverage: item.isBeverage,
    });

    toast.success(`${item.name} zum Warenkorb hinzugefügt`, {
      description: `${quantity}× ${formatPrice(effectivePrice)}`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {item.code && (
              <span className="text-charcoal/50 mr-2">{item.code}</span>
            )}
            {item.name}
          </DialogTitle>
        </DialogHeader>

        {item.description && (
          <p className="text-sm text-charcoal/60 -mt-2">{item.description}</p>
        )}

        {/* Variant selection */}
        {item.variants.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Variante wählen</Label>
            <div className="space-y-2">
              {item.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedVariant?.id === variant.id
                      ? "border-terracotta bg-terracotta/5"
                      : "border-sand-dark hover:border-terracotta/30"
                  }`}
                >
                  <span className="text-sm font-medium">{variant.name}</span>
                  <span className="text-sm font-semibold text-terracotta">
                    {formatPrice(variant.priceCents)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Menge</Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold w-8 text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Special instructions */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Besondere Wünsche{" "}
            <span className="font-normal text-charcoal/50">(optional)</span>
          </Label>
          <Textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="z.B. ohne Zwiebeln, extra scharf..."
            className="resize-none"
            rows={2}
          />
        </div>

        {/* Add button */}
        <Button
          onClick={handleAdd}
          disabled={effectivePrice == null}
          className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-6 text-base font-semibold"
        >
          Hinzufügen · {effectivePrice != null ? formatPrice(effectivePrice * quantity) : "—"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
