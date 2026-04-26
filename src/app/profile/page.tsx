import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./form";

export const metadata: Metadata = {
  title: "Mein Profil",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      addresses: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <h1 className="font-serif text-3xl font-bold text-charcoal mb-8">Mein Profil</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-dark">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
