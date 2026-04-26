"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Anmeldung fehlgeschlagen", {
          description: "Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.",
        });
      } else {
        router.push(callbackUrl);
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Passwort</Label>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-terracotta hover:bg-terracotta-dark text-white"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Anmelden
      </Button>

      <div className="text-center text-sm text-charcoal/60 pt-4">
        Noch kein Konto?{" "}
        <Link href="/register" className="text-terracotta font-semibold hover:underline">
          Jetzt registrieren
        </Link>
      </div>
    </form>
  );
}
