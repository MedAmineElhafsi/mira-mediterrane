"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MenuSettingsClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const router = useRouter();

  const toggleAvailability = async (categoryId: string, itemId: string, currentStatus: boolean) => {
    // Optimistic UI update
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? {
          ...cat,
          items: cat.items.map((item: any) => 
            item.id === itemId ? { ...item, available: !currentStatus } : item
          )
        } : cat
      )
    );

    try {
      const res = await fetch(`/api/admin/menu/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus })
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("Gespeichert!", { duration: 2000 });
      router.refresh();
    } catch (e) {
      toast.error("Fehler beim Speichern");
      // Revert on error
      setCategories(initialCategories);
    }
  };

  return (
    <div className="space-y-8">
      {categories.map(category => (
        <div key={category.id} className="bg-white rounded-2xl border border-sand-dark shadow-sm overflow-hidden">
          <div className="bg-sand-light px-6 py-4 border-b border-sand-dark font-bold text-lg flex items-center gap-2">
            <span>{category.emoji}</span> {category.name}
          </div>
          
          <div className="divide-y divide-sand-dark">
            {category.items.map((item: any) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-sand-light/50 transition">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-charcoal/60 w-8">{item.code}</span>
                    <span className="font-semibold text-charcoal">{item.name}</span>
                    {item.isVegetarian && <Badge variant="outline" className="text-[10px] h-5 bg-green-50 text-green-700">Veg</Badge>}
                  </div>
                  <div className="text-sm text-charcoal/60 ml-10">
                    {item.priceCents ? formatPrice(item.priceCents) : "Varianten / Nach Anfrage"}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${item.available ? "text-olive" : "text-red-500"}`}>
                    {item.available ? "Aktiv" : "Ausverkauft"}
                  </span>
                  <button 
                    onClick={() => toggleAvailability(category.id, item.id, item.available)}
                    className={`w-11 h-6 rounded-full border-2 flex items-center px-0.5 transition-colors cursor-pointer ${item.available ? 'bg-olive border-olive' : 'bg-sand-dark border-sand-dark'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.available ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
