"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (!res.ok) {
        const error = await res.text();
        toast.error("Registrierung fehlgeschlagen", { description: error });
        setIsLoading(false);
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Anmeldung nach Registrierung fehlgeschlagen");
        router.push("/login");
      } else {
        toast.success("Erfolgreich registriert!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Vollständiger Name</Label>
        <Input
          id="name"
          placeholder="Max Mustermann"
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
          placeholder="name@beispiel.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefonnummer <span className="text-muted-foreground font-normal">(für Rückfragen zur Bestellung)</span></Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+49 123 4567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Passwort</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={8}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-olive hover:bg-olive-dark text-white"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Konto erstellen
      </Button>

      <div className="text-center text-sm text-charcoal/60 pt-4">
        Bereits ein Konto?{" "}
        <Link href="/login" className="text-terracotta font-semibold hover:underline">
          Hier anmelden
        </Link>
      </div>
    </form>
  );
}
