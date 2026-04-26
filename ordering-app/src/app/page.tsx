import { prisma } from "@/lib/prisma";
import { MenuPage } from "@/components/menu/MenuPage";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { PopularDishes } from "@/components/landing/PopularDishes";

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

  return (
    <div className="-mt-20">
      <HeroSection />
      <AboutSection />
      <PopularDishes />
      <MenuPage categories={categories} />
    </div>
  );
}
