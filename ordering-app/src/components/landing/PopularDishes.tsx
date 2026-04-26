"use client";

import React from "react";
import { TiltCard } from "@/components/ui/TiltCard";

export function PopularDishes() {
  const popularDishes = [
    {
      id: "d1",
      name: "Kaufmanntaschen",
      description: "Knusprig frittierte Teigtaschen mit herzhafter Füllung, serviert mit Pommes und Joghurtdip.",
      image: "/images/kaufmanntaschen.jpg",
      badge: "⭐ Beliebt",
      badgeColor: "bg-terracotta",
      overlayText: "Knusprige Spezialität",
    },
    {
      id: "d2",
      name: "Kadeh",
      description: "Wrap mit Hähnchen, Tum und gebratenem Gemüse, serviert mit Pommes, Reis oder Savar und Krautsalat.",
      image: "/images/mira_shawarma_teller.jpg",
      badge: "🍽️ Spezialität",
      badgeColor: "bg-olive",
      overlayText: "Mira Hausgerichte",
    },
    {
      id: "d3",
      name: "Mira Shawarma Teller",
      description: "4 frittierte Teigtaschen mit Kalbshackfleisch, Zwiebel und Petersilienfüllung, serviert mit Pommes.",
      image: "/images/kadeh.jpg",
      overlayText: "Hausgemacht täglich",
    },
    {
      id: "d4",
      name: "Crispy Chicken",
      description: "4 frittierte Hähnchenbrustfilets mit Krautsalat, Pommes und Tum – knusprig und unwiderstehlich.",
      image: "/images/crispy.jpg",
      badge: "🔥 Hot",
      badgeColor: "bg-terracotta",
      overlayText: "Knusprig & Saftig",
    },
    {
      id: "d5",
      name: "Shawarma",
      description: "Zart mariniertes Hähnchen vom Holzkohlegrill, gewickelt im Fladenbrot – ein echter Klassiker.",
      image: "/images/chawarma.jpg",
      badge: "⭐ Beliebt",
      badgeColor: "bg-terracotta",
      overlayText: "Mediterrane Spezialität",
    },
  ];

  return (
    <section id="dishes" className="py-20 lg:py-28 bg-sand">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-terracotta text-sm font-semibold uppercase tracking-widest">
            Unsere Highlights
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-charcoal mt-3 mb-4">
            Beliebte Gerichte
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Von der Levante direkt auf Ihren Tisch – entdecken Sie unsere meistgeliebten Spezialitäten.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDishes.map((dish) => (
            <TiltCard
              key={dish.id}
              options={{ max: 8, speed: 400, glare: true, "max-glare": 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-all duration-400 group cursor-pointer"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 translate-z-[30px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 translate-z-[40px]">
                  <span className="text-white text-sm font-medium">
                    {dish.overlayText}
                  </span>
                </div>
                {dish.badge && (
                  <div
                    className={`absolute top-3 right-3 ${dish.badgeColor} text-white text-xs px-2 py-1 rounded-full font-semibold translate-z-[40px]`}
                  >
                    {dish.badge}
                  </div>
                )}
              </div>
              <div className="p-5 translate-z-[30px]">
                <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
                  {dish.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {dish.description}
                </p>
              </div>
            </TiltCard>
          ))}

          {/* CTA Card */}
          <TiltCard
            options={{ max: 10, speed: 400, glare: true, "max-glare": 0.3 }}
            className="bg-gradient-to-br from-terracotta to-terracotta-dark rounded-2xl p-8 flex flex-col items-center justify-center text-center text-white shadow-md hover:shadow-[0_20px_40px_rgba(192,98,47,0.4)] transition-all duration-400 hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-5xl mb-4 drop-shadow-xl translate-z-[50px]">🍽️</div>
            <h3 className="font-serif text-2xl font-bold mb-3 drop-shadow-md translate-z-[50px]">
              Noch mehr entdecken
            </h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed translate-z-[50px]">
              Unsere vollständige Speisekarte wartet auf Sie – mit vielen
              weiteren Köstlichkeiten.
            </p>
            <a
              href="#menu"
              className="bg-white text-terracotta font-semibold px-6 py-3 rounded-full transition-all hover:bg-sand hover:shadow-md translate-z-[50px]"
            >
              Speisekarte ansehen →
            </a>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
