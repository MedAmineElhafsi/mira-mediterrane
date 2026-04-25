import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  // Very simple protection, ideally use a token in production but this is just for the first automated deploy
  if (req.headers.get("x-seed-key") !== "mira-secret-seed-2026") {
    return NextResponse.json({ error: "Missing seed key header" }, { status: 401 });
  }

  try {
    // 1. Create Admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { email: "admin@mira-merseburg.de" },
      update: {},
      create: {
        email: "admin@mira-merseburg.de",
        name: "Admin",
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });

    // 2. Insert Categories and Items
    const categories = [
      { name: "Vorspeisen", slug: "vorspeisen", emoji: "🫒" },
      { name: "Salate & Suppen", slug: "salate-suppen", emoji: "🥗" },
      { name: "Hauptgerichte (Shawarma)", slug: "hauptgerichte-shawarma", emoji: "🌯" },
    ];

    const createdCats: Record<string, string> = {};
    for (const [index, cat] of categories.entries()) {
      const dbCat = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { sortOrder: index, name: cat.name, emoji: cat.emoji },
        create: { name: cat.name, slug: cat.slug, emoji: cat.emoji, sortOrder: index },
      });
      createdCats[cat.name] = dbCat.id;
    }

    // Insert top popular items using findFirst + create pattern since 'code' is not @unique
    const existingV1 = await prisma.menuItem.findFirst({ where: { code: "V1" } });
    if (!existingV1) {
      await prisma.menuItem.create({
        data: {
          categoryId: createdCats["Vorspeisen"],
          code: "V1",
          name: "Hummus",
          description: "Dip aus Kichererbsen, Sesampaste mit Brot",
          priceCents: 550,
          isVegetarian: true,
          sortOrder: 1,
        }
      });
    }

    const existingSh1 = await prisma.menuItem.findFirst({ where: { code: "Sh1" } });
    if (!existingSh1) {
      await prisma.menuItem.create({
        data: {
          categoryId: createdCats["Hauptgerichte (Shawarma)"],
          code: "Sh1",
          name: "Klassik-Shawarma Pêçan",
          description: "Wrap mit Hähnchen, Tum und Sauergurken",
          priceCents: 750,
          sortOrder: 1,
        }
      });
    }

    return NextResponse.json({ message: "Seed successful!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
