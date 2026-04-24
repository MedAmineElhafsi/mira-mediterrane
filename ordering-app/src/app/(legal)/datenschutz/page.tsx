import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Mira Mediterrane Küche",
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-charcoal mb-8">Datenschutzerklärung</h1>
      
      <div className="space-y-8 text-charcoal/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">1. Datenschutz auf einen Blick</h2>
          <p className="mb-2"><strong>Allgemeine Hinweise</strong></p>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">2. Datenerfassung auf dieser Website</h2>
          <p className="mb-2"><strong>Bestelldaten</strong></p>
          <p>
            Wenn Sie über unsere Website eine Bestellung aufgeben, erheben wir Daten wie Name, E-Mail-Adresse, Telefonnummer und Lieferadresse, um Ihre Bestellung bearbeiten zu können. Diese Daten werden zur Vertragserfüllung nach Art. 6 Abs. 1 lit. b DSGVO verarbeitet.
          </p>
          <p className="mt-4 mb-2"><strong>Zahlungsinformationen</strong></p>
          <p>
            Für die Zahlungsabwicklung nutzen wir Stripe. Ihre Zahlungsdaten (wie Kreditkartennummer) werden direkt an Stripe übergeben und von uns nicht auf eigenen Servern gespeichert.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">3. Cookies</h2>
          <p>
            Unsere Website verwendet Cookies, um Kernfunktionen wie den Warenkorb und den sicheren Login (NextAuth) bereitzustellen. Es handelt sich hierbei um technisch notwendige Cookies, die nach Art. 6 Abs. 1 lit. f DSGVO gespeichert werden.
          </p>
        </section>
      </div>
    </div>
  );
}
