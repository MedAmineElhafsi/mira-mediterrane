import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDateTime, generateOrderNumber } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Package, Store, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Meine Bestellungen",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">Meine Bestellungen</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-sand-dark shadow-sm flex flex-col items-center">
          <Package className="h-12 w-12 text-sand-dark mb-4" />
          <h2 className="text-xl font-bold mb-2">Noch keine Bestellungen</h2>
          <p className="text-charcoal/60 mb-6">Sie haben noch keine Gerichte bei uns bestellt.</p>
          <Link href="/">
            <Button className="bg-terracotta hover:bg-terracotta-dark text-white">Zur Speisekarte</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link 
              href={`/orders/${order.id}`} 
              key={order.id}
              className="block bg-white rounded-2xl p-6 border border-sand-dark shadow-sm hover:border-terracotta/40 transition-colors group"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                
                {/* Left info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold">{generateOrderNumber(order.id)}</span>
                    <Badge variant="secondary" className="bg-sand text-charcoal">
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <div className="text-sm text-charcoal/60 flex items-center gap-4">
                    <span>{formatDateTime(order.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      {order.type === "DELIVERY" ? <Truck className="h-3 w-3" /> : <Store className="h-3 w-3" />}
                      {order.type === "DELIVERY" ? "Lieferung" : "Abholung"}
                    </span>
                  </div>
                </div>

                {/* Right info */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 border-sand-dark pt-4 md:pt-0">
                  <div className="text-right">
                    <div className="font-bold text-terracotta">{formatPrice(order.totalCents)}</div>
                    <div className="text-xs text-charcoal/50">{order.items.length} Artikel</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-sand-light flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
