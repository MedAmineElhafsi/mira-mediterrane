import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB | Mira Mediterrane Küche",
};

export default function AGBPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-charcoal mb-8">Allgemeine Geschäftsbedingungen</h1>
      
      <div className="space-y-8 text-charcoal/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">§1 Geltungsbereich</h2>
          <p>
            Für die Geschäftsbeziehungen zwischen dem Besteller und Mira Mediterrane Küche gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">§2 Vertragsschluss</h2>
          <p>
            Die Darstellung der Produkte im Online-Bestellsystem stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar. Durch Anklicken des Buttons "Zahlungspflichtig bestellen" geben Sie eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">§3 Lieferung und Abholung</h2>
          <p>
            Wenn "Lieferung" gewählt wurde, liefern wir im angegebenen Liefergebiet. Eine Lieferung außerhalb dieses Gebiets ist nicht möglich. Bei Auswahl von "Abholung" ist das Essen zur angegebenen Schätzzeit im Restaurant abholbereit.
          </p>
        </section>
      </div>
    </div>
  );
}
