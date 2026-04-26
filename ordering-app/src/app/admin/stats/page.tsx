import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { TrendingUp, ShoppingBag, Euro, Award } from "lucide-react";

export default async function AdminStatsPage() {
  // Fetch completed orders
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["COMPLETED", "DELIVERED", "PAID", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"] }
    },
    include: {
      items: {
        include: { menuItem: true }
      }
    }
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalCents, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate top items
  const itemCounts: Record<string, { count: number; name: string }> = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      if (!itemCounts[i.menuItemId]) {
        itemCounts[i.menuItemId] = { count: 0, name: i.menuItem.name };
      }
      itemCounts[i.menuItemId].count += i.quantity;
    });
  });

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal">Umsatz & Statistiken</h1>
        <p className="text-charcoal/60 mt-1">Überblick über die Performance des Bestellsystems.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0">
            <Euro className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-charcoal/60 font-medium mb-1">Gesamtumsatz</div>
            <div className="text-2xl font-bold font-mono">{formatPrice(totalRevenue)}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-charcoal/60 font-medium mb-1">Bestellungen</div>
            <div className="text-2xl font-bold font-mono">{totalOrders}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sand-dark shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-charcoal/60 font-medium mb-1">Ø Bestellwert</div>
            <div className="text-2xl font-bold font-mono">{formatPrice(avgOrderValue)}</div>
          </div>
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-white rounded-2xl border border-sand-dark shadow-sm overflow-hidden w-full lg:w-2/3">
        <div className="px-6 py-4 border-b border-sand-dark flex items-center gap-2 bg-sand-light">
          <Award className="w-5 h-5 text-terracotta" />
          <h2 className="font-bold text-charcoal">Bestseller Gerichte</h2>
        </div>
        <div className="divide-y divide-sand-dark">
          {topItems.length === 0 ? (
            <div className="p-6 text-center text-charcoal/60">Noch keine Daten verfügbar.</div>
          ) : (
            topItems.map((item, idx) => (
              <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-sand-light/50 transition">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-charcoal/40 w-6">#{idx + 1}</div>
                  <div className="font-semibold">{item.name}</div>
                </div>
                <div className="font-medium text-terracotta bg-terracotta/10 px-3 py-1 rounded-full text-sm">
                  {item.count}x bestellt
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
