import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderTrackerClient } from "./OrderTrackerClient";

export const metadata: Metadata = {
  title: "Bestelldetails",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  const resolvedParams = await params;

  if (!session?.user) {
    redirect(`/login?callbackUrl=/orders/${resolvedParams.id}`);
  }

  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: {
        include: {
          menuItem: true,
          variant: true
        }
      },
      deliveryAddress: true,
      statusEvents: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!order) {
    notFound();
  }

  // Security: only allow users to see their own orders unless they are an admin
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/orders");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <OrderTrackerClient initialOrder={order} />
    </div>
  );
}
