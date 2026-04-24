import { Metadata } from "next";
import { CheckoutForm } from "./form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Kasse",
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">Kasse</h1>
      <CheckoutForm user={session?.user} />
    </div>
  );
}
