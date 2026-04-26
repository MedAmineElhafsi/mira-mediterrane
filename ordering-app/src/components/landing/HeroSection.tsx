"use client";

import React from "react";
import { TiltCard } from "@/components/ui/TiltCard";
import { Phone } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(30, 20, 10, 0.55) 0%, rgba(30, 20, 10, 0.35) 60%, rgba(30, 20, 10, 0.72) 100%), url('/images/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <TiltCard
        options={{ max: 4, speed: 500, perspective: 1000 }}
        className="max-w-3xl mx-auto"
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in translate-z-[50px]"
        >
          <span className="w-2 h-2 bg-terracotta-light rounded-full inline-block animate-pulse"></span>
          Mediterrane & Syrisch-Arabische Küche · Merseburg
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 animate-fade-in-up">
          Mira<br />
          <span className="text-terracotta-light italic">Mediterrane Küche</span>
        </h1>

        <p className="text-xl text-white/90 font-light mb-3 animate-fade-in-up">
          Mediterrane Spezialitäten im Herzen von Merseburg
        </p>
        <p className="text-white/70 text-base max-w-xl mx-auto mb-10 animate-fade-in-up">
          Frische Zutaten, traditionelle Rezepte und die herzliche Atmosphäre
          des Mittelmeerraums – erleben Sie die Aromen der Levante direkt in
          Merseburg.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up translate-z-[50px]">
          <a
            href="tel:+491636473331"
            className="flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-[0_20px_40px_rgba(192,98,47,0.4)] hover:-translate-y-1 hover:scale-105"
          >
            <Phone className="w-5 h-5" />
            Jetzt anrufen
          </a>
          <a
            href="#menu"
            className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border-2 border-white text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)]"
          >
            🛍️ Online bestellen
          </a>
        </div>
      </TiltCard>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
