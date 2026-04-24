import { Metadata } from "next";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { SuccessClient } from "./SuccessClient";
import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateOrderNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bestellung erfolgreich",
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const sessionId = resolvedParams.session_id as string | undefined;

  if (!sessionId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">Keine Bestellung gefunden</h1>
        <Link href="/" className="mt-4 text-terracotta hover:underline">
          Zurück zur Speisekarte
        </Link>
      </div>
    );
  }

  try {
    let orderId;
    
    // Simulate lookup if we bypassed Stripe
    if (sessionId.startsWith("test_bypass_")) {
      orderId = sessionId.replace("test_bypass_", "");
    } else {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      orderId = session.metadata?.orderId;
    }

    if (!orderId) throw new Error("Order ID missing");

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) throw new Error("Order not found in DB");

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <SuccessClient />
        
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>
        
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-4">
          Vielen Dank für Ihre Bestellung!
        </h1>
        <p className="text-charcoal/70 mb-8 max-w-lg mx-auto">
          Wir haben Ihre Bestellung erhalten. Die Zahlung war erfolgreich.
          Die Zubereitung beginnt in Kürze.
        </p>

        <div className="bg-sand-light border border-sand-dark rounded-xl p-6 max-w-sm mx-auto mb-8 shadow-sm">
          <div className="text-sm text-charcoal/60 mb-1">Bestellnummer</div>
          <div className="text-2xl font-mono font-bold text-charcoal mb-4">
            {generateOrderNumber(order.id)}
          </div>
          <div className="flex justify-between items-center text-sm border-t border-sand-dark pt-3">
            <span className="text-charcoal/70">Art der Bestellung:</span>
            <span className="font-semibold">{order.type === "DELIVERY" ? "Lieferung" : "Abholung"}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/orders">
            <Button className="bg-olive hover:bg-olive-dark text-white">
              Bestellung verfolgen
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-sand-dark text-charcoal hover:bg-sand">
              Zusätzliche Bestellung
            </Button>
          </Link>
        </div>
      </div>
    );

  } catch (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">Es gab ein Problem</h1>
        <p className="mt-2 text-charcoal/60">Ihre Zahlung wurde registriert, aber wir konnten die Bestellübersicht nicht laden.</p>
        <Link href="/" className="mt-4 text-terracotta hover:underline">
          Zurück zur Speisekarte
        </Link>
      </div>
    );
  }
}
