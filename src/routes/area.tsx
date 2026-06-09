import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { TranslationKey } from "@/lib/translations";
import image from "../assets/karteros.jpg";
import image2 from "../assets/ammoudara.jpg";
import image3 from "../assets/kokkini.jpg";
import image4 from "../assets/peskesi.jpg";
import image5 from "../assets/magazaki.jpg";
import image6 from "../assets/mourelo.jpg";
import image7 from "../assets/knossos.jpg";
import image8 from "../assets/mouseio.jpeg";
import image9 from "../assets/koules.jpeg";
import image10 from "../assets/old-town.jpg";
import image11 from "../assets/watercity.jpg";
import image12 from "../assets/aquarium.jpg";
import image13 from "../assets/elia.jpg";

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
  { img: image, titleEn: "Karteros Beach", titleEl: "Παραλία Καρτερού", descEn: "5 min drive. A wide sandy beach with calm shallow waters, perfect for a morning swim. Popular with locals and easy to reach.", descEl: "5 λεπτά οδικώς. Φαρδιά αμμώδης παραλία με ήρεμα ρηχά νερά, ιδανική για πρωινό μπάνιο. Δημοφιλής στους ντόπιους.", lat: 35.331971473676084, lng: 25.199908890578183 },
  { img: image2, titleEn: "Amoudara Beach", titleEl: "Παραλία Αμμουδάρας", descEn: "10 min. One of Heraklion's longest sandy beaches, lined with beach bars and sunbeds. Great for a full day out.", descEl: "10 λεπτά. Μία από τις μεγαλύτερες αμμουδιές του Ηρακλείου, με beach bars και ξαπλώστρες.", lat: 35.33742695458806, lng: 25.087555139729275 },
  { img: image3, titleEn: "Kokkini Hani Beach", titleEl: "Παραλία Κοκκίνη Χάνι", descEn: "8 min. A quieter stretch with clear water and a relaxed local atmosphere.", descEl: "8 λεπτά. Πιο ήσυχο σημείο με καθαρά νερά και χαλαρή τοπική ατμόσφαιρα.", lat: 35.331909280270764, lng: 25.256182224380755 },
];
const RESTAURANTS: Place[] = [
  { img: image4, titleEn: "Peskesi", titleEl: "Peskesi", descEn: "Farm-to-table Cretan cuisine in a beautifully restored mansion. One of Heraklion's most celebrated restaurants.", descEl: "Κρητική κουζίνα farm-to-table σε ένα όμορφα αποκαταστημένο αρχοντικό. Από τα πιο γνωστά εστιατόρια του Ηρακλείου.", lat: 35.340216020847244, lng: 25.132689138570406 },
  { img: image5, titleEn: "To magazaki", titleEl: "Το μαγαζάκι", descEn: "Traditional meze, house wine, and the warmth of a Cretan family kitchen.", descEl: "Παραδοσιακοί μεζέδες, χύμα κρασί και η ζεστασιά μιας Κρητικής οικογενειακής κουζίνας.", lat: 35.303103310655075, lng: 25.231484385047207 },
  { img: image6, titleEn: "Mourelo", titleEl: "Μουρέλο", descEn: "A hidden gem for slow lunches and honest Cretan home cooking.", descEl: "Ένα κρυμμένο διαμάντι για ξεκούραστα γεύματα και αυθεντική Κρητική σπιτική κουζίνα.", lat: 35.25791166316347, lng: 25.23778637447852 },
];
const ATTRACTIONS: Place[] = [
  { img: image7, titleEn: "Knossos Palace", titleEl: "Ανάκτορο Κνωσού", descEn: "10 min drive. Europe's oldest city and the heart of Minoan civilization. An unmissable window into the ancient world.", descEl: "10 λεπτά οδικώς. Η αρχαιότερη πόλη της Ευρώπης και η καρδιά του Μινωικού πολιτισμού.", lat: 35.2979743855661, lng: 25.162781496240708 },
  { img: image8, titleEn: "Heraklion Archaeological Museum", titleEl: "Αρχαιολογικό Μουσείο Ηρακλείου", descEn: "Home to the greatest collection of Minoan art in the world. A world-class museum by any measure.", descEl: "Στεγάζει τη σπουδαιότερη συλλογή Μινωικής τέχνης στον κόσμο. Παγκόσμιας κλάσης μουσείο.", lat: 35.3389620008857, lng: 25.13713451952037 },
  { img: image9, titleEn: "Koules Venetian Fortress", titleEl: "Φρούριο Κoύλες", descEn: "Standing guard at the entrance to Heraklion's harbor since the 16th century. Stunning at golden hour.", descEl: "Φρουρός στην είσοδο του λιμανιού του Ηρακλείου από τον 16ο αιώνα. Εκπληκτικό στη χρυσή ώρα.", lat: 35.344624672697776, lng: 25.13686239624284 },
];
const ENTERTAINMENT: Place[] = [
  { img: image10, titleEn: "Heraklion Old Town", titleEl: "Παλιά Πόλη Ηρακλείου", descEn: "Wander through Venetian-era streets, stop at a kafeneio, and discover the city's living culture.", descEl: "Περιπλανηθείτε σε Ενετικoύς δρόμους, θαυμάζοντας τα αξέχαστα τείχη και μνημεία του ενετικού ηρακλείου.", lat: 35.34254855416953, lng: 25.134513215808237 },
  { img: image11, titleEn: "Watercity Anopolis Park", titleEl: "Watercity Πάρκο Ανόπολης", descEn: "5 min drive. A beautiful and exciting waterpark to make unforgetable memories", descEl: "5 λεπτά οδικώς. Πανέμοργο Υδάτινο πάρκο όπου δημιουργείς αξέχαστες αναμνήσεις.", lat: 35.31058538166889, lng: 25.251487723846434 },
  { img: image12, titleEn: "Aquaworld Aquarium", titleEl: "Ενυδρείο Aquaworld", descEn: "A family favourite featuring Mediterranean marine life in a natural setting.", descEl: "Αγαπημένο των οικογενειών με Μεσογειακή θαλάσσια ζωή σε φυσικό περιβάλλον.", lat: 35.3323676550184, lng: 25.282435116829696 },
];

function PlacesSection({ eyebrow, title, places }: { eyebrow: TranslationKey; title: TranslationKey; places: Place[] }) {
  const { t, lang } = useTranslation();
  return (
    <section className="section" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        
        {/* Section Header with drop-shadow legibility */}
        <div className="text-center" style={{ marginBottom: 48, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          <span className="eyebrow fade-up" style={{ color: "#c5a880", letterSpacing: "2px", display: "block", marginBottom: "8px" }}>{t(eyebrow)}</span>
          <h2 className="display fade-up" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#ffffff" }}>{t(title)}</h2>
        </div>

        {/* CSS Flex Grid Framework */}
        <div className="places-liquid-grid">
          {places.map((p, i) => (
            <div key={i} className="liquid-place-card fade-up">
              
              {/* Enforced Fixed Image Window */}
              <div className="liquid-card-img-container">
                <img src={p.img} alt={lang === "en" ? p.titleEn : p.titleEl} loading="lazy" />
              </div>
              
              {/* Liquid Glass Description Panel Layer */}
              <div className="liquid-card-glass-body">
                <h4>{lang === "en" ? p.titleEn : p.titleEl}</h4>
                <p>{lang === "en" ? p.descEn : p.descEl}</p>
                
                {/* Fixed Map References templates */}
                <a 
                  className="liquid-map-link" 
                  href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {t("view_on_map")}
                </a>
                
                <div className="liquid-iframe-container">
                  <iframe 
                    title={p.titleEn} 
                    src={`https://maps.google.com/maps?q=${p.lat},${p.lng}&z=15&output=embed`} 
                    loading="lazy" 
                  />
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
    <div 
      className="area-page-fixed-wrapper"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${image13})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        color: "#ffffff"
      }}
    >
      {/* HERO SECTION INHERITING ELIA BACKGROUND */}
      <section
        className="page-hero"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${image13})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div className="page-hero-inner" style={{ textAlign: "center", textShadow: "0 4px 12px rgba(0,0,0,0.7)" }}>
          <span className="eyebrow" style={{ color: "#c5a880", letterSpacing: "3px", textTransform: "uppercase" }}>{t("area_eyebrow")}</span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)", fontWeight: 300, marginTop: "12px" }}>{t("area_title")}</h1>
        </div>
      </section>

      {/* INTRO BRUSH WITH BALANCED GRAPHIC HOOD */}
      <section className="section" style={{ padding: "60px 0 20px 0" }}>
        <div className="container text-center" style={{ padding: "0 24px" }}>
          <p className="fade-up" style={{ maxWidth: 780, margin: "0 auto", fontSize: "1.15rem", lineHeight: 1.85, color: "#fdfbf7", textShadow: "0 2px 8px rgba(0,0,0,0.8)", fontStyle: "italic", fontWeight: 300 }}>
            {t("area_intro")}
          </p>
        </div>
      </section>

      {/* CORE LOCATION RENDER PILES */}
      <PlacesSection eyebrow="nearby_beaches" title="sea_doorstep" places={BEACHES} />
      <div className="container"><div className="glass-horizontal-divider" /></div>
      
      <PlacesSection eyebrow="dining" title="flavours" places={RESTAURANTS} />
      <div className="container"><div className="glass-horizontal-divider" /></div>
      
      <PlacesSection eyebrow="culture" title="history_title" places={ATTRACTIONS} />
      <div className="container"><div className="glass-horizontal-divider" /></div>
      
      <PlacesSection eyebrow="entertainment" title="evenings_well_spent" places={ENTERTAINMENT} />

      {/* Injecting Area-Specific Grid Layout Rules & Liquid Glass Cards Styleblocks */}
      <style>{`
        /* 3-Column Responsive Dashboard Layout */
        .places-liquid-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
          justify-content: center;
          margin-top: 16px;
        }

        /* Liquid Glass Tile Wrapper */
        .liquid-place-card {
          flex: 1 1 350px;
          max-width: 380px;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          
          /* --- LIQUID GLASS --- */
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
          backdrop-filter: blur(24px) saturate(160%) brightness(88%);
          WebkitBackdropFilter: blur(24px) saturate(160%) brightness(88%);
          
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-top: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .liquid-place-card:hover {
          transform: translateY(-6px);
          border-color: rgba(197, 168, 128, 0.35);
          box-shadow: 0 22px 50px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        /* Enforce Fixed Aspect Window for Locations Images */
        .liquid-card-img-container {
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .liquid-card-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .liquid-place-card:hover .liquid-card-img-container img {
          transform: scale(1.05);
        }

        /* Glass Content Formatting Block */
        .liquid-card-glass-body {
          padding: 28px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }

        .liquid-card-glass-body h4 {
          font-size: 1.35rem;
          font-weight: 400;
          margin: 0 0 12px 0;
          letter-spacing: 0.5px;
          color: #fcfaf5;
        }

        .liquid-card-glass-body p {
          font-size: 0.98rem;
          line-height: 1.65;
          margin: 0 0 20px 0;
          opacity: 0.92;
        }

        /* Map Anchor Style rules */
        .liquid-map-link {
          color: #c5a880 !important;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          text-decoration: none;
          margin-top: auto; /* Pushes maps anchors to the bottom of the content uniformly */
          margin-bottom: 14px;
          display: inline-block;
          transition: color 0.2s ease;
        }

        .liquid-map-link:hover {
          color: #ffffff !important;
        }

        /* Clean Embedded Map Format */
        .liquid-iframe-container {
          width: 100%;
          height: 130px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }

        .liquid-iframe-container iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Glass horizontal divider lines between categories */
        .glass-horizontal-divider {
          width: 100%;
          max-width: 1150px;
          margin: 40px auto;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15) 50%, transparent);
        }

        /* Phone Layout Optimizations */
        @media (max-width: 480px) {
          .liquid-place-card {
            max-width: 100%;
            flex: 1 1 100%;
          }
          .liquid-card-glass-body {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}