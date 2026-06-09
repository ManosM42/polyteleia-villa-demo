import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// --- LOCAL ASSET IMPORTS ---
import bgEnd from "../assets/end.jpeg";
import slider1 from "../assets/slider-1.jpg";
import slider2 from "../assets/slider-2.jpg";
import slider3 from "../assets/slider-3.jpg";
import slider4 from "../assets/slider-4.jpg"; 
import slider6 from "../assets/slider-6.jpg";
import slider8 from "../assets/slider-8.jpg";
import slider11 from "../assets/slider-11.jpg";

export const Route = createFileRoute("/villa")({
  component: VillaPage,
});

const SPACES = [
  {
    img: slider2, 
    titleEn: "The Living Room",
    titleEl: "Το Σαλόνι",
    descEn: "Open-plan space anchored by a sculptural boucle sofa, warm oak shelving, cove lighting, and floor-to-ceiling glass doors that dissolve the boundary between inside and out. The pool glimmers just beyond.",
    descEl: "Ανοιχτός χώρος με γλυπτικό καναπέ boucle, ράφια από ζεστή δρυ, κρυφό φωτισμό και υαλοστάσια από δάπεδο μέχρι οροφή που διαλύουν τα όρια μεταξύ εσωτερικού και εξωτερικού. Η πισίνα λάμπει ακριβώς δίπλα.",
  },
  {
    img: slider4, 
    titleEn: "The Master Suite",
    titleEl: "Η Κύρια Σουίτα",
    descEn: "A king-size bed faces the morning light. En-suite marble bathroom with brass fixtures, rain shower, and a vanity that belongs in an editorial shoot.",
    descEl: "Ένα king-size κρεβάτι κοιτάει το πρωινό φως. En-suite μπάνιο με μάρμαρο, ορειχάλκινα είδη υγιεινής, ντουζιέρα-βροχή και έπιπλο μπάνιου άξιο φωτογράφισης.",
  },
  {
    img: slider3, 
    titleEn: "The Marble Bathroom",
    titleEl: "Το Μαρμάρινο Μπάνιο",
    descEn: "Travertine marble from floor to ceiling. A brass bowl sink, round mirror, and dried botanicals. The shower is rain-fed and generous.",
    descEl: "Τραβερτίνη από το δάπεδο έως την οροφή. Ορειχάλκινος νιπτήρας-μπολ, στρογγυλός καθρέφτης και αποξηραμένα φυτά. Η ντουζιέρα είναι τύπου βροχής και γενναιόδωρη.",
  },
  {
    img: slider6, 
    titleEn: "The Kitchen",
    titleEl: "Η Κουζίνα",
    descEn: "Fully equipped with modern appliances, a breakfast bar for two, and a warm wood finish that makes cooking feel like pleasure.",
    descEl: "Πλρωλέως εξοπλισμένη με σύγχρονες συσκευές, μπαρ πρωινού για δύο και ξύλινο φινίρισμα που κάνει το μαγείρεμα απόλαυση.",
  },
  {
    img: slider8, 
    titleEn: "Pool & Terrace",
    titleEl: "Πισίνα & Βεράντα",
    descEn: "A private plunge pool surrounded by stone, lit at dusk by glowing globe lights. Sunbeds, a deep lounge sofa, and the sound of nothing.",
    descEl: "Μια ιδιωτική πισίνα περιτριγυρισμένη από πέτρα, φωτισμένη το σούρουπο από λαμπερές σφαίρες. Ξαπλώστρες, βαθύς καναπές και ο ήχος του τίποτα.",
  },
  {
    img: slider11, 
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
    <div 
      className="villa-page-wrapper"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${bgEnd})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        color: "#ffffff"
      }}
    >
      {/* HEADER HERO */}
      <section
        className="page-hero"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${slider1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div className="page-hero-inner" style={{ textAlign: "center", textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}>
          <span className="eyebrow" style={{ color: "#c5a880", letterSpacing: "3px", textTransform: "uppercase" }}>{t("villa_eyebrow")}</span>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, marginTop: "12px" }}>{t("villa_title")}</h1>
        </div>
      </section>

      {/* GRID CONTAINER */}
      <section className="section" style={{ padding: "100px 0" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "120px", maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          
          {SPACES.map((s, i) => (
            <div 
              key={i} 
              className={`space-row ${i % 2 === 1 ? "reverse" : ""}`}
            >
              {/* IMAGE WRAPPER (Enforced Aspect Ratio & Alignment) */}
              <div className="space-image-container fade-in">
                <img 
                  src={s.img} 
                  alt={lang === "en" ? s.titleEn : s.titleEl} 
                  loading="lazy" 
                />
              </div>

              {/* LIQUID GLASS DESCRIPTION CONTAINER */}
              <div className="space-text-glass fade-up">
                <div className="glass-content-inner">
                  <span className="space-number">0{i + 1}</span>
                  <h2>{lang === "en" ? s.titleEn : s.titleEl}</h2>
                  <hr className="gold-rule" />
                  <p>{lang === "en" ? s.descEn : s.descEl}</p>
                </div>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* Global CSS Layout Enforcements */}
      <style>{`
        /* Core row flexbox system */
        .space-row {
          display: flex;
          align-items: stretch; /* Forces both image and glass text container to have identical structural height */
          gap: 48px;
        }
        
        .space-row.reverse {
          flex-direction: row-reverse;
        }

        /* Image sizing controller */
        .space-image-container {
          flex: 1;
          width: 50%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.6);
          position: relative;
          
          /* Enforces strict cinematic widescreen 16:9 aspect ratio */
          aspect-ratio: 16 / 10; 
        }

        .space-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* Crops individual image formats natively to fit perfectly without stretching */
          display: block;
        }

        /* Liquid Glass Card Layout matching image bounds */
        .space-text-glass {
          flex: 1;
          width: 50%;
          padding: 48px;
          border-radius: 24px;
          display: flex;
          align-items: center; /* Vertically centers typography items */
          
          /* --- LIQUID GLASS --- */
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
          backdrop-filter: blur(24px) saturate(150%) brightness(90%);
          WebkitBackdropFilter: "blur(24px) saturate(150%) brightness(90%)";
          
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-top: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow: 0 20px 50px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.1);
          
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .glass-content-inner {
          width: 100%;
        }

        .space-number {
          color: #c5a880; 
          display: block; 
          margin-bottom: 8px; 
          font-weight: 600;
          letter-spacing: 1px;
        }

        .space-text-glass h2 {
          font-size: 2rem; 
          fontWeight: 400; 
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .gold-rule {
          border: none; 
          height: 1px; 
          background: #c5a880; 
          width: 60px; 
          margin: 0 0 24px 0;
        }

        .space-text-glass p {
          line-height: 1.75; 
          font-size: 1.05rem; 
          opacity: 0.95;
        }

        /* --- RESPONSIVE PHONE FIXES --- */
        @media (max-width: 991px) {
          .space-row, .space-row.reverse {
            flex-direction: column !important;
            align-items: initial !important;
            gap: 24px;
          }
          .space-image-container, .space-text-glass {
            width: 100% !important;
            flex: none !important;
          }
          .space-image-container {
            aspect-ratio: 16 / 11; /* Slightly taller aspect ratio on mobile screens */
          }
          .space-text-glass {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}