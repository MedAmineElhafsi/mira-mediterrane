import { prisma } from "@/lib/prisma";
import { MenuSettingsClient } from "./MenuSettingsClient";

export default async function AdminMenuPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Speisekarte verwalten</h1>
          <p className="text-charcoal/60 mt-1">Aktivieren oder deaktivieren Sie Gerichte für Online-Bestellungen.</p>
        </div>
      </div>

      <MenuSettingsClient initialCategories={categories} />
    </div>
  );
}
