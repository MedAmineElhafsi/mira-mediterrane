"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
  onClose: () => void;
}

export function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, itemCount, subtotalCents, updateQuantity, removeItem } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <ShoppingBag className="w-16 h-16 text-sand-dark mb-4" />
        <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
          Ihr Warenkorb ist leer
        </h3>
        <p className="text-sm text-charcoal/60 mb-6">
          Entdecken Sie unsere leckere Speisekarte und fügen Sie Gerichte hinzu.
        </p>
        <Button
          onClick={onClose}
          className="bg-terracotta hover:bg-terracotta-dark text-white"
        >
          Speisekarte ansehen
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-terracotta" />
          Warenkorb
          <span className="text-sm font-normal text-charcoal/60">
            ({itemCount} {itemCount === 1 ? "Artikel" : "Artikel"})
          </span>
        </h2>
      </div>

      <Separator />

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-sand-light rounded-xl p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-charcoal text-sm">
                  {item.name}
                </h4>
                {item.variantName && (
                  <p className="text-xs text-charcoal/60">{item.variantName}</p>
                )}
                {item.specialInstructions && (
                  <p className="text-xs text-olive italic mt-1">
                    „{item.specialInstructions}"
                  </p>
                )}
              </div>
              <span className="font-semibold text-terracotta text-sm ml-4">
                {formatPrice(item.priceCents * item.quantity)}
              </span>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-sand-dark"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Menge verringern"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-semibold w-6 text-center">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-sand-dark"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Menge erhöhen"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => removeItem(item.id)}
                aria-label="Artikel entfernen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Footer with total and checkout */}
      <div className="p-6 space-y-4 bg-white">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-charcoal">Zwischensumme</span>
          <span className="font-bold text-lg text-terracotta">
            {formatPrice(subtotalCents)}
          </span>
        </div>
        <p className="text-xs text-charcoal/50">
          Liefergebühr und MwSt. werden im Checkout berechnet.
        </p>
        <Link href="/checkout" onClick={onClose}>
          <Button className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-6 text-base font-semibold rounded-xl">
            Zur Kasse ({formatPrice(subtotalCents)})
          </Button>
        </Link>
      </div>
    </div>
  );
}
