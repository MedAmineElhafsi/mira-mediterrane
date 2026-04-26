"use client";

import React from "react";
import { TiltCard } from "@/components/ui/TiltCard";

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <TiltCard
              options={{ max: 5, speed: 600, perspective: 1000 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="/images/about.jpg"
                  alt="Gemütliche Atmosphäre im Mira Restaurant"
                  className="w-full h-full object-cover translate-z-[30px]"
                  loading="lazy"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-terracotta text-white rounded-2xl px-6 py-4 shadow-xl text-center hidden sm:block translate-z-[50px]">
                <div className="font-serif text-3xl font-bold">10+</div>
                <div className="text-xs font-medium opacity-90 uppercase tracking-wider mt-0.5">
                  Jahre Erfahrung
                </div>
              </div>
              {/* Olive leaf decoration */}
              <div className="absolute -top-4 -left-4 bg-olive text-white rounded-xl px-4 py-3 shadow-lg hidden sm:flex items-center gap-2 translate-z-[50px]">
                <span className="text-xl">🫒</span>
                <span className="text-xs font-semibold tracking-wide">
                  Frisch &amp; Authentisch
                </span>
              </div>
            </TiltCard>
          </div>

          {/* Text side */}
          <div>
            <span className="text-terracotta text-sm font-semibold uppercase tracking-widest">
              Unsere Geschichte
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-charcoal mt-3 mb-6 leading-tight">
              Der Geschmack des<br />
              <span className="text-terracotta italic">Mittelmeers</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              Im Mira Mediterrane Küche verbinden wir die reiche Küchentradition
              der Levante mit der Herzlichkeit persönlicher Gastfreundschaft.
              Jedes Gericht erzählt eine Geschichte – von sonnengereiften Zutaten,
              handverlesenen Gewürzen und Rezepten, die über Generationen
              weitergegeben wurden.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Von knusprigen Falafeln und zartem Shawarma über gefüllte
              Weinblätter bis hin zu langsam geschmortem Lamm – wir servieren
              mediterrane und syrisch-arabische Spezialitäten mit echter
              Leidenschaft und frischesten Zutaten.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-sand rounded-xl p-4">
                <span className="text-2xl">🌿</span>
                <div>
                  <div className="font-semibold text-sm text-charcoal">
                    Frische Zutaten
                  </div>
                  <div className="text-xs text-gray-500">
                    Täglich frisch zubereitet
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-sand rounded-xl p-4">
                <span className="text-2xl">🏺</span>
                <div>
                  <div className="font-semibold text-sm text-charcoal">
                    Traditionell
                  </div>
                  <div className="text-xs text-gray-500">
                    Authentische Rezepte
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-sand rounded-xl p-4">
                <span className="text-2xl">🥗</span>
                <div>
                  <div className="font-semibold text-sm text-charcoal">
                    Vegetarisch
                  </div>
                  <div className="text-xs text-gray-500">Viele Optionen</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-sand rounded-xl p-4">
                <span className="text-2xl">❤️</span>
                <div>
                  <div className="font-semibold text-sm text-charcoal">Mit Herz</div>
                  <div className="text-xs text-gray-500">Familiär &amp; herzlich</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <span className="text-terracotta text-sm font-semibold uppercase tracking-widest">
              Einblicke
            </span>
            <h3 className="font-serif text-3xl font-bold text-charcoal mt-2">
              Erleben Sie uns
            </h3>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Ein Blick hinter die Kulissen – unsere Küche, unsere Leidenschaft.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Video 1 */}
            <TiltCard
              options={{ max: 5, speed: 400, glare: true, "max-glare": 0.2 }}
              className="rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.3)] bg-black group"
            >
              <video
                className="w-full aspect-video object-contain translate-z-[30px]"
                controls
                muted
                preload="metadata"
              >
                <source src="/images/restaurant_video1.mp4" type="video/mp4" />
                Ihr Browser unterstützt kein Video.
              </video>
            </TiltCard>

            {/* Video 2 */}
            <TiltCard
              options={{ max: 5, speed: 400, glare: true, "max-glare": 0.2 }}
              className="rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.3)] bg-black group"
            >
              <video
                className="w-full aspect-video object-contain translate-z-[30px]"
                controls
                muted
                preload="metadata"
              >
                <source src="/images/restaurant_video2.mp4" type="video/mp4" />
                Ihr Browser unterstützt kein Video.
              </video>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
