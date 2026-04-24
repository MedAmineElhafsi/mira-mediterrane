import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | Mira Mediterrane Küche",
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-serif text-4xl font-bold text-charcoal mb-8">Impressum</h1>
      
      <div className="space-y-8 text-charcoal/80 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">Angaben gemäß § 5 TMG</h2>
          <p>
            Mira Mediterrane Küche<br />
            Inhaber: [Name des Inhabers einfügen]<br />
            Klobikauer Str. 64<br />
            06217 Merseburg<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">Kontakt</h2>
          <p>
            Telefon: +49 163 647 3331<br />
            E-Mail: kontakt@mira-merseburg.de
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            [USt-IdNr. einfügen falls vorhanden]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-charcoal mb-3">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </div>
  );
}
