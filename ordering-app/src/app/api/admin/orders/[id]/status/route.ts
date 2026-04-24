import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { status } = await req.json();

    if (!status) {
      return new NextResponse("Missing status", { status: 400 });
    }

    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Create a new event history tracking
    await prisma.orderStatusEvent.create({
      data: {
        orderId,
        status,
      }
    });

    // Note in reality we could trigger an email or pusher notification here.
    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    console.error("Failed to update status:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
