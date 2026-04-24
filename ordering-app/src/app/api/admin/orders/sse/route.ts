import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  };

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      const fetchOrders = async () => {
        return await prisma.order.findMany({
          where: {
            status: {
              in: ["PAID", "PREPARING", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"],
            },
          },
          orderBy: { createdAt: "asc" },
          include: {
            items: {
              include: { menuItem: true, variant: true }
            },
            deliveryAddress: true,
            user: true,
          }
        });
      };

      // Send initial dataset immediately
      const initialData = await fetchOrders();
      sendEvent(initialData);

      // Poll database every 5 seconds for new/updated active orders
      const interval = setInterval(async () => {
        try {
          const currentData = await fetchOrders();
          sendEvent(currentData);
        } catch (err) {
          console.error("Admin SSE Polling error", err);
        }
      }, 5000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new NextResponse(stream, { headers });
}
