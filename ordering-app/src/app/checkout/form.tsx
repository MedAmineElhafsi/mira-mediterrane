"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";
import { getTaxBreakdown } from "@/lib/tax";
import { isWithinDeliveryRadius, getDeliveryFeeCents, getEstimatedDeliveryTime, getEstimatedPickupTime, meetsMinimumOrder } from "@/lib/delivery";
import { TIP_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Store, Truck, MapPin } from "lucide-react";

export function CheckoutForm({ user }: { user: any }) {
  const { items, subtotalCents, clearCart } = useCart();
  
  const [orderType, setOrderType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [tipIndex, setTipIndex] = useState(0);
  
  // Address state
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Merseburg");
  const [postalCode, setPostalCode] = useState("06217");
  const [addressNotes, setAddressNotes] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  // Hardcode coordinates for user address validation (simplified - real app uses geocoding API)
  const isDeliveryValid = isWithinDeliveryRadius(51.355, 11.995); // Example proxy for "in Merseburg"
  
  const deliveryFee = orderType === "DELIVERY" ? getDeliveryFeeCents() : 0;
  const tipAmount = Math.round(subtotalCents * TIP_OPTIONS[tipIndex].value);
  const totalAmount = subtotalCents + deliveryFee + tipAmount;

  const taxes = getTaxBreakdown(items);

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-sand-dark text-center">
        Ihr Warenkorb ist leer.
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderType === "DELIVERY" && !meetsMinimumOrder(subtotalCents)) {
      toast.error("Mindestbestellwert für Lieferung nicht erreicht.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          orderType,
          tipCents: tipAmount,
          specialInstructions,
          deliveryAddress: orderType === "DELIVERY" ? {
            street, city, postalCode, notes: addressNotes
          } : null,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const { url } = await res.json();
      window.location.href = url; // Redirect to Stripe
    } catch (error: any) {
      toast.error("Fehler beim Checkout", { description: error.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="space-y-8">
        {/* Order Type Selection */}
        <section className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm">
          <h2 className="text-lg font-bold text-charcoal mb-4">Bestellart</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOrderType("DELIVERY")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${
                orderType === "DELIVERY" 
                  ? "border-terracotta bg-terracotta/5 text-terracotta" 
                  : "border-sand-dark text-charcoal/70 hover:border-terracotta/40"
              }`}
            >
              <Truck className="w-6 h-6" />
              <span className="font-semibold text-sm">Lieferung</span>
              <span className="text-xs opacity-70">{getEstimatedDeliveryTime()}</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderType("PICKUP")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${
                orderType === "PICKUP" 
                  ? "border-terracotta bg-terracotta/5 text-terracotta" 
                  : "border-sand-dark text-charcoal/70 hover:border-terracotta/40"
              }`}
            >
              <Store className="w-6 h-6" />
              <span className="font-semibold text-sm">Abholung</span>
              <span className="text-xs opacity-70">{getEstimatedPickupTime()}</span>
            </button>
          </div>
        </section>

        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
          {/* Delivery Address */}
          {orderType === "DELIVERY" && (
            <section className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
                <MapPin className="w-5 h-5 text-terracotta" />
                Lieferadresse
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Straße und Hausnummer</Label>
                  <Input 
                    id="street" 
                    value={street} 
                    onChange={(e) => setStreet(e.target.value)} 
                    required 
                    placeholder="Bsp. Bahnhofstraße 1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal">PLZ</Label>
                    <Input 
                      id="postal" 
                      value={postalCode} 
                      onChange={(e) => setPostalCode(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ort</Label>
                    <Input 
                      id="city" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressNotes">Zusatzinfos <span className="font-normal text-muted-foreground">(Etage, Hinterhaus, etc.)</span></Label>
                  <Input 
                    id="addressNotes" 
                    value={addressNotes} 
                    onChange={(e) => setAddressNotes(e.target.value)} 
                  />
                </div>
              </div>
            </section>
          )}

          {/* Special Instructions global */}
          <section className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-charcoal">Anmerkungen zur Bestellung</h2>
            <Textarea 
              placeholder="Besondere Hinweise für die Küche..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </section>
        </form>
      </div>

      {/* Summary sidebar */}
      <div className="bg-sand-light p-6 rounded-2xl border border-sand-dark sticky top-24">
        <h2 className="text-xl font-serif font-bold text-charcoal mb-4">Bestellübersicht</h2>
        
        <div className="space-y-3 mb-6 max-h-60 overflow-auto pr-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <span className="font-semibold">{item.quantity}x</span> {item.name}
                {item.variantName && <span className="text-charcoal/60 ml-1">({item.variantName})</span>}
              </div>
              <span className="text-charcoal font-medium">{formatPrice(item.priceCents * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator className="bg-sand-dark mb-4" />

        <div className="space-y-2 text-sm text-charcoal">
          <div className="flex justify-between">
            <span>Zwischensumme</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          {orderType === "DELIVERY" && (
            <div className="flex justify-between">
              <span>Lieferkosten</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}

          {/* Tip */}
          <div className="pt-4 pb-2">
            <Label className="mb-2 block">Trinkgeld hinzufügen?</Label>
            <div className="flex gap-2">
              {TIP_OPTIONS.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTipIndex(idx)}
                  className={`flex-1 py-1.5 text-xs rounded-md border font-medium transition-colors ${
                    tipIndex === idx
                      ? "bg-olive text-white border-olive"
                      : "bg-white text-charcoal border-sand-dark hover:bg-sand"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          {tipAmount > 0 && (
            <div className="flex justify-between text-olive font-medium">
              <span>Trinkgeld</span>
              <span>{formatPrice(tipAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-xs text-charcoal/50 pt-2">
            <span>Inkl. 7% MwSt. (Speisen)</span>
            <span>{formatPrice(taxes.foodTax)}</span>
          </div>
          {taxes.beverageTax > 0 && (
            <div className="flex justify-between text-xs text-charcoal/50">
              <span>Inkl. 19% MwSt. (Getränke)</span>
              <span>{formatPrice(taxes.beverageTax)}</span>
            </div>
          )}
        </div>

        <Separator className="bg-sand-dark my-4" />

        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-lg">Gesamtsumme</span>
          <span className="font-bold text-xl text-terracotta">{formatPrice(totalAmount)}</span>
        </div>

        <Button 
          form="checkout-form"
          type="submit" 
          disabled={isLoading || (orderType === "DELIVERY" && !meetsMinimumOrder(subtotalCents))}
          className="w-full bg-terracotta hover:bg-terracotta-dark text-white py-6 text-base font-semibold"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Zahlungspflichtig bestellen
        </Button>
      </div>
    </div>
  );
}
