import { Metadata } from "next";
import { LoginForm } from "./form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Anmelden",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-sand-dark">
        <div className="text-center mb-8">
          <span className="text-4xl mb-2 block">🫒</span>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Willkommen zurück</h1>
          <p className="text-charcoal/60 text-sm mt-2">
            Melden Sie sich an, um schneller zu bestellen und Ihre Historie einzusehen.
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
