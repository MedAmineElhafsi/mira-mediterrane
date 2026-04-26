"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export function ProfileForm({ user }: { user: UserProfile }) {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (!res.ok) {
        throw new Error("Fehler beim Speichern");
      }

      toast.success("Profil erfolgreich aktualisiert");
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Vollständiger Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail Adresse</Label>
          <Input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="bg-sand-light text-charcoal/60"
          />
          <p className="text-xs text-charcoal/50">Die E-Mail Adresse kann nicht geändert werden.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefonnummer</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="bg-terracotta hover:bg-terracotta-dark text-white"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Änderungen speichern
        </Button>
      </form>

      <Separator />

      <div className="pt-4">
        <h3 className="font-semibold text-charcoal mb-4">Konto-Verwaltung</h3>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-charcoal border-sand-dark hover:bg-sand"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Abmelden
        </Button>
      </div>
    </div>
  );
}
