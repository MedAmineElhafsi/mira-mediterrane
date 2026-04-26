import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash("MiraAdmin2026!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mira-merseburg.de" },
    update: {},
    create: {
      email: "admin@mira-merseburg.de",
      name: "Mira Admin",
      role: "ADMIN",
      passwordHash,
    },
  });
  console.log({ admin });

  // 2. Clear existing categories/items
  await prisma.menuItemVariant.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  // 3. Create Categories
  const categoriesData = [
    { name: "Vorspeisen", slug: "vorspeisen", emoji: "🫒", sortOrder: 10 },
    { name: "Suppen", slug: "suppen", emoji: "🥣", sortOrder: 20 },
    { name: "Salate", slug: "salate", emoji: "🥗", sortOrder: 30 },
    { name: "Hauptgerichte (Shawarma)", slug: "shawarma", emoji: "🌯", sortOrder: 40 },
    { name: "Mira Hausgerichte", slug: "hausgerichte", emoji: "🍽️", sortOrder: 50 },
    { name: "Crispy Chicken", slug: "crispy", emoji: "🍗", sortOrder: 60 },
    { name: "Kaufmannstaschen", slug: "kaufmannstaschen", emoji: "🥟", sortOrder: 70 },
    { name: "Mira-Shawarma Teller", slug: "mira_shawarma_teller", emoji: "🍛", sortOrder: 80 },
    { name: "Falafel und Co", slug: "falafel", emoji: "🧆", sortOrder: 90 },
    { name: "Holzgrill", slug: "holzgrill", emoji: "🔥", sortOrder: 100 },
    { name: "Pêçan (Wrap)", slug: "wrap", emoji: "🌯", sortOrder: 110 },
    { name: "Getränke", slug: "getraenke", emoji: "☕", sortOrder: 120 },
  ];

  const categoryMap: Record<string, string> = {};
  for (const catData of categoriesData) {
    const cat = await prisma.category.create({ data: catData });
    categoryMap[catData.slug] = cat.id;
  }

  // 4. Create Menu Items
  // Vorspeisen
  await prisma.menuItem.createMany({
    data: [
      { categoryId: categoryMap["vorspeisen"], code: "V1", name: "Hummus", description: "Dip aus Kichererbsen, Sesampaste, Olivenöl, Zitronensaft und Gewürzen mit Brot", priceCents: 550, isVegetarian: true, isVegan: false, sortOrder: 1 },
      { categoryId: categoryMap["vorspeisen"], code: "V2", name: "Mutabbal", description: "Dip aus Aubergine, Tahin, Knoblauch, Salz, Zitronensaft und Olivenöl mit Brot", priceCents: 650, isVegetarian: true, isVegan: false, sortOrder: 2 },
      { categoryId: categoryMap["vorspeisen"], code: "V3", name: "Tum", description: "Knoblauchsoße", priceCents: 300, isVegetarian: false, isVegan: false, sortOrder: 3 },
      { categoryId: categoryMap["vorspeisen"], code: "V4", name: "Ezme", description: "Dip aus Tomaten, Spitzpaprika, Chilischoten, Knoblauch, Zwiebeln, Petersilie, Granatapfelsirup, Olivenöl und Tomatenmark mit Brot", priceCents: 600, isVegetarian: true, isVegan: false, sortOrder: 4 },
      { categoryId: categoryMap["vorspeisen"], code: "V5", name: "Vorspeisen Mix", description: "Mix 3 Dips nach Wahl", priceCents: 950, isVegetarian: false, isVegan: false, sortOrder: 5 },
      { categoryId: categoryMap["vorspeisen"], code: "V6", name: "Kute", description: "Bulgur, Tomaten, Zwiebeln, Knoblauch, Tomatenmark, Paprikamark und Gewürze", priceCents: 850, isVegetarian: true, isVegan: false, sortOrder: 6 },
      { categoryId: categoryMap["vorspeisen"], code: "V7", name: "Reis", description: "", priceCents: 450, isVegetarian: true, isVegan: false, sortOrder: 7 },
      { categoryId: categoryMap["vorspeisen"], code: "V8", name: "Savar", description: "Bulgur, Tomatenmark und Gemüse", priceCents: 450, isVegetarian: true, isVegan: false, sortOrder: 8 },
    ]
  });

  // V9 Pommes has variants
  const pommes = await prisma.menuItem.create({
    data: { categoryId: categoryMap["vorspeisen"], code: "V9", name: "Pommes", description: "", priceCents: null, isVegetarian: true, isVegan: false, sortOrder: 9 },
  });
  await prisma.menuItemVariant.createMany({
    data: [
      { menuItemId: pommes.id, name: "Klein", priceCents: 350, sortOrder: 1 },
      { menuItemId: pommes.id, name: "Groß", priceCents: 550, sortOrder: 2 },
    ]
  });

  // Suppen
  await prisma.menuItem.createMany({
    data: [
      { categoryId: categoryMap["suppen"], code: "S1", name: "Nisk", description: "Linsensuppe", priceCents: null, isVegetarian: true, isVegan: false, sortOrder: 1 },
      { categoryId: categoryMap["suppen"], code: "S2", name: "Tufti", description: "Weizensuppe mit Kichererbsen, Zwiebeln, Kalbfleisch, Tomatenmark und Paprikamark", priceCents: 750, isVegetarian: false, isVegan: false, sortOrder: 2 },
    ]
  });

  // Salate
  await prisma.menuItem.createMany({
    data: [
      { categoryId: categoryMap["salate"], code: "Sa1", name: "Fatusch", description: "Aus Zwiebeln, Gurken, Tomaten, Feldsalat und frittiertem Brot", priceCents: 750, isVegetarian: false, isVegan: false, sortOrder: 1 },
      { categoryId: categoryMap["salate"], code: "Sa2", name: "Sivan", description: "Aus Eisbergsalat, Tomaten, Gurken und Paprika", priceCents: 650, isVegetarian: true, isVegan: false, sortOrder: 2 },
      { categoryId: categoryMap["salate"], code: "Sa3", name: "Sivan mit Käse", description: "Aus Eisbergsalat, Oliven, Tomaten, Gurken, Paprika und kurdischem Käse", priceCents: 750, isVegetarian: true, isVegan: false, sortOrder: 3 },
      { categoryId: categoryMap["salate"], code: "Sa4", name: "Sivan Hähnchen", description: "Aus Eisbergsalat, Tomaten, Gurken, Paprika, Hähnchenfleisch und kurdischem Käse", priceCents: 850, isVegetarian: false, isVegan: false, sortOrder: 4 },
      { categoryId: categoryMap["salate"], code: "Sa5", name: "Krautsalat", description: "Aus Weißkohl, Möhren und Mayonnaise", priceCents: 490, isVegetarian: true, isVegan: false, sortOrder: 5 },
      { categoryId: categoryMap["salate"], code: "Sa6", name: "Gemischter Salat", description: "Aus Eisbergsalat, Tomaten, Gurken, Kraut & Zwiebeln", priceCents: 650, isVegetarian: true, isVegan: false, sortOrder: 6 },
      { categoryId: categoryMap["salate"], code: "Sa7", name: "Gozer Salat", description: "Karottensalat", priceCents: 450, isVegetarian: true, isVegan: false, sortOrder: 7 },
      { categoryId: categoryMap["salate"], code: "Sa8", name: "Mira Salat", description: "Aus roter Zwiebel, Tomaten, Koriander, Chili, Minze und Zitrone", priceCents: 850, isVegetarian: true, isVegan: false, sortOrder: 8 },
    ]
  });

  // Shawarma
  await prisma.menuItem.createMany({
    data: [
      { categoryId: categoryMap["shawarma"], code: "Sh1", name: "Klassik-Shawarma Pêçan", description: "Wrap mit Hähnchen, Tum und Sauergurken", priceCents: 750, sortOrder: 1 },
      { categoryId: categoryMap["shawarma"], code: "Sh2", name: "Kinder Klassik-Shawarma", description: "Wrap mit Hähnchen, Tum und Sauergurken", priceCents: 400, sortOrder: 2 },
      { categoryId: categoryMap["shawarma"], code: "Sh3", name: "Mira-Shawarma Pêçan", description: "Wrap mit Hähnchen, Tum und gebratenem Gemüse", priceCents: 850, sortOrder: 3 },
      { categoryId: categoryMap["shawarma"], code: "Sh4", name: "Shawarma Pêçan Teller", description: "Wrap mit Hähnchen, Tum und Sauergurken, serviert mit Pommes, Reis oder Savar und Krautsalat", priceCents: 1050, sortOrder: 4 },
      { categoryId: categoryMap["shawarma"], code: "Sh5", name: "Mira-Shawarma Pêçan Teller", description: "Wrap mit Hähnchen, Tum und gebratenem Gemüse, serviert mit Pommes, Reis oder Savar und Krautsalat", priceCents: 1250, sortOrder: 5 },
      { categoryId: categoryMap["shawarma"], code: "Sh6", name: "Shawarma Box", description: "Mit Hähnchen und Salat, serviert mit Pommes, Reis oder Savar und Dip nach Wahl", priceCents: 950, sortOrder: 6 },
      { categoryId: categoryMap["shawarma"], code: "Sh7", name: "Mira-Shawarma Box", description: "Mit Hähnchen und gebratenem Gemüse, serviert mit Pommes, Reis oder Savar und Dip nach Wahl", priceCents: 1150, sortOrder: 7 },
    ]
  });

  // Hausgerichte
  await prisma.menuItem.createMany({
    data: [
     { categoryId: categoryMap["hausgerichte"], code: "M1", name: "Mira Salat", description: "Mit roter Zwiebel, Tomaten, Koriander, Chili, Minze und Zitrone", priceCents: 850, sortOrder: 1 },
     { categoryId: categoryMap["hausgerichte"], code: "M2", name: "Mira-Shawarma Pêçan", description: "Wrap mit Hähnchen, Tum und gebratenem Gemüse", priceCents: 850, sortOrder: 2 },
     { categoryId: categoryMap["hausgerichte"], code: "M3", name: "Kadeh", description: "Wrap mit Hähnchen, Tum und gebratenem Gemüse, serviert mit Pommes, Reis oder Savar und Krautsalat", priceCents: 1250, sortOrder: 3, imageUrl: "/images/kadeh.jpg" },
     { categoryId: categoryMap["hausgerichte"], code: "M4", name: "Mira-Shawarma Box", description: "Mit Hähnchen und gebratenem Gemüse, serviert mit Pommes, Reis oder Savar und Dip nach Wahl", priceCents: 1150, sortOrder: 4 },
    ]
  });

  // Crispy Chicken
  await prisma.menuItem.createMany({
    data: [
     { categoryId: categoryMap["crispy"], code: "C1", name: "Crispy Teller", description: "4 frittierte Hähnchenbrustfilets, Krautsalat, Pommes und Tum", priceCents: 1150, sortOrder: 1, imageUrl: "/images/crispy.jpg" },
     { categoryId: categoryMap["crispy"], code: "C2", name: "Crispy Box", description: "4 frittierte Hähnchenbrustfilets, Pommes und Dip nach Wahl", priceCents: 950, sortOrder: 2 },
    ]
  });

  // Kaufmannstaschen
  const ka1 = await prisma.menuItem.create({
    data: { categoryId: categoryMap["kaufmannstaschen"], code: "Ka1", name: "Klassik", description: "Mit Hähnchenbrustfilet, Sauergurken, Eisbergsalat und Mayonnaise", priceCents: null, sortOrder: 1, imageUrl: "/images/kaufmanntaschen.jpg" }
  });
  await prisma.menuItemVariant.createMany({
    data: [
      { menuItemId: ka1.id, name: "4 Stück", priceCents: 1350, sortOrder: 1 },
      { menuItemId: ka1.id, name: "6 Stück", priceCents: 1650, sortOrder: 2 },
    ]
  });
  const ka2 = await prisma.menuItem.create({
    data: { categoryId: categoryMap["kaufmannstaschen"], code: "Ka2", name: "Kartoffel", description: "Mit gebratenen Kartoffeln, Zwiebeln und Käse", isVegetarian: true, priceCents: null, sortOrder: 2 }
  });
  await prisma.menuItemVariant.createMany({
    data: [
      { menuItemId: ka2.id, name: "4 Stück", priceCents: 1250, sortOrder: 1 },
      { menuItemId: ka2.id, name: "6 Stück", priceCents: 1550, sortOrder: 2 },
    ]
  });

  // Mira-Shawarma Teller
  await prisma.menuItem.createMany({
    data: [
     { categoryId: categoryMap["mira_shawarma_teller"], code: "K1", name: "Klassik Teller", description: "4 frittierte Teigtaschen mit Kalbshackfleisch, Zwiebel und Petersilienfüllung, serviert mit Pommes", priceCents: 1250, sortOrder: 1, imageUrl: "/images/mira_shawarma_teller.jpg" },
    ]
  });

  // Falafel und Co
  await prisma.menuItem.createMany({
    data: [
     { categoryId: categoryMap["falafel"], code: "F1", name: "Falafel Pêçan (Wrap)", description: "Mit Falafel, Sauergurken, verschiedenem Gemüse und Hummus", priceCents: 600, isVegan: true, sortOrder: 1 },
     { categoryId: categoryMap["falafel"], code: "F2", name: "Falafel Teller", description: "Falafel, Hummus und verschiedenes Gemüse", priceCents: 1050, isVegan: true, sortOrder: 2, imageUrl: "/images/falafel.png" },
     { categoryId: categoryMap["falafel"], code: "F3", name: "Ful", description: "Fava-Bohnen Eintopf mit Knoblauch, Petersilie, Tomaten und Olivenöl", priceCents: 790, isVegan: true, sortOrder: 3 },
     { categoryId: categoryMap["falafel"], code: "F4", name: "Joghurt Ful", description: "Fava-Bohnen Eintopf mit Knoblauch, Petersilie, Tomaten, Olivenöl, Joghurt und Tahini", priceCents: 850, isVegan: true, sortOrder: 4 },
     { categoryId: categoryMap["falafel"], code: "F5", name: "Fatteh", description: "Gericht aus frittiertem Fladenbrot, Kichererbsen, Joghurt und Tahini", priceCents: 890, isVegetarian: true, sortOrder: 5 },
    ]
  });

  // Holzgrill
  await prisma.menuItem.createMany({
    data: [
     { categoryId: categoryMap["holzgrill"], code: "H1", name: "Kebabé Kurdî", description: "Gegrillte Lammhackfleischspieße", priceCents: 1550, sortOrder: 1, imageUrl: "/images/lamb_rice.png" },
     { categoryId: categoryMap["holzgrill"], code: "H2", name: "Kebabé Amede", description: "Gegrillte Kalbshackfleischspieße", priceCents: 1550, sortOrder: 2 },
     { categoryId: categoryMap["holzgrill"], code: "H3", name: "Pêrçe Mirîşk", description: "Gegrillte Hähnchenspieße", priceCents: 1450, sortOrder: 3 },
     { categoryId: categoryMap["holzgrill"], code: "H4", name: "Bask", description: "Gegrillte Hähnchenflügel", priceCents: 1400, sortOrder: 4, imageUrl: "/images/wings.png" },
    ]
  });

  // Pêçan (Wrap)
  await prisma.menuItem.createMany({
    data: [
     { categoryId: categoryMap["wrap"], code: "P1", name: "Kebabé Banî", description: "Mit gebratenem Gemüse und frischem Salat", priceCents: 1050, sortOrder: 1 },
     { categoryId: categoryMap["wrap"], code: "P2", name: "Kebabé Kurdî", description: "Mit gebratenem Gemüse, frischem Salat und Käse", priceCents: 1150, sortOrder: 2 },
     { categoryId: categoryMap["wrap"], code: "P3", name: "Kebabé Amede", description: "Mit gebratenem Gemüse, frischem Salat, Käse und scharf", priceCents: 1150, isSpicy: true, sortOrder: 3 },
     { categoryId: categoryMap["wrap"], code: "P4", name: "Pêrçe Mirîşk", description: "Mit gebratenem Gemüse und frischem Salat", priceCents: 1050, sortOrder: 4 },
    ]
  });

  // Getränke
  const getraenke = [
    { name: "Tee", priceCents: 250 },
    { name: "Apfelschorle" },
    { name: "Cola" },
    { name: "Cola Light" },
    { name: "Cola Zero" },
    { name: "Fanta" },
    { name: "Sprite" },
    { name: "Dao (Ayran)" },
    { name: "Wasser ohne Kohlensäure" },
    { name: "Wasser mit Kohlensäure" }
  ];
  for (let i = 0; i < getraenke.length; i++) {
    const item = await prisma.menuItem.create({
      data: { categoryId: categoryMap["getraenke"], name: getraenke[i].name, priceCents: null, isBeverage: true, sortOrder: i + 1 }
    });
    // Create variants for drinks (0,2 L -> 2,50 €, 0,4 L -> 3,50 € except Tee which might just be minimum 250)
    await prisma.menuItemVariant.createMany({
      data: [
        { menuItemId: item.id, name: "0,2 L", priceCents: 250, sortOrder: 1 },
        { menuItemId: item.id, name: "0,4 L", priceCents: 350, sortOrder: 2 },
      ]
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
