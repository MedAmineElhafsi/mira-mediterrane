import { AdminDashboardClient } from "./AdminDashboardClient";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // Fetch initial active orders directly via Prisma
  const activeOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ["PAID", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"],
      },
    },
    orderBy: { createdAt: "asc" }, // Oldest first
    include: {
      items: {
        include: { menuItem: true, variant: true }
      },
      deliveryAddress: true,
      user: true,
    }
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Aktive Bestellungen</h1>
          <p className="text-charcoal/60 mt-1">Live Updates für eingehende Bestellungen</p>
        </div>
      </div>

      <AdminDashboardClient initialOrders={activeOrders} />
    </div>
  );
}
