import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Route = createFileRoute("/villa")({
  component: VillaPage,
});

const SPACES = [
  {
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1400&q=80",
    titleEn: "The Living Room",
    titleEl: "Το Σαλόνι",
    descEn: "Open-plan space anchored by a sculptural boucle sofa, warm oak shelving, cove lighting, and floor-to-ceiling glass doors that dissolve the boundary between inside and out. The pool glimmers just beyond.",
    descEl: "Ανοιχτός χώρος με γλυπτικό καναπέ boucle, ράφια από ζεστή δρυ, κρυφό φωτισμό και υαλοστάσια από δάπεδο μέχρι οροφή που διαλύουν τα όρια μεταξύ εσωτερικού και εξωτερικού. Η πισίνα λάμπει ακριβώς δίπλα.",
  },
  {
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80",
    titleEn: "The Master Suite",
    titleEl: "Η Κύρια Σουίτα",
    descEn: "A king-size bed faces the morning light. En-suite marble bathroom with brass fixtures, rain shower, and a vanity that belongs in an editorial shoot.",
    descEl: "Ένα king-size κρεβάτι κοιτάει το πρωινό φως. En-suite μπάνιο με μάρμαρο, ορειχάλκινα είδη υγιεινής, ντουζιέρα-βροχή και έπιπλο μπάνιου άξιο φωτογράφισης.",
  },
  {
    img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80",
    titleEn: "Guest Bedrooms",
    titleEl: "Υπνοδωμάτια Επισκεπτών",
    descEn: "Two further bedrooms, each with quality linens, natural light, and a calm that invites rest. Thoughtful storage, soft texture, nothing unnecessary.",
    descEl: "Δύο επιπλέον υπνοδωμάτια, κάθε ένα με ποιοτικά λευκά είδη, φυσικό φως και μια γαλήνη που καλεί στην ανάπαυση. Έξυπνη αποθήκευση, απαλή υφή, τίποτα περιττό.",
  },
  {
    img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1400&q=80",
    titleEn: "The Marble Bathroom",
    titleEl: "Το Μαρμάρινο Μπάνιο",
    descEn: "Travertine marble from floor to ceiling. A brass bowl sink, round mirror, and dried botanicals. The shower is rain-fed and generous.",
    descEl: "Τραβερτίνη από το δάπεδο έως την οροφή. Ορειχάλκινος νιπτήρας-μπολ, στρογγυλός καθρέφτης και αποξηραμένα φυτά. Η ντουζιέρα είναι τύπου βροχής και γενναιόδωρη.",
  },
  {
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80",
    titleEn: "The Kitchen",
    titleEl: "Η Κουζίνα",
    descEn: "Fully equipped with modern appliances, a breakfast bar for two, and a warm wood finish that makes cooking feel like pleasure.",
    descEl: "Πλήρως εξοπλισμένη με σύγχρονες συσκευές, μπαρ πρωινού για δύο και ξύλινο φινίρισμα που κάνει το μαγείρεμα απόλαυση.",
  },
  {
    img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80",
    titleEn: "Pool & Terrace",
    titleEl: "Πισίνα & Βεράντα",
    descEn: "A private plunge pool surrounded by stone, lit at dusk by glowing globe lights. Sunbeds, a deep lounge sofa, and the sound of nothing.",
    descEl: "Μια ιδιωτική πισίνα περιτριγυρισμένη από πέτρα, φωτισμένη το σούρουπο από λαμπερές σφαίρες. Ξαπλώστρες, βαθύς καναπές και ο ήχος του τίποτα.",
  },
  {
    img: "https://images.unsplash.com/photo-1505820013142-f86a3439c5b2?auto=format&fit=crop&w=1400&q=80",
    titleEn: "Rooftop Balcony",
    titleEl: "Ταρατσόκηπος",
    descEn: "Climb to the top and let Crete reveal itself. Panoramic views to the hills, the olive groves, and on clear days, the Aegean horizon.",
    descEl: "Ανεβείτε στην κορυφή και αφήστε την Κρήτη να αποκαλυφθεί. Πανοραμική θέα στους λόφους, στους ελαιώνες και τις καθαρές μέρες στον ορίζοντα του Αιγαίου.",
  },
];

function VillaPage() {
  useScrollAnimation();
  const { t, lang } = useTranslation();
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1613553497126-a44624272024?auto=format&fit=crop&w=2000&q=80)" }}
      >
        <div className="page-hero-inner">
          <span className="eyebrow">{t("villa_eyebrow")}</span>
          <h1>{t("villa_title")}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 80 }}>
          {SPACES.map((s, i) => (
            <div key={i} className={`alt-row ${i % 2 === 1 ? "reverse" : ""}`}>
              <div className="alt-image fade-in">
                <img src={s.img} alt={lang === "en" ? s.titleEn : s.titleEl} loading="lazy" />
              </div>
              <div className="alt-text fade-up">
                <span className="eyebrow">0{i + 1}</span>
                <h2>{lang === "en" ? s.titleEn : s.titleEl}</h2>
                <hr className="gold-rule" />
                <p>{lang === "en" ? s.descEn : s.descEl}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
