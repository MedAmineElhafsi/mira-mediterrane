import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { available: true },
          orderBy: { sortOrder: "asc" },
          include: {
            variants: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    return NextResponse.json(
      { error: "Speisekarte konnte nicht geladen werden" },
      { status: 500 }
    );
  }
}
