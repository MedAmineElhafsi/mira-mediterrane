"use client";

import { useSSE } from "@/hooks/useSSE";
import { formatTime, formatPrice, generateOrderNumber } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Store, Truck, Bell, Clock, ChefHat, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function AdminDashboardClient({ initialOrders }: { initialOrders: any[] }) {
  // Real-time updates pulling active orders
  const { data: updatedOrders } = useSSE<any[]>("/api/admin/orders/sse");
  const orders = updatedOrders || initialOrders;
  
  // Audio state
  const prevOrdersCount = React.useRef(initialOrders.filter(o => o.status === "PAID").length);

  React.useEffect(() => {
    // Only ring bell if a new order arrives (PAID status)
    const currentNewOrdersCount = orders.filter(o => o.status === "PAID").length;
    if (currentNewOrdersCount > prevOrdersCount.current) {
      try {
        // Base64 generic bell ding
        const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="); 
        // Note: Real audio file requires a longer base64 string, using a simple beep fallback:
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.type = "sine";
        osc.start();
        osc.stop(ctx.currentTime + 0.3); // 300ms beep
      } catch (e) { console.error("Audio block", e); }
    }
    prevOrdersCount.current = currentNewOrdersCount;
  }, [orders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Fehler beim Aktualisieren");
      toast.success("Status aktualisiert");
    } catch (err) {
      toast.error("Fehler beim Server");
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white border text-center border-sand-dark rounded-2xl p-12 flex flex-col items-center shadow-sm">
        <Bell className="h-10 w-10 text-sand-dark mb-4" />
        <h2 className="text-xl font-bold text-charcoal">Keine aktiven Bestellungen</h2>
        <p className="text-charcoal/60 text-sm mt-1">Es liegen aktuell keine offenen Bestellungen vor.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {orders.map((order: any) => (
        <OrderCard key={order.id} order={order} onUpdateStatus={handleStatusUpdate} />
      ))}
    </div>
  );
}

function OrderCard({ order, onUpdateStatus }: { order: any, onUpdateStatus: (id: string, s: string) => void }) {
  const isDelivery = order.type === "DELIVERY";
  
  // Define action buttons based on current status
  let actionButtons = null;

  if (order.status === "PAID") {
    actionButtons = (
      <Button onClick={() => onUpdateStatus(order.id, "PREPARING")} className="w-full bg-olive hover:bg-olive-dark text-white">
        <ChefHat className="w-4 h-4 mr-2" /> Zubereitung starten
      </Button>
    );
  } else if (order.status === "PREPARING") {
    actionButtons = isDelivery ? (
      <Button onClick={() => onUpdateStatus(order.id, "OUT_FOR_DELIVERY")} className="w-full bg-terracotta hover:bg-terracotta-dark text-white">
        <Truck className="w-4 h-4 mr-2" /> Ist auf dem Weg
      </Button>
    ) : (
      <Button onClick={() => onUpdateStatus(order.id, "READY_FOR_PICKUP")} className="w-full bg-terracotta hover:bg-terracotta-dark text-white">
        <Store className="w-4 h-4 mr-2" /> Bereit zur Abholung
      </Button>
    );
  } else if (order.status === "READY_FOR_PICKUP" || order.status === "OUT_FOR_DELIVERY") {
    const label = isDelivery ? "Erfolgreich zugestellt" : "Erfolgreich abgeholt";
    actionButtons = (
      <Button onClick={() => onUpdateStatus(order.id, isDelivery ? "DELIVERED" : "COMPLETED")} className="w-full bg-green-600 hover:bg-green-700 text-white">
        <CheckCircle2 className="w-4 h-4 mr-2" /> {label}
      </Button>
    );
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-red-100 text-red-700 border-red-200 animate-pulse";
      case "PREPARING": return "bg-orange-100 text-orange-700 border-orange-200";
      case "READY_FOR_PICKUP":
      case "OUT_FOR_DELIVERY": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-md overflow-hidden flex flex-col ${order.status === 'PAID' ? 'border-terracotta' : 'border-sand-dark'}`}>
      {/* Header */}
      <div className={`p-4 border-b border-sand-dark flex justify-between items-start ${order.status === 'PAID' ? 'bg-terracotta/5' : 'bg-sand-light'}`}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-lg font-bold text-charcoal">{generateOrderNumber(order.id)}</span>
            <Badge variant="outline" className={getStatusColor(order.status)}>
              {order.status === "PAID" && "NEU"}
              {order.status === "PREPARING" && "In Küche"}
              {order.status === "OUT_FOR_DELIVERY" && "Unterwegs"}
              {order.status === "READY_FOR_PICKUP" && "Abholbereit"}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-charcoal/70">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(order.createdAt)}
            </span>
            <span className="flex items-center gap-1 font-medium text-charcoal">
              {isDelivery ? <Truck className="w-3.5 h-3.5 text-terracotta" /> : <Store className="w-3.5 h-3.5 text-olive" />}
              {isDelivery ? "Lieferung" : "Abholung"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl text-charcoal mb-1">{formatPrice(order.totalCents)}</div>
          <button onClick={() => window.print()} className="print:hidden underline text-xs text-charcoal/50 hover:text-terracotta transition uppercase tracking-widest font-semibold">
            Drucken
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1">
        {/* Customer / Address info */}
        {isDelivery && order.deliveryAddress ? (
          <div className="mb-4 p-3 bg-sand rounded-xl border border-sand-dark flex gap-3 text-sm">
            <MapPin className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
            <div className="leading-tight text-charcoal">
              <div className="font-semibold mb-0.5">{order.user.name} ({order.user.phone || 'Keine Nummer'})</div>
              {order.deliveryAddress.street}<br />
              {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
              {order.deliveryAddress.notes && <div className="mt-1 text-charcoal/60 font-medium whitespace-pre-wrap">Hinweis: {order.deliveryAddress.notes}</div>}
            </div>
          </div>
        ) : (
          <div className="mb-4 text-sm bg-sand rounded-xl border border-sand-dark p-3 text-charcoal/80">
            <span className="font-semibold text-charcoal">Kunde:</span> {order.user.name} | {order.user.phone || 'Keine Nummer'}
          </div>
        )}

        {/* Global instructions */}
        {order.specialInstructions && (
          <div className="mb-4 bg-terracotta/10 text-red-900 border border-terracotta/20 rounded-lg p-3 text-sm font-medium">
            ⚠️ {order.specialInstructions}
          </div>
        )}

        {/* Items */}
        <div className="space-y-2.5">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex gap-3 text-sm pb-2 border-b border-sand-dark/50 last:border-0 last:pb-0">
              <div className="font-bold font-mono text-terracotta min-w-[1.5rem]">{item.quantity}x</div>
              <div className="flex-1">
                <span className="font-semibold text-charcoal">{item.menuItem.name}</span>
                {item.variant && <span className="text-charcoal/60 ml-1">({item.variant.name})</span>}
                {item.specialInstructions && (
                  <div className="text-terracotta/90 text-xs italic mt-0.5">↳ Ohne Zwiebeln etc: {item.specialInstructions}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Controls */}
      {actionButtons && (
        <div className="p-4 bg-sand border-t border-sand-dark">
          {actionButtons}
        </div>
      )}
    </div>
  );
}
