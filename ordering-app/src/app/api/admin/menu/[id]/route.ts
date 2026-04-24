import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { available } = body;

    const item = await prisma.menuItem.update({
      where: { id: resolvedParams.id },
      data: { available }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
