import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Store, ShoppingBag, Archive, BarChart, Settings, LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | Mira",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const navItems = [
    { label: "Aktive Bestellungen", href: "/admin", icon: ShoppingBag },
    { label: "Historie", href: "/admin/history", icon: Archive },
    { label: "Umsatz", href: "/admin/stats", icon: BarChart },
    { label: "Einstellungen", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-sand-light relative">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-charcoal text-white hidden md:flex flex-col flex-shrink-0 min-h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 group mb-8">
            <span className="text-2xl">🫒</span>
            <div>
              <div className="font-serif font-bold text-lg leading-tight text-white">Mira</div>
              <div className="text-[10px] font-light tracking-widest uppercase text-sand-dark">Admin</div>
            </div>
          </Link>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sand hover:bg-white/10 hover:text-white"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <Link 
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-red-300 hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Abmelden</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
