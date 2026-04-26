"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { ShoppingCart, Menu, X, User, ChefHat } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;

  const navLinks = [
    { href: "/#about", label: "Über uns" },
    { href: "/#dishes", label: "Gerichte" },
    { href: "/#menu", label: "Speisekarte" },
    { href: "/orders", label: "Bestellungen" },
  ];

  const isHome = pathname === "/";
  const headerClasses = isHome
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-sand-dark shadow-sm py-2"
          : "bg-transparent py-4"
      }`
    : "sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sand-dark shadow-sm py-2";

  const textClasses = isHome && !scrolled ? "text-white" : "text-charcoal";
  const linkHoverClasses = isHome && !scrolled ? "hover:text-terracotta-light" : "hover:text-terracotta";
  const logoSubtitleClasses = isHome && !scrolled ? "text-white/80" : "text-charcoal/60";
  const iconClasses = isHome && !scrolled ? "text-white hover:text-white" : "text-charcoal";

  return (
    <header className={headerClasses}>
      <nav className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🫒</span>
          <div>
            <div className={`font-serif font-bold text-lg leading-tight ${textClasses}`}>
              Mira
            </div>
            <div className={`text-[10px] font-light tracking-widest uppercase ${logoSubtitleClasses}`}>
              Online Bestellung
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${linkHoverClasses} ${
                pathname === link.href ? "text-terracotta" : isHome && !scrolled ? "text-white" : "text-charcoal/70"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm font-medium text-olive hover:text-olive-dark transition-colors flex items-center gap-1"
            >
              <ChefHat className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side: Cart + User */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className={`relative ${isHome && !scrolled ? "border-white/30 bg-white/10 hover:bg-white/20" : "border-sand-dark hover:bg-sand"}`}
                  aria-label="Warenkorb öffnen"
                />
              }
            >
              <ShoppingCart className={`h-5 w-5 ${iconClasses}`} />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-terracotta text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                  {itemCount}
                </Badge>
              )}
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <CartDrawer onClose={() => setCartOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* User button */}
          {session ? (
            <Link
              href="/profile"
              className={buttonVariants({ variant: "outline", size: "icon", className: isHome && !scrolled ? "border-white/30 bg-white/10 hover:bg-white/20 text-white" : "border-sand-dark hover:bg-sand text-charcoal" })}
              aria-label="Profil"
            >
              <User className={`h-5 w-5 ${iconClasses}`} />
            </Link>
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "default", size: "sm", className: "bg-terracotta hover:bg-terracotta-dark text-white" })}
            >
              Anmelden
            </Link>
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${iconClasses}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü öffnen"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-sand-dark shadow-lg">
          <div className="flex flex-col py-4 px-6 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-terracotta"
                    : "text-charcoal/70 hover:text-terracotta"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-olive hover:text-olive-dark flex items-center gap-1"
              >
                <ChefHat className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
