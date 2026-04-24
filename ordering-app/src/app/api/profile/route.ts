import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Nicht autorisiert", { status: 401 });
    }

    const { name, phone } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        phone,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile update error:", error);
    return new NextResponse("Interner Serverfehler", { status: 500 });
  }
}
