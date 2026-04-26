import { prisma } from "@/lib/prisma";
import { formatDateTime, formatPrice, generateOrderNumber } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Store, Truck } from "lucide-react";

export default async function AdminHistoryPage() {
  const pastOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ["COMPLETED", "DELIVERED", "CANCELLED"],
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: true,
    },
    take: 50, // Recent 50 history entries
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal">Bestellhistorie</h1>
        <p className="text-charcoal/60 mt-1">Die neuesten 50 abgeschlossenen oder stornierten Bestellungen.</p>
      </div>

      <div className="bg-white rounded-2xl border border-sand-dark shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-charcoal/70 bg-sand-light uppercase border-b border-sand-dark">
              <tr>
                <th className="px-6 py-4 font-medium">Bestell-Nr. / Zeit</th>
                <th className="px-6 py-4 font-medium">Kunde</th>
                <th className="px-6 py-4 font-medium">Art</th>
                <th className="px-6 py-4 font-medium text-right">Summe</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pastOrders.map((order) => (
                <tr key={order.id} className="border-b border-sand-dark/50 last:border-0 hover:bg-sand-light/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-terracotta">{generateOrderNumber(order.id)}</div>
                    <div className="text-charcoal/60 mt-0.5">{formatDateTime(order.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-charcoal">{order.user.name}</div>
                    <div className="text-charcoal/60 whitespace-nowrap">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-medium text-charcoal">
                      {order.type === "DELIVERY" ? (
                        <><Truck className="w-4 h-4 text-terracotta" /> Lieferung</>
                      ) : (
                        <><Store className="w-4 h-4 text-olive" /> Abholung</>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold">{formatPrice(order.totalCents)}</div>
                    <div className="text-xs text-charcoal/50">{order.items.length} Artikel</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${order.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}
                      `}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              
              {pastOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-charcoal/60">
                    Keine Einträge in der Historie gefunden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
