import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { TranslationKey } from "@/lib/translations";

export const Route = createFileRoute("/area")({
  component: AreaPage,
});

type Place = {
  img: string;
  titleEn: string;
  titleEl: string;
  descEn: string;
  descEl: string;
  lat: number;
  lng: number;
};

const BEACHES: Place[] = [
  { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", titleEn: "Karteros Beach", titleEl: "Παραλία Καρτερού", descEn: "5 min drive. A wide sandy beach with calm shallow waters, perfect for a morning swim. Popular with locals and easy to reach.", descEl: "5 λεπτά οδικώς. Φαρδιά αμμώδης παραλία με ήρεμα ρηχά νερά, ιδανική για πρωινό μπάνιο. Δημοφιλής στους ντόπιους.", lat: 35.3314, lng: 25.1721 },
  { img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", titleEn: "Amoudara Beach", titleEl: "Παραλία Αμμουδάρας", descEn: "10 min. One of Heraklion's longest sandy beaches, lined with beach bars and sunbeds. Great for a full day out.", descEl: "10 λεπτά. Μία από τις μεγαλύτερες αμμουδιές του Ηρακλείου, με beach bars και ξαπλώστρες.", lat: 35.3488, lng: 25.0818 },
  { img: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80", titleEn: "Kokkini Hani Beach", titleEl: "Παραλία Κοκκίνη Χάνι", descEn: "8 min. A quieter stretch with clear water and a relaxed local atmosphere.", descEl: "8 λεπτά. Πιο ήσυχο σημείο με καθαρά νερά και χαλαρή τοπική ατμόσφαιρα.", lat: 35.3176, lng: 25.2094 },
];
const RESTAURANTS: Place[] = [
  { img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80", titleEn: "Peskesi", titleEl: "Peskesi", descEn: "Farm-to-table Cretan cuisine in a beautifully restored mansion. One of Heraklion's most celebrated restaurants.", descEl: "Κρητική κουζίνα farm-to-table σε ένα όμορφα αποκαταστημένο αρχοντικό. Από τα πιο γνωστά εστιατόρια του Ηρακλείου.", lat: 35.3387, lng: 25.1343 },
  { img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80", titleEn: "Erganos Taverna", titleEl: "Ταβέρνα Έργανος", descEn: "Traditional meze, house wine, and the warmth of a Cretan family kitchen.", descEl: "Παραδοσιακοί μεζέδες, χύμα κρασί και η ζεστασιά μιας Κρητικής οικογενειακής κουζίνας.", lat: 35.3381, lng: 25.1340 },
  { img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80", titleEn: "Koutouki tis Elenis", titleEl: "Κουτούκι της Ελένης", descEn: "A hidden gem for slow lunches and honest Cretan home cooking.", descEl: "Ένα κρυμμένο διαμάντι για ξεκούραστα γεύματα και αυθεντική Κρητική σπιτική κουζίνα.", lat: 35.3360, lng: 25.1330 },
];
const ATTRACTIONS: Place[] = [
  { img: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1200&q=80", titleEn: "Knossos Palace", titleEl: "Ανάκτορο Κνωσού", descEn: "10 min drive. Europe's oldest city and the heart of Minoan civilization. An unmissable window into the ancient world.", descEl: "10 λεπτά οδικώς. Η αρχαιότερη πόλη της Ευρώπης και η καρδιά του Μινωικού πολιτισμού.", lat: 35.2985, lng: 25.1628 },
  { img: "https://images.unsplash.com/photo-1564399263-3d4ce4317656?auto=format&fit=crop&w=1200&q=80", titleEn: "Heraklion Archaeological Museum", titleEl: "Αρχαιολογικό Μουσείο Ηρακλείου", descEn: "Home to the greatest collection of Minoan art in the world. A world-class museum by any measure.", descEl: "Στεγάζει τη σπουδαιότερη συλλογή Μινωικής τέχνης στον κόσμο. Παγκόσμιας κλάσης μουσείο.", lat: 35.3404, lng: 25.1330 },
  { img: "https://images.unsplash.com/photo-1601053662251-9bd6cbdec7f8?auto=format&fit=crop&w=1200&q=80", titleEn: "Koules Venetian Fortress", titleEl: "Φρούριο Κούλες", descEn: "Standing guard at the entrance to Heraklion's harbor since the 16th century. Stunning at golden hour.", descEl: "Φρουρός στην είσοδο του λιμανιού του Ηρακλείου από τον 16ο αιώνα. Εκπληκτικό στη χρυσή ώρα.", lat: 35.3436, lng: 25.1378 },
];
const ENTERTAINMENT: Place[] = [
  { img: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1200&q=80", titleEn: "Heraklion Old Town", titleEl: "Παλιά Πόλη Ηρακλείου", descEn: "Wander through Venetian-era streets, stop at a kafeneio, and discover the city's living culture.", descEl: "Περιπλανηθείτε σε Ενετικούς δρόμους, σταματήστε σε ένα καφενείο και ανακαλύψτε την πόλη.", lat: 35.3387, lng: 25.1343 },
  { img: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80", titleEn: "Crete Golf Club", titleEl: "Crete Golf Club", descEn: "15 min drive. A beautiful 18-hole course set among olive trees and mountain views.", descEl: "15 λεπτά οδικώς. Πανέμορφο γήπεδο γκολφ 18 οπών ανάμεσα σε ελαιώνες.", lat: 35.3178, lng: 25.0690 },
  { img: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1200&q=80", titleEn: "Aquaworld Aquarium", titleEl: "Ενυδρείο Aquaworld", descEn: "A family favourite featuring Mediterranean marine life in a natural setting.", descEl: "Αγαπημένο των οικογενειών με Μεσογειακή θαλάσσια ζωή σε φυσικό περιβάλλον.", lat: 35.3180, lng: 25.2085 },
];

function PlacesSection({ eyebrow, title, places }: { eyebrow: TranslationKey; title: TranslationKey; places: Place[] }) {
  const { t, lang } = useTranslation();
  return (
    <section className="section">
      <div className="container">
        <div className="text-center" style={{ marginBottom: 64 }}>
          <span className="eyebrow fade-up">{t(eyebrow)}</span>
          <h2 className="display fade-up" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>{t(title)}</h2>
        </div>
        <div className="places-grid stagger-parent">
          {places.map((p, i) => (
            <div key={i} className="card place-card stagger-child fade-up">
              <div className="place-img"><img src={p.img} alt={lang === "en" ? p.titleEn : p.titleEl} loading="lazy" /></div>
              <div className="place-body">
                <h4>{lang === "en" ? p.titleEn : p.titleEl}</h4>
                <p>{lang === "en" ? p.descEn : p.descEl}</p>
                <a className="place-map-link" href={`https://www.google.com/maps?q=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer">{t("view_on_map")}</a>
                <div className="place-map">
                  <iframe title={p.titleEn} src={`https://www.google.com/maps?q=${p.lat},${p.lng}&output=embed`} loading="lazy" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreaPage() {
  useScrollAnimation();
  const { t } = useTranslation();
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504512485720-7d83a16ee930?auto=format&fit=crop&w=2000&q=80)" }}
      >
        <div className="page-hero-inner">
          <span className="eyebrow">{t("area_eyebrow")}</span>
          <h1>{t("area_title")}</h1>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container text-center">
          <p className="fade-up" style={{ maxWidth: 780, margin: "0 auto", fontSize: "1.1rem", lineHeight: 1.9, color: "var(--color-cream)", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300 }}>
            {t("area_intro")}
          </p>
        </div>
      </section>

      <PlacesSection eyebrow="nearby_beaches" title="sea_doorstep" places={BEACHES} />
      <div className="container"><div className="divider" /></div>
      <PlacesSection eyebrow="dining" title="flavours" places={RESTAURANTS} />
      <div className="container"><div className="divider" /></div>
      <PlacesSection eyebrow="culture" title="history_title" places={ATTRACTIONS} />
      <div className="container"><div className="divider" /></div>
      <PlacesSection eyebrow="entertainment" title="evenings_well_spent" places={ENTERTAINMENT} />
    </>
  );
}
