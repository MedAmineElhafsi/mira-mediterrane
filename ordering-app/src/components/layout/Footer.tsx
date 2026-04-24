import Link from "next/link";
import { RESTAURANT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🫒</span>
              <div>
                <div className="font-serif font-bold text-xl">Mira</div>
                <div className="text-xs text-white/50 tracking-widest uppercase">
                  Mediterrane Küche
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Authentische mediterrane und syrisch-arabische Küche in Merseburg.
              Frisch, traditionell, herzlich.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Kontakt
            </h4>
            <ul className="text-white/60 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>
                  Klobikauer Str. 64
                  <br />
                  06217 Merseburg
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a
                  href={`tel:${RESTAURANT.phone}`}
                  className="hover:text-terracotta-light transition-colors"
                >
                  {RESTAURANT.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Rechtliches
            </h4>
            <ul className="text-white/60 text-sm space-y-2">
              <li>
                <Link
                  href="/impressum"
                  className="hover:text-terracotta-light transition-colors"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="hover:text-terracotta-light transition-colors"
                >
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="hover:text-terracotta-light transition-colors"
                >
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center gap-4 text-sm text-white/40">
          <span>&copy; {new Date().getFullYear()} Mira Mediterrane Küche. Alle Rechte vorbehalten.</span>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-white/60 transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-white/60 transition-colors">Datenschutz</Link>
            <Link href="/agb" className="hover:text-white/60 transition-colors">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
