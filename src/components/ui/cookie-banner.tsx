"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-charcoal text-white p-4 md:p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center justify-between gap-4 border-t border-sand-dark/20">
      <div className="text-sm md:text-base leading-relaxed">
        Diese Website verwendet notwendige Cookies für die Warenkorb- und Login-Funktionen. 
        Durch die Nutzung erklären Sie sich damit einverstanden. 
        Weitere Infos in unserer <a href="/datenschutz" className="underline text-terracotta hover:text-white transition-colors">Datenschutzerklärung</a>.
      </div>
      <Button 
        onClick={acceptCookies} 
        className="bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-8 shrink-0"
      >
        Einverstanden
      </Button>
    </div>
  );
}
