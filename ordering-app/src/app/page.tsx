import { prisma } from "@/lib/prisma";
import { MenuPage } from "@/components/menu/MenuPage";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      items: {
        orderBy: { sortOrder: "asc" },
        include: {
          variants: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  return <MenuPage categories={categories} />;
}
