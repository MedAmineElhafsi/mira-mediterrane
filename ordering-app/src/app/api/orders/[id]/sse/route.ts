import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const resolvedParams = await params;
  
  // Security check mapping
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    select: { userId: true }
  });

  if (!order || (order.userId !== session.user.id && session.user.role !== "ADMIN")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Set headers for SSE
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  };

  const stream = new ReadableStream({
    async start(controller) {
      // Function to send data
      const sendEvent = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Send initial data immediately
      const initialData = await getOrderFullData(resolvedParams.id);
      sendEvent(initialData);

      // Setup polling instead of real Postgres LISTEN/NOTIFY since we are on SQLite
      // In production with Postgres, use Prisma listening or Postgres Triggers (pg_notify)
      const interval = setInterval(async () => {
        try {
          const currentData = await getOrderFullData(resolvedParams.id);
          sendEvent(currentData);
        } catch (err) {
          console.error("SSE Polling error", err);
        }
      }, 5000); // Check for updates every 5 seconds

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new NextResponse(stream, { headers });
}

async function getOrderFullData(id: string) {
  return await prisma.order.findUnique({
    where: { id },
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
}
