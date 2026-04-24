"use client";

import { useSSE } from "@/hooks/useSSE";
import { formatPrice, formatDateTime, generateOrderNumber } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Clock, ChefHat, Truck, MapPin, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  { status: "PENDING_PAYMENT", label: "Warten auf Zahlung", icon: Clock },
  { status: "PAID", label: "Bestellung erhalten", icon: CheckCircle2 },
  { status: "PREPARING", label: "Wird zubereitet", icon: ChefHat },
  { status: "READY_FOR_PICKUP", label: "Bereit zur Abholung", icon: Store, only: "PICKUP" },
  { status: "OUT_FOR_DELIVERY", label: "Auf dem Weg", icon: Truck, only: "DELIVERY" },
  { status: "DELIVERED", label: "Zugestellt", icon: MapPin, only: "DELIVERY" },
  { status: "COMPLETED", label: "Abgeschlossen", icon: CheckCircle2, only: "PICKUP" },
];

export function OrderTrackerClient({ initialOrder }: { initialOrder: any }) {
  // Listen for real-time updates
  const { data: updatedOrder } = useSSE<any>(`/api/orders/${initialOrder.id}/sse`);
  const order = updatedOrder || initialOrder;

  // Filter steps based on order type
  const orderSteps = STEPS.filter(
    (step) => !step.only || step.only === order.type
  );

  const currentStepIndex = orderSteps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-sand-dark shadow-sm">
        <div>
          <div className="text-sm text-charcoal/60">Bestellnummer</div>
          <h1 className="font-mono text-2xl font-bold">{generateOrderNumber(order.id)}</h1>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="bg-sand text-charcoal mb-2">
            {order.type === "DELIVERY" ? "Lieferung" : "Abholung"}
          </Badge>
          <div className="text-sm text-charcoal/60">{formatDateTime(order.createdAt)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Col: Order Tracker */}
        <div className="bg-white p-8 rounded-2xl border border-sand-dark shadow-sm">
          <h2 className="text-xl font-serif font-bold mb-8">Bestellstatus</h2>
          
          {isCancelled ? (
            <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <div className="font-bold">Bestellung storniert</div>
                <div className="text-sm">Ihre Bestellung wurde leider storniert.</div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line connector */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-sand-dark -z-10" />
              
              <div className="space-y-8 z-10 relative">
                {orderSteps.map((step, idx) => {
                  const isCompleted = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className={`flex gap-6 ${isCompleted ? 'text-charcoal' : 'text-charcoal/30'}`}>
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 shrink-0
                        ${isCurrent ? 'border-terracotta text-terracotta shadow-md' : isCompleted ? 'border-olive bg-olive text-white' : 'border-sand-dark'}
                      `}>
                        {isCompleted && !isCurrent ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <div className="pt-2">
                        <h3 className={`font-bold ${isCurrent ? 'text-terracotta' : ''}`}>
                          {step.label}
                        </h3>
                        {/* Optional: Show timestamp if we have it in statusEvents */}
                        {isCompleted && order.statusEvents && (
                          <div className="flex text-xs opacity-60 mt-1">
                            {formatDateTime(
                              order.statusEvents.find((e: any) => e.status === step.status)?.createdAt || order.updatedAt
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Order Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm">
            <h2 className="text-lg font-bold mb-4">Zusammenfassung</h2>
            
            <div className="space-y-3 mb-6">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <span className="font-semibold">{item.quantity}x</span> {item.menuItem.name}
                    {item.variant && <span className="text-charcoal/60 ml-1">({item.variant.name})</span>}
                    {item.specialInstructions && (
                      <div className="text-xs text-charcoal/60 mt-0.5 ml-4">
                        ↳ {item.specialInstructions}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-charcoal/80">
                    {formatPrice(item.priceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-sand-dark mb-4" />

            <div className="space-y-2 text-sm text-charcoal">
              <div className="flex justify-between">
                <span>Zwischensumme</span>
                <span>{formatPrice(order.subtotalCents)}</span>
              </div>
              {order.deliveryFeeCents > 0 && (
                <div className="flex justify-between">
                  <span>Lieferkosten</span>
                  <span>{formatPrice(order.deliveryFeeCents)}</span>
                </div>
              )}
              {order.tipCents > 0 && (
                <div className="flex justify-between text-olive">
                  <span>Trinkgeld</span>
                  <span>{formatPrice(order.tipCents)}</span>
                </div>
              )}
            </div>

            <Separator className="bg-sand-dark my-4" />

            <div className="flex justify-between items-center font-bold text-lg">
              <span>Gesamtsumme</span>
              <span className="text-terracotta">{formatPrice(order.totalCents)}</span>
            </div>
          </div>

          {order.type === "DELIVERY" && order.deliveryAddress && (
            <div className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm">
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-terracotta" />
                Lieferadresse
              </h2>
              <div className="text-charcoal/80 text-sm leading-relaxed">
                {order.deliveryAddress.street}<br/>
                {order.deliveryAddress.postalCode} {order.deliveryAddress.city}<br/>
                {order.deliveryAddress.notes && (
                  <span className="text-charcoal/60">Notiz: {order.deliveryAddress.notes}</span>
                )}
              </div>
            </div>
          )}

          {order.specialInstructions && (
            <div className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm">
              <h2 className="text-lg font-bold mb-2">Anmerkungen zur Bestellung</h2>
              <p className="text-charcoal/80 text-sm">
                {order.specialInstructions}
              </p>
            </div>
          )}
          
          <Link href="/orders" className="block text-center text-sm font-semibold text-terracotta hover:underline pt-4">
            ← Zurück zu allen Bestellungen
          </Link>
        </div>

      </div>
    </div>
  );
}
